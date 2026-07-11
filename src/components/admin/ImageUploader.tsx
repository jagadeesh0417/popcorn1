"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024;

interface UploadingFile {
  file: File;
  preview: string;
  progress: number;
  error: string;
}

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `"${file.name}" — only JPG, PNG, and WEBP allowed`;
    }
    if (file.size > MAX_SIZE) {
      return `"${file.name}" — exceeds 10MB limit`;
    }
    return null;
  };

  const uploadToCloudinary = async (file: File, index: number) => {
    try {
      const sigRes = await fetch("/api/cloudinary");
      const sigData = await sigRes.json();
      if (!sigData.success) throw new Error(sigData.error || "Failed to get upload signature");

      const { signature, timestamp, apiKey, cloudName, folder } = sigData.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

      const xhr = new XMLHttpRequest();

      return new Promise<string>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setUploading((prev) => {
              const next = [...prev];
              if (next[index]) next[index] = { ...next[index], progress: pct };
              return next;
            });
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
    } catch (err) {
      throw err;
    }
  };

  const handleFiles = useCallback(async (files: FileList) => {
    const valid: UploadingFile[] = [];

    for (const file of Array.from(files)) {
      const error = validateFile(file);
      valid.push({
        file,
        preview: URL.createObjectURL(file),
        progress: 0,
        error: error || "",
      });
    }

    setUploading((prev) => [...prev, ...valid]);

    for (let i = 0; i < valid.length; i++) {
      const idx = uploading.length + i;
      if (valid[i].error) continue;

      try {
        const url = await uploadToCloudinary(valid[i].file, idx);
        onChange([...images, url]);
        setUploading((prev) => {
          const next = [...prev];
          if (next[idx]) next[idx] = { ...next[idx], progress: 100 };
          return next;
        });
      } catch (err) {
        setUploading((prev) => {
          const next = [...prev];
          if (next[idx]) next[idx] = { ...next[idx], error: err instanceof Error ? err.message : "Upload failed" };
          return next;
        });
      }
    }
  }, [images, onChange, uploading.length]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleBrowse = () => inputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  };

  const removeExisting = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const removeUploading = (index: number) => {
    setUploading((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index]?.preview || "");
      next.splice(index, 1);
      return next;
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Product Images</label>

      {/* Existing images */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {images.map((url, i) => (
            <div key={url} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-[rgba(220,2,24,0.12)]">
              <img src={url} alt={`Product ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeExisting(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Uploading previews */}
      {uploading.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {uploading.map((item, i) => (
            <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-[rgba(220,2,24,0.12)] bg-[#FFF8F0]">
              <img src={item.preview} alt="Preview" className="w-full h-full object-cover" />
              {item.error ? (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-400" />
                </div>
              ) : item.progress < 100 ? (
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1">
                  <Loader2 className="h-5 w-5 text-white animate-spin" />
                  <span className="text-white text-[10px] font-medium">{item.progress}%</span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-600 text-[10px] font-bold">✓ Done</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeUploading(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ opacity: item.progress < 100 ? 1 : 0 }}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Errors */}
      {uploading.some((u) => u.error) && (
        <div className="mb-3 space-y-1">
          {uploading.filter((u) => u.error).map((u, i) => (
            <p key={i} className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {u.error}
            </p>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleBrowse}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-[#DC0218] bg-[#DC0218]/5"
            : "border-[rgba(220,2,24,0.2)] hover:border-[#DC0218] hover:bg-[#FFF8F0]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
        <Upload className="h-8 w-8 mx-auto mb-2 text-[#444444]" />
        <p className="text-sm text-[#444444] font-medium">
          Drop images here or <span className="text-[#DC0218]">browse</span>
        </p>
        <p className="text-xs text-[#666666] mt-1">JPG, PNG, WEBP — up to 10MB each</p>
      </div>
    </div>
  );
}
