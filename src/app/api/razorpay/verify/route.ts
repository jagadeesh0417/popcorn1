import { NextResponse } from "next/server";
import crypto from "crypto";
import { errorResponse } from "@/lib/api-utils";

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return errorResponse("Missing payment details", 400);
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET!;
    if (!keySecret) {
      return errorResponse("Razorpay not configured", 500);
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return errorResponse("Invalid signature", 400);
    }

    return NextResponse.json({ success: true, data: { verified: true } });
  } catch (err) {
    console.error("verify error:", err);
    return errorResponse("Internal server error", 500);
  }
}
