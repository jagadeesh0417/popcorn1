import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { errorResponse } from "@/lib/api-utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = body;

    console.log("[PAYMENT] verify request", { razorpay_order_id, razorpay_payment_id, orderId: orderData?.orderId });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return errorResponse("Missing payment details", 400);
    }

    if (!orderData || !orderData.orderId) {
      return errorResponse("Missing order data", 400);
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return errorResponse("Razorpay not configured", 500);
    }

    const payload = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(payload)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("[PAYMENT] signature mismatch", { expected: expectedSignature, received: razorpay_signature });
      return errorResponse("Invalid payment signature", 400);
    }

    console.log("[PAYMENT] signature verified");

    await connectDB();

    const existingOrder = await Order.findOne({ orderId: orderData.orderId });
    if (existingOrder) {
      console.log("[PAYMENT] order already exists (duplicate request)", { orderId: orderData.orderId });
      return NextResponse.json({ success: true, data: { order: existingOrder } });
    }

    const order = await Order.create({
      orderId: orderData.orderId,
      items: orderData.items,
      total: orderData.total,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping || 0,
      discount: orderData.discount || 0,
      coupon: orderData.coupon,
      status: "confirmed",
      paymentMethod: "Razorpay",
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      customerDetails: orderData.customerDetails,
      statusTimeline: [{ status: "confirmed", date: new Date(), note: "Payment verified" }],
    });

    console.log("[PAYMENT] order created", { orderId: order.orderId, paymentId: razorpay_payment_id });

    // Deduct inventory for each item
    for (const item of orderData.items || []) {
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
        product.inStock = product.stockQuantity > 0;
        await product.save();
        console.log("[INVENTORY] deducted", { productId: item.productId, qty: item.quantity });
      }
    }

    return NextResponse.json({ success: true, data: { order } });
  } catch (err) {
    console.error("[PAYMENT] verify error:", err);
    return errorResponse("Payment verification failed", 500);
  }
}
