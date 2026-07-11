import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subscriber from "@/lib/models/Subscriber";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const subscriber = await Subscriber.findByIdAndDelete(id);
    if (!subscriber) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: "Deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
