"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const bundlePrices: Record<string, { price: number; savings: number }> = {
  "All 80g": { price: Number(process.env.NEXT_PUBLIC_BUNDLE_TRIO_PRICE_80G) || 449, savings: Number(process.env.NEXT_PUBLIC_BUNDLE_TRIO_SAVINGS_80G) || 18 },
  "All 150g": { price: Number(process.env.NEXT_PUBLIC_BUNDLE_TRIO_PRICE_150G) || 749, savings: Number(process.env.NEXT_PUBLIC_BUNDLE_TRIO_SAVINGS_150G) || 28 },
  "All 250g": { price: Number(process.env.NEXT_PUBLIC_BUNDLE_TRIO_PRICE_250G) || 1199, savings: Number(process.env.NEXT_PUBLIC_BUNDLE_TRIO_SAVINGS_250G) || 48 },
};

const bundleSizes = ["All 80g", "All 150g", "All 250g"];

const bundleImages = [
  "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=600&q=80",
  "https://images.unsplash.com/photo-1600959908209-755b03e7c66f?w=600&q=80",
  "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=600&q=80",
  "https://images.unsplash.com/photo-1600959908209-755b03e7c66f?w=600&q=80",
  "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=600&q=80",
];

export function BundleCard() {
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  const bundleData = selectedBundle ? bundlePrices[selectedBundle] : null;

  const handleAddBundle = () => {
    if (!bundleData) return;
    toast.success(`Added The Trio (${selectedBundle}) to cart!`);
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % bundleImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + bundleImages.length) % bundleImages.length);

  return (
    <section id="bundles" className="py-16 md:py-20 bg-gradient-to-b from-white to-[#FFFDF9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <div className="gold-rule" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          whileHover={{ y: -4 }}
          className="bg-[#FFFDF9] border border-[rgba(0,0,0,0.05)] shadow-[0_12px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Image side */}
            <div className="md:w-1/2 relative aspect-[4/3] md:aspect-auto md:min-h-[420px] bg-[#FFF8F0] overflow-hidden group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={bundleImages[currentImage]}
                    alt="The Trio bundle"
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Carousel arrows */}
              <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-all hover:scale-105">
                <ChevronLeft className="h-4 w-4 text-[#1A1A1A]" />
              </button>
              <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-all hover:scale-105">
                <ChevronRight className="h-4 w-4 text-[#1A1A1A]" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {bundleImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-1.5 h-1.5 transition-all duration-300 ${
                      i === currentImage ? "bg-white w-4" : "bg-white/50 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content side */}
            <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
              <span className="inline-block bg-[#B71C1C] text-white text-[10px] uppercase tracking-[0.15em] font-semibold px-3 py-1 mb-4 w-fit">
                Best Value
              </span>

              <h2 className="text-3xl md:text-4xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
                The Trio
              </h2>
              <p className="text-[#666666] text-sm mt-2 leading-relaxed">
                One of each. The best way to find your favourite.
              </p>
              <p className="text-[#B71C1C] text-xs mt-4 font-medium tracking-wide">
                Ghee &amp; Black Pepper <span className="text-[#666666]">·</span> Ghee &amp; Curry Leaf <span className="text-[#666666]">·</span> Coffee Chikki
              </p>

              <div className="flex flex-wrap gap-2 mt-6">
                {bundleSizes.map((size) => {
                  const isSelected = selectedBundle === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedBundle(size)}
                      className={`px-5 py-2.5 text-xs uppercase tracking-[0.06em] font-medium border transition-all duration-200 ${
                        isSelected
                          ? "bg-[#B71C1C] text-white border-[#B71C1C]"
                          : "bg-white text-[#1A1A1A] border-[rgba(183,28,28,0.2)] hover:border-[#B71C1C]"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              {bundleData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 flex items-baseline gap-3"
                >
                  <span className="text-2xl font-semibold text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
                    ₹{bundleData.price}
                  </span>
                  <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider">
                    Save ₹{bundleData.savings}
                  </span>
                </motion.div>
              )}

              {!selectedBundle && (
                <p className="text-[#999999] text-[11px] mt-3 uppercase tracking-[0.06em]">Select a size above</p>
              )}

              <motion.div whileTap={{ scale: 0.97 }} className="mt-6">
                <Button
                  onClick={handleAddBundle}
                  disabled={!selectedBundle}
                  className={`w-full md:w-auto btn-small-caps px-10 h-12 transition-all duration-200 ${
                    selectedBundle
                      ? "bg-[#B71C1C] hover:bg-[#8E1414] text-white shadow-lg shadow-[#B71C1C]/20 hover:shadow-[#B71C1C]/30"
                      : "bg-[#E0E0E0] text-[#999999] cursor-not-allowed"
                  }`}
                >
                  <ShoppingBag className="h-3.5 w-3.5 mr-2" /> Add Bundle to Cart
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
