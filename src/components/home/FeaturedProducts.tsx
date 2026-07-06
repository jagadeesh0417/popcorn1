"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { getFeaturedProducts } from "@/lib/data";

export function FeaturedProducts() {
  const { addItem } = useCart();
  const products = getFeaturedProducts();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="text-[#B71C1C] font-semibold text-sm uppercase tracking-[0.2em]">Our Collection</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-3 text-[#1A1A1A]">
            Our Best Selling Flavours
          </h2>
          <p className="text-[#666666] mt-4 max-w-xl mx-auto leading-relaxed">
            Freshly prepared gourmet popcorn crafted to perfection.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-[24px] overflow-hidden shadow-[0_2px_20px_rgba(183,28,28,0.06)] hover:shadow-[0_8px_40px_rgba(183,28,28,0.12)] transition-all duration-500 border border-[rgba(183,28,28,0.08)]"
            >
              <Link href={`/products/${product.slug}`}>
                <div className="relative h-56 overflow-hidden bg-[#FFF8F0]">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-3 left-3 bg-[#B71C1C] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      SAVE ₹{product.originalPrice - product.price}
                    </div>
                  )}
                  {product.isBestSeller && (
                    <div className="absolute top-3 right-3 bg-[#F9D976] text-[#8E1414] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                      <Star className="h-3 w-3 fill-current" /> Best Seller
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-5">
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-bold text-base text-[#1A1A1A] group-hover:text-[#B71C1C] transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-[#666666] text-xs mt-1.5 line-clamp-2 leading-relaxed">{product.shortDescription}</p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[rgba(183,28,28,0.08)]">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-[#B71C1C]">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-[#666666] line-through text-sm">₹{product.originalPrice}</span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="bg-[#B71C1C] hover:bg-[#8E1414] text-white rounded-xl text-xs px-4 h-9 transition-all duration-300"
                    onClick={() => addItem(product)}
                  >
                    <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/shop">
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl border-[#B71C1C] text-[#B71C1C] hover:bg-[#B71C1C] hover:text-white px-10 transition-all duration-300"
            >
              View All Flavours
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
