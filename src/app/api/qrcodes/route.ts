import { connectDB } from "@/lib/db";
import QRCode from "@/lib/models/QRCode";
import { successResponse, errorResponse } from "@/lib/api-utils";
import crypto from "crypto";

export async function GET() {
  try {
    await connectDB();
    const qrcodes = await QRCode.find().sort({ createdAt: -1 });
    return successResponse(qrcodes);
  } catch (err) {
    console.error("[GET /api/qrcodes] Error:", err);
    return errorResponse("Failed to fetch QR codes", 500);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const code = crypto.randomBytes(12).toString("hex");
    const qr = await QRCode.create({
      label: body.label || "Farmer QR",
      code,
      expiresAt: body.expiresAt || "",
    });
    return successResponse(qr, 201);
  } catch (err) {
    console.error("[POST /api/qrcodes] Error:", err);
    return errorResponse("Failed to create QR code", 500);
  }
}
