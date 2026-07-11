import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriber extends Document {
  email: string;
  phone?: string;
  name?: string;
  isActive: boolean;
  createdAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    name: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Subscriber || mongoose.model<ISubscriber>("Subscriber", SubscriberSchema);
