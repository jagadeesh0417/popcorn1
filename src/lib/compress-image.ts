const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

function loadImageFromBitmap(file: File): Promise<ImageBitmap> {
  return createImageBitmap(file);
}

function loadImageFromElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to read image"));
    };
    img.src = url;
  });
}

/**
 * Downscale + compress a large image before upload so the transfer is small.
 * Uses off-main-thread APIs (createImageBitmap + OffscreenCanvas) where
 * available so the admin UI never freezes; falls back to a plain canvas.
 * Returns the original file unchanged when it is already small enough.
 */
export async function compressImage(file: File): Promise<File> {
  try {
    if (file.size < 300 * 1024) return file;

    let source: ImageBitmap | HTMLImageElement;
    if (typeof createImageBitmap === "function") {
      source = await loadImageFromBitmap(file);
    } else {
      source = await loadImageFromElement(file);
    }
    const isBitmap = !(source instanceof HTMLImageElement);
    const width = source.width;
    const height = source.height;

    const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
    const needsResize = scale < 1;

    const targetWidth = Math.max(1, Math.round(width * scale));
    const targetHeight = Math.max(1, Math.round(height * scale));

    let blob: Blob | null = null;

    if (needsResize && typeof OffscreenCanvas !== "undefined") {
      const offscreen = new OffscreenCanvas(targetWidth, targetHeight);
      const ctx = offscreen.getContext("2d");
      if (ctx) {
        ctx.drawImage(source, 0, 0, targetWidth, targetHeight);
        blob = await offscreen.convertToBlob({ type: "image/webp", quality: JPEG_QUALITY });
      }
    } else if (needsResize) {
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(source, 0, 0, targetWidth, targetHeight);
        blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob((b) => resolve(b), "image/webp", JPEG_QUALITY)
        );
      }
    }

    if (isBitmap && typeof (source as ImageBitmap).close === "function") {
      (source as ImageBitmap).close();
    }

    // If nothing was resized/compressed, return the original untouched.
    if (!blob) return file;

    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${baseName}.webp`, { type: blob.type || "image/webp" });
  } catch {
    // Never block the upload on compression failures.
    return file;
  }
}
