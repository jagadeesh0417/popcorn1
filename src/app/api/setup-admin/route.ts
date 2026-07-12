import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

export async function GET() {
  const steps: { step: string; ok: boolean; detail: string }[] = [];

  try {
    steps.push({ step: "connectDB", ok: false, detail: "Attempting..." });
    await connectDB();
    steps[0].ok = true;
    steps[0].detail = "MongoDB connected";

    steps.push({ step: "User model", ok: false, detail: "Checking model..." });
    const modelNames = Object.keys(mongoose.models);
    steps[steps.length - 1].ok = true;
    steps[steps.length - 1].detail = `Registered models: ${modelNames.join(", ")}`;

    steps.push({ step: "Find existing", ok: false, detail: "Looking up admin..." });
    const emailRegex = new RegExp("^poprika\\.official@gmail\\.com$", "i");
    const existing = await User.findOne({ email: emailRegex });
    if (existing) {
      steps[steps.length - 1].ok = true;
      steps[steps.length - 1].detail = `User found: ${existing.email}, role: ${existing.role}, hash starts with: ${existing.password.substring(0, 15)}...`;

      steps.push({ step: "Test password match", ok: false, detail: "Testing bcrypt..." });
      const testMatch = await existing.comparePassword("Admin@123");
      steps[steps.length - 1].ok = testMatch;
      steps[steps.length - 1].detail = testMatch ? "Password Admin@123 MATCHES" : "Password Admin@123 DOES NOT MATCH";

      return NextResponse.json({ success: true, action: "already_exists", steps, user: { email: existing.email, role: existing.role } });
    }

    steps[steps.length - 1].detail = "No admin user found — creating now";
    await User.create({
      name: "Admin",
      email: "poprika.official@gmail.com",
      password: "Admin@123",
      role: "admin",
    });

    steps.push({ step: "Verify created user", ok: false, detail: "Re-querying..." });
    const created = await User.findOne({ email: emailRegex });
    if (!created) {
      steps[steps.length - 1].detail = "User NOT found after create!";
      return NextResponse.json({ success: false, steps });
    }
    steps[steps.length - 1].ok = true;
    steps[steps.length - 1].detail = `Created: ${created.email}, role: ${created.role}, hash: ${created.password.substring(0, 15)}...`;

    steps.push({ step: "Test password match", ok: false, detail: "Testing bcrypt..." });
    const testMatch = await created.comparePassword("Admin@123");
    steps[steps.length - 1].ok = testMatch;
    steps[steps.length - 1].detail = testMatch ? "Password Admin@123 MATCHES" : "Password Admin@123 DOES NOT MATCH";

    return NextResponse.json({ success: true, action: "created", steps });
  } catch (err) {
    steps.push({ step: "ERROR", ok: false, detail: err instanceof Error ? err.message : String(err) });
    return NextResponse.json({ success: false, steps });
  }
}
