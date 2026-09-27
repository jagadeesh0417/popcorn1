import { connectDB } from "@/lib/db";
import Setting from "@/lib/models/Setting";

export interface RazorpayCredentials {
  keyId: string;
  keySecret: string;
}

/**
 * Resolve Razorpay credentials for the payment gateway.
 *
 * Precedence:
 *   1. process.env.RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET (deployment env)
 *   2. The Admin > Settings > Payments configuration stored in the `payment`
 *      Setting (MongoDB), which lets an owner configure keys without rebuilding.
 *
 * The secret is only ever resolved on the server; it is never sent to the
 * browser. Returns null when neither source provides usable credentials.
 */
export async function getRazorpayCredentials(): Promise<RazorpayCredentials | null> {
  const envKeyId = process.env.RAZORPAY_KEY_ID;
  const envKeySecret = process.env.RAZORPAY_KEY_SECRET;

  if (envKeyId && envKeySecret) {
    return { keyId: envKeyId, keySecret: envKeySecret };
  }

  try {
    await connectDB();
  } catch (err) {
    console.error(
      "[RAZORPAY] DB connection failed while resolving credentials:",
      err instanceof Error ? err.message : err
    );
    return null;
  }

  try {
    const setting = await Setting.findOne({ key: "payment" }).lean();
    if (!setting || typeof setting.value !== "string" || !setting.value) return null;

    let parsed: { keyId?: string; keySecret?: string };
    try {
      parsed = JSON.parse(setting.value);
    } catch {
      console.error("[RAZORPAY] stored payment setting is not valid JSON");
      return null;
    }

    const keyId = typeof parsed.keyId === "string" ? parsed.keyId.trim() : "";
    const keySecret = typeof parsed.keySecret === "string" ? parsed.keySecret.trim() : "";

    // The admin UI uses "xxxxxxxxxxxxxxxx" as a placeholder secret; treat it as
    // "not configured" so we never hit Razorpay with a fake secret.
    const isPlaceholder =
      keySecret && /^x{4,}$/i.test(keySecret) && !envKeySecret;

    if (!keyId || !keySecret || isPlaceholder) return null;

    return { keyId, keySecret };
  } catch (err) {
    console.error(
      "[RAZORPAY] error reading stored payment credentials:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
}
