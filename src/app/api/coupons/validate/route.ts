import { NextRequest } from "next/server";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { validateCoupon } from "@/lib/server/coupon";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code = typeof body?.code === "string" ? body.code : "";
    const subtotal = Number(body?.subtotal);
    if (!Number.isFinite(subtotal) || subtotal < 0) {
      return errorResponse("Invalid cart total", 400);
    }
    const result = await validateCoupon(code, subtotal);
    if (!result.valid) {
      return errorResponse(result.reason || "Invalid coupon code", 400);
    }
    return successResponse({
      code: result.code,
      discount: result.discount,
      coupon: result.coupon,
    });
  } catch (err) {
    console.error("Failed to validate coupon", err);
    return errorResponse("Failed to validate coupon", 500);
  }
}
