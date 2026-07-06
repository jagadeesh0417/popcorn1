import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, whatsappNumber: _whatsappNumber, consent } = body;

    if (!email || !consent) {
      return NextResponse.json({ error: "Email and consent are required" }, { status: 400 });
    }

    // TODO: connect MongoDB — save to `subscribers` collection
    // const db = await connectDB();
    // await db.collection("subscribers").insertOne({
    //   email,
    //   whatsappNumber,
    //   consent: true,
    //   createdAt: new Date(),
    // });

    return NextResponse.json({ success: true, message: "Subscribed successfully" });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
