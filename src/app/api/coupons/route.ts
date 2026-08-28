import { connectDB } from "@/lib/db";
import Coupon from "@/lib/models/Coupon";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { unstable_cache } from "next/cache";
import { revalidateTag } from "next/cache";
import { COUPON_CACHE_TAG, PUBLIC_REVALIDATE_SECONDS, publicCacheHeaders } from "@/lib/cache";

async function fetchCoupons() {
  await connectDB();
  return Coupon.find({}).sort({ createdAt: -1 }).lean();
}

export async function GET() {
  try {
    const cachedFetch = unstable_cache(
      async () => (await fetchCoupons()) as unknown[],
      ["coupons"],
      { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: [COUPON_CACHE_TAG] }
    );
    const coupons = await cachedFetch();
    return successResponse(coupons, 200, { headers: publicCacheHeaders() });
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
    revalidateTag(COUPON_CACHE_TAG);
    return successResponse(coupon, 201);
  } catch (err) {
    console.error("Failed to create coupon", err);
    return errorResponse("Failed to create coupon", 500);
  }
}
