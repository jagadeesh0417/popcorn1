import { connectDB } from "@/lib/db";
import QRCode from "@/lib/models/QRCode";
import { NextResponse } from "next/server";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const qr = await QRCode.findById(id);
    if (!qr) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    if (!qr.isActive) return NextResponse.json({ success: false, error: "QR code is disabled" }, { status: 403 });
    if (qr.expiresAt && new Date(qr.expiresAt) < new Date()) return NextResponse.json({ success: false, error: "QR code expired" }, { status: 410 });
    qr.scanCount += 1;
    qr.lastScannedAt = new Date().toISOString();
    await qr.save();
    return NextResponse.json({ success: true, data: qr });
  } catch (err) {
    console.error("[POST /api/qrcodes/[id]/scan] Error:", err);
    return NextResponse.json({ success: false, error: "Failed to record scan" }, { status: 500 });
  }
}
