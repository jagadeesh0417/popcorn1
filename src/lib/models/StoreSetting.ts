import mongoose, { Schema, Document } from "mongoose";

export interface PaymentConfig {
  mode: "razorpay" | "whatsapp";
  razorpayKeyId: string;
  razorpayKeySecret: string;
  testMode: boolean;
  enableUpi: boolean;
  enableCards: boolean;
  enableNetBanking: boolean;
  enableWallets: boolean;
  enableCod: boolean;
  codCharge: number;
}

export interface DeliveryConfig {
  freeDeliveryMin: number;
  deliveryCharge: number;
  codAvailable: boolean;
  deliveryRadius: number;
  deliveryMessage: string;
  pickupAvailable: boolean;
  pickupMessage: string;
  expressDeliveryAvailable: boolean;
  expressDeliveryCharge: number;
}

export interface BusinessConfig {
  storeName: string;
  whatsappNumber: string;
  supportEmail: string;
  instagramHandle: string;
  facebookHandle: string;
  gstNumber: string;
  fssaiNumber: string;
  storeTimings: string;
  address: string;
}

export interface IStoreSetting extends Document {
  key: string;
  value: unknown;
  createdAt: Date;
}

const StoreSettingSchema = new Schema<IStoreSetting>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.StoreSetting || mongoose.model<IStoreSetting>("StoreSetting", StoreSettingSchema);
