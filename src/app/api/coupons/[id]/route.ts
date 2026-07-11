import { connectDB } from "@/lib/db";
import Coupon from "@/lib/models/Coupon";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const coupon = await Coupon.findById(id);
    if (!coupon) return errorResponse("Not found", 404);
    return successResponse(coupon);
  } catch (err) {
    console.error("Failed to fetch coupon", err);
    return errorResponse("Failed to fetch coupon", 500);
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const coupon = await Coupon.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
    if (!coupon) return errorResponse("Not found", 404);
    return successResponse(coupon);
  } catch (err) {
    console.error("Failed to update coupon", err);
    return errorResponse("Failed to update coupon", 500);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) return errorResponse("Not found", 404);
    return successResponse({ message: "Deleted" });
  } catch (err) {
    console.error("Failed to delete coupon", err);
    return errorResponse("Failed to delete coupon", 500);
  }
}
