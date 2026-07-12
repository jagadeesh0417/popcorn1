import { connectDB } from "@/lib/db";
import Banner from "@/lib/models/Banner";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    await connectDB();
    const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    return successResponse(banners);
  } catch (err) {
    console.error("[GET /api/banners] Error:", err);
    return errorResponse("Failed to fetch banners", 500);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.image) return errorResponse("Image is required", 400);
    const count = await Banner.countDocuments();
    const banner = await Banner.create({ ...body, order: count });
    return successResponse(banner, 201);
  } catch (err) {
    console.error("[POST /api/banners] Error:", err);
    return errorResponse("Failed to create banner", 500);
  }
}
