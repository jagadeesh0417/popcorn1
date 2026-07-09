"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Minus, Plus, Check, Truck, Shield, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/store";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";
import { notFound } from "next/navigation";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = getProductBySlug(slug);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes?.[0]?.label ?? "");
  const [activeTab, setActiveTab] = useState<"description" | "ingredients" | "nutrition" | "reviews">("description");
  const [added, setAdded] = useState(false);

  if (!product) notFound();

  const related = getRelatedProducts(product);

  const currentSize = product.sizes?.find((s) => s.label === selectedSize);
  const displayPrice = currentSize?.price ?? product.price;

  const handleAdd = () => {
    if (!currentSize) return;
    addItem({ ...product, price: displayPrice }, quantity);
    setAdded(true);
    setQuantity(1);
    toast.success("Added to Cart ✓");
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="text-sm text-[#666666] mb-8">
          <Link href="/" className="hover:text-[#DC0218] transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-[#DC0218] transition-colors">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-[#1A1A1A]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative h-80 sm:h-96 lg:h-[500px] overflow-hidden bg-[#FFF8F0]">
              <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" className="bg-[#FFF8F0] text-[#1A1A1A] border-0">{product.category}</Badge>
              {product.isBestSeller && (
                <Badge className="bg-[#F9D976] text-[#C70015] flex items-center gap-1 border-0">
                  <Star className="h-3 w-3 fill-current" /> Best Seller
                </Badge>
              )}
            </div>

            <div className="flex justify-start mb-2">
              <div className="gold-rule" />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>{product.name}</h1>
            <p className="text-[#DC0218] text-sm italic mt-1">{product.tagline}</p>
            <p className="text-[#666666] mt-4 leading-relaxed">{product.description}</p>

            <Separator className="my-6 bg-[rgba(220,2,24,0.08)]" />

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <p className="text-xs uppercase tracking-[0.08em] text-[#666666] mb-3">Choose size</p>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size.label;
                    return (
                      <button
                        key={size.label}
                        onClick={() => setSelectedSize(size.label)}
                        className={`px-5 py-3 text-xs uppercase tracking-[0.06em] font-medium border transition-all ${
                          isSelected
                            ? "bg-[#DC0218] text-white border-[#DC0218]"
                            : "bg-white text-[#1A1A1A] border-[rgba(220,2,24,0.2)] hover:border-[#DC0218]"
                        }`}
                      >
                        {size.label} <span className="opacity-70">— ₹{size.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
                ₹{displayPrice}
              </span>
              <span className="text-sm text-[#666666]">/ {currentSize?.grams}g</span>
            </div>

            <div className="flex items-center gap-4 mt-auto">
              <div className="flex items-center border border-[rgba(220,2,24,0.15)] overflow-hidden">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-[#FFF8F0] transition-colors text-[#1A1A1A]">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 font-medium min-w-[3rem] text-center text-[#1A1A1A]">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-[#FFF8F0] transition-colors text-[#1A1A1A]">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                size="lg"
                disabled={!currentSize}
                onClick={handleAdd}
                className={`flex-1 h-12 text-base rounded-xl transition-all ${
                  added
                    ? "bg-green-600 text-white"
                    : "bg-[#DC0218] hover:bg-[#C70015] text-white"
                }`}
              >
                {added ? (
                  <span className="flex items-center gap-2"><Check className="h-5 w-5" /> Added!</span>
                ) : (
                  <span className="flex items-center gap-2"><ShoppingBag className="h-5 w-5" /> Add to Cart</span>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-8">
              {[
                { icon: Truck, text: "Free delivery above ₹300" },
                { icon: Shield, text: "Freshness guaranteed" },
                { icon: RotateCcw, text: "Easy returns" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center text-center p-3 bg-[#FFF8F0]">
                  <Icon className="h-5 w-5 text-[#DC0218] mb-1" />
                  <span className="text-xs text-[#666666]">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mb-16">
          <div className="flex gap-1 border-b border-[rgba(220,2,24,0.08)] mb-8">
            {[
              { id: "description" as const, label: "Description" },
              { id: "ingredients" as const, label: "Ingredients" },
              { id: "nutrition" as const, label: "Nutrition" },
              { id: "reviews" as const, label: `Reviews (${product.reviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-[1px] ${
                  activeTab === tab.id ? "border-[#DC0218] text-[#DC0218]" : "border-transparent text-[#666666] hover:text-[#1A1A1A]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {activeTab === "description" && (
              <div className="prose max-w-none text-[#666666] leading-relaxed">
                <p>{product.description}</p>
                <p className="mt-4">Each batch is freshly popped and packed with care to ensure you get the perfect crunch in every bite.</p>
              </div>
            )}
            {activeTab === "ingredients" && (
              <ul className="space-y-2">
                {product.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-3 text-[#666666]">
                    <Check className="h-4 w-4 text-[#DC0218] shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === "nutrition" && (
              <div className="max-w-md">
                <p className="text-sm text-[#666666] mb-4">Serving Size: {product.nutritionInfo.servingSize}</p>
                <div className="border border-[rgba(220,2,24,0.08)] overflow-hidden">
                  <div className="bg-[#FFF8F0] px-4 py-2 flex justify-between font-semibold text-sm text-[#1A1A1A]">
                    <span>Nutrient</span>
                    <span>Amount per serving</span>
                  </div>
                  {[
                    { label: "Calories", value: `${product.nutritionInfo.calories}` },
                    { label: "Total Fat", value: product.nutritionInfo.totalFat },
                    { label: "Saturated Fat", value: product.nutritionInfo.saturatedFat },
                    { label: "Trans Fat", value: product.nutritionInfo.transFat },
                    { label: "Cholesterol", value: product.nutritionInfo.cholesterol },
                    { label: "Sodium", value: product.nutritionInfo.sodium },
                    { label: "Total Carbohydrates", value: product.nutritionInfo.totalCarb },
                    { label: "Dietary Fiber", value: product.nutritionInfo.fiber },
                    { label: "Sugar", value: product.nutritionInfo.sugar },
                    { label: "Protein", value: product.nutritionInfo.protein },
                  ].map((row, i) => (
                    <div key={row.label} className={`px-4 py-2 flex justify-between text-sm ${i % 2 === 0 ? "bg-white" : "bg-[#FFF8F0]/50"}`}>
                      <span className="text-[#666666]">{row.label}</span>
                      <span className="font-medium text-[#1A1A1A]">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="space-y-5">
                {product.reviews.length === 0 ? (
                  <p className="text-[#666666]">No reviews yet. Be the first to review this product!</p>
                ) : (
                  product.reviews.map((review) => (
                    <div key={review.id} className="p-5 bg-[#FFF8F0]">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#DC0218]/10 flex items-center justify-center text-[#DC0218] font-bold text-sm">
                          {review.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-[#1A1A1A]">{review.name}</p>
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`h-3 w-3 ${i < review.rating ? "text-[#F9D976] fill-[#F9D976]" : "text-gray-300"}`} />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-[#666666]">{review.date}</span>
                      </div>
                      <p className="text-sm text-[#666666]">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </motion.div>
        </div>

        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6" style={{ fontFamily: "var(--font-playfair)" }}>You May Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group border border-[rgba(220,2,24,0.08)] bg-white overflow-hidden hover:border-[rgba(220,2,24,0.2)] transition-colors"
                >
                  <Link href={`/products/${p.slug}`}>
                    <div className="relative h-40 overflow-hidden bg-[#FFF8F0]">
                      <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 25vw" />
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link href={`/products/${p.slug}`}>
                      <h3 className="font-semibold text-lg text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>{p.name}</h3>
                    </Link>
                    <p className="text-[#DC0218] text-xs italic mt-0.5">{p.tagline}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(220,2,24,0.08)]">
                      <span className="font-semibold text-sm text-[#1A1A1A]">From ₹{Math.min(...(p.sizes?.map((s) => s.price) || [p.price]))}</span>
                      <Button size="sm" className="bg-[#DC0218] hover:bg-[#C70015] text-white h-8 px-3 text-xs" onClick={() => addItem(p)}>Add</Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
