import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    console.log(`[GET /api/products/${id}] Connecting...`);
    await connectDB();
    const product = await Product.findById(id);
    if (!product) {
      console.log(`[GET /api/products/${id}] Not found`);
      return errorResponse("Not found", 404);
    }
    console.log(`[GET /api/products/${id}] Found: ${product.name}`);
    return successResponse(product);
  } catch (err) {
    console.error(`[GET /api/products/${id}] Error:`, err instanceof Error ? err.message : err);
    return errorResponse("Failed to fetch product", 500);
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    console.log(`[PUT /api/products/${id}] Connecting...`);
    await connectDB();
    const body = await req.json();
    console.log(`[PUT /api/products/${id}] Updating with keys:`, Object.keys(body));
    const product = await Product.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
    if (!product) {
      console.log(`[PUT /api/products/${id}] Not found`);
      return errorResponse("Not found", 404);
    }
    console.log(`[PUT /api/products/${id}] Updated: ${product.name}`);
    return successResponse(product);
  } catch (err) {
    console.error(`[PUT /api/products/${id}] Error:`, err instanceof Error ? err.message : err);
    return errorResponse("Failed to update product", 500);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    console.log(`[DELETE /api/products/${id}] Connecting...`);
    await connectDB();
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      console.log(`[DELETE /api/products/${id}] Not found`);
      return errorResponse("Not found", 404);
    }
    console.log(`[DELETE /api/products/${id}] Deleted`);
    return successResponse({ message: "Deleted" });
  } catch (err) {
    console.error(`[DELETE /api/products/${id}] Error:`, err instanceof Error ? err.message : err);
    return errorResponse("Failed to delete product", 500);
  }
}
