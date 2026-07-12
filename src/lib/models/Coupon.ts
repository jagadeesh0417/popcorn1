import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  name: string;
  discount: number;
  type: "percentage" | "flat";
  maxDiscount: number;
  minAmount: number;
  applicableCategories: string[];
  applicableProducts: string[];
  scope: "grocery" | "combo" | "universal";
  expiryDate: string;
  maxUses: number;
  currentUses: number;
  perUserLimit: number;
  isActive: boolean;
  autoApply: boolean;
  firstOrderOnly: boolean;
  createdAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    name: { type: String, default: "" },
    discount: { type: Number, required: true },
    type: { type: String, enum: ["percentage", "flat"], required: true },
    maxDiscount: { type: Number, default: 0 },
    minAmount: { type: Number, default: 0 },
    applicableCategories: [{ type: String }],
    applicableProducts: [{ type: String }],
    scope: { type: String, enum: ["grocery", "combo", "universal"], default: "universal" },
    expiryDate: { type: String, default: "" },
    maxUses: { type: Number, default: 100 },
    currentUses: { type: Number, default: 0 },
    perUserLimit: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    autoApply: { type: Boolean, default: false },
    firstOrderOnly: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);
