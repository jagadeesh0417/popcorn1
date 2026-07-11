import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return successResponse(orders);
  } catch (err) {
    console.error("Failed to fetch orders", err);
    return errorResponse("Failed to fetch orders", 500);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const order = await Order.create({
      ...body,
      statusTimeline: [{ status: "pending", date: new Date(), note: "Order placed" }],
    });
    return successResponse(order, 201);
  } catch (err) {
    console.error("Failed to create order", err);
    return errorResponse("Failed to create order", 500);
  }
}
