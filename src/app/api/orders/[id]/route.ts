import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const order = await Order.findOne({ orderId: id });
    if (!order) {
      console.log("[ORDERS] GET by ID — not found", { orderId: id });
      return errorResponse("Not found", 404);
    }
    console.log("[ORDERS] GET by ID — found", { orderId: id, status: order.status });
    return successResponse(order);
  } catch (err) {
    console.error("[ORDERS] Failed to fetch order", err);
    return errorResponse("Failed to fetch order", 500);
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const body = await req.json();
    const order = await Order.findOneAndUpdate({ orderId: id }, body, { new: true });
    if (!order) return errorResponse("Not found", 404);
    return successResponse(order);
  } catch (err) {
    console.error("Failed to update order", err);
    return errorResponse("Failed to update order", 500);
  }
}
