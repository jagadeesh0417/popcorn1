import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Coupon from "@/lib/models/Coupon";

export async function GET() {
  try {
    await connectDB();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json(coupons);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const coupon = await Coupon.create(body);
    return NextResponse.json(coupon, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
