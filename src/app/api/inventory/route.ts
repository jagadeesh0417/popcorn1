import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { revalidateTag } from "next/cache";
import { PRODUCT_CACHE_TAG } from "@/lib/cache";
import { requireAdmin } from "@/lib/server/auth";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    await connectDB();
    const products = await Product.find({})
      .sort({ name: 1 })
      .select({ name: 1, category: 1, weight: 1, price: 1, stockQuantity: 1, inStock: 1 })
      .lean();
    return successResponse(products);
  } catch (err) {
    console.error("Failed to fetch inventory", err);
    return errorResponse("Failed to fetch inventory", 500);
  }
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    await connectDB();
    const body = await req.json();
    const { id, stockQuantity, inStock } = body;
    if (!id) return errorResponse("Product ID is required", 400);
    const update: Record<string, unknown> = {};
    if (stockQuantity !== undefined) update.stockQuantity = stockQuantity;
    if (inStock !== undefined) update.inStock = inStock;
    const product = await Product.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!product) return errorResponse("Not found", 404);
    // Keep per-variant stock in sync with the master stockQuantity so the
    // inventory page remains the single source of truth for stock.
    await Product.updateOne({ _id: id }, { $set: { "sizes.$[].stock": stockQuantity } });
    revalidateTag(PRODUCT_CACHE_TAG);
    return successResponse(product);
  } catch (err) {
    console.error("Failed to update inventory", err);
    return errorResponse("Failed to update inventory", 500);
  }
}
