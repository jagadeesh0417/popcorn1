"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { Product } from "@/lib/types";

export function BestSellers() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/products?bestSeller=true")
      .then((r) => r.json())
      .then((data) => { if (data?.success) setProducts(data.data); })
      .catch(console.error);
  }, []);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => el.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollBy({ left: direction === "left" ? -340 : 340, behavior: "smooth" });
      setTimeout(checkScroll, 350);
    }
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || products.length === 0) return;
    const interval = setInterval(() => {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 340, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [products.length]);

  return (
    <section id="best-sellers" className="py-24 bg-[#FFF8F0]" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Trending</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2 text-[#1A1A1A]">Best Sellers</h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-[rgba(220,2,24,0.2)] hover:bg-[#DC0218] hover:text-white transition-all"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-[rgba(220,2,24,0.2)] hover:bg-[#DC0218] hover:text-white transition-all"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.08 }}
              className="min-w-[290px] sm:min-w-[310px] snap-start"
            >
              <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_2px_20px_rgba(220,2,24,0.06)] hover:shadow-[0_8px_40px_rgba(220,2,24,0.12)] transition-all duration-500 border border-[rgba(220,2,24,0.08)] group h-full">
                <Link href={`/products/${product.slug}`}>
                  <div className="relative h-56 overflow-hidden bg-[#FFF8F0]">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="310px"
                    />
                    <div className="absolute top-3 left-3 bg-[#F9D976] text-[#C70015] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                      <Star className="h-3 w-3 fill-current" /> Bestseller
                    </div>
                  </div>
                </Link>
                <div className="p-5">
                  <Link href={`/products/${product.slug}`}>
                    <h3 className="font-bold text-base text-[#1A1A1A] group-hover:text-[#DC0218] transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-[#444444] text-xs mt-1.5 line-clamp-2">{product.shortDescription}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-[rgba(220,2,24,0.08)]">
                    <span className="text-xl font-bold text-[#DC0218]">₹{product.price}</span>
                    <Button size="sm" className="bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl text-xs px-4 h-9" onClick={() => addItem(product)}>
                      <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
