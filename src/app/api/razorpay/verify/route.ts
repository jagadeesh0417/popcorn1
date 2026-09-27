import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { connectDB } from "@/lib/db";
import { errorResponse } from "@/lib/api-utils";
import { getRazorpayCredentials } from "@/lib/server/razorpay";
import {
  findPaymentOrder,
  markOrderPaid,
  markOrderPaymentFailed,
  recordOrphanPayment,
} from "@/lib/server/payment";

/** Constant-time string comparison so signature checks can't be probed by timing. */
function signatureMatches(expected: string, received: string): boolean {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

type GatewayPayment = {
  id: string;
  order_id: string;
  status: string;
  amount: number;
  currency: string;
  created_at: number;
};

/**
 * Server-side payment verification.
 *
 * The browser callback is only a transport for the Razorpay signature — every
 * decision here is made server-side:
 *   1. HMAC-SHA256 signature check against the stored key secret,
 *   2. cross-check with the gateway payment (binding, status, amount, currency)
 *      whenever the API is reachable,
 *   3. atomic `paymentStatus != paid` transition + one-time stock deduction.
 * Replaying this request is safe: it returns success without side effects.
 */
export async function POST(req: Request) {
  let body: {
    razorpay_order_id?: unknown;
    razorpay_payment_id?: unknown;
    razorpay_signature?: unknown;
    orderId?: unknown;
  };
  try {
    body = await req.json();
  } catch (e) {
    console.error("[PAYMENT] failed to parse request body:", e);
    return errorResponse("Invalid request body", 400);
  }

  const razorpayOrderId = typeof body.razorpay_order_id === "string" ? body.razorpay_order_id : "";
  const paymentId = typeof body.razorpay_payment_id === "string" ? body.razorpay_payment_id : "";
  const signature = typeof body.razorpay_signature === "string" ? body.razorpay_signature : "";
  const orderId = typeof body.orderId === "string" ? body.orderId : undefined;

  if (!razorpayOrderId || !paymentId || !signature) {
    console.error("[PAYMENT] missing payment details", {
      has_order_id: !!razorpayOrderId,
      has_payment_id: !!paymentId,
      has_signature: !!signature,
    });
    return errorResponse("Missing payment details", 400);
  }

  const credentials = await getRazorpayCredentials();
  if (!credentials) {
    console.error("[PAYMENT] payment credentials not configured");
    return errorResponse("Payment gateway not configured", 500);
  }

  // Step 1 — official Razorpay signature verification (order_id|payment_id HMAC).
  const expectedSignature = crypto
    .createHmac("sha256", credentials.keySecret)
    .update(`${razorpayOrderId}|${paymentId}`)
    .digest("hex");

  if (!signatureMatches(expectedSignature, signature)) {
    // Never log or return the expected signature: it is derived from the secret.
    console.error("[PAYMENT] signature verification failed", { razorpayOrderId, paymentId });
    return errorResponse("Invalid payment signature", 400);
  }

  try {
    await connectDB();
  } catch (e) {
    console.error("[PAYMENT] database connection failed:", e);
    return errorResponse("Database connection failed", 500);
  }

  const order = await findPaymentOrder({ razorpayOrderId, orderId });
  if (!order) {
    // Signature is valid, so money moved but we have no matching order — record
    // it for manual review instead of losing it.
    console.error("[PAYMENT] verified payment but no local order found", { razorpayOrderId, paymentId });
    await recordOrphanPayment({ paymentId, razorpayOrderId, error: "verified payment with no matching local order" });
    return errorResponse("Order not found for this payment. Please contact support with your payment ID.", 404);
  }

  // Step 2 — cross-check the payment with the gateway (best effort). The
  // signature already authenticates the callback; the API adds direct proof of
  // status/amount/currency. If the gateway is unreachable we fall back to the
  // signature + the amount we stored when creating the Razorpay order.
  let gatewayAmountPaise: number | undefined;
  let gatewayCurrency: string | undefined;
  let paidAt: Date | undefined;

  try {
    const razorpay = new Razorpay({ key_id: credentials.keyId, key_secret: credentials.keySecret });
    let payment = (await razorpay.payments.fetch(paymentId)) as GatewayPayment;

    if (payment.order_id !== razorpayOrderId) {
      console.error("[PAYMENT] payment/order binding mismatch", {
        expectedOrderId: razorpayOrderId,
        paymentOrderId: payment.order_id,
      });
      return errorResponse("Payment does not belong to this order", 400);
    }

    if (payment.status === "authorized") {
      // Auto-capture is normally on; if not, capture explicitly so a genuine
      // payment can settle. Failure keeps the order PENDING (never fake-paid).
      try {
        await razorpay.payments.capture(paymentId, payment.amount, payment.currency);
        payment = (await razorpay.payments.fetch(paymentId)) as GatewayPayment;
      } catch (captureErr) {
        console.warn("[PAYMENT] authorized payment could not be captured yet", captureErr);
        return NextResponse.json({
          success: false,
          paymentStatus: "pending",
          retryable: true,
          error: "Payment is being confirmed. Please wait a moment.",
        });
      }
    }

    if (payment.status !== "captured") {
      if (payment.status === "failed" || payment.status === "cancelled") {
        await markOrderPaymentFailed({ orderId: order.orderId, razorpayOrderId, paymentId, reason: payment.status, source: "verify" });
        return NextResponse.json({ success: false, paymentStatus: "failed", error: "Payment failed. Please try again." }, { status: 400 });
      }
      // e.g. created / authorized-pending — truthful PENDING, never fake success.
      console.warn("[PAYMENT] payment not captured yet", { status: payment.status });
      return NextResponse.json({
        success: false,
        paymentStatus: "pending",
        retryable: true,
        error: "Payment is being confirmed. Please wait a moment.",
      });
    }

    gatewayAmountPaise = payment.amount;
    gatewayCurrency = payment.currency;
    paidAt = new Date(payment.created_at * 1000);
  } catch (err) {
    console.warn(
      "[PAYMENT] gateway cross-check unavailable, relying on signature + stored amount:",
      err instanceof Error ? err.message : String(err)
    );
  }

  // Step 3 — atomic, idempotent paid transition + one-time stock deduction.
  const result = await markOrderPaid({
    orderId: order.orderId,
    razorpayOrderId,
    paymentId,
    gatewayAmountPaise,
    gatewayCurrency,
    paidAt,
    source: "verify",
  });

  switch (result.outcome) {
    case "paid":
      return NextResponse.json({
        success: true,
        data: {
          orderId: result.order.orderId,
          paymentStatus: "paid",
          orderStatus: result.order.status,
          order: result.order,
        },
      });

    case "amount_mismatch":
      await recordOrphanPayment({
        paymentId,
        razorpayOrderId,
        amount: result.gotPaise,
        email: order.customerDetails?.email,
        error: `amount mismatch: expected ${result.expectedPaise} paise, gateway captured ${result.gotPaise}`,
      });
      console.error("[PAYMENT] amount mismatch — order kept unpaid", {
        orderId: order.orderId,
        expected: result.expectedPaise,
        got: result.gotPaise,
      });
      return NextResponse.json(
        {
          success: false,
          paymentStatus: order.paymentStatus,
          payment_id: paymentId,
          error: "Payment amount does not match the order total. Please contact support with your payment ID.",
        },
        { status: 409 }
      );

    case "currency_mismatch":
      await recordOrphanPayment({
        paymentId,
        razorpayOrderId,
        amount: gatewayAmountPaise,
        email: order.customerDetails?.email,
        error: `currency mismatch: ${result.currency}`,
      });
      return NextResponse.json(
        { success: false, payment_id: paymentId, error: "Unsupported payment currency. Please contact support." },
        { status: 409 }
      );

    case "stock_failed":
      // Money is captured; order stays PAID but flagged for manual review.
      return NextResponse.json(
        {
          success: false,
          paymentStatus: "paid",
          payment_id: paymentId,
          needs_refund: true,
          error: result.error || "Some items in your order are no longer available.",
        },
        { status: 409 }
      );

    case "not_found":
    default:
      console.error("[PAYMENT] order disappeared during verification", { orderId: order.orderId });
      await recordOrphanPayment({ paymentId, razorpayOrderId, error: "order missing during paid transition" });
      return errorResponse("Order not found. Please contact support with your payment ID.", 404);
  }
}
