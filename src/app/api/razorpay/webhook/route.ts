import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import {
  markOrderPaid,
  markOrderPaymentFailed,
  recordOrphanPayment,
} from "@/lib/server/payment";

type RazorpayWebhookEvent = {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        status?: string;
        amount?: number;
        currency?: string;
        created_at?: number;
      };
    };
  };
};

function signatureMatches(expected: string, received: string): boolean {
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Razorpay webhook — the reliability backstop for the browser callback.
 *
 * - Signature is validated against RAZORPAY_WEBHOOK_SECRET over the RAW body.
 * - The same event delivered N times maps to N idempotent no-ops: the paid
 *   transition and stock deduction are guarded atomically on the order document.
 * - Valid events are always acknowledged with 200 so Razorpay stops retrying;
 *   anything we cannot tie to an order is durably recorded for review instead
 *   of being silently dropped.
 */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[WEBHOOK] RAZORPAY_WEBHOOK_SECRET is not configured — rejecting webhook");
    return NextResponse.json({ success: false, error: "Webhook secret not configured" }, { status: 500 });
  }

  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ success: false, error: "Missing signature" }, { status: 400 });
  }

  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  if (!signatureMatches(expected, signature)) {
    console.error("[WEBHOOK] signature verification failed");
    return NextResponse.json({ success: false, error: "Invalid webhook signature" }, { status: 400 });
  }

  let event: RazorpayWebhookEvent;
  try {
    event = JSON.parse(raw) as RazorpayWebhookEvent;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
  }

  try {
    await connectDB();
  } catch (err) {
    console.error("[WEBHOOK] database connection failed:", err);
    return NextResponse.json({ success: false, error: "Database unavailable" }, { status: 500 });
  }

  const payment = event.payload?.payment?.entity;
  const paymentId = payment?.id;
  const razorpayOrderId = payment?.order_id;
  const name = event.event || "unknown";

  try {
    if ((name === "payment.captured" || name === "order.paid") && paymentId && razorpayOrderId) {
      const result = await markOrderPaid({
        razorpayOrderId,
        paymentId,
        gatewayAmountPaise: payment?.amount,
        gatewayCurrency: payment?.currency,
        paidAt: payment?.created_at ? new Date(payment.created_at * 1000) : undefined,
        source: "webhook",
      });

      switch (result.outcome) {
        case "paid":
          return NextResponse.json({
            success: true,
            received: true,
            orderId: result.order.orderId,
            paymentStatus: "paid",
            duplicate: result.alreadyPaid,
          });
        case "not_found":
          await recordOrphanPayment({ paymentId, razorpayOrderId, error: `webhook ${name} with no matching order` });
          console.warn("[WEBHOOK] captured payment has no matching order", { razorpayOrderId, paymentId });
          return NextResponse.json({ success: true, received: true, recorded: true });
        case "amount_mismatch":
        case "currency_mismatch":
          await recordOrphanPayment({
            paymentId,
            razorpayOrderId,
            amount: payment?.amount,
            error: `webhook ${name} rejected: ${result.outcome}`,
          });
          console.error("[WEBHOOK] rejected payment — amount/currency mismatch", {
            razorpayOrderId,
            paymentId,
            outcome: result.outcome,
          });
          return NextResponse.json({ success: true, received: true, flagged: true });
        case "stock_failed":
          console.error("[WEBHOOK] paid but stock deduction failed", { orderId: result.order.orderId });
          return NextResponse.json({ success: true, received: true, flagged: true });
        default:
          return NextResponse.json({ success: true, received: true });
      }
    }

    if (name === "payment.failed" && paymentId && razorpayOrderId) {
      const result = await markOrderPaymentFailed({
        razorpayOrderId,
        paymentId,
        reason: payment?.status,
        source: "webhook",
      });
      return NextResponse.json({ success: true, received: true, paymentStatus: result.order?.paymentStatus ?? "unknown" });
    }

    // Recognised but irrelevant events (refunds, disputes handled elsewhere).
    return NextResponse.json({ success: true, received: true, ignored: name });
  } catch (err) {
    // Unexpected failure: 500 so Razorpay retries — the transition itself is
    // idempotent, so a retry can never double-apply anything.
    console.error("[WEBHOOK] unhandled error", { event: name, err: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ success: false, error: "Webhook processing failed" }, { status: 500 });
  }
}
