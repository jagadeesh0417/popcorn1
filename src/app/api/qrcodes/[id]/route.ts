import { connectDB } from "@/lib/db";
import QRCode from "@/lib/models/QRCode";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const body = await req.json();
    const qr = await QRCode.findByIdAndUpdate(id, { $set: body }, { new: true });
    if (!qr) return errorResponse("Not found", 404);
    return successResponse(qr);
  } catch (err) {
    console.error("[PUT /api/qrcodes/[id]] Error:", err);
    return errorResponse("Failed to update QR code", 500);
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const qr = await QRCode.findByIdAndDelete(id);
    if (!qr) return errorResponse("Not found", 404);
    return successResponse({ message: "Deleted" });
  } catch (err) {
    console.error("[DELETE /api/qrcodes/[id]] Error:", err);
    return errorResponse("Failed to delete QR code", 500);
  }
}
