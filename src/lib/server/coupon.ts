import { connectDB } from "@/lib/db";
import Coupon from "@/lib/models/Coupon";

export interface CouponValidationResult {
  valid: boolean;
  reason?: string;
  code?: string;
  discount?: number;
  coupon?: {
    _id?: string;
    code: string;
    discount: number;
    type: "percentage" | "fixed";
    minAmount: number;
    maxUses: number;
    currentUses: number;
    expiryDate: string;
    isActive: boolean;
  };
}

/** Parse an expiryDate string (YYYY-MM-DD, ISO, etc.) into a Date; returns null if unparseable. */
function parseExpiry(value: string): Date | null {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const d = new Date(value + "T23:59:59.999");
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Server-side coupon validation + discount computation.
 * Never trusts a browser-supplied discount; always reads fresh from the DB
 * so usage limits / active status / expiry are current.
 */
export async function validateCoupon(
  code: string | undefined | null,
  subtotal: number
): Promise<CouponValidationResult> {
  const clean = typeof code === "string" ? code.trim().toUpperCase() : "";
  if (!clean) {
    return { valid: false, reason: "Please enter a coupon code" };
  }
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    return { valid: false, reason: "Invalid cart total" };
  }

  await connectDB();
  const coupon = await Coupon.findOne({ code: clean }).lean();
  if (!coupon) {
    return { valid: false, reason: "Invalid coupon code" };
  }

  if (!coupon.isActive) {
    return { valid: false, reason: "Coupon is no longer available" };
  }

  const expires = parseExpiry(coupon.expiryDate);
  if (expires && expires.getTime() < Date.now()) {
    return { valid: false, reason: "Coupon has expired" };
  }

  if (coupon.minAmount > 0 && subtotal < coupon.minAmount) {
    return {
      valid: false,
      reason: `Minimum order value is \u20B9${coupon.minAmount.toLocaleString("en-IN")}`,
    };
  }

  if (coupon.currentUses >= coupon.maxUses) {
    return { valid: false, reason: "Coupon is no longer available" };
  }

  let discount: number;
  if (coupon.type === "percentage") {
    discount = Math.round((subtotal * coupon.discount) / 100);
  } else {
    discount = coupon.discount;
  }
  discount = Math.max(0, Math.min(discount, subtotal));

  return {
    valid: true,
    code: coupon.code,
    discount,
    coupon: {
      _id: String(coupon._id),
      code: coupon.code,
      discount: coupon.discount,
      type: coupon.type as "percentage" | "fixed",
      minAmount: coupon.minAmount,
      maxUses: coupon.maxUses,
      currentUses: coupon.currentUses,
      expiryDate: coupon.expiryDate,
      isActive: coupon.isActive,
    },
  };
}

/** Increment a coupon's usage counter once per successful order. */
export async function incrementCouponUsage(code: string | undefined | null): Promise<void> {
  const clean = typeof code === "string" ? code.trim().toUpperCase() : "";
  if (!clean) return;
  await connectDB();
  await Coupon.updateOne({ code: clean }, { $inc: { currentUses: 1 } });
}
