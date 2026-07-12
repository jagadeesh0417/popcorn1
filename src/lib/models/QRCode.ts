import mongoose, { Schema, Document } from "mongoose";

export interface IQRCode extends Document {
  label: string;
  code: string;
  isActive: boolean;
  expiresAt: string;
  scanCount: number;
  lastScannedAt: string;
  createdAt: Date;
}

const QRCodeSchema = new Schema<IQRCode>(
  {
    label: { type: String, default: "" },
    code: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: String, default: "" },
    scanCount: { type: Number, default: 0 },
    lastScannedAt: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.QRCode || mongoose.model<IQRCode>("QRCode", QRCodeSchema);
