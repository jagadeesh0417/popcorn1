import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import type { IOrder, PaymentStatus } from "@/lib/models/Order";
import OrphanPayment from "@/lib/models/OrphanPayment";
import { reserveStock } from "@/lib/server/stock";
import { incrementCouponUsage } from "@/lib/server/coupon";

/**
 * Server-side payment state machine.
 *
 * Every path that can confirm a Razorpay payment (browser callback, webhook,
 * reconciliation) funnels through these helpers so that:
 *   - `paymentStatus` only ever becomes `paid` after our own verification,
 *   - the paid transition happens exactly once (atomic `paymentStatus != paid` guard),
 *   - stock is deducted exactly once per order (atomic `stockAdjusted` guard).
 */

export type PaymentTransitionSource = "verify" | "webhook" | "reconcile";

export type MarkPaidResult =
  | { outcome: "paid"; order: IOrder; alreadyPaid: boolean }
  | { outcome: "not_found" }
  | { outcome: "amount_mismatch"; order: IOrder; expectedPaise: number; gotPaise: number }
  | { outcome: "currency_mismatch"; order: IOrder; currency: string }
  | { outcome: "stock_failed"; order: IOrder; error: string };

export interface MarkPaidInput {
  /** Our order id, when known by the caller. */
  orderId?: string;
  /** Razorpay order id from the gateway — the authoritative link. */
  razorpayOrderId?: string;
  paymentId: string;
  /** Amount actually captured by the gateway, in paise. */
  gatewayAmountPaise?: number;
  gatewayCurrency?: string;
  /** Gateway payment timestamp. */
  paidAt?: Date;
  source: PaymentTransitionSource;
}

/** Locate the local order behind a gateway payment (razorpayOrderId first). */
export async function findPaymentOrder(opts: { orderId?: string; razorpayOrderId?: string }): Promise<IOrder | null> {
  await connectDB();
  if (opts.razorpayOrderId) {
    const byGateway = await Order.findOne({ razorpayOrderId: opts.razorpayOrderId });
    if (byGateway) return byGateway;
  }
  if (opts.orderId) return Order.findOne({ orderId: opts.orderId });
  return null;
}

/** The amount we expect to have been charged, in paise. */
export function expectedAmountPaise(order: IOrder): number {
  return typeof order.amountPaise === "number" && order.amountPaise > 0
    ? order.amountPaise
    : Math.round(order.total * 100);
}

/**
 * Deduct stock for an order at most once. The atomic `stockAdjusted` claim
 * guarantees duplicate callbacks/webhooks never decrement twice. On failure the
 * claim is intentionally left set: an orphan record + timeline note are written
 * for manual review instead of silently re-attempting partial deductions.
 */
async function deductStockOnce(order: IOrder): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const claim = await Order.findOneAndUpdate(
      { _id: order._id, stockAdjusted: { $ne: true } },
      { $set: { stockAdjusted: true } },
      { new: true }
    );
    if (!claim) return { ok: true }; // another request already handled stock

    try {
      await reserveStock(order.items as unknown as Parameters<typeof reserveStock>[0], order.orderId);
      console.log("[INVENTORY] stock deducted", { orderId: order.orderId });
      return { ok: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[INVENTORY] stock deduction failed after payment", { orderId: order.orderId, msg });
      await recordOrphanPayment({
        paymentId: order.paymentId,
        razorpayOrderId: order.razorpayOrderId,
        amount: order.total,
        email: order.customerDetails?.email,
        error: `stock deduction failed: ${msg}`,
      });
      await Order.updateOne(
        { _id: order._id },
        {
          $push: {
            statusTimeline: {
              status: order.status,
              date: new Date(),
              note: `Stock deduction failed — needs review: ${msg}`,
            },
          },
        }
      );
      return { ok: false, error: msg };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[INVENTORY] stock claim failed", { orderId: order.orderId, msg });
    return { ok: false, error: msg };
  }
}

/**
 * Mark an order paid exactly once. Returns `alreadyPaid` for idempotent
 * replays (duplicate verify calls, webhook + callback races) without touching
 * stock again.
 */
export async function markOrderPaid(input: MarkPaidInput): Promise<MarkPaidResult> {
  const order = await findPaymentOrder({ orderId: input.orderId, razorpayOrderId: input.razorpayOrderId });
  if (!order) return { outcome: "not_found" };

  if (input.gatewayCurrency && input.gatewayCurrency.toUpperCase() !== "INR") {
    console.error("[PAYMENT] currency mismatch", { orderId: order.orderId, currency: input.gatewayCurrency });
    return { outcome: "currency_mismatch", order, currency: input.gatewayCurrency };
  }

  const expected = expectedAmountPaise(order);
  if (typeof input.gatewayAmountPaise === "number" && input.gatewayAmountPaise !== expected) {
    console.error("[PAYMENT] amount mismatch — NOT marking paid", {
      orderId: order.orderId,
      expectedPaise: expected,
      gotPaise: input.gatewayAmountPaise,
    });
    return { outcome: "amount_mismatch", order, expectedPaise: expected, gotPaise: input.gatewayAmountPaise };
  }

  const paidAt = input.paidAt ?? new Date();
  const now = new Date();
  const becameConfirmed = order.status === "pending";

  const updated = await Order.findOneAndUpdate(
    { _id: order._id, paymentStatus: { $ne: "paid" } },
    {
      $set: {
        paymentStatus: "paid",
        paidAt,
        paymentId: input.paymentId,
        paymentMethod: order.paymentMethod || "Razorpay",
        ...(input.razorpayOrderId ? { razorpayOrderId: input.razorpayOrderId } : {}),
        paymentStatusUpdatedAt: now,
        paymentStatusUpdatedBy: `gateway:${input.source}`,
        ...(becameConfirmed ? { status: "confirmed" } : {}),
      },
      $push: {
        statusTimeline: {
          status: becameConfirmed ? "confirmed" : order.status,
          date: now,
          note: `Payment verified (${input.source})`,
        },
      },
    },
    { new: true }
  );

  if (!updated) {
    // Already paid — a duplicate callback/webhook. Success, but no side effects.
    const current = (await Order.findOne({ _id: order._id })) || order;
    console.log("[PAYMENT] duplicate paid transition ignored", { orderId: order.orderId, source: input.source });
    return { outcome: "paid", order: current, alreadyPaid: true };
  }

  // Coupon usage is counted exactly once — tied to the atomic paid transition,
  // so retries/webhook races can never double-increment. (COD counts at order
  // creation instead; those orders never pass through here.)
  if (updated.coupon) {
    try {
      await incrementCouponUsage(updated.coupon);
    } catch (err) {
      console.warn("[PAYMENT] coupon usage increment failed", { orderId: updated.orderId, err: err instanceof Error ? err.message : String(err) });
    }
  }

  console.log("[PAYMENT] order marked PAID", {
    orderId: updated.orderId,
    paymentId: input.paymentId,
    source: input.source,
  });

  const stock = await deductStockOnce(updated);
  if (!stock.ok) {
    return { outcome: "stock_failed", order: updated, error: stock.error };
  }

  const final = (await Order.findOne({ _id: updated._id })) || updated;
  return { outcome: "paid", order: final, alreadyPaid: false };
}

/**
 * Mark a pending payment as failed (payment.failed callback/webhook).
 * Never downgrades an already-paid or refunded order.
 */
export async function markOrderPaymentFailed(opts: {
  orderId?: string;
  razorpayOrderId?: string;
  paymentId?: string;
  reason?: string;
  source: PaymentTransitionSource;
}): Promise<{ outcome: "failed" | "ignored" | "not_found"; order: IOrder | null }> {
  const order = await findPaymentOrder({ orderId: opts.orderId, razorpayOrderId: opts.razorpayOrderId });
  if (!order) return { outcome: "not_found", order: null };

  const now = new Date();
  const updated = await Order.findOneAndUpdate(
    { _id: order._id, paymentStatus: "pending" },
    {
      $set: {
        paymentStatus: "failed",
        paymentStatusUpdatedAt: now,
        paymentStatusUpdatedBy: `gateway:${opts.source}`,
        ...(opts.paymentId ? { paymentId: opts.paymentId } : {}),
      },
      $push: {
        statusTimeline: {
          status: order.status,
          date: now,
          note: `Payment failed${opts.reason ? `: ${opts.reason}` : ""}`,
        },
      },
    },
    { new: true }
  );

  if (!updated) {
    const current = (await Order.findOne({ _id: order._id })) || order;
    console.log("[PAYMENT] failed transition ignored", { orderId: order.orderId, paymentStatus: current.paymentStatus });
    return { outcome: "ignored", order: current };
  }

  console.log("[PAYMENT] order marked FAILED", { orderId: updated.orderId, source: opts.source });
  return { outcome: "failed", order: updated };
}

/**
 * Durably record money that was captured but could not be tied to a healthy
 * order (missing order, amount mismatch, stock failure). Deduplicated by the
 * gateway payment id so retries do not pile up records.
 */
export async function recordOrphanPayment(opts: {
  paymentId?: string;
  razorpayOrderId?: string;
  amount?: number;
  email?: string;
  error: string;
}): Promise<void> {
  try {
    await connectDB();
    if (opts.paymentId) {
      const existing = await OrphanPayment.findOne({ razorpay_payment_id: opts.paymentId });
      if (existing) return;
    }
    await OrphanPayment.create({
      razorpay_payment_id: opts.paymentId,
      razorpay_order_id: opts.razorpayOrderId,
      amount: opts.amount,
      email: opts.email,
      status: "needs_review",
      error: opts.error,
    });
  } catch (err) {
    console.error("[PAYMENT] failed to record orphan payment", err);
  }
}

/** Derived payment status for legacy orders created before the field existed. */
export function resolvePaymentStatus(order: {
  paymentStatus?: PaymentStatus;
  paymentId?: string;
  paymentMethod?: string;
}): PaymentStatus {
  if (order.paymentStatus) return order.paymentStatus;
  // Legacy orders: COD was never paid online; online orders only count as paid
  // when a gateway payment id was captured at verification time.
  if (order.paymentMethod === "COD") return "pending";
  if (order.paymentId) return "paid";
  return "pending";
}
