import { connectDB } from "@/lib/db";
import Review from "@/lib/models/Review";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  try {
    await connectDB();
    const filter = productId ? { productId } : {};
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    return successResponse(reviews);
  } catch (err) {
    console.error("Failed to fetch reviews", err);
    return errorResponse("Failed to fetch reviews", 500);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const review = await Review.create(body);
    return successResponse(review, 201);
  } catch (err) {
    console.error("Failed to create review", err);
    return errorResponse("Failed to create review", 500);
  }
}
