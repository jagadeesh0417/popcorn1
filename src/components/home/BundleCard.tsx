"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const bundlePrices: Record<string, { price: number; savings: number }> = {
  "All 80g": { price: Number(process.env.NEXT_PUBLIC_BUNDLE_TRIO_PRICE_80G) || 449, savings: Number(process.env.NEXT_PUBLIC_BUNDLE_TRIO_SAVINGS_80G) || 18 },
  "All 150g": { price: Number(process.env.NEXT_PUBLIC_BUNDLE_TRIO_PRICE_150G) || 749, savings: Number(process.env.NEXT_PUBLIC_BUNDLE_TRIO_SAVINGS_150G) || 28 },
  "All 250g": { price: Number(process.env.NEXT_PUBLIC_BUNDLE_TRIO_PRICE_250G) || 1199, savings: Number(process.env.NEXT_PUBLIC_BUNDLE_TRIO_SAVINGS_250G) || 48 },
};

const bundleSizes = ["All 80g", "All 150g", "All 250g"];

export function BundleCard() {
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);

  const bundleData = selectedBundle ? bundlePrices[selectedBundle] : null;

  const handleAddBundle = () => {
    if (!bundleData) return;
    toast.success(`Added The Trio (${selectedBundle}) to cart!`);
  };

  return (
    <section id="bundles" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          whileHover={{ y: -4 }}
          className="border-2 border-[rgba(183,28,28,0.12)] p-8 md:p-12 text-center shadow-[0_4px_20px_rgba(183,28,28,0.04)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition-all duration-300"
        >
          <div className="flex justify-center mb-4">
            <div className="gold-rule" />
          </div>
          <h2 className="text-3xl md:text-4xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
            The Trio
          </h2>
          <p className="text-[#666666] mt-2 text-sm uppercase tracking-[0.08em]">
            One of each. The best way to find your favorite — or discover you love them all.
          </p>
          <p className="text-[#B71C1C] text-xs mt-4 font-medium tracking-wide">
            Ghee & Black Pepper · Ghee & Curry Leaf · Coffee Chikki
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {bundleSizes.map((size) => {
              const isSelected = selectedBundle === size;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedBundle(size)}
                  className={`px-6 py-3 text-xs uppercase tracking-[0.06em] font-medium border transition-all duration-200 ${
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
              className="mt-6"
            >
              <p className="text-2xl font-semibold text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
                ₹{bundleData.price}
                <span className="text-[#999999] text-sm font-normal ml-2">· Save ₹{bundleData.savings}</span>
              </p>
            </motion.div>
          )}

          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              onClick={handleAddBundle}
              disabled={!selectedBundle}
              className={`mt-8 btn-small-caps px-10 h-12 transition-all duration-200 ${
                selectedBundle
                  ? "bg-[#B71C1C] hover:bg-[#8E1414] text-white shadow-lg shadow-[#B71C1C]/20 hover:shadow-[#B71C1C]/30"
                  : "bg-[#E0E0E0] text-[#999999] cursor-not-allowed"
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5 mr-2" /> Add Bundle to Cart
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
