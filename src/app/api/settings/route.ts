import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import Setting from "@/lib/models/Setting";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { unstable_cache, revalidateTag } from "next/cache";
import { SETTINGS_CACHE_TAG, PUBLIC_REVALIDATE_SECONDS, publicCacheHeaders } from "@/lib/cache";
import { requireAdmin } from "@/lib/server/auth";

async function fetchSettings(key?: string) {
  await connectDB();
  if (key) {
    const setting = await Setting.findOne({ key }).lean();
    if (!setting) return null;
    return { key: setting.key, value: parseSettingValue(setting.value) };
  }
  const settings = await Setting.find({}).lean();
  const result: Record<string, unknown> = {};
  settings.forEach((s) => { result[s.key] = parseSettingValue(s.value); });
  return result;
}

// A malformed/empty stored value must never crash the public settings route
// (e.g. bundle settings load). Fall back to null so callers handle it gracefully.
function parseSettingValue(raw: string): unknown {
  if (typeof raw !== "string") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
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
  const denied = await requireAdmin();
  if (denied) return denied;
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
