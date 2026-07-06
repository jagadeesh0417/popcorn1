"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { trioProducts } from "@/lib/data";

export function ProductGrid() {
  const { addItem } = useCart();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [addedFeedback, setAddedFeedback] = useState<Record<string, boolean>>({});

  const handleSizeSelect = (productId: string, label: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: label }));
  };

  const handleAddToCart = (product: (typeof trioProducts)[0]) => {
    const sizeLabel = selectedSizes[product.id];
    if (!sizeLabel) return;
    const size = product.sizes?.find((s) => s.label === sizeLabel);
    const productToAdd = { ...product, price: size?.price || product.price };
    addItem(productToAdd);
    setAddedFeedback((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedFeedback((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section id="shop" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <div className="gold-rule" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
            The First Three
          </h2>
          <p className="text-[#666666] mt-3 text-sm uppercase tracking-[0.08em]">
            Our launch lineup. Two savory. One sweet. All popped this week.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {trioProducts.map((product, index) => {
            const selectedSize = selectedSizes[product.id];
            const sizeData = product.sizes?.find((s) => s.label === selectedSize);
            const displayPrice = sizeData?.price || product.price;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white border border-[rgba(183,28,28,0.08)] shadow-[0_2px_15px_rgba(183,28,28,0.04)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-[#FFF8F0] flex items-center justify-center text-5xl border-b border-[rgba(183,28,28,0.08)] relative overflow-hidden group">
                  <motion.div
                    className="text-6xl"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    🍿
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
                    {product.name}
                  </h3>
                  <p className="text-[#B71C1C] text-xs italic mt-1">{product.tagline}</p>
                  <p className="text-[#666666] text-xs mt-3 leading-relaxed">{product.description}</p>

                  <div className="flex gap-2 mt-5">
                    {product.sizes?.map((size) => {
                      const isSelected = selectedSizes[product.id] === size.label;
                      return (
                        <button
                          key={size.label}
                          onClick={() => handleSizeSelect(product.id, size.label)}
                          className={`px-4 py-2 text-xs uppercase tracking-[0.06em] font-medium border transition-all duration-200 ${
                            isSelected
                              ? "bg-[#B71C1C] text-white border-[#B71C1C]"
                              : "bg-white text-[#1A1A1A] border-[rgba(183,28,28,0.2)] hover:border-[#B71C1C]"
                          }`}
                        >
                          {size.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 h-5">
                    {selectedSize ? (
                      <p className="text-sm font-semibold text-[#B71C1C]">₹{displayPrice}</p>
                    ) : (
                      <p className="text-[#999999] text-[11px] uppercase tracking-[0.06em]">Select a size</p>
                    )}
                  </div>

                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={!selectedSize}
                      className={`w-full mt-4 btn-small-caps h-11 transition-all duration-200 ${
                        addedFeedback[product.id]
                          ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                          : selectedSize
                            ? "bg-[#B71C1C] hover:bg-[#8E1414] text-white shadow-lg shadow-[#B71C1C]/20 hover:shadow-[#B71C1C]/30"
                            : "bg-[#E0E0E0] text-[#999999] cursor-not-allowed"
                      }`}
                    >
                      {addedFeedback[product.id] ? (
                        <><Check className="h-3.5 w-3.5 mr-2" /> Added!</>
                      ) : (
                        <><ShoppingBag className="h-3.5 w-3.5 mr-2" /> Add to Cart</>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
