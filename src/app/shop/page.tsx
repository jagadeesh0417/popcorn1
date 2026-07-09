"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { products, categories } from "@/lib/data";

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { addItem } = useCart();

  const filtered = activeCategory === "all" ? products : products.filter((p) => {
    const cat = p.category.toLowerCase();
    return activeCategory === "savory" ? cat === "savory" || p.tags.includes("savory") :
           activeCategory === "sweet" ? cat === "sweet" :
           true;
  });

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-2">
            <div className="flex justify-center mb-4">
              <div className="gold-rule" />
            </div>
            <h1 className="text-3xl md:text-4xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
              All Flavours
            </h1>
            <p className="text-[#444444] mt-2 text-xs uppercase tracking-[0.08em]">{filtered.length} products available</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 overflow-x-auto pb-2 mb-12 mt-8 justify-center"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 text-xs uppercase tracking-[0.08em] font-medium border transition-all ${
                activeCategory === cat.id
                  ? "bg-[#DC0218] text-white border-[#DC0218]"
                  : "bg-white text-[#444444] border-[rgba(220,2,24,0.15)] hover:border-[#DC0218] hover:text-[#DC0218]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group border border-[rgba(220,2,24,0.08)] bg-white overflow-hidden hover:border-[rgba(220,2,24,0.2)] transition-colors"
            >
              <Link href={`/products/${product.slug}`}>
                <div className="relative h-48 bg-[#FFF8F0]">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                </div>
              </Link>
              <div className="p-5">
                <p className="text-[#DC0218] text-xs italic">{product.tagline}</p>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-semibold text-lg text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>{product.name}</h3>
                </Link>
                <p className="text-[#444444] text-xs mt-1 line-clamp-1">{product.shortDescription}</p>

                {product.sizes && product.sizes.length > 0 && (
                  <p className="text-[#666666] text-[10px] mt-2 uppercase tracking-[0.06em]">
                    {product.sizes.map((s) => s.label).join(" · ")} available
                  </p>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(220,2,24,0.08)]">
                  <span className="text-base font-semibold text-[#1A1A1A]">From ₹{Math.min(...(product.sizes?.map((s) => s.price) || [product.price]))}</span>
                  <Button size="sm" className="bg-[#DC0218] hover:bg-[#C70015] text-white h-9 px-4 text-xs transition-all" onClick={() => addItem(product)}>
                    <ShoppingBag className="h-3.5 w-3.5 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#444444] text-sm">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
