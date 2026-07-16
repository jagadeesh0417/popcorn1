import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Setting from "@/lib/models/Setting";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    if (key) {
      const setting = await Setting.findOne({ key });
      if (!setting) return errorResponse("Setting not found", 404);
      return successResponse({ key: setting.key, value: JSON.parse(setting.value) });
    }
    const settings = await Setting.find({});
    const result: Record<string, unknown> = {};
    settings.forEach((s) => { result[s.key] = JSON.parse(s.value); });
    return successResponse(result);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return errorResponse("Failed to fetch settings");
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { key, value } = await request.json();
    if (!key) return errorResponse("Key is required", 400);
    await Setting.findOneAndUpdate(
      { key },
      { key, value: JSON.stringify(value) },
      { upsert: true, new: true }
    );
    return successResponse({ key, value });
  } catch (error) {
    console.error("Error saving setting:", error);
    return errorResponse("Failed to save setting");
  }
}
