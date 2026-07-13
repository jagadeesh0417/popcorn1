import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-utils";

export async function POST(req: Request) {
  try {
    const { amount, currency } = await req.json();

    console.log("[RAZORPAY] create-order request", { amount, currency });

    if (!amount || amount <= 0) {
      console.error("[RAZORPAY] invalid amount", { amount });
      return errorResponse("Invalid amount", 400);
    }

    const keyId = process.env.RAZORPAY_KEY_ID!;
    const keySecret = process.env.RAZORPAY_KEY_SECRET!;

    if (!keyId || !keySecret) {
      return errorResponse("Razorpay not configured", 500);
    }

    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
      },
      body: JSON.stringify({
        amount,
        currency: currency || "INR",
        receipt: "rcpt_" + Date.now(),
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Razorpay order creation failed:", err);
      return errorResponse("Failed to create order", 500);
    }

    const order = await res.json();
    return NextResponse.json({ success: true, data: { razorpayOrderId: order.id } });
  } catch (err) {
    console.error("create-order error:", err);
    return errorResponse("Internal server error", 500);
  }
}
