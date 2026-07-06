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
    return activeCategory === "classic" ? cat === "classic" :
           activeCategory === "sweet" ? ["sweet"].includes(cat) || ["Chocolate Drizzle", "Honey Roasted", "Cinnamon Roll"].includes(p.name) :
           activeCategory === "salty" ? cat === "classic" || p.tags.includes("savory") :
           activeCategory === "cheese" ? cat === "cheese" :
           activeCategory === "caramel" ? cat === "caramel" :
           activeCategory === "spicy" ? cat === "spicy" :
           activeCategory === "gourmet" ? cat === "gourmet" || p.tags.includes("premium") :
           true;
  });

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-2">
            <span className="text-[#B71C1C] font-semibold text-sm uppercase tracking-[0.2em]">Our Menu</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 text-[#1A1A1A]">All Flavours</h1>
            <p className="text-[#666666] mt-2">{filtered.length} products available</p>
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
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all text-sm font-medium ${
                activeCategory === cat.id
                  ? "bg-[#B71C1C] text-white shadow-lg shadow-[#B71C1C]/20"
                  : "bg-[#FFF8F0] text-[#1A1A1A] hover:bg-[#B71C1C]/5"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-[24px] overflow-hidden shadow-[0_2px_20px_rgba(183,28,28,0.06)] hover:shadow-[0_8px_40px_rgba(183,28,28,0.12)] transition-all duration-500 border border-[rgba(183,28,28,0.08)]"
            >
              <Link href={`/products/${product.slug}`}>
                <div className="relative h-48 overflow-hidden bg-[#FFF8F0]">
                  <Image src={product.images[0]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                  {product.originalPrice && (
                    <div className="absolute top-3 left-3 bg-[#B71C1C] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">SALE</div>
                  )}
                </div>
              </Link>
              <div className="p-4">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-bold text-sm text-[#1A1A1A] group-hover:text-[#B71C1C] transition-colors">{product.name}</h3>
                </Link>
                <p className="text-[#666666] text-xs mt-1 line-clamp-1">{product.shortDescription}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(183,28,28,0.08)]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-bold text-[#B71C1C]">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-[#666666] line-through text-xs">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <Button size="sm" className="bg-[#B71C1C] hover:bg-[#8E1414] text-white rounded-xl h-9 px-3 text-xs transition-all" onClick={() => addItem(product)}>
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
            <p className="text-[#666666]">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
