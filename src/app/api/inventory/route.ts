import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ name: 1 });
    return NextResponse.json(products);
  } catch (err) {
    console.error("Failed to fetch inventory", err);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, stockQuantity, inStock } = body;
    if (!id) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    const update: Record<string, unknown> = {};
    if (stockQuantity !== undefined) update.stockQuantity = stockQuantity;
    if (inStock !== undefined) update.inStock = inStock;
    const product = await Product.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
  } catch (err) {
    console.error("Failed to update inventory", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
