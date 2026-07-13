import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { errorResponse } from "@/lib/api-utils";

export async function POST(req: Request) {
  let amount: number;
  let currency: string;

  try {
    const body = await req.json();
    amount = body.amount;
    currency = body.currency || "INR";
  } catch (e) {
    console.error("[RAZORPAY] failed to parse request body:", e);
    return errorResponse("Invalid request body", 400);
  }

  console.log("[RAZORPAY] create-order request", { amount, currency });

  if (!amount || typeof amount !== "number" || amount <= 0 || !Number.isInteger(amount)) {
    console.error("[RAZORPAY] invalid amount", { amount, type: typeof amount });
    return errorResponse("Amount must be a positive integer (in paise)", 400);
  }

  if (currency !== "INR") {
    console.error("[RAZORPAY] unsupported currency", { currency });
    return errorResponse("Only INR is supported", 400);
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.error("[RAZORPAY] credentials not found in env", {
      hasKeyId: !!keyId,
      hasKeySecret: !!keySecret,
      keyIdPrefix: keyId ? keyId.substring(0, 8) : "none",
    });
    return errorResponse("Razorpay not configured", 500);
  }

  console.log("[RAZORPAY] credentials loaded", {
    keyIdPrefix: keyId.substring(0, 8) + "...",
    keySecretLength: keySecret.length,
  });

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: "rcpt_" + Date.now(),
    });

    console.log("[RAZORPAY] order created on Razorpay", {
      razorpayOrderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });

    return NextResponse.json({ success: true, data: { razorpayOrderId: order.id } });
  } catch (err: unknown) {
    const errorBody = err && typeof err === "object"
      ? JSON.stringify(err, Object.getOwnPropertyNames(err))
      : String(err);

    console.error("[RAZORPAY] Razorpay SDK error:", errorBody);

    // Extract structured error details
    const razorpayErr = err as {
      statusCode?: number;
      error?: { code?: string; description?: string; field?: string };
      message?: string;
    };

    const statusCode = razorpayErr.statusCode || 500;
    const errorCode = razorpayErr.error?.code || "UNKNOWN";
    const description = razorpayErr.error?.description || razorpayErr.message || errorBody;
    const field = razorpayErr.error?.field;

    console.error("[RAZORPAY] structured error", {
      statusCode,
      errorCode,
      description,
      field,
      amount,
      currency,
    });

    return NextResponse.json(
      {
        success: false,
        error: `Razorpay: ${description}`,
        detail: { statusCode, errorCode, field },
      },
      { status: statusCode >= 400 && statusCode < 500 ? statusCode : 500 }
    );
  }
}
