import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import Setting from "@/lib/models/Setting";

// Mongoose throws a CastError when you query { _id: <non-ObjectId-string> } (e.g. a
// slug). Build the lookup so the _id branch is only present for genuinely valid
// ObjectIds, otherwise fall back to the slug lookup.
function refQuery(ref: string | undefined) {
  const value = String(ref ?? "");
  if (!value) return {};
  const isObjectId = mongoose.isValidObjectId(value);
  return isObjectId ? { $or: [{ _id: value }, { slug: value }] } : { slug: value };
}

export interface ResolvedItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant: { label: string; grams: number } | null;
  type?: "product" | "bundle";
  bundleId?: string;
  parts?: { productId: string; name: string; variantLabel?: string; quantity: number }[];
}

export interface StockResolution {
  items: ResolvedItem[];
  subtotal: number;
}

interface RawPart {
  productId?: string;
  name?: string;
  variantLabel?: string;
  quantity?: number;
}

interface RawItem {
  type?: "product" | "bundle";
  productId?: string;
  name?: string;
  price?: number;
  quantity?: number;
  image?: string;
  variant?: { label?: string; grams?: number } | null;
  bundleId?: string;
  sizeLabel?: string;
  parts?: RawPart[];
}

interface BundlePartDef {
  slug?: string;
  quantity?: number;
}

interface BundleSizeDef {
  label?: string;
  price?: number;
}

interface BundleConfig {
  bundleId?: string;
  bundleText?: { title?: string };
  sizes?: BundleSizeDef[];
  products?: BundlePartDef[];
}

class StockError extends Error {
  code: number;
  constructor(msg: string, code = 409) {
    super(msg);
    this.code = code;
  }
}

function normalizeImage(product: Record<string, unknown>): string {
  const images = Array.isArray(product.images) ? (product.images as unknown[]) : [];
  const first = images.find((i) => typeof i === "string" && (i as string).length > 0);
  if (first) return first as string;
  const single = (product as Record<string, unknown>).image;
  return typeof single === "string" ? single : "";
}

function normalizeVariantList(product: Record<string, unknown>): Record<string, unknown>[] {
  const sizes = Array.isArray(product.sizes) ? (product.sizes as Record<string, unknown>[]) : [];
  if (sizes.length > 0) return sizes;
  const variants = Array.isArray(product.variants) ? (product.variants as Record<string, unknown>[]) : [];
  return variants;
}

function findVariantByGrams(product: Record<string, unknown>, grams: number): Record<string, unknown> | null {
  const variants = normalizeVariantList(product);
  // Prefer an exact label match, then fall back to a numeric grams match.
  const exact = variants.find(
    (v) => typeof (v as { label?: unknown }).label === "string" && String((v as { label: string }).label).toLowerCase() === `${grams}g`
  );
  if (exact) return exact;
  return variants.find(
    (v) =>
      typeof (v as { grams?: unknown }).grams === "number" && Math.floor((v as { grams: number }).grams) === Math.floor(grams)
  ) || null;
}

// Bundle composition is stored in the bundle setting (single source of truth).
async function loadBundleConfig(): Promise<BundleConfig | null> {
  const setting = await Setting.findOne({ key: "bundle" }).lean();
  if (!setting) return null;
  try {
    return JSON.parse(setting.value) as BundleConfig;
  } catch {
    return null;
  }
}

// Grams represented by a bundle size label, e.g. "All 80g" -> 80.
function sizeGrams(sizeLabel: string): number {
  const digits = String(sizeLabel || "").replace(/[^0-9]/g, "");
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

// Authoritative server-side stock validation + resolution for a single bundle line.
// The bundle price is taken from the DB config (size price), never from the client.
async function resolveBundleItem(item: RawItem): Promise<{ resolved: ResolvedItem; subtotal: number }> {
  const lineQty = Math.floor(Number(item.quantity));
  if (!Number.isFinite(lineQty) || lineQty <= 0) {
    throw new StockError("Invalid item quantity", 400);
  }
  const bundleId = item.bundleId || "";
  const config = await loadBundleConfig();
  if (!config || !config.bundleId) {
    throw new StockError("This bundle is no longer available. Please remove it and try again.");
  }

  const sizeLabel = item.sizeLabel || "";
  const size: BundleSizeDef | undefined = (Array.isArray(config.sizes) ? config.sizes : []).find(
    (s) => s && s.label === sizeLabel
  );
  const unitPrice = typeof size?.price === "number" && size.price > 0 ? size.price : 0;
  if (!unitPrice) {
    throw new StockError("This bundle size is no longer available. Please remove it and try again.");
  }

  const grams = sizeGrams(sizeLabel);
  const composition = Array.isArray(config.products) ? config.products : [];
  if (composition.length === 0) {
    throw new StockError("This bundle has no products configured. Please check back later.");
  }

  const parts: ResolvedItem["parts"] = [];
  for (const part of composition) {
    const slug = part.slug;
    const perBundle = Math.floor(Number(part.quantity));
    if (!slug || !Number.isFinite(perBundle) || perBundle <= 0) {
      throw new StockError("This bundle is not configured correctly. Please contact support.");
    }
    const product = await Product.findOne({ slug }).lean();
    if (!product) {
      throw new StockError("One or more items in this bundle are no longer available.");
    }
    const p = product as unknown as Record<string, unknown>;
    if (p.inStock === false || p.isPublished === false) {
      throw new StockError(`${p.name || "A bundle item"} is currently out of stock.`);
    }
    const variant = findVariantByGrams(p, grams);
    const variants = normalizeVariantList(p);
    if (variants.length > 0 && !variant) {
      throw new StockError(`${p.name || "A bundle item"} is currently out of stock.`);
    }
    const need = perBundle * lineQty;
    if (variant) {
      const v = variant as { stock?: number; inStock?: boolean };
      const stock = typeof v.stock === "number" ? v.stock : 0;
      if (v.inStock === false || stock <= 0) {
        throw new StockError(`${p.name || "A bundle item"} (${grams}g) is currently out of stock.`);
      }
      if (stock < need) {
        throw new StockError(`Only ${stock} unit${stock === 1 ? "" : "s"} left for ${p.name || "a bundle item"} (${grams}g). Please reduce the quantity.`);
      }
    } else {
      const stock = typeof p.stockQuantity === "number" ? p.stockQuantity : 0;
      if (stock <= 0) {
        throw new StockError(`${p.name || "A bundle item"} is currently out of stock.`);
      }
      if (stock < need) {
        throw new StockError(`Only ${stock} unit${stock === 1 ? "" : "s"} left for ${p.name || "a bundle item"}. Please reduce the quantity.`);
      }
    }
    parts.push({
      productId: String(p._id || slug),
      name: String(p.name || part.slug),
      variantLabel: variant ? String((variant as { label?: unknown }).label || `${grams}g`) : undefined,
      quantity: perBundle,
    });
  }

  const name = config.bundleText?.title || "Bundle";
  const resolved: ResolvedItem = {
    productId: `bundle:${bundleId}`,
    name,
    price: unitPrice,
    quantity: lineQty,
    image: typeof item.image === "string" ? item.image : "",
    variant: null,
    type: "bundle",
    bundleId,
    parts,
  };

  return { resolved, subtotal: unitPrice * lineQty };
}

// Authoritative server-side stock validation.
// Returns resolved order items with real DB names/prices and a server-computed subtotal.
// Throws StockError naming the first unavailable product.
export async function validateAndResolveItems(rawItems: RawItem[]): Promise<StockResolution> {
  await connectDB();
  const items: RawItem[] = Array.isArray(rawItems) ? rawItems : [];
  if (items.length === 0) {
    throw new StockError("Order has no items", 400);
  }

  const resolved: ResolvedItem[] = [];
  let subtotal = 0;

  for (const item of items) {
    if (item.type === "bundle") {
      const { resolved: rBundle, subtotal: sBundle } = await resolveBundleItem(item);
      resolved.push(rBundle);
      subtotal += sBundle;
      continue;
    }

    const qty = Math.floor(Number(item.quantity));
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new StockError("Invalid item quantity", 400);
    }

    const ref = item.productId;
    const product = await Product.findOne(refQuery(ref)).lean();

    if (!product) {
      throw new StockError(`One or more items in your cart are no longer available. ("${item.name || "Unknown"}")`);
    }

    const p = product as unknown as Record<string, unknown>;
    if (p.inStock === false || p.isPublished === false) {
      throw new StockError(`${p.name || item.name} is currently out of stock.`);
    }

    let price: number;
    let variant: ResolvedItem["variant"] = null;

    const variantRef = item.variant?.label;
    const sizes = normalizeVariantList(p);
    if (variantRef) {
      const size = sizes.find((s) => (s as { label?: string }).label === variantRef);
      if (!size) {
        throw new StockError(`${p.name || item.name} is currently out of stock.`);
      }
      const v = size as { stock?: number; inStock?: boolean; price?: number; grams?: number };
      const stock = typeof v.stock === "number" ? v.stock : 0;
      if (v.inStock === false || stock <= 0) {
        throw new StockError(`${p.name || item.name} (${variantRef}) is currently out of stock.`);
      }
      if (stock < qty) {
        throw new StockError(`Only ${stock} unit${stock === 1 ? "" : "s"} left for ${p.name || item.name} (${variantRef}). Please reduce the quantity.`);
      }
      price = typeof v.price === "number" && v.price > 0 ? v.price : (typeof p.price === "number" ? p.price : 0);
      variant = { label: variantRef, grams: typeof v.grams === "number" ? v.grams : 0 };
    } else {
      const stock = typeof p.stockQuantity === "number" ? p.stockQuantity : 0;
      if (stock <= 0) {
        throw new StockError(`${p.name || item.name} is currently out of stock.`);
      }
      if (stock < qty) {
        throw new StockError(`Only ${stock} unit${stock === 1 ? "" : "s"} left for ${p.name || item.name}. Please reduce the quantity.`);
      }
      price = typeof p.price === "number" && p.price > 0 ? p.price : 0;
    }

    if (!price || price <= 0) {
      throw new StockError(`${p.name || item.name} is currently unavailable.`);
    }

    resolved.push({
      productId: String(p._id || item.productId),
      name: String(p.name || item.name),
      price,
      quantity: qty,
      image: normalizeImage(p) || (typeof item.image === "string" ? item.image : ""),
      variant,
      type: "product",
    });
    subtotal += price * qty;
  }

  return { items: resolved, subtotal: Math.round(subtotal * 100) / 100 };
}

// Expand bundle lines into atomic per-product reservations, then reserve each.
interface ProductReservation {
  productId?: string;
  variantLabel?: string | null;
  qty: number;
}

function flattenReservations(items: (RawItem | ResolvedItem)[]): ProductReservation[] {
  const flat: ProductReservation[] = [];
  for (const item of items) {
    const qty = Math.floor(Number((item as RawItem).quantity));
    if (!Number.isFinite(qty) || qty <= 0) continue;
    const type = (item as ResolvedItem).type || (item as RawItem).type;
    if (type === "bundle") {
      const parts = (item as ResolvedItem).parts;
      if (Array.isArray(parts)) {
        for (const part of parts) {
          const partQty = Math.floor(Number(part.quantity));
          if (!Number.isFinite(partQty) || partQty <= 0) continue;
          flat.push({ productId: part.productId, variantLabel: part.variantLabel || null, qty: partQty * qty });
        }
      }
      continue;
    }
    const ref = (item as RawItem).productId;
    const variantLabel = (item as RawItem).variant?.label || (item as ResolvedItem).variant?.label || null;
    flat.push({ productId: ref, variantLabel, qty });
  }
  return flat;
}

// Atomically reserve/decrement stock so two simultaneous purchases of the last unit
// cannot both succeed. Throws StockError if any item can't be satisfied.
export async function reserveStock(items: (RawItem | ResolvedItem)[]): Promise<void> {
  await connectDB();
  const reservations = flattenReservations(items);
  for (const r of reservations) {
    const ref = r.productId;
    if (!ref) continue;

    if (r.variantLabel) {
      const label = r.variantLabel;
      const res = await Product.updateOne(
        {
          ...refQuery(ref),
          "sizes.label": label,
          "sizes.inStock": { $ne: false },
          "sizes.stock": { $gte: r.qty },
        },
        { $inc: { "sizes.$.stock": -r.qty } }
      );
      if (res.modifiedCount !== 1) {
        throw new StockError("Some items in your order are no longer available. Please review your cart.");
      }
      // If the variant hit 0, mark it out of stock so it can't be selected again.
      await Product.updateOne(
        { "sizes.label": label, "sizes.stock": { $lte: 0 } },
        { $set: { "sizes.$.inStock": false } }
      );
    } else {
      const res = await Product.updateOne(
        {
          ...refQuery(ref),
          inStock: { $ne: false },
          stockQuantity: { $gte: r.qty },
        },
        { $inc: { stockQuantity: -r.qty } }
      );
      if (res.modifiedCount !== 1) {
        throw new StockError("Some items in your order are no longer available. Please review your cart.");
      }
      await Product.updateMany(
        { stockQuantity: { $lte: 0 } },
        { $set: { inStock: false } }
      );
    }
  }
}

export { StockError };
