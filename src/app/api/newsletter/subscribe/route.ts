import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subscriber from "@/lib/models/Subscriber";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, phone, name, consent } = body;

    if (!email || !consent) {
      return NextResponse.json({ error: "Email and consent are required" }, { status: 400 });
    }

    await connectDB();

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
    }

    await Subscriber.create({ email, phone, name });

    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch (err) {
    console.error("Newsletter subscribe error", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
