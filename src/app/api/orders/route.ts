import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import type { PaymentStatus } from "@/lib/models/Order";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { validateCoupon, incrementCouponUsage } from "@/lib/server/coupon";
import { validateAndResolveItems, reserveStock, StockError } from "@/lib/server/stock";
import { requireAdmin } from "@/lib/server/auth";
import { resolvePaymentStatus, recordOrphanPayment } from "@/lib/server/payment";
import { loadShippingSettings } from "@/lib/server/shipping";
import { computeShippingCost } from "@/lib/shipping";

const CUSTOMER_KEYS = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zipCode", "deliveryInstructions"] as const;

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    await connectDB();
    // Admin order list only needs these fields — skip heavy item images, timeline, address, etc.
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .select({
        orderId: 1,
        createdAt: 1,
        customerDetails: 1,
        items: { name: 1, quantity: 1, variant: 1, price: 1, mrp: 1, offerPercent: 1 },
        subtotal: 1,
        shipping: 1,
        discount: 1,
        coupon: 1,
        total: 1,
        status: 1,
        paymentStatus: 1,
        paidAt: 1,
        paymentMethod: 1,
        paymentId: 1,
        razorpayOrderId: 1,
        fulfillmentMethod: 1,
        deliveryRegion: 1,
        pickupLocation: 1,
      })
      .lean();
    // Orders stored before `paymentStatus` existed get a derived value so the
    // admin panel never shows a blank state.
    return successResponse(orders.map((o) => ({ ...o, paymentStatus: resolvePaymentStatus(o) })));
  } catch (err) {
    console.error("Failed to fetch orders", err);
    return errorResponse("Failed to fetch orders", 500);
  }
}

/**
 * Public checkout order creation (cash on delivery).
 *
 * The browser is untrusted here: totals are recomputed server-side and every
 * status/payment field is forced — the client can only contribute line items,
 * the coupon code, the fulfilment choice and customer details.
 */
export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid request body", 400);
  }

  try {
    await connectDB();

    const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
    if (!orderId) return errorResponse("Missing orderId", 400);

    const existing = await Order.findOne({ orderId });
    if (existing) {
      // Idempotent: retries/replays return the same order, never a second one.
      return successResponse(existing);
    }

    // Server-side source of truth: resolve items from the DB and confirm stock is available.
    let resolved;
    try {
      resolved = await validateAndResolveItems(body.items as Parameters<typeof validateAndResolveItems>[0]);
    } catch (err) {
      if (err instanceof StockError) return errorResponse(err.message, err.code);
      throw err;
    }

    // Recompute subtotal, discount + total server-side from authoritative item prices.
    const subtotal = resolved.subtotal;
    const shippingSettings = await loadShippingSettings();
    const shippingMethod = typeof body.shippingMethod === "string" ? body.shippingMethod : undefined;
    const shippingCost = computeShippingCost(subtotal, shippingSettings, shippingMethod);
    console.log("[ORDERS] server-side shipping", { subtotal, shippingCost, shippingMethod: shippingMethod ?? "shipping" });

    let discount = 0;
    const coupon = typeof body.coupon === "string" && body.coupon ? body.coupon : undefined;
    if (coupon) {
      const couponResult = await validateCoupon(coupon, subtotal);
      if (couponResult.valid) {
        discount = couponResult.discount ?? 0;
        await incrementCouponUsage(coupon);
      }
    }
    const total = Math.max(0, subtotal - discount + shippingCost);

    const rawCustomer = (body.customerDetails || {}) as Record<string, unknown>;
    const customerDetails: Record<string, string> = {};
    for (const key of CUSTOMER_KEYS) {
      const value = rawCustomer[key];
      customerDetails[key] = typeof value === "string" ? value.trim() : "";
    }
    const missingCustomerField = CUSTOMER_KEYS.filter((key) => key !== "lastName" && key !== "deliveryInstructions" && !customerDetails[key]);
    if (missingCustomerField.length > 0) {
      return errorResponse("Please provide your name, phone, email and address to continue.", 400);
    }

    const fulfillmentMethod = body.fulfillmentMethod === "pickup" ? "pickup" : "delivery";
    const orderData = {
      orderId,
      items: resolved.items,
      subtotal,
      shipping: shippingCost,
      discount,
      coupon,
      total,
      // COD is never "paid" at creation; client-supplied statuses are ignored.
      status: "pending" as const,
      paymentStatus: "pending" as PaymentStatus,
      paymentMethod: "COD",
      fulfillmentMethod: fulfillmentMethod as "pickup" | "delivery",
      ...(fulfillmentMethod === "pickup" && typeof body.pickupLocation === "string" ? { pickupLocation: body.pickupLocation } : {}),
      ...(fulfillmentMethod === "delivery" &&
      (body.deliveryRegion === "mysore" || body.deliveryRegion === "pan_india")
        ? { deliveryRegion: body.deliveryRegion }
        : {}),
      customerDetails,
      statusTimeline: [{ status: "pending", date: new Date(), note: "Order placed (COD)" }],
    };

    // Create the order BEFORE reserving stock so the order is the
    // idempotency anchor (duplicate orderId returns early above).
    let order;
    try {
      order = await Order.create(orderData);
      console.log("[ORDERS] order created", { orderId: order.orderId, paymentStatus: order.paymentStatus });
    } catch (e: unknown) {
      // Race: another request created the same order concurrently.
      const duplicate = await Order.findOne({ orderId });
      if (duplicate) {
        console.log("[ORDERS] concurrent duplicate order", { orderId });
        return successResponse(duplicate);
      }
      console.error("[ORDERS] Failed to create order", e);
      if (e && typeof e === "object" && "errors" in e) {
        console.error("[ORDERS] validation errors:", JSON.stringify((e as { errors: Record<string, { message: string }> }).errors));
      }
      return errorResponse("Failed to create order", 500);
    }

    // Now reserve/deduct stock. Because the order already exists, any
    // retry after this point is caught by the duplicate-order check above.
    try {
      await reserveStock(resolved.items, order.orderId);
      await Order.updateOne({ _id: order._id }, { $set: { stockAdjusted: true } });
    } catch (err) {
      if (err instanceof StockError) {
        // No money has moved — remove the order entirely so a retry with the
        // same orderId re-runs validation instead of resurrecting this record.
        try {
          await Order.deleteOne({ _id: order._id });
        } catch { /* non-fatal */ }
        await recordOrphanPayment({ error: `COD stock reservation failed: ${err.message}`, email: customerDetails.email });
        console.error("[ORDERS] COD stock reservation failed — order removed", { orderId, msg: err.message });
        return errorResponse(err.message, err.code);
      }
      throw err;
    }

    return successResponse(order);
  } catch (err) {
    console.error("[ORDERS] Failed to create order", err);
    if (err && typeof err === "object" && "errors" in err) {
      console.error("[ORDERS] validation errors:", JSON.stringify((err as { errors: Record<string, { message: string }> }).errors));
    }
    return errorResponse("Failed to create order", 500);
  }
}
