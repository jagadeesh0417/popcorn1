import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { errorResponse } from "@/lib/api-utils";
import { validateCoupon } from "@/lib/server/coupon";
import { validateAndResolveItems, StockError, type ResolvedItem } from "@/lib/server/stock";
import { getRazorpayCredentials } from "@/lib/server/razorpay";
import { loadShippingSettings } from "@/lib/server/shipping";
import { computeShippingCost } from "@/lib/shipping";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import type { PaymentStatus } from "@/lib/models/Order";
import { ORDER_ID_PREFIX } from "@/lib/brand";

type CustomerDetails = {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  phone?: unknown;
  address?: unknown;
  city?: unknown;
  state?: unknown;
  zipCode?: unknown;
  deliveryInstructions?: unknown;
};

function sanitizeCustomer(raw: CustomerDetails | undefined): Record<string, string> | null {
  if (!raw || typeof raw !== "object") return null;
  const pick = (v: unknown, required = false): string | null => {
    const s = typeof v === "string" ? v.trim() : "";
    if (required && !s) return null;
    return s;
  };
  const out = {
    firstName: pick(raw.firstName, true),
    lastName: pick(raw.lastName) || "",
    email: pick(raw.email, true),
    phone: pick(raw.phone, true),
    address: pick(raw.address, true),
    city: pick(raw.city, true),
    state: pick(raw.state, true),
    zipCode: pick(raw.zipCode, true),
    deliveryInstructions: pick(raw.deliveryInstructions) || undefined,
  };
  if (Object.values(out).some((v) => v === null)) return null;
  return out as Record<string, string>;
}

/**
 * Creates (or refreshes) the local PENDING order and the matching Razorpay
 * order. Persisting the order *before* payment means:
 *   - verify / webhook / reconcile can always find it by razorpayOrderId,
 *   - the server-computed amount is stored for amount validation,
 *   - retrying checkout with the same orderId refreshes one order instead of
 *     creating duplicates.
 */
export async function POST(req: Request) {
  let amount: number;
  let currency: string;
  let resolved: { items: ResolvedItem[]; subtotal: number };
  let shippingCost: number;
  let discount: number;
  let total: number;
  let orderId: string;
  let customer: Record<string, string> | null;
  let fulfillmentMethod: "pickup" | "delivery";
  let pickupLocation: string | undefined;
  let deliveryRegion: "mysore" | "pan_india" | undefined;
  let couponCode: string | undefined;

  let body: {
    items?: unknown;
    shipping?: unknown;
    shippingMethod?: unknown;
    coupon?: unknown;
    currency?: unknown;
    orderId?: unknown;
    customerDetails?: CustomerDetails;
    fulfillmentMethod?: unknown;
    pickupLocation?: unknown;
    deliveryRegion?: unknown;
  };
  try {
    body = await req.json();
  } catch (e) {
    console.error("[RAZORPAY] failed to parse JSON request body:", e);
    return errorResponse("Invalid request body", 400);
  }

  try {
    currency = String(body.currency || "INR");

    // Server-side source of truth: resolve items from the DB and confirm stock
    // is available before creating the Razorpay order. Never trust a browser amount.
    resolved = await validateAndResolveItems(body.items as Parameters<typeof validateAndResolveItems>[0]);
    const subtotal = resolved.subtotal;
    // Shipping is recomputed from the authoritative subtotal + delivery method.
    // The browser-supplied shipping number is ignored (anti-tampering).
    const shippingSettings = await loadShippingSettings();
    const shippingMethod = typeof body.shippingMethod === "string" ? body.shippingMethod : undefined;
    shippingCost = computeShippingCost(subtotal, shippingSettings, shippingMethod);
    console.log("[RAZORPAY] server-side shipping", { subtotal, shippingCost, shippingMethod: shippingMethod ?? "shipping" });
    discount = 0;
    couponCode = typeof body.coupon === "string" && body.coupon ? body.coupon : undefined;
    if (couponCode) {
      const couponResult = await validateCoupon(couponCode, subtotal);
      if (couponResult.valid) {
        discount = couponResult.discount ?? 0;
      }
    }
    total = Math.max(0, subtotal - discount + shippingCost);
    amount = Math.round(total * 100);

    orderId = typeof body.orderId === "string" && body.orderId.trim() ? body.orderId.trim() : ORDER_ID_PREFIX + Date.now();
    customer = sanitizeCustomer(body.customerDetails);
    fulfillmentMethod = body.fulfillmentMethod === "pickup" ? "pickup" : "delivery";
    pickupLocation = fulfillmentMethod === "pickup" && typeof body.pickupLocation === "string" ? body.pickupLocation : undefined;
    deliveryRegion =
      fulfillmentMethod === "delivery" && (body.deliveryRegion === "mysore" || body.deliveryRegion === "pan_india")
        ? body.deliveryRegion
        : undefined;
  } catch (e) {
    console.error("[RAZORPAY] create-order validation failed:", e);
    if (e instanceof StockError) {
      return errorResponse(e.message, e.code);
    }
    // Structurally valid JSON that failed our own validation: log the underlying
    // detail for debugging but never leak internals to the customer.
    console.error("[RAZORPAY] validation error detail:", {
      name: e instanceof Error ? e.name : typeof e,
      message: e instanceof Error ? e.message : String(e),
    });
    return errorResponse("The order could not be created. Please review your cart and try again.", 400);
  }

  if (!customer) {
    return errorResponse("Please provide your name, phone, email and address to continue.", 400);
  }

  console.log("[RAZORPAY] create-order request", { amount, currency, orderId });

  if (!amount || typeof amount !== "number" || amount <= 0 || !Number.isInteger(amount)) {
    console.error("[RAZORPAY] invalid amount", { amount, type: typeof amount });
    return errorResponse("Amount must be a positive integer (in paise)", 400);
  }

  if (currency !== "INR") {
    console.error("[RAZORPAY] unsupported currency", { currency });
    return errorResponse("Only INR is supported", 400);
  }

  const credentials = await getRazorpayCredentials();
  if (!credentials) {
    console.error("[RAZORPAY] credentials not configured (env or stored payment setting)");
    return errorResponse("Razorpay not configured", 500);
  }
  const { keyId, keySecret } = credentials;

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  let razorpayOrder;
  try {
    razorpayOrder = await razorpay.orders.create({
      amount,
      currency,
      receipt: orderId,
      notes: { orderId },
    });

    console.log("[RAZORPAY] order created on Razorpay", {
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId,
    });
  } catch (err: unknown) {
    const errorBody = err && typeof err === "object" ? JSON.stringify(err, Object.getOwnPropertyNames(err)) : String(err);
    console.error("[RAZORPAY] Razorpay SDK error:", errorBody);

    const razorpayErr = err as {
      statusCode?: number;
      error?: { code?: string; description?: string; field?: string };
      message?: string;
    };
    const statusCode = razorpayErr.statusCode || 500;
    const errorCode = razorpayErr.error?.code || "UNKNOWN";
    const description = razorpayErr.error?.description || razorpayErr.message || errorBody;
    const field = razorpayErr.error?.field;

    console.error("[RAZORPAY] structured error", { statusCode, errorCode, description, field, amount, currency });
    return NextResponse.json(
      { success: false, error: `Razorpay: ${description}`, detail: { statusCode, errorCode, field } },
      { status: statusCode >= 400 && statusCode < 500 ? statusCode : 500 }
    );
  }

  // Persist/refresh the local PENDING order so every later step (verify,
  // webhook, reconcile, thanks page) can find it by orderId / razorpayOrderId.
  try {
    await connectDB();
    const now = new Date();
    const snapshot: Record<string, unknown> = {
      items: resolved.items,
      subtotal: resolved.subtotal,
      shipping: shippingCost,
      discount,
      coupon: couponCode,
      total,
      amountPaise: amount,
      razorpayOrderId: razorpayOrder.id,
      paymentMethod: "Razorpay",
      customerDetails: customer,
      fulfillmentMethod,
      ...(pickupLocation ? { pickupLocation } : {}),
      ...(deliveryRegion ? { deliveryRegion } : {}),
    };

    const existing = await Order.findOne({ orderId });
    if (existing) {
      const status = existing.paymentStatus as PaymentStatus | undefined;
      if (status === "paid" || status === "refunded") {
        console.error("[RAZORPAY] refusing to reuse an already-settled order", { orderId, paymentStatus: status });
        return errorResponse("This order has already been paid. Please start a new checkout.", 409);
      }
      const unset: Record<string, 1> = {};
      if (!pickupLocation) unset.pickupLocation = 1;
      if (!deliveryRegion) unset.deliveryRegion = 1;
      await Order.updateOne(
        { _id: existing._id },
        {
          $set: { ...snapshot, paymentStatus: "pending" },
          ...(Object.keys(unset).length ? { $unset: unset } : {}),
          $push: { statusTimeline: { status: "pending", date: now, note: "Checkout retried — awaiting payment" } },
        }
      );
      console.log("[RAZORPAY] pending order refreshed", { orderId });
    } else {
      try {
        await Order.create({
          orderId,
          ...snapshot,
          status: "pending",
          paymentStatus: "pending",
          stockAdjusted: false,
          statusTimeline: [{ status: "pending", date: now, note: "Awaiting payment" }],
        });
        console.log("[RAZORPAY] pending order created", { orderId });
      } catch (e: unknown) {
        // Race: another request created this order id concurrently — refresh it.
        const raced = await Order.findOne({ orderId });
        if (!raced) {
          const msg = e instanceof Error ? e.message : String(e);
          console.error("[RAZORPAY] failed to persist pending order:", msg);
          return errorResponse("Failed to create order. Please try again.", 500);
        }
        await Order.updateOne({ _id: raced._id }, { $set: { ...snapshot, paymentStatus: "pending" } });
        console.log("[RAZORPAY] pending order created concurrently", { orderId });
      }
    }
  } catch (err) {
    // No money has moved yet — safe to fail loudly and let the customer retry.
    console.error("[RAZORPAY] failed to persist pending order:", err);
    return errorResponse("Failed to create order. Please try again.", 500);
  }

  return NextResponse.json({
    success: true,
    data: {
      razorpayOrderId: razorpayOrder.id,
      orderId,
      amount,
      currency,
      keyId,
      paymentStatus: "pending",
    },
  });
}
