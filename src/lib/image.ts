export function optimizeImageUrl(
  url: string | null | undefined,
  width = 600,
  quality = "auto"
): string | null {
  if (!url) return null;
  if (typeof url !== "string" || url.length === 0) return null;

  // Cloudinary: insert automatic format, quality and requested-width transforms.
  const marker = "/image/upload/";
  const idx = url.indexOf(marker);
  if (idx !== -1) {
    const base = url.slice(0, idx + marker.length);
    const rest = url.slice(idx + marker.length);
    const transform = `f_auto,q_${quality === "auto" ? "auto:best" : quality},w_${width},dpr_auto`;
    return `${base}${transform}/${rest}`;
  }

  // Non-Cloudinary URLs are returned unchanged so next/image / upstream handles them.
  return url;
}

/**
 * Normalize a product's images into a flat array of URL strings.
 *
 * The data layer stores `images: string[]`, but for robustness it also accepts:
 *   - legacy singular `image: "url"`
 *   - `images` stored as a single string
 *   - `images` as an array of objects `[{ url }, { src }]`
 * Prefers the `images` array over the singular `image` field and never
 * collapses the array into a single value.
 */
export function getProductImages(
  product: { images?: unknown; image?: unknown } | null | undefined
): string[] {
  const result: string[] = [];
  const push = (v: unknown) => {
    if (typeof v === "string") {
      const trimmed = v.trim();
      if (trimmed.length > 0) result.push(trimmed);
    } else if (v && typeof v === "object" && !Array.isArray(v)) {
      const obj = v as Record<string, unknown>;
      const candidate = typeof obj.url === "string" ? obj.url : typeof obj.src === "string" ? obj.src : "";
      const trimmed = candidate.trim();
      if (trimmed.length > 0) result.push(trimmed);
    }
  };

  if (product?.images !== undefined && product.images !== null) {
    if (Array.isArray(product.images)) {
      product.images.forEach(push);
    } else {
      push(product.images);
    }
  }

  if (product?.image !== undefined && product.image !== null) {
    push(product.image);
  }

  return result;
}

/** First image of a product, or null. Prefers `images[0]`, falls back to `image`. */
export function getProductImage(
  product: { images?: unknown; image?: unknown } | null | undefined
): string | null {
  const imgs = getProductImages(product);
  return imgs.length > 0 ? imgs[0] : null;
}
