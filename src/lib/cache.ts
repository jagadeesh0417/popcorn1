// Public, cachable, read-only endpoints (products, bundle/shipping settings, coupons)
// are protected by a short TTL + CDN cache so repeated visits don't re-query MongoDB.
// Admin mutations call revalidateTag() to purge the relevant tag immediately,
// so admin edits still appear on the public site without manual cache flushes.

export const PRODUCT_CACHE_TAG = "products";
export const SETTINGS_CACHE_TAG = "settings";
export const COUPON_CACHE_TAG = "coupons";

export const PUBLIC_REVALIDATE_SECONDS = 60;
export const PUBLIC_STALE_SECONDS = 300;

export function publicCacheHeaders(revalidateSeconds = PUBLIC_REVALIDATE_SECONDS, staleSeconds = PUBLIC_STALE_SECONDS) {
  return {
    "Cache-Control": `public, s-maxage=${revalidateSeconds}, stale-while-revalidate=${staleSeconds}`,
  };
}
