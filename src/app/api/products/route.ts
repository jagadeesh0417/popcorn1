import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: Request) {
  try {
    console.log("[GET /api/products] Connecting to MongoDB...");
    await connectDB();
    console.log("[GET /api/products] Connected, building query...");
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const featured = searchParams.get("featured");
    const bestSeller = searchParams.get("bestSeller");
    const homepage = searchParams.get("homepage");
    const query: Record<string, unknown> = {};
    if (slug) query.slug = slug;
    if (featured === "true") query.isFeatured = true;
    if (bestSeller === "true") query.isBestSeller = true;
    if (homepage === "true") query.showOnHomepage = true;
    console.log("[GET /api/products] Query:", JSON.stringify(query));
    const products = await Product.find(query).sort({ createdAt: -1 });
    console.log(`[GET /api/products] Found ${products.length} products`);
    return successResponse(products);
  } catch (err) {
    console.error("[GET /api/products] Error:", err instanceof Error ? err.message : err);
    if (err instanceof Error && err.stack) console.error("[GET /api/products] Stack:", err.stack);
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
    return successResponse(product, 201);
  } catch (err) {
    console.error("Failed to create product", err);
    return errorResponse("Failed to create product", 500);
  }
}
