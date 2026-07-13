import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  orderId: string;
  items: { productId: string; name: string; price: number; quantity: number; image: string; variant?: { label: string; grams: number } }[];
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  coupon?: string;
  status: string;
  trackingId?: string;
  courierPartner?: string;
  estimatedDelivery?: string;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    deliveryInstructions?: string;
  };
  paymentId?: string;
  razorpayOrderId?: string;
  paymentMethod?: string;
  statusTimeline: { status: string; date: Date; note?: string }[];
  userId?: string;
  createdAt: Date;
};

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    items: [
      {
        productId: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
        variant: {
          label: String,
          grams: Number,
        },
      },
    ],
    total: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    coupon: { type: String },
    status: {
      type: String,
      enum: ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled", "return-requested"],
      default: "pending",
    },
    trackingId: { type: String },
    courierPartner: { type: String },
    estimatedDelivery: { type: String },
    customerDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      deliveryInstructions: { type: String },
    },
    paymentId: { type: String },
    razorpayOrderId: { type: String },
    paymentMethod: { type: String },
    statusTimeline: [
      {
        status: String,
        date: { type: Date, default: Date.now },
        note: String,
      },
    ],
    userId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
