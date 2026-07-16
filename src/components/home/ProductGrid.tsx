"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { Product, ProductVariant } from "@/lib/types";
import { toast } from "sonner";

const TRIO_SLUGS = ["ghee-black-pepper", "ghee-curry-leaf", "coffee-chikki"];

export function ProductGrid() {
  const { addItem } = useCart();
  const [trioProducts, setTrioProducts] = useState<Product[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [addedFeedback, setAddedFeedback] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (!data?.success) return;
        const list = data.data as Product[];
        const trios = list.filter((p: Product) => TRIO_SLUGS.includes(p.slug));
        setTrioProducts(trios);
        const init: Record<string, string> = {};
        trios.forEach((p: Product) => {
          const variants: ProductVariant[] = p.sizes || p.variants || [];
          if (variants.length > 0) init[p.id || p._id || ""] = variants[0].label;
        });
        setSelectedSizes(init);
      })
      .catch(console.error);
  }, []);

  const handleSizeSelect = (productId: string, label: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: label }));
  };

  const handleAddToCart = (product: Product) => {
    const sizeLabel = selectedSizes[product.id];
    if (!sizeLabel) return;
    const variants: ProductVariant[] = product.sizes || product.variants || [];
    const variant = variants.find((s) => s.label === sizeLabel);
    if (!variant) return;
    addItem(product, variant);
    setAddedFeedback((prev) => ({ ...prev, [product.id]: true }));
    toast.success("Added to Cart ✓");
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
          <p className="text-[#444444] mt-3 text-sm uppercase tracking-[0.08em]">
            Our launch lineup. Two savory. One sweet. All popped this week.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {trioProducts.map((product, index) => {
            const variants: ProductVariant[] = product.sizes || product.variants || [];
            const selectedSize = selectedSizes[product.id];
            const sizeData = variants.find((s) => s.label === selectedSize);
            const displayPrice = sizeData?.price || product.price;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white border border-[rgba(220,2,24,0.08)] shadow-[0_2px_15px_rgba(220,2,24,0.04)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)] transition-all duration-300"
              >
                <div className="aspect-[4/3] bg-[#FFF8F0] border-b border-[rgba(220,2,24,0.08)] relative overflow-hidden group">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">🍿</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
                    {product.name}
                  </h3>
                  <p className="text-[#DC0218] text-xs italic mt-1">{product.tagline}</p>
                  <p className="text-[#444444] text-xs mt-3 leading-relaxed">{product.description}</p>

                  <div className="flex gap-2 mt-5">
                    {variants.map((size) => {
                      const isSelected = selectedSizes[product.id] === size.label;
                      return (
                        <button
                          key={size.label}
                          onClick={() => handleSizeSelect(product.id, size.label)}
                          className={`px-4 py-2 text-xs uppercase tracking-[0.06em] font-medium border transition-all duration-200 ${
                            isSelected
                              ? "bg-[#DC0218] text-white border-[#DC0218]"
                              : "bg-white text-[#1A1A1A] border-[rgba(220,2,24,0.2)] hover:border-[#DC0218]"
                          }`}
                        >
                          {size.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 h-5">
                    <p className="text-sm font-semibold text-[#DC0218]">₹{displayPrice}</p>
                  </div>

                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      className={`w-full mt-4 btn-small-caps h-11 rounded-xl transition-all duration-200 ${
                        addedFeedback[product.id]
                          ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                          : "bg-[#DC0218] hover:bg-[#C70015] text-white shadow-lg shadow-[#DC0218]/20 hover:shadow-[#DC0218]/30"
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
