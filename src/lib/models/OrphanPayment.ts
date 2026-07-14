import mongoose, { Schema } from "mongoose";

const OrphanPaymentSchema = new Schema(
  {
    razorpay_payment_id: String,
    razorpay_order_id: String,
    amount: Number,
    email: String,
    status: { type: String, default: "needs_review" },
    orderData: Schema.Types.Mixed,
    error: String,
  },
  { strict: false, timestamps: true }
);

export default mongoose.models.OrphanPayment || mongoose.model("OrphanPayment", OrphanPaymentSchema);
