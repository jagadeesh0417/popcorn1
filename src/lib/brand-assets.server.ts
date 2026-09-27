import fs from "node:fs";
import path from "node:path";

/**
 * Drop-in slots for the Blue Dino brand artwork.
 *
 * Nothing here is generated or faked. Each entry is a path under `public/`.
 * If the file is not present yet, `resolveBrandAssets` returns `null` for it
 * and the UI falls back to a text wordmark / omits the icon entirely, so the
 * site never renders a broken image or points at the previous brand's files.
 *
 * To activate the real artwork:
 *   1. Drop the files into `public/brand/` using the exact filenames below.
 *   2. Rebuild (`npm run build`) — existence is resolved at build time.
 *
 * Overridable per environment with NEXT_PUBLIC_BRAND_* if the files live
 * somewhere else (e.g. a CDN).
 */
export const BRAND_ASSET_PATHS = {
  headerLogo: "/brand/blue-dino-logo-header.png",
  footerLogo: "/brand/blue-dino-logo-footer.png",
  favicon: "/brand/blue-dino-favicon.png",
  appleTouchIcon: "/brand/blue-dino-apple-touch-icon.png",
  ogImage: "/brand/blue-dino-og-image.png",
} as const;

export type BrandAssetKey = keyof typeof BRAND_ASSET_PATHS;

export type BrandAssets = Partial<Record<BrandAssetKey, string>>;

function isRemoteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function existsInPublic(urlPath: string): boolean {
  if (isRemoteUrl(urlPath)) return false;
  const relative = urlPath.replace(/^\/+/, "");
  if (!relative || relative.split(/[\\/]/).includes("..")) return false;
  try {
    return fs.existsSync(path.join(process.cwd(), "public", relative));
  } catch {
    return false;
  }
}

function envOverride(key: BrandAssetKey): string | null {
  return process.env[`NEXT_PUBLIC_BRAND_${key.replace(/[A-Z]/g, (c) => `_${c}`).toUpperCase()}`] || null;
}

/**
 * Returns the public URL for each brand asset that actually exists on disk.
 * Server-only: relies on `node:fs`.
 */
export function resolveBrandAssets(): BrandAssets {
  const resolved: BrandAssets = {};

  (Object.keys(BRAND_ASSET_PATHS) as BrandAssetKey[]).forEach((key) => {
    const candidate = envOverride(key) ?? BRAND_ASSET_PATHS[key];
    if (!candidate) return;
    // Remote overrides (CDN) are trusted as-is; local paths must exist on disk.
    if (isRemoteUrl(candidate) || existsInPublic(candidate)) {
      resolved[key] = candidate;
    }
  });

  return resolved;
}
