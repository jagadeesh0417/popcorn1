import mongoose, { Schema, Document } from "mongoose";

export interface ICoupon extends Document {
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minAmount: number;
  maxUses: number;
  currentUses: number;
  expiryDate: string;
  isActive: boolean;
  createdAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discount: { type: Number, required: true },
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    minAmount: { type: Number, default: 0 },
    maxUses: { type: Number, default: 100 },
    currentUses: { type: Number, default: 0 },
    expiryDate: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model<ICoupon>("Coupon", CouponSchema);
