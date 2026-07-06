"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface BundleImage {
  id: string;
  src: string;
}

interface BundleSize {
  label: string;
  price: number;
  savings: number;
}

export default function AdminBundlePage() {
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

  const addImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      setImages([...images, { id: String(Date.now()), src: url }]);
    }
  };

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const replaceImage = (id: string) => {
    const url = prompt("Enter new image URL:");
    if (url) {
      setImages(images.map((img) => (img.id === id ? { ...img, src: url } : img)));
    }
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

  const handleSave = () => {
    // TODO: persist to DB
    // const db = await connectDB();
    // await db.collection("bundle").updateOne({ id: "trio" }, { $set: { images, sizes, bundleText } }, { upsert: true });
    toast.success("Bundle settings saved! (TODO: connect DB)");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFFDF9] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 pt-20">
        <div className="px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#B71C1C] font-semibold text-sm uppercase tracking-[0.2em]">Admin</span>
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
                  <Input value={bundleText.title} onChange={(e) => setBundleText({ ...bundleText, title: e.target.value })} className="bg-white border-[rgba(183,28,28,0.12)]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#1A1A1A]">Subtitle</Label>
                  <Input value={bundleText.subtitle} onChange={(e) => setBundleText({ ...bundleText, subtitle: e.target.value })} className="bg-white border-[rgba(183,28,28,0.12)]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#1A1A1A]">Flavors</Label>
                  <Input value={bundleText.flavors} onChange={(e) => setBundleText({ ...bundleText, flavors: e.target.value })} className="bg-white border-[rgba(183,28,28,0.12)]" />
                </div>
              </div>
            </motion.div>

            {/* Images */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-lg text-[#1A1A1A]">Bundle Images</h3>
                <Button onClick={addImage} className="bg-[#B71C1C] hover:bg-[#8E1414] text-white text-xs h-8">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Image
                </Button>
              </div>
              <div className="space-y-3">
                {images.map((img, i) => (
                  <motion.div key={img.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 bg-white p-3 border border-[rgba(183,28,28,0.06)] group">
                    <div className="flex flex-col gap-0.5 text-[#999999]">
                      <button onClick={() => moveImage(i, "up")} disabled={i === 0} className={`text-[10px] ${i === 0 ? "opacity-30" : "hover:text-[#1A1A1A]"}`}>▲</button>
                      <button onClick={() => moveImage(i, "down")} disabled={i === images.length - 1} className={`text-[10px] ${i === images.length - 1 ? "opacity-30" : "hover:text-[#1A1A1A]"}`}>▼</button>
                    </div>
                    <div className="w-14 h-14 bg-[#FFF8F0] overflow-hidden shrink-0">
                      <img src={img.src} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs text-[#999999] truncate flex-1">{img.src}</span>
                    <button onClick={() => replaceImage(img.id)} className="text-[10px] text-[#B71C1C] hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                    <button onClick={() => removeImage(img.id)} className="p-1 text-[#999999] hover:text-red-500 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sizes & Pricing */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm mt-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg text-[#1A1A1A]">Sizes &amp; Pricing</h3>
              <Button onClick={addSize} className="bg-[#B71C1C] hover:bg-[#8E1414] text-white text-xs h-8">
                <Plus className="h-3.5 w-3.5 mr-1" /> Add Size
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(183,28,28,0.08)] text-left">
                    <th className="pb-3 font-medium text-[#666666] text-xs uppercase tracking-[0.08em]">Size</th>
                    <th className="pb-3 font-medium text-[#666666] text-xs uppercase tracking-[0.08em]">Price (₹)</th>
                    <th className="pb-3 font-medium text-[#666666] text-xs uppercase tracking-[0.08em]">Savings (₹)</th>
                    <th className="pb-3" />
                  </tr>
                </thead>
                <tbody>
                  {sizes.map((size, i) => (
                    <tr key={i} className="border-b border-[rgba(183,28,28,0.06)] last:border-0">
                      <td className="py-3 pr-4">
                        <Input value={size.label} onChange={(e) => updateSize(i, "label", e.target.value)} className="bg-white border-[rgba(183,28,28,0.12)] h-9 text-sm" />
                      </td>
                      <td className="py-3 pr-4">
                        <Input type="number" value={size.price} onChange={(e) => updateSize(i, "price", e.target.value)} className="bg-white border-[rgba(183,28,28,0.12)] h-9 text-sm w-28" />
                      </td>
                      <td className="py-3 pr-4">
                        <Input type="number" value={size.savings} onChange={(e) => updateSize(i, "savings", e.target.value)} className="bg-white border-[rgba(183,28,28,0.12)] h-9 text-sm w-28" />
                      </td>
                      <td className="py-3">
                        <button onClick={() => removeSize(i)} className="p-1.5 text-[#999999] hover:text-red-500 transition-colors">
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
              <Button onClick={handleSave} className="bg-[#B71C1C] hover:bg-[#8E1414] text-white px-8 h-12 shadow-lg shadow-[#B71C1C]/20">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
