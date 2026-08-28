import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { unstable_cache, revalidateTag } from "next/cache";
import { PRODUCT_CACHE_TAG, PUBLIC_REVALIDATE_SECONDS, publicCacheHeaders } from "@/lib/cache";
import { Types } from "mongoose";

interface ProductQuery {
  slug?: string;
  slugs?: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  showOnHomepage?: boolean;
  $or?: unknown[];
}

function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function fetchProducts(query: ProductQuery, isDetail: boolean, projection?: Record<string, number>) {
  await connectDB();
  const mongoQuery: Record<string, unknown> = {};
  if (query.slug) {
    // Canonicalize the lookup slug: trim whitespace and let the regex match
    // case-insensitively. Admin-created products may carry non-canonical slugs
    // (manual typing, case, stray spaces), and the URL is derived from that
    // stored slug — so the match must be tolerant to keep valid products reachable.
    const cleanSlug = query.slug.trim();
    let slugCondition: unknown;
    if (Types.ObjectId.isValid(cleanSlug)) {
      slugCondition = { $or: [{ _id: cleanSlug }, { slug: { $regex: `^${escapeRegex(cleanSlug)}$`, $options: "i" } }] };
    } else {
      slugCondition = { slug: { $regex: `^${escapeRegex(cleanSlug)}$`, $options: "i" } };
    }
    Object.assign(mongoQuery, slugCondition);
  }
  if (query.isFeatured) mongoQuery.isFeatured = true;
  if (query.isBestSeller) mongoQuery.isBestSeller = true;
  if (query.showOnHomepage) mongoQuery.showOnHomepage = true;
  if (query.slugs && query.slugs.length > 0) mongoQuery.slug = { $in: query.slugs };
  const select = projection || (isDetail ? {} : LIST_PROJECTION);
  const docs = await Product.find(mongoQuery)
    .sort({ createdAt: -1 })
    .select(select)
    .lean();
  return docs;
}

// List queries (homepage, featured, trio, shop) don't need the heavy nutrition/ingredients blocks.
const LIST_PROJECTION = {
  nutritionInfo: 0,
  ingredients: 0,
};

// Admin product table only renders these fields — keep the payload minimal.
const ADMIN_PROJECTION = {
  name: 1,
  slug: 1,
  category: 1,
  price: 1,
  stockQuantity: 1,
  inStock: 1,
  isPublished: 1,
  isBestSeller: 1,
  showOnHomepage: 1,
  images: 1,
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const featured = searchParams.get("featured");
    const bestSeller = searchParams.get("bestSeller");
    const homepage = searchParams.get("homepage");
    const slugsParam = searchParams.get("slugs");
    const isAdmin = searchParams.get("admin") === "1";
    const fresh = searchParams.get("fresh") === "1";

    const query: ProductQuery = {};
    if (slug) query.slug = slug;
    if (featured === "true") query.isFeatured = true;
    if (bestSeller === "true") query.isBestSeller = true;
    if (homepage === "true") query.showOnHomepage = true;
    if (slugsParam) {
      const list = slugsParam.split(",").map((s) => s.trim()).filter(Boolean);
      if (list.length > 0) query.slugs = list;
    }

    const isDetail = Boolean(slug);
    const projection = isAdmin ? ADMIN_PROJECTION : undefined;

    // Admin needs fresh data immediately after every edit — bypass the public cache.
    // The "fresh" flag is used by cart/checkout stock revalidation so the client
    // never sees stale availability.
    if (isAdmin || fresh) {
      const products = await fetchProducts(query, isDetail, projection);
      return successResponse(products);
    }

    const cacheKey = JSON.stringify(query);

    const cachedFetch = unstable_cache(
      async () => (await fetchProducts(query, isDetail, projection)) as unknown[],
      ["products", cacheKey],
      { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: [PRODUCT_CACHE_TAG] }
    );

    const products = await cachedFetch();
    const init = { headers: publicCacheHeaders() };
    return successResponse(products, 200, init);
  } catch (err) {
    console.error("Failed to fetch products", err);
    return errorResponse("Failed to fetch products", 500);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.name || !body.slug || !body.price) {
      return errorResponse("Name, slug, and price are required", 400);
    }
    const existing = await Product.findOne({ slug: body.slug });
    if (existing) {
      return errorResponse("Product with this slug already exists", 409);
    }
    const product = await Product.create(body);
    revalidateTag(PRODUCT_CACHE_TAG);
    return successResponse(product, 201);
  } catch (err) {
    console.error("Failed to create product", err);
    return errorResponse("Failed to create product", 500);
  }
}
