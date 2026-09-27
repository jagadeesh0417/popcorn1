import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import type { IOrder, PaymentStatus } from "@/lib/models/Order";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { requireAdmin, getSessionUser } from "@/lib/server/auth";
import { resolvePaymentStatus } from "@/lib/server/payment";

const ORDER_STATUSES = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled", "return-requested"];
const PAYMENT_STATUSES: PaymentStatus[] = ["pending", "paid", "failed", "refunded"];

/**
 * Allowed manual payment-status transitions. A refunded order is terminal and
 * a paid order can never be silently walked back to pending/failed — that
 * keeps the admin override from corrupting gateway truth.
 */
const PAYMENT_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  pending: ["paid", "failed", "refunded"],
  failed: ["pending", "paid", "refunded"],
  paid: ["refunded"],
  refunded: [],
};

/** Confirmation-page payload: enough to render the receipt, no admin-only data. */
function publicOrderView(order: IOrder, paymentStatus: PaymentStatus) {
  const c = order.customerDetails;
  return {
    orderId: order.orderId,
    status: order.status,
    paymentStatus,
    paymentMethod: order.paymentMethod,
    paymentId: order.paymentId,
    paidAt: order.paidAt,
    createdAt: order.createdAt,
    items: order.items,
    subtotal: order.subtotal,
    shipping: order.shipping,
    discount: order.discount,
    coupon: order.coupon,
    total: order.total,
    fulfillmentMethod: order.fulfillmentMethod,
    pickupLocation: order.pickupLocation,
    deliveryRegion: order.deliveryRegion,
    // Name + address for the receipt; phone/email are never exposed here.
    customerDetails: {
      firstName: c.firstName,
      lastName: c.lastName,
      address: c.address,
      city: c.city,
      state: c.state,
      zipCode: c.zipCode,
    },
  };
}

/**
 * GET — admins receive the full document (order modal); everyone else receives
 * the sanitized confirmation view. Knowing an order id must not leak contact
 * details to strangers.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const order = await Order.findOne({ orderId: id });
    if (!order) {
      console.log("[ORDERS] GET by ID — not found", { orderId: id });
      return errorResponse("Not found", 404);
    }
    const paymentStatus = resolvePaymentStatus(order);
    const user = await getSessionUser();
    if (user?.role === "admin") {
      return successResponse({ ...order.toObject(), paymentStatus });
    }
    return successResponse(publicOrderView(order, paymentStatus));
  } catch (err) {
    console.error("[ORDERS] Failed to fetch order", err);
    return errorResponse("Failed to fetch order", 500);
  }
}

/**
 * PUT — admin only. Whitelisted fields:
 *   - `status`       → fulfilment/order status
 *   - `paymentStatus` → payment status (manual override, validated transitions)
 * Totals, payment ids and customer data are immutable through this endpoint,
 * and every change is written to the order timeline with the admin's identity.
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const user = await getSessionUser();
  const { id } = await params;

  let body: { status?: unknown; paymentStatus?: unknown };
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid request body", 400);
  }

  try {
    await connectDB();
    const order = await Order.findOne({ orderId: id });
    if (!order) return errorResponse("Not found", 404);

    const currentPaymentStatus = resolvePaymentStatus(order);
    const actor = user?.email || "admin";
    const set: Record<string, unknown> = {};
    const notes: { status: string; date: Date; note: string }[] = [];
    const now = new Date();

    if (body.status !== undefined && body.status !== null) {
      const nextStatus = String(body.status);
      if (!ORDER_STATUSES.includes(nextStatus)) {
        return errorResponse("Invalid order status", 400);
      }
      if (nextStatus !== order.status) {
        set.status = nextStatus;
        notes.push({ status: nextStatus, date: now, note: `Status changed to ${nextStatus} by ${actor}` });
      }
    }

    if (body.paymentStatus !== undefined && body.paymentStatus !== null) {
      const nextPayment = String(body.paymentStatus) as PaymentStatus;
      if (!PAYMENT_STATUSES.includes(nextPayment)) {
        return errorResponse("Invalid payment status", 400);
      }
      if (nextPayment !== currentPaymentStatus) {
        const allowed = PAYMENT_TRANSITIONS[currentPaymentStatus] || [];
        if (!allowed.includes(nextPayment)) {
          return errorResponse(`Cannot change payment status from "${currentPaymentStatus}" to "${nextPayment}"`, 400);
        }
        set.paymentStatus = nextPayment;
        set.paymentStatusUpdatedAt = now;
        set.paymentStatusUpdatedBy = actor;
        if (nextPayment === "paid") {
          if (!order.paidAt) set.paidAt = now;
          // A manually-paid order moves out of "pending" like a gateway-paid one.
          if (order.status === "pending") {
            set.status = "confirmed";
            notes.push({ status: "confirmed", date: now, note: `Status changed to confirmed by ${actor}` });
          }
        }
        notes.push({
          status: (set.status as string) || order.status,
          date: now,
          note: `Payment marked ${nextPayment} by ${actor}`,
        });
      }
    }

    if (Object.keys(set).length === 0) {
      return successResponse({ ...order.toObject(), paymentStatus: currentPaymentStatus });
    }

    const updated = await Order.findOneAndUpdate(
      { orderId: id },
      { $set: set, ...(notes.length ? { $push: { statusTimeline: { $each: notes } } } : {}) },
      { new: true, runValidators: true }
    );
    console.log("[ORDERS] admin update", { orderId: id, fields: Object.keys(set), actor });
    return successResponse({ ...updated!.toObject(), paymentStatus: (updated!.paymentStatus as PaymentStatus) || currentPaymentStatus });
  } catch (err) {
    console.error("Failed to update order", err);
    return errorResponse("Failed to update order", 500);
  }
}
