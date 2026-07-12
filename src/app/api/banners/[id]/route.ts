import { connectDB } from "@/lib/db";
import Banner from "@/lib/models/Banner";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const banner = await Banner.findById(id);
    if (!banner) return errorResponse("Not found", 404);
    return successResponse(banner);
  } catch (err) {
    console.error("[GET /api/banners/[id]] Error:", err);
    return errorResponse("Failed to fetch banner", 500);
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const body = await req.json();
    const banner = await Banner.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!banner) return errorResponse("Not found", 404);
    return successResponse(banner);
  } catch (err) {
    console.error("[PUT /api/banners/[id]] Error:", err);
    return errorResponse("Failed to update banner", 500);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) return errorResponse("Not found", 404);
    return successResponse({ message: "Deleted" });
  } catch (err) {
    console.error("[DELETE /api/banners/[id]] Error:", err);
    return errorResponse("Failed to delete banner", 500);
  }
}
