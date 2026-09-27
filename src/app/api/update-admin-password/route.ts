import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

export async function POST() {
  if (process.env.NEXT_PUBLIC_ENABLE_ADMIN_SETUP !== "true") {
    return NextResponse.json({ success: false, error: "Admin update is disabled" }, { status: 403 });
  }

  try {
    await connectDB();
    const email = process.env.ADMIN_EMAIL;
    if (!email) {
      return NextResponse.json(
        { success: false, error: "ADMIN_EMAIL is not configured" },
        { status: 500 }
      );
    }
    const password = process.env.ADMIN_PASSWORD;

    if (!password) {
      return NextResponse.json(
        { success: false, error: "ADMIN_PASSWORD is not configured" },
        { status: 500 }
      );
    }

    const user = await User.findOne({ role: "admin" });
    if (!user) {
      return NextResponse.json({ success: false, message: "No admin user found" });
    }

    user.email = email;
    user.password = password;
    await user.save();

    return NextResponse.json({ success: true, message: `Admin updated: ${user.email}` });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to update admin" }, { status: 500 });
  }
}
