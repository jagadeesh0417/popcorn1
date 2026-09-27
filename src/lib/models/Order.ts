import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  /** Maximum retail price at the time of purchase. Undefined when the product has no MRP. */
  mrp?: number;
  /** Offer discount percentage versus MRP (derived from mrp/price). */
  offerPercent?: number;
  quantity: number;
  image: string;
  type?: string;
  bundleId?: string;
  variant?: { label: string; grams: number };
  parts?: { productId: string; name: string; variantLabel?: string; quantity: number }[];
}

/** Payment lifecycle, kept separate from fulfilment (`status`). */
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface IOrder extends Document {
  orderId: string;
  items: IOrderItem[];
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  coupon?: string;
  status: string;
  /** Verified payment state. `paid` is only ever set by server-side gateway verification. */
  paymentStatus: PaymentStatus;
  /** Server-computed charge in paise, stored when the gateway order is created. */
  amountPaise?: number;
  paidAt?: Date;
  paymentStatusUpdatedAt?: Date;
  /** Admin email when the payment status was changed manually. */
  paymentStatusUpdatedBy?: string;
  /** True once stock has been deducted for this order — idempotency guard. */
  stockAdjusted: boolean;
  trackingId?: string;
  courierPartner?: string;
  estimatedDelivery?: string;
  /** How the customer wants the order fulfilled. Defaults to delivery. */
  fulfillmentMethod?: "pickup" | "delivery";
  /** Human-readable pickup point, set on pickup orders. */
  pickupLocation?: string;
  /** Which delivery region a delivery order ships to. */
  deliveryRegion?: "mysore" | "pan_india";
  customerDetails: {
    firstName: string;
    lastName?: string;
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
        mrp: { type: Number },
        offerPercent: { type: Number },
        quantity: Number,
        image: String,
        type: { type: String },
        bundleId: { type: String },
        variant: {
          label: String,
          grams: Number,
        },
        parts: [
          {
            productId: String,
            name: String,
            variantLabel: String,
            quantity: Number,
          },
        ],
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
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    amountPaise: { type: Number },
    paidAt: { type: Date },
    paymentStatusUpdatedAt: { type: Date },
    paymentStatusUpdatedBy: { type: String },
    stockAdjusted: { type: Boolean, default: false },
    trackingId: { type: String },
    courierPartner: { type: String },
    estimatedDelivery: { type: String },
    fulfillmentMethod: {
      type: String,
      enum: ["pickup", "delivery"],
      default: "delivery",
    },
    pickupLocation: { type: String },
    deliveryRegion: { type: String, enum: ["mysore", "pan_india"] },
    customerDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String, default: '', trim: true },
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

OrderSchema.index({ orderId: 1 }, { unique: true });
OrderSchema.index({ userId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ "customerDetails.email": 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ razorpayOrderId: 1 });

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
