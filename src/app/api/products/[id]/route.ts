import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const product = await Product.findById(id);
    if (!product) return errorResponse("Not found", 404);
    return successResponse(product);
  } catch (err) {
    console.error("Failed to fetch product", err);
    return errorResponse("Failed to fetch product", 500);
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const body = await req.json();
    const product = await Product.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
    if (!product) return errorResponse("Not found", 404);
    return successResponse(product);
  } catch (err) {
    console.error("Failed to update product", err);
    return errorResponse("Failed to update product", 500);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const product = await Product.findByIdAndDelete(id);
    if (!product) return errorResponse("Not found", 404);
    return successResponse({ message: "Deleted" });
  } catch (err) {
    console.error("Failed to delete product", err);
    return errorResponse("Failed to delete product", 500);
  }
}
