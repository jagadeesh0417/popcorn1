import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import OrphanPayment from "@/lib/models/OrphanPayment";
import Product from "@/lib/models/Product";
import { errorResponse } from "@/lib/api-utils";

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

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    console.error("[PAYMENT] RAZORPAY_KEY_SECRET not configured");
    return errorResponse("Payment gateway not configured", 500);
  }

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
  try {
    order = await Order.create({
      orderId: orderData.orderId,
      items: orderData.items || [],
      total: Number(orderData.total) || 0,
      subtotal: Number(orderData.subtotal) || 0,
      shipping: Number(orderData.shipping) || 0,
      discount: Number(orderData.discount) || 0,
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

  // Deduct inventory for each item
  for (const item of orderData.items || []) {
    try {
      const product = await Product.findOne({
        $or: [{ slug: item.productId }, { _id: item.productId }],
      });
      if (product) {
        if (item.variant?.label && product.sizes?.length) {
          const variant = product.sizes.find(
            (v: { label: string }) => v.label === item.variant.label
          );
          if (variant) {
            variant.stock = Math.max(0, (variant.stock || 0) - item.quantity);
          }
        } else {
          product.stockQuantity = Math.max(0, (product.stockQuantity || 0) - item.quantity);
        }
        product.inStock = (product.stockQuantity || 0) > 0;
        await product.save();
        console.log("[INVENTORY] deducted", { productId: item.productId, qty: item.quantity });
      } else {
        console.warn("[INVENTORY] product not found for deduction", { productId: item.productId });
      }
    } catch (e) {
      console.error("[INVENTORY] deduction failed for item", { productId: item.productId, error: e });
    }
  }

  return NextResponse.json({ success: true, data: { order } });
}
