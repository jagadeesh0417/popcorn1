import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import OrphanPayment from "@/lib/models/OrphanPayment";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { validateCoupon, incrementCouponUsage } from "@/lib/server/coupon";
import { validateAndResolveItems, reserveStock, StockError } from "@/lib/server/stock";
import { requireAdmin } from "@/lib/server/auth";

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
        customerDetails: 1,
        items: { name: 1, quantity: 1, variant: 1 },
        total: 1,
        status: 1,
        paymentMethod: 1,
        paymentId: 1,
      })
      .lean();
    return successResponse(orders);
  } catch (err) {
    console.error("Failed to fetch orders", err);
    return errorResponse("Failed to fetch orders", 500);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.orderId) {
      return errorResponse("Missing orderId", 400);
    }

    const existing = await Order.findOne({ orderId: body.orderId });
    if (existing) {
      return successResponse(existing);
    }

    const orderData: Record<string, unknown> = { ...body };
    if (!orderData.statusTimeline || !Array.isArray(orderData.statusTimeline) || orderData.statusTimeline.length === 0) {
      orderData.statusTimeline = [{ status: body.status || "pending", date: new Date(), note: "Order placed" }];
    }

    // Server-side source of truth: resolve items from the DB and confirm stock is available.
    let resolved;
    try {
      resolved = await validateAndResolveItems(body.items);
    } catch (err) {
      if (err instanceof StockError) {
        return errorResponse(err.message, err.code);
      }
      throw err;
    }
    orderData.items = resolved.items;

    // Recompute subtotal, discount + total server-side from authoritative item prices.
    const subtotal = resolved.subtotal;
    const shippingCost = Number(body.shipping) || 0;
    let discount = 0;
    if (body.coupon) {
      const couponResult = await validateCoupon(body.coupon, subtotal);
      if (couponResult.valid) {
        discount = couponResult.discount ?? 0;
        await incrementCouponUsage(body.coupon);
      }
    }
    const total = Math.max(0, subtotal - discount + shippingCost);
    orderData.subtotal = subtotal;
    orderData.shipping = shippingCost;
    orderData.discount = discount;
    orderData.total = total;

    // Atomically reserve stock (rejects if the last unit was just taken by someone else).
    try {
      await reserveStock(resolved.items);
    } catch (err) {
      if (err instanceof StockError) {
        return errorResponse(err.message, err.code);
      }
      throw err;
    }

    const order = await Order.create(orderData);

    return successResponse(order, 201);
  } catch (err) {
    console.error("[ORDERS] Failed to create order", err);
    if (err && typeof err === "object" && "errors" in err) {
      console.error("[ORDERS] validation errors:", JSON.stringify((err as { errors: Record<string, { message: string }> }).errors));
    }

    // Write orphan record for manual review
    try {
      const body = await req.clone().json().catch(() => ({}));
      await OrphanPayment.create({
        razorpay_order_id: body.orderId,
        status: "needs_review",
        orderData: body,
        error: err instanceof Error ? err.message : String(err),
      });
    } catch { /* orphan write failure is non-fatal */ }

    return errorResponse("Failed to create order", 500);
  }
}
