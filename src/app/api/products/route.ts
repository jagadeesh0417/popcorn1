import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (err) {
    console.error("Failed to fetch products", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.name || !body.slug || !body.price) {
      return NextResponse.json({ error: "Name, slug, and price are required" }, { status: 400 });
    }
    const existing = await Product.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json({ error: "Product with this slug already exists" }, { status: 409 });
    }
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error("Failed to create product", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
