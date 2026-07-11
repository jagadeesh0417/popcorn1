import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subscriber from "@/lib/models/Subscriber";

export async function GET() {
  try {
    await connectDB();
    const subscribers = await Subscriber.find({}).sort({ createdAt: -1 });
    return NextResponse.json(subscribers);
  } catch {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, name, phone } = body;
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
    const existing = await Subscriber.findOne({ email });
    if (existing) return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
    const subscriber = await Subscriber.create({ email, name, phone });
    return NextResponse.json(subscriber, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create subscriber" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
    await Subscriber.deleteOne({ email });
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}
