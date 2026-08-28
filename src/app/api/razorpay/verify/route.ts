import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import OrphanPayment from "@/lib/models/OrphanPayment";
import { errorResponse } from "@/lib/api-utils";
import { validateCoupon, incrementCouponUsage } from "@/lib/server/coupon";
import { validateAndResolveItems, reserveStock } from "@/lib/server/stock";
import { getRazorpayCredentials } from "@/lib/server/razorpay";

export async function POST(req: Request) {
  let body;
  try {
    body = await req.json();
  } catch (e) {
    console.error("[PAYMENT] failed to parse request body:", e);
    return errorResponse("Invalid request body", 400);
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = body;

  console.log("[PAYMENT] verify request", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature: razorpay_signature ? razorpay_signature.substring(0, 10) + "..." : undefined,
    orderId: orderData?.orderId,
  });

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    console.error("[PAYMENT] missing payment details", {
      has_order_id: !!razorpay_order_id,
      has_payment_id: !!razorpay_payment_id,
      has_signature: !!razorpay_signature,
    });
    return errorResponse("Missing payment details", 400);
  }

  if (!orderData || !orderData.orderId) {
    console.error("[PAYMENT] missing order data");
    return errorResponse("Missing order data", 400);
  }

  const credentials = await getRazorpayCredentials();
  if (!credentials) {
    console.error("[PAYMENT] RAZORPAY_KEY_SECRET not configured");
    return errorResponse("Payment gateway not configured", 500);
  }
  const keySecret = credentials.keySecret;

  console.log("[PAYMENT] key secret loaded, length:", keySecret.length);

  const payload = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(payload)
    .digest("hex");

  console.log("[PAYMENT] signature check", {
    payload: razorpay_order_id + "|" + razorpay_payment_id,
    expected: expectedSignature,
    received: razorpay_signature,
  });

  if (expectedSignature !== razorpay_signature) {
    console.error("[PAYMENT] SIGNATURE MISMATCH", {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      expected: expectedSignature,
      received: razorpay_signature,
      key_secret_length: keySecret.length,
    });
    return NextResponse.json(
      {
        success: false,
        error: "Invalid payment signature",
        detail: {
          expected: expectedSignature,
          received: razorpay_signature,
        },
      },
      { status: 400 }
    );
  }

  console.log("[PAYMENT] signature verified successfully");

  try {
    await connectDB();
  } catch (e) {
    console.error("[PAYMENT] database connection failed:", e);
    return errorResponse("Database connection failed", 500);
  }

  try {
    const existingOrder = await Order.findOne({ orderId: orderData.orderId });
    if (existingOrder) {
      console.log("[PAYMENT] order already exists (duplicate request)", { orderId: orderData.orderId });
      return NextResponse.json({ success: true, data: { order: existingOrder } });
    }
  } catch (e) {
    console.error("[PAYMENT] duplicate check failed:", e);
    return errorResponse("Failed to check existing order", 500);
  }

  let order;
  // Server-side source of truth: resolve items from the DB and confirm stock is
  // available. If the product went out of stock after the customer paid, we must
  // NOT create the order — record an orphan so the money can be refunded.
  let resolved;
  try {
    resolved = await validateAndResolveItems(orderData.items);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[PAYMENT] stock validation failed after payment", { orderId: orderData.orderId, msg });
    try {
      await OrphanPayment.create({
        razorpay_payment_id,
        razorpay_order_id,
        amount: orderData.total,
        email: orderData.customerDetails?.email,
        status: "needs_review",
        orderData,
        error: msg,
      });
    } catch { /* non-fatal */ }
    return NextResponse.json(
      {
        success: false,
        error: msg || "One or more items in your order are no longer available.",
        payment_id: razorpay_payment_id,
        needs_refund: true,
      },
      { status: 409 }
    );
  }

  // Recompute subtotal, discount + total server-side from authoritative item prices.
  const subtotalForCoupon = resolved.subtotal;
  const shippingCost = Number(orderData.shipping) || 0;
  let discount = 0;
  if (orderData.coupon) {
    const couponResult = await validateCoupon(orderData.coupon, subtotalForCoupon);
    if (couponResult.valid) {
      discount = couponResult.discount ?? 0;
      await incrementCouponUsage(orderData.coupon);
    }
  }
  const computedTotal = Math.max(0, subtotalForCoupon - discount + shippingCost);

  // Atomically reserve stock BEFORE creating the order (rejects if the last unit
  // was just taken by a concurrent request).
  try {
    await reserveStock(resolved.items);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[PAYMENT] stock reserve failed", { orderId: orderData.orderId, msg });
    try {
      await OrphanPayment.create({
        razorpay_payment_id,
        razorpay_order_id,
        amount: orderData.total,
        email: orderData.customerDetails?.email,
        status: "needs_review",
        orderData,
        error: msg,
      });
    } catch { /* non-fatal */ }
    return NextResponse.json(
      {
        success: false,
        error: msg || "Some items in your order are no longer available.",
        payment_id: razorpay_payment_id,
        needs_refund: true,
      },
      { status: 409 }
    );
  }

  try {
    order = await Order.create({
      orderId: orderData.orderId,
      items: resolved.items,
      total: computedTotal,
      subtotal: subtotalForCoupon,
      shipping: shippingCost,
      discount,
      coupon: orderData.coupon,
      status: "confirmed",
      paymentMethod: "Razorpay",
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      customerDetails: orderData.customerDetails,
      statusTimeline: [{ status: "confirmed", date: new Date(), note: "Payment verified" }],
    });
    console.log("[PAYMENT] order created in DB", { orderId: order.orderId, paymentId: razorpay_payment_id });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[PAYMENT] order creation failed:", msg);
    if (e && typeof e === "object" && "errors" in e) {
      const ve = (e as { errors: Record<string, { message: string }> }).errors;
      console.error("[PAYMENT] validation errors:", JSON.stringify(ve));
    }

    // Write orphan payment record so captured money is never lost
    try {
      await OrphanPayment.create({
        razorpay_payment_id,
        razorpay_order_id,
        amount: orderData.total,
        email: orderData.customerDetails?.email,
        status: "needs_review",
        orderData,
        error: msg,
      });
      console.log("[PAYMENT] orphan payment recorded", { razorpay_payment_id });
    } catch (orphanErr) {
      console.error("[PAYMENT] failed to record orphan payment:", orphanErr);
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
        payment_id: razorpay_payment_id,
        detail: msg,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, data: { order } });
}
