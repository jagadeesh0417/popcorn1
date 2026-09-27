import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import { errorResponse } from "@/lib/api-utils";
import { getRazorpayCredentials } from "@/lib/server/razorpay";
import { markOrderPaid, markOrderPaymentFailed, expectedAmountPaise } from "@/lib/server/payment";

type GatewayPayment = {
  id: string;
  order_id: string;
  status: string;
  amount: number;
  currency: string;
  created_at: number;
};

/**
 * Reconciliation for PENDING payments.
 *
 * Used by the confirmation page (and anyone who needs certainty) when a webhook
 * is delayed or the browser callback never completed. It never fabricates a
 * result: it asks Razorpay for the real payment state and only then applies the
 * same idempotent paid/failed transition used by verify + webhook.
 */
export async function POST(req: Request) {
  let body: { orderId?: unknown };
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid request body", 400);
  }

  const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
  if (!orderId) return errorResponse("Missing orderId", 400);

  try {
    await connectDB();
  } catch (err) {
    console.error("[RECONCILE] database connection failed:", err);
    return errorResponse("Database connection failed", 500);
  }

  const order = await Order.findOne({ orderId });
  if (!order) return errorResponse("Order not found", 404);

  const currentState = () => ({
    orderId: order.orderId,
    paymentStatus: order.paymentStatus || (order.paymentId ? "paid" : "pending"),
    orderStatus: order.status,
  });

  // Nothing to reconcile: already settled, explicitly failed/refunded, or COD.
  if (order.paymentStatus === "paid" || order.paymentStatus === "refunded") {
    return NextResponse.json({ success: true, data: { ...currentState(), alreadyPaid: order.paymentStatus === "paid" } });
  }
  if (order.paymentStatus === "failed") {
    return NextResponse.json({ success: true, data: currentState() });
  }
  if (order.paymentMethod === "COD" || !order.razorpayOrderId) {
    return NextResponse.json({ success: true, data: currentState() });
  }

  const credentials = await getRazorpayCredentials();
  if (!credentials) return errorResponse("Payment gateway not configured", 500);

  let payments: GatewayPayment[];
  try {
    const razorpay = new Razorpay({ key_id: credentials.keyId, key_secret: credentials.keySecret });
    const res = await razorpay.orders.fetchPayments(order.razorpayOrderId);
    payments = (res.items || []) as unknown as GatewayPayment[];
  } catch (err) {
    console.error("[RECONCILE] gateway query failed:", err instanceof Error ? err.message : String(err));
    return errorResponse("Payment gateway is unavailable right now. Please try again.", 502);
  }

  const expected = expectedAmountPaise(order);
  const captured =
    payments.find((p) => p.status === "captured" && p.amount === expected) ||
    payments.find((p) => p.status === "captured" && p.id === order.paymentId) ||
    payments.find((p) => p.status === "captured");

  if (captured) {
    const result = await markOrderPaid({
      orderId: order.orderId,
      razorpayOrderId: order.razorpayOrderId,
      paymentId: captured.id,
      gatewayAmountPaise: captured.amount,
      gatewayCurrency: captured.currency,
      paidAt: new Date(captured.created_at * 1000),
      source: "reconcile",
    });

    if (result.outcome === "paid" || result.outcome === "stock_failed") {
      return NextResponse.json({
        success: true,
        data: {
          orderId: result.order.orderId,
          paymentStatus: "paid",
          orderStatus: result.order.status,
          alreadyPaid: result.outcome === "paid" ? result.alreadyPaid : false,
        },
      });
    }
    if (result.outcome === "amount_mismatch") {
      console.error("[RECONCILE] amount mismatch for order", {
        orderId: order.orderId,
        expected: result.expectedPaise,
        got: result.gotPaise,
      });
      return NextResponse.json({ success: true, data: currentState() });
    }
  }

  // No captured payment: if the gateway shows only failures, mark it failed so
  // the customer sees a truthful state instead of an eternal spinner.
  const hasFailure = payments.some((p) => p.status === "failed" || p.status === "cancelled");
  if (hasFailure) {
    await markOrderPaymentFailed({ orderId: order.orderId, razorpayOrderId: order.razorpayOrderId, reason: "gateway reports failure", source: "reconcile" });
    const fresh = await Order.findOne({ orderId });
    return NextResponse.json({ success: true, data: fresh ? { orderId: fresh.orderId, paymentStatus: fresh.paymentStatus, orderStatus: fresh.status } : currentState() });
  }

  // Still pending (e.g. payment in progress) — report exactly that.
  return NextResponse.json({ success: true, data: currentState() });
}
