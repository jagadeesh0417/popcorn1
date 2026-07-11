import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ name: 1 });
    return successResponse(products);
  } catch (err) {
    console.error("Failed to fetch inventory", err);
    return errorResponse("Failed to fetch inventory", 500);
  }
}

export async function PUT(req: Request) {
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
    return successResponse(product);
  } catch (err) {
    console.error("Failed to update inventory", err);
    return errorResponse("Failed to update inventory", 500);
  }
}
