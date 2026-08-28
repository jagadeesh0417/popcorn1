import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Setting from "@/lib/models/Setting";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { unstable_cache, revalidateTag } from "next/cache";
import { SETTINGS_CACHE_TAG, PUBLIC_REVALIDATE_SECONDS, publicCacheHeaders } from "@/lib/cache";

async function fetchSettings(key?: string) {
  await connectDB();
  if (key) {
    const setting = await Setting.findOne({ key }).lean();
    if (!setting) return null;
    return { key: setting.key, value: JSON.parse(setting.value) };
  }
  const settings = await Setting.find({}).lean();
  const result: Record<string, unknown> = {};
  settings.forEach((s) => { result[s.key] = JSON.parse(s.value); });
  return result;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key") || undefined;

    const cachedFetch = unstable_cache(
      async () => (await fetchSettings(key)) as unknown,
      ["settings", key || "all"],
      { revalidate: PUBLIC_REVALIDATE_SECONDS, tags: [SETTINGS_CACHE_TAG] }
    );

    const result = await cachedFetch();

    if (key && result === null) {
      return errorResponse("Setting not found", 404);
    }
    const init = { headers: publicCacheHeaders() };
    return successResponse(result, 200, init);
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
    revalidateTag(SETTINGS_CACHE_TAG);
    return successResponse({ key, value });
  } catch (error) {
    console.error("Error saving setting:", error);
    return errorResponse("Failed to save setting");
  }
}
