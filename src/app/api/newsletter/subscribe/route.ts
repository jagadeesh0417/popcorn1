import { connectDB } from "@/lib/db";
import Subscriber from "@/lib/models/Subscriber";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone, name, consent } = body;

    if (!email || !consent) {
      return errorResponse("Email and consent are required", 400);
    }

    await connectDB();

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return errorResponse("Already subscribed", 409);
    }

    await Subscriber.create({ email, phone, name });

    return successResponse({ message: "Subscribed successfully" }, 201);
  } catch (err) {
    console.error("Newsletter subscribe error", err);
    return errorResponse("Internal server error", 500);
  }
}
