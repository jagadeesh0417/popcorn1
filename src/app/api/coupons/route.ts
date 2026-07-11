import { connectDB } from "@/lib/db";
import Coupon from "@/lib/models/Coupon";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    await connectDB();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return successResponse(coupons);
  } catch (err) {
    console.error("Failed to fetch coupons", err);
    return errorResponse("Failed to fetch coupons", 500);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const coupon = await Coupon.create(body);
    return successResponse(coupon, 201);
  } catch (err) {
    console.error("Failed to create coupon", err);
    return errorResponse("Failed to create coupon", 500);
  }
}
