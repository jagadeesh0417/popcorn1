import { connectDB } from "@/lib/db";
import Subscriber from "@/lib/models/Subscriber";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    await connectDB();
    const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });
    return successResponse(subscribers);
  } catch (err) {
    console.error("Failed to fetch subscribers", err);
    return errorResponse("Failed to fetch subscribers", 500);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, name, phone } = body;
    if (!email) return errorResponse("Email is required", 400);
    const existing = await Subscriber.findOne({ email });
    if (existing) return errorResponse("Already subscribed", 409);
    const subscriber = await Subscriber.create({ email, name, phone });
    return successResponse(subscriber, 201);
  } catch (err) {
    console.error("Failed to create subscriber", err);
    return errorResponse("Failed to create subscriber", 500);
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();
    if (!email) return errorResponse("Email is required", 400);
    await Subscriber.deleteOne({ email });
    return successResponse({ message: "Deleted" });
  } catch (err) {
    console.error("Failed to delete subscriber", err);
    return errorResponse("Failed to delete subscriber", 500);
  }
}
