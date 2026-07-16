import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

export async function POST() {
  try {
    await connectDB();
    const email = "Poprika.official@gmail.com";
    const password = "Newbusinesspop@098";

    const user = await User.findOne({ role: "admin" });
    if (!user) {
      return NextResponse.json({ success: false, message: "No admin user found" });
    }

    user.email = email;
    user.password = password;
    await user.save();

    return NextResponse.json({ success: true, message: `Admin updated: ${user.email}` });
  } catch (err) {
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
