import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { amount, currency } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID!;
    const keySecret = process.env.RAZORPAY_KEY_SECRET!;

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
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    const order = await res.json();
    return NextResponse.json({ razorpayOrderId: order.id });
  } catch (err) {
    console.error("create-order error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
