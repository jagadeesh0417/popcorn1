import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Setting from "@/lib/models/Setting";
import Product from "@/lib/models/Product";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { unstable_cache, revalidateTag } from "next/cache";
import { SETTINGS_CACHE_TAG, PUBLIC_REVALIDATE_SECONDS, publicCacheHeaders } from "@/lib/cache";
import { requireAdmin, getSessionUser } from "@/lib/server/auth";

// Grams encoded in a bundle size label, e.g. "All 80g" -> 80.
function sizeGrams(label: string): number {
  const digits = String(label || "").replace(/[^0-9]/g, "");
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

// Server-side validation for the bundle setting. The admin form lets the owner
// pick products from stock, so saving must verify every referenced product still
// exists, is published/in stock, and that its quantity is a positive integer.
// Returns a human-readable error string, or null when valid.
async function validateBundleValue(value: unknown): Promise<string | null> {
  if (!value || typeof value !== "object") return "Bundle data is missing.";
  const v = value as Record<string, unknown>;

  const bundleText = (v.bundleText as Record<string, unknown>) || {};
  const title = typeof bundleText.title === "string" ? bundleText.title.trim() : "";
  if (!title) return "Bundle name is required.";

  const sizes = Array.isArray(v.sizes) ? (v.sizes as Record<string, unknown>[]) : [];
  const size = sizes[0] || {};
  const price = typeof size.price === "number" ? size.price : Number(size.price || 0);
  const savings = typeof size.savings === "number" ? size.savings : Number(size.savings || 0);
  if (typeof size.label !== "string" || sizeGrams(size.label) <= 0) {
    return "Please choose a valid bundle size (grams).";
  }
  if (!Number.isFinite(price) || price <= 0) {
    return "Bundle price must be a positive number.";
  }
  if (!Number.isFinite(savings) || savings < 0) {
    return "Discount cannot be negative.";
  }
  if (savings > price) {
    return "Discount cannot exceed the bundle price.";
  }

  const images = Array.isArray(v.images) ? (v.images as Record<string, unknown>[]) : [];
  const hasImage = images.some(
    (img) => img && typeof img.src === "string" && img.src.trim().length > 0
  );
  if (!hasImage) return "Please upload a bundle image.";

  const products = Array.isArray(v.products) ? (v.products as Record<string, unknown>[]) : [];
  if (products.length === 0) return "Please add at least one product to the bundle.";

  const grams = sizeGrams(String(size.label || ""));

  for (const part of products) {
    const slug = typeof part.slug === "string" ? part.slug.trim() : "";
    const qty = Math.floor(Number(part.quantity));
    if (!slug) return "A selected product is missing its reference.";
    if (!Number.isFinite(qty) || qty <= 0) {
      return "Product quantities must be positive whole numbers.";
    }
    const product = await Product.findOne({ slug }).lean();
    if (!product) {
      return `"${slug}" is no longer in the catalog. Remove it and try again.`;
    }
    const p = product as unknown as Record<string, unknown>;
    const name = typeof p.name === "string" ? p.name : slug;
    if (p.inStock === false || p.isPublished === false) {
      return `${name} is currently not available for a bundle.`;
    }
    const sizesArr = Array.isArray(p.sizes) ? (p.sizes as Record<string, unknown>[]) : [];
    const variants = sizesArr.length > 0
      ? sizesArr
      : (Array.isArray(p.variants) ? (p.variants as Record<string, unknown>[]) : []);
    let availableStock = 0;
    if (variants.length > 0) {
      const variant = variants.find(
        (s) => Math.floor(Number((s as { grams?: unknown }).grams)) === grams
      ) || variants.find((s) => String((s as { label?: unknown }).label).toLowerCase() === `${grams}g`);
      if (!variant) {
        return `${name} has no ${grams}g size to include in this bundle.`;
      }
      const s = variant as { stock?: unknown; inStock?: unknown };
      availableStock = typeof s.stock === "number" ? s.stock : 0;
      if (s.inStock === false || availableStock <= 0) {
        return `${name} (${grams}g) is currently out of stock.`;
      }
    } else {
      availableStock = typeof p.stockQuantity === "number" ? p.stockQuantity : 0;
      if (availableStock <= 0) {
        return `${name} is currently out of stock.`;
      }
    }
    if (availableStock < qty) {
      return `Only ${availableStock} unit${availableStock === 1 ? "" : "s"} of ${name} available.`;
    }
  }

  return null;
}

async function fetchSettings(key?: string) {
  await connectDB();
  if (key) {
    const setting = await Setting.findOne({ key }).lean();
    if (!setting) return null;
    return { key: setting.key, value: parseSettingValue(setting.value) };
  }
  const settings = await Setting.find({}).lean();
  const result: Record<string, unknown> = {};
  settings.forEach((s) => { result[s.key] = parseSettingValue(s.value); });
  return result;
}

// A malformed/empty stored value must never crash the public settings route
// (e.g. bundle settings load). Fall back to null so callers handle it gracefully.
function parseSettingValue(raw: string): unknown {
  if (typeof raw !== "string") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * The `payment` setting contains the Razorpay KEY SECRET. It must only ever be
 * readable by an authenticated admin — anonymous callers get the public key id
 * with the secret stripped. (The checkout gets its key from create-order.)
 */
function stripPaymentSecrets(key: string | undefined, value: unknown): unknown {
  const sanitizeValue = (v: unknown): unknown => {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const obj = { ...(v as Record<string, unknown>) };
      if ("keySecret" in obj) obj.keySecret = "";
      return obj;
    }
    return v;
  };

  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const map = value as Record<string, unknown>;
    if (key === "payment") {
      // Preserve the { key, value } wrapper shape while blanking the secret.
      if ("value" in map) return { ...map, value: sanitizeValue(map.value) };
      return sanitizeValue(map);
    }
    // Unscoped lookup returns { settingKey: parsedValue } — sanitize any payment entry.
    const out: Record<string, unknown> = { ...map };
    if ("payment" in out) out.payment = sanitizeValue(out.payment);
    return out;
  }
  return value;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key") || undefined;

    const user = await getSessionUser();
    const isAdmin = user?.role === "admin";

    if (isAdmin) {
      // Admin (settings screens) gets the raw value, never cached/never public.
      const result = await fetchSettings(key);
      if (key && result === null) return errorResponse("Setting not found", 404);
      return successResponse(result, 200, { headers: { "Cache-Control": "no-store" } });
    }

    // Public path: cacheable, but payment secrets are stripped first so they
    // can never be served from the shared cache to anonymous callers.
    const cachedFetch = unstable_cache(
      async () => stripPaymentSecrets(key, (await fetchSettings(key)) as unknown),
      ["settings-public", key || "all"],
      { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: [SETTINGS_CACHE_TAG] }
    );

    const result = await cachedFetch();

    if (key && result === null) {
      return errorResponse("Setting not found", 404);
    }
    const init = { headers: publicCacheHeaders() };
    return successResponse(result, 200, init);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return errorResponse("Failed to fetch settings");
  }
}

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    await connectDB();
    const { key, value } = await request.json();
    if (!key) return errorResponse("Key is required", 400);
    if (key === "bundle") {
      const bundleError = await validateBundleValue(value);
      if (bundleError) return errorResponse(bundleError, 400);
    }
    await Setting.findOneAndUpdate(
      { key },
      { key, value: JSON.stringify(value) },
      { upsert: true, new: true }
    );
    revalidateTag(SETTINGS_CACHE_TAG);
    return successResponse({ key, value });
  } catch (error) {
    console.error("Error saving setting:", error);
    return errorResponse("Failed to save setting");
  }
}
