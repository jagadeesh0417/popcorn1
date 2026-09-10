import { connectDB } from "@/lib/db";
import Setting from "@/lib/models/Setting";
import { DEFAULT_SHIPPING_SETTINGS, ShippingSettings } from "@/lib/shipping";

// Load the shipping settings stored in the DB (key "shipping"), falling back to
// the shared defaults for any missing/malformed field. Mirrors how the client
// merges { ...DEFAULT_SHIPPING_SETTINGS, ...storedValue } so both sides agree.
export async function loadShippingSettings(): Promise<ShippingSettings> {
  await connectDB();
  try {
    const setting = await Setting.findOne({ key: "shipping" }).lean();
    if (!setting) return { ...DEFAULT_SHIPPING_SETTINGS };

    const raw = (setting as { value?: unknown }).value;
    const parsed = typeof raw === "string" ? (JSON.parse(raw) as unknown) : raw;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ...DEFAULT_SHIPPING_SETTINGS };
    }

    const record = parsed as Record<string, unknown>;
    const merged: ShippingSettings = { ...DEFAULT_SHIPPING_SETTINGS };
    (Object.keys(DEFAULT_SHIPPING_SETTINGS) as (keyof ShippingSettings)[]).forEach((key) => {
      const v = record[key];
      if (typeof v === "boolean" || (typeof v === "number" && Number.isFinite(v))) {
        (merged as Record<keyof ShippingSettings, boolean | number>)[key] = v;
      }
    });
    return merged;
  } catch {
    // A malformed shipping setting must never break order creation.
    return { ...DEFAULT_SHIPPING_SETTINGS };
  }
}