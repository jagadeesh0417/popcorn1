"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save, Loader2, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { uploadImages } from "@/lib/upload-image";

interface BundleImage {
  id: string;
  src: string;
}

interface UploadItem {
  id: string;
  preview: string;
  progress: number;
  error: string;
}

interface BundleSize {
  label: string;
  price: number;
  savings: number;
}

export default function AdminBundlePage() {
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<BundleImage[]>([
    { id: "1", src: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=600&q=80" },
    { id: "2", src: "https://images.unsplash.com/photo-1600959908209-755b03e7c66f?w=600&q=80" },
    { id: "3", src: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=600&q=80" },
  ]);
  const [sizes, setSizes] = useState<BundleSize[]>([
    { label: "All 80g", price: 449, savings: 18 },
    { label: "All 150g", price: 749, savings: 28 },
    { label: "All 250g", price: 1199, savings: 48 },
  ]);
  const [bundleText, setBundleText] = useState({
    title: "The Trio",
    subtitle: "One of each. The best way to find your favourite.",
    flavors: "Ghee & Black Pepper · Ghee & Curry Leaf · Coffee Chikki",
  });
  const [uploading, setUploading] = useState<UploadItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const addInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const editTargetIdRef = useRef<string | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearUploadingBatch = () => {
    setUploading((prev) => {
      prev.forEach((u) => URL.revokeObjectURL(u.preview));
      return [];
    });
  };

  const handleUploadFiles = async (files: File[]) => {
    if (!files.length || isUploading) return;
    const items: UploadItem[] = files.map((f) => ({
      id: `${Date.now()}-${Math.random()}`,
      preview: URL.createObjectURL(f),
      progress: 0,
      error: "",
    }));
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
    setUploading(items);
    setUploadErrors([]);
    setIsUploading(true);
    try {
      const { urls, errors, rejected } = await uploadImages(files, 0, (i, pct) => {
        setUploading((prev) => prev.map((it, idx) => (idx === i ? { ...it, progress: pct } : it)));
      });
      if (urls.length > 0) {
        setImages((prev) => [...prev, ...urls.map((src) => ({ id: `${Date.now()}-${Math.random()}`, src }))]);
      }
      const allErrors = [...rejected, ...errors];
      if (allErrors.length > 0) setUploadErrors(allErrors);
      setUploading((prev) => prev.map((it) => ({ ...it, progress: 100 })));
      if (urls.length > 0) {
        toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} uploaded`);
      }
    } catch (err) {
      setUploadErrors([err instanceof Error ? err.message : "Upload failed"]);
    } finally {
      setIsUploading(false);
      clearTimerRef.current = setTimeout(clearUploadingBatch, 1200);
    }
  };

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    void handleUploadFiles(files);
  };

  const handleEditFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    const targetId = editTargetIdRef.current;
    editTargetIdRef.current = null;
    (async () => {
      if (isUploading) return;
      setIsUploading(true);
      setUploadErrors([]);
      try {
        const { urls, errors, rejected } = await uploadImages(files, 0);
        if (urls.length > 0 && targetId) {
          setImages((prev) => prev.map((img) => (img.id === targetId ? { ...img, src: urls[0] } : img)));
          toast.success("Image replaced");
        }
        const allErrors = [...rejected, ...errors];
        if (allErrors.length > 0) setUploadErrors(allErrors);
      } catch (err) {
        setUploadErrors([err instanceof Error ? err.message : "Upload failed"]);
      } finally {
        setIsUploading(false);
      }
    })();
  };

  const addImage = () => {
    if (isUploading) return;
    addInputRef.current?.click();
  };

  useEffect(() => {
    fetch("/api/settings?key=bundle")
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data.data?.value) {
          const v = data.data.value;
          if (v.images) setImages(v.images);
          if (v.sizes) setSizes(v.sizes);
          if (v.bundleText) setBundleText(v.bundleText);
        }
      })
      .catch(console.error);
  }, []);

  const removeImage = (id: string) => {
    if (isUploading) return;
    setImages(images.filter((img) => img.id !== id));
  };

  const replaceImage = (id: string) => {
    if (isUploading) return;
    editTargetIdRef.current = id;
    editInputRef.current?.click();
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= newImages.length) return;
    [newImages[index], newImages[target]] = [newImages[target], newImages[index]];
    setImages(newImages);
  };

  const updateSize = (index: number, field: keyof BundleSize, value: string) => {
    const newSizes = [...sizes];
    if (field === "label") {
      newSizes[index].label = value;
    } else {
      newSizes[index][field] = Number(value) || 0;
    }
    setSizes(newSizes);
  };

  const addSize = () => {
    setSizes([...sizes, { label: "New size", price: 0, savings: 0 }]);
  };

  const removeSize = (index: number) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (isUploading) return;
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "bundle", value: { images, sizes, bundleText } }),
      });
      if (res.ok) {
        toast.success("Bundle settings saved!");
      } else {
        toast.error("Failed to save bundle settings");
      }
    } catch {
      toast.error("Failed to save bundle settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFFDF9] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 pt-20">
        <div className="px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Admin</span>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Bundle Settings</h1>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            {/* Bundle Text */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-5">Bundle Copy</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[#1A1A1A]">Title</Label>
                  <Input value={bundleText.title} onChange={(e) => setBundleText({ ...bundleText, title: e.target.value })} className="bg-white border-[rgba(220,2,24,0.12)]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#1A1A1A]">Subtitle</Label>
                  <Input value={bundleText.subtitle} onChange={(e) => setBundleText({ ...bundleText, subtitle: e.target.value })} className="bg-white border-[rgba(220,2,24,0.12)]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#1A1A1A]">Flavors</Label>
                  <Input value={bundleText.flavors} onChange={(e) => setBundleText({ ...bundleText, flavors: e.target.value })} className="bg-white border-[rgba(220,2,24,0.12)]" />
                </div>
              </div>
            </motion.div>

            {/* Images */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-lg text-[#1A1A1A]">Bundle Images</h3>
                <Button onClick={addImage} disabled={isUploading} className="bg-[#DC0218] hover:bg-[#C70015] text-white text-xs h-8">
                  {isUploading ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Plus className="h-3.5 w-3.5 mr-1" />}
                  {isUploading ? "Uploading images..." : "Add Image"}
                </Button>
              </div>

              {/* Hidden device file pickers (no URL prompt) */}
              <input
                ref={addInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                multiple
                onChange={handleAddFiles}
                className="hidden"
              />
              <input
                ref={editInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleEditFiles}
                className="hidden"
              />

              {/* Uploading previews + progress */}
              {uploading.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-[#DC0218] font-medium mb-2 flex items-center gap-1">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading {uploading.length} image{uploading.length > 1 ? "s" : ""}...
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {uploading.map((u) => (
                      <div key={u.id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[rgba(220,2,24,0.12)] bg-[#FFF8F0]">
                        <img src={u.preview} alt="Uploading preview" className="w-full h-full object-cover" />
                        {u.progress < 100 ? (
                          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1">
                            <Loader2 className="h-4 w-4 text-white animate-spin" />
                            <span className="text-white text-[10px] font-medium">{u.progress}%</span>
                          </div>
                        ) : (
                          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload errors */}
              {uploadErrors.length > 0 && (
                <div className="mb-3 space-y-1">
                  {uploadErrors.map((msg, i) => (
                    <p key={i} className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" /> {msg}
                    </p>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                {images.map((img, i) => (
                  <motion.div key={img.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 bg-white p-3 border border-[rgba(220,2,24,0.06)] group">
                    <div className="flex flex-col gap-0.5 text-[#666666]">
                      <button onClick={() => moveImage(i, "up")} disabled={i === 0 || isUploading} className={`text-[10px] ${i === 0 || isUploading ? "opacity-30" : "hover:text-[#1A1A1A]"}`}>▲</button>
                      <button onClick={() => moveImage(i, "down")} disabled={i === images.length - 1 || isUploading} className={`text-[10px] ${i === images.length - 1 || isUploading ? "opacity-30" : "hover:text-[#1A1A1A]"}`}>▼</button>
                    </div>
                    <div className="w-14 h-14 bg-[#FFF8F0] overflow-hidden shrink-0">
                      <img src={img.src} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-[#666666] truncate flex-1">{img.src}</span>
                    <button onClick={() => replaceImage(img.id)} disabled={isUploading} className="text-[10px] text-[#DC0218] hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                    <button onClick={() => removeImage(img.id)} disabled={isUploading} className="p-1 text-[#666666] hover:text-red-500 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))}
                {!isUploading && (
                  <button onClick={addImage}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[rgba(220,2,24,0.2)] text-[#DC0218] text-sm font-medium hover:bg-[#FFF8F0] transition-colors">
                    <Upload className="h-4 w-4" /> Add Image from Device
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sizes & Pricing */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm mt-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg text-[#1A1A1A]">Sizes &amp; Pricing</h3>
              <Button onClick={addSize} className="bg-[#DC0218] hover:bg-[#C70015] text-white text-xs h-8">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Size
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(220,2,24,0.08)] text-left">
                    <th className="pb-3 font-medium text-[#444444] text-xs uppercase tracking-[0.08em]">Size</th>
                    <th className="pb-3 font-medium text-[#444444] text-xs uppercase tracking-[0.08em]">Price (₹)</th>
                    <th className="pb-3 font-medium text-[#444444] text-xs uppercase tracking-[0.08em]">Savings (₹)</th>
                    <th className="pb-3" />
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((size, i) => (
                    <tr key={i} className="border-b border-[rgba(220,2,24,0.06)] last:border-0">
                      <td className="py-3 pr-4">
                        <Input value={size.label} onChange={(e) => updateSize(i, "label", e.target.value)} className="bg-white border-[rgba(220,2,24,0.12)] h-9 text-sm" />
                      </td>
                      <td className="py-3 pr-4">
                        <Input type="number" value={size.price} onChange={(e) => updateSize(i, "price", e.target.value)} className="bg-white border-[rgba(220,2,24,0.12)] h-9 text-sm w-28" />
                      </td>
                      <td className="py-3 pr-4">
                        <Input type="number" value={size.savings} onChange={(e) => updateSize(i, "savings", e.target.value)} className="bg-white border-[rgba(220,2,24,0.12)] h-9 text-sm w-28" />
                      </td>
                      <td className="py-3">
                        <button onClick={() => removeSize(i)} className="p-1.5 text-[#666666] hover:text-red-500 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 flex justify-end">
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
              <Button onClick={handleSave} disabled={saving || isUploading} className="bg-[#DC0218] hover:bg-[#C70015] text-white px-8 h-12 shadow-lg shadow-[#DC0218]/20">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} {saving ? "Saving..." : "Save Changes"}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
