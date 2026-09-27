import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { requireAdmin } from "@/lib/server/auth";
import { buildShippingLabel } from "@/lib/shipping/label";

export async function GET(_req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { orderId } = await params;
  if (!orderId) {
    return errorResponse("Missing order ID", 400);
  }

  try {
    await connectDB();
    const order = await Order.findOne({ orderId }).lean();
    if (!order) {
      return errorResponse("Order not found", 404);
    }

    // Only expose the fields needed for a shipping label. Never return payment
    // credentials, request IDs, internal tokens, or unrelated order data.
    const label = buildShippingLabel(order);
    if (!label) {
      return errorResponse("Unable to generate shipping label. Please check the order details and try again.", 400);
    }

    return successResponse(label);
  } catch (err) {
    console.error("[SHIPPING-LABEL] Failed to fetch order for label", err);
    return errorResponse("Unable to generate shipping label. Please check the order details and try again.", 500);
  }
}
