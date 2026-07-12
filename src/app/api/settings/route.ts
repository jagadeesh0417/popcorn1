import { connectDB } from "@/lib/db";
import StoreSetting from "@/lib/models/StoreSetting";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    await connectDB();
    const settings = await StoreSetting.find();
    const map: Record<string, unknown> = {};
    settings.forEach((s) => { map[s.key] = s.value; });
    return successResponse(map);
  } catch (err) {
    console.error("[GET /api/settings] Error:", err);
    return errorResponse("Failed to fetch settings", 500);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    if (!body.key) return errorResponse("key is required", 400);
    const setting = await StoreSetting.findOneAndUpdate(
      { key: body.key },
      { key: body.key, value: body.value },
      { upsert: true, new: true }
    );
    return successResponse(setting);
  } catch (err) {
    console.error("[POST /api/settings] Error:", err);
    return errorResponse("Failed to save setting", 500);
  }
}
