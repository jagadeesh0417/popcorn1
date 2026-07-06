import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  productId: string;
  name: string;
  rating: number;
  comment: string;
  userId?: string;
  isVerified: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    productId: { type: String, required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    userId: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
