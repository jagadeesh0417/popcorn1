import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";

export async function GET() {
  try {
    await connectDB();
    const customers = await Order.aggregate([
      { $group: { _id: "$customerDetails.email", firstName: { $first: "$customerDetails.firstName" }, lastName: { $first: "$customerDetails.lastName" }, phone: { $first: "$customerDetails.phone" }, orders: { $sum: 1 }, totalSpent: { $sum: "$total" }, joined: { $min: "$createdAt" } } },
      { $project: { _id: 0, email: "$_id", firstName: 1, lastName: 1, phone: 1, orders: 1, totalSpent: 1, joined: 1 } },
      { $sort: { orders: -1 } },
    ]);
    return NextResponse.json(customers);
  } catch {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
