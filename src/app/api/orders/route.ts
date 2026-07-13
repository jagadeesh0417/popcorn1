import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    console.log("[ORDERS] GET all — found", orders.length);
    return successResponse(orders);
  } catch (err) {
    console.error("[ORDERS] Failed to fetch orders", err);
    return errorResponse("Failed to fetch orders", 500);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    console.log("[ORDERS] POST request", { orderId: body.orderId, paymentMethod: body.paymentMethod, itemCount: body.items?.length });

    if (!body.orderId) {
      return errorResponse("Missing orderId", 400);
    }

    const existing = await Order.findOne({ orderId: body.orderId });
    if (existing) {
      console.log("[ORDERS] order already exists (duplicate)", { orderId: body.orderId });
      return successResponse(existing);
    }

    const orderData: Record<string, unknown> = { ...body };
    if (!orderData.statusTimeline || !Array.isArray(orderData.statusTimeline) || orderData.statusTimeline.length === 0) {
      orderData.statusTimeline = [{ status: body.status || "pending", date: new Date(), note: "Order placed" }];
    }

    const order = await Order.create(orderData);
    console.log("[ORDERS] order created", { orderId: order.orderId, status: order.status });

    return successResponse(order, 201);
  } catch (err) {
    console.error("[ORDERS] Failed to create order", err);
    return errorResponse("Failed to create order", 500);
  }
}
