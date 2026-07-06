import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Review from "@/lib/models/Review";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  try {
    await connectDB();
    const filter = productId ? { productId } : {};
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const review = await Review.create(body);
    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
