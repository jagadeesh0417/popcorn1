import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({ showOnHomepage: true }).sort({ createdAt: -1 });
    return successResponse(products);
  } catch (err) {
    console.error("Failed to fetch homepage products", err);
    return errorResponse("Failed to fetch homepage products", 500);
  }
}
