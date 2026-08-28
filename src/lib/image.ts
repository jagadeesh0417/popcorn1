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
