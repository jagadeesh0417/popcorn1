import { compressImage } from "@/lib/compress-image";

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export function validateImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `"${file.name}" — only JPG, PNG, and WEBP allowed`;
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return `"${file.name}" — exceeds 10MB limit`;
  }
  return null;
}

/**
 * Upload a single image to the existing Cloudinary storage using a signed
 * request (signature comes from /api/cloudinary). Compresses/downscales first.
 * Resolves with the permanent secure_url.
 */
export function uploadImageToCloudinary(
  file: File,
  index: number,
  onProgress?: (index: number, pct: number) => void
): Promise<string> {
  return (async () => {
    const sigRes = await fetch("/api/cloudinary");
    const sigData = await sigRes.json();
    if (!sigData.success) {
      throw new Error(sigData.error || "Failed to get upload signature");
    }

    const { signature, timestamp, apiKey, cloudName, folder } = sigData.data;
    const compressed = await compressImage(file);

    const formData = new FormData();
    formData.append("file", compressed);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    formData.append("folder", folder);

    const xhr = new XMLHttpRequest();

    return new Promise<string>((resolve, reject) => {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress(index, Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const result = JSON.parse(xhr.responseText);
          resolve(result.secure_url);
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            reject(new Error(err.error?.message || "Upload failed"));
          } catch {
            reject(new Error("Upload failed"));
          }
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Network error")));
      xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

      xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`);
      xhr.send(formData);
    });
  })();
}

export interface UploadImagesResult {
  urls: string[];
  errors: string[];
  rejected: string[];
}

/**
 * Validate and upload many files in parallel. `baseIndex` lets the caller map
 * progress callbacks into its own absolute index space.
 */
export async function uploadImages(
  files: File[],
  baseIndex = 0,
  onProgress?: (index: number, pct: number) => void
): Promise<UploadImagesResult> {
  const validation = files.map((file) => ({ file, error: validateImageFile(file) }));
  const rejected = validation
    .filter((v) => v.error)
    .map((v) => v.error as string);
  const valid = validation.filter((v) => !v.error);

  const results = await Promise.all(
    valid.map((v, i) =>
      uploadImageToCloudinary(v.file, baseIndex + i, onProgress)
        .then((url) => ({ url }))
        .catch((e) => ({ error: e instanceof Error ? e.message : "Upload failed" }))
    )
  );

  const urls = results.filter((r) => "url" in r).map((r) => (r as { url: string }).url);
  const errors = results.filter((r) => "error" in r).map((r) => (r as { error: string }).error);

  return { urls, errors, rejected };
}
