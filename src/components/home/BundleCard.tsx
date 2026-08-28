"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronLeft, ChevronRight, RefreshCw, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";
import { Product, ProductVariant, BundleComposition, BundlePart } from "@/lib/types";
import { toast } from "sonner";
import { optimizeImageUrl } from "@/lib/image";
import { isBuyable, getAvailableQty } from "@/lib/stock";

interface BundlePartDef {
  slug?: string;
  quantity?: number;
}

interface BundleSettingsData {
  bundleId?: string;
  images: { id: string; src: string }[];
  sizes: { label: string; price: number; savings: number }[];
  bundleText: { title: string; subtitle: string; flavors: string };
  products?: BundlePartDef[];
}

const defaultBundle: BundleSettingsData = {
  bundleId: "trio",
  images: [
    { id: "1", src: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=600&q=80" },
    { id: "2", src: "https://images.unsplash.com/photo-1600959908209-755b03e7c66f?w=600&q=80" },
    { id: "3", src: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=600&q=80" },
    { id: "4", src: "https://images.unsplash.com/photo-1600959908209-755b03e7c66f?w=600&q=80" },
    { id: "5", src: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=600&q=80" },
  ],
  sizes: [
    { label: "All 80g", price: 449, savings: 18 },
    { label: "All 150g", price: 749, savings: 28 },
    { label: "All 250g", price: 1199, savings: 48 },
  ],
  bundleText: {
    title: "The Trio",
    subtitle: "One of each. The best way to find your favourite.",
    flavors: "Ghee & Black Pepper · Ghee & Curry Leaf · Coffee Chikki",
  },
  products: [
    { slug: "ghee-black-pepper", quantity: 1 },
    { slug: "ghee-curry-leaf", quantity: 1 },
    { slug: "coffee-chikki", quantity: 1 },
  ],
};

// Grams represented by a bundle size label, e.g. "All 80g" -> 80.
function sizeGrams(sizeLabel: string): number {
  const digits = String(sizeLabel || "").replace(/[^0-9]/g, "");
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

function normalizeVariants(product: Product): ProductVariant[] {
  if (Array.isArray(product.sizes) && product.sizes.length > 0) return product.sizes;
  if (Array.isArray(product.variants) && product.variants.length > 0) return product.variants;
  return [];
}

function findVariantForGrams(product: Product, grams: number): ProductVariant | null {
  const variants = normalizeVariants(product);
  const exact = variants.find((v) => String(v.label).toLowerCase() === `${grams}g`);
  if (exact) return exact;
  return variants.find((v) => Math.floor(Number(v.grams)) === Math.floor(grams)) || null;
}

export function BundleCard() {
  const [bundle, setBundle] = useState<BundleSettingsData>(defaultBundle);
  const [selectedBundle, setSelectedBundle] = useState<string>(defaultBundle.sizes[0]?.label || "");
  const [currentImage, setCurrentImage] = useState(0);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addBundle } = useCart();

  const loadBundle = useCallback(async () => {
    try {
      const res = await fetch("/api/settings?key=bundle&fresh=1");
      const data = await res.json();
      let cfg = defaultBundle;
      if (data?.success && data.data?.value) {
        const v = data.data.value as Partial<BundleSettingsData>;
        cfg = {
          bundleId: v.bundleId || defaultBundle.bundleId,
          images: Array.isArray(v.images) && v.images.length > 0 ? v.images : defaultBundle.images,
          sizes: Array.isArray(v.sizes) && v.sizes.length > 0 ? v.sizes : defaultBundle.sizes,
          bundleText: v.bundleText ? { ...defaultBundle.bundleText, ...v.bundleText } : defaultBundle.bundleText,
          products: Array.isArray(v.products) && v.products.length > 0 ? v.products : defaultBundle.products,
        };
      }
      setBundle(cfg);
      if (!cfg.sizes.some((s) => s.label === selectedBundle) && cfg.sizes.length > 0) {
        setSelectedBundle(cfg.sizes[0].label);
      }

      // Fetch the products that make up the bundle composition.
      const slugs = (cfg.products ?? []).map((p) => p.slug).filter(Boolean) as string[];
      if (slugs.length > 0) {
        const pres = await fetch(`/api/products?slugs=${encodeURIComponent(slugs.join(","))}&fresh=1`);
        const pdata = await pres.json();
        if (pdata?.success) {
          const map: Record<string, Product> = {};
          (pdata.data as Product[]).forEach((p) => { if (p.slug) map[p.slug] = p; });
          setProducts(map);
        }
      }
    } catch {
      setError("Couldn't load the bundle. Please retry.");
    } finally {
      setLoading(false);
    }
  }, [selectedBundle]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBundle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bundleImages = bundle.images.map((i) => i.src);
  const currentImgIndex = bundleImages.length > 0 ? currentImage % bundleImages.length : 0;
  const displayImage = bundleImages[currentImgIndex] || defaultBundle.images[0].src;

  const effectiveSelected = bundle.sizes.some((s) => s.label === selectedBundle)
    ? selectedBundle
    : (bundle.sizes[0]?.label || "");
  const bundleData = bundle.sizes.find((s) => s.label === effectiveSelected) || bundle.sizes[0];
  const bundleSizes = bundle.sizes.map((s) => s.label);

  const grams = sizeGrams(effectiveSelected);

  // Build the per-bundle parts (products + the grams variant they need) + availability.
  const parts: BundlePart[] = [];
  const partStates: { name: string; buyable: boolean; maxBundles: number }[] = [];
  (bundle.products ?? []).forEach((def) => {
    const product = products[def.slug || ""];
    const name = product?.name || def.slug || "Product";
    const qty = Math.max(1, Math.floor(Number(def.quantity)) || 1);
    if (!product) return;
    const variant = findVariantForGrams(product, grams);
    const buyable = isBuyable(product, variant);
    const perUnit = getAvailableQty(product, variant);
    const maxBundles = perUnit > 0 ? Math.floor(perUnit / qty) : 0;
    parts.push({
      productId: product.slug || product._id || "",
      name,
      variantLabel: variant ? variant.label : undefined,
      quantity: qty,
    });
    partStates.push({ name, buyable, maxBundles });
  });

  const anyUnavailable = parts.length > 0 && partStates.some((s) => !s.buyable);
  const maxBundleQty = parts.length > 0 ? Math.min(...partStates.map((s) => s.maxBundles)) : 0;
  const compositionLoaded = parts.length > 0;

  const handleAddBundle = () => {
    if (!bundleData) return;
    if (!compositionLoaded) {
      setError("Bundle products not loaded yet. Please retry.");
      return;
    }
    if (anyUnavailable) {
      const first = partStates.find((s) => !s.buyable);
      toast.error(`${first?.name || "A product"} in this bundle is currently out of stock.`);
      return;
    }
    if (maxBundleQty <= 0) {
      toast.error("This bundle is currently out of stock.");
      return;
    }
    const composition: BundleComposition = {
      bundleId: bundle.bundleId || "trio",
      name: bundle.bundleText.title || "Bundle",
      sizeLabel: effectiveSelected,
      unitPrice: bundleData.price,
      originalPrice: bundleData.price + bundleData.savings,
      image: bundle.images[0]?.src || "",
      parts,
    };
    addBundle(composition);
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % bundleImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + bundleImages.length) % bundleImages.length);

  return (
    <section id="bundles" className="py-24 bg-[#FFF8F0]">
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
                    src={optimizeImageUrl(displayImage, 700) || ""}
                    alt={bundle.bundleText.title || "Bundle"}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Carousel arrows */}
              {bundleImages.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-all hover:scale-105">
                    <ChevronLeft className="h-4 w-4 text-[#1A1A1A]" />
                  </button>
                  <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-all hover:scale-105">
                    <ChevronRight className="h-4 w-4 text-[#1A1A1A]" />
                  </button>
                </>
              )}

              {/* Dots */}
              {bundleImages.length > 1 && (
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
              )}
            </div>

            {/* Content side */}
            <div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
              <span className="inline-block bg-[#DC0218] text-white text-[10px] uppercase tracking-[0.15em] font-semibold px-3 py-1 mb-4 w-fit">
                Best Value
              </span>

              <h2 className="text-3xl md:text-4xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
                {bundle.bundleText.title || "The Trio"}
              </h2>
              <p className="text-[#444444] text-sm mt-2 leading-relaxed">
                {bundle.bundleText.subtitle || "One of each. The best way to find your favourite."}
              </p>
              <p className="text-[#DC0218] text-xs mt-4 font-medium tracking-wide">
                {bundle.bundleText.flavors || "Ghee & Black Pepper · Ghee & Curry Leaf · Coffee Chikki"}
              </p>

              <div className="flex flex-wrap gap-2 mt-6">
                {bundleSizes.map((size) => {
                  const isSelected = effectiveSelected === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedBundle(size)}
                      className={`px-5 py-2.5 text-xs uppercase tracking-[0.06em] font-medium border transition-all duration-200 ${
                        isSelected
                          ? "bg-[#DC0218] text-white border-[#DC0218]"
                          : "bg-white text-[#1A1A1A] border-[rgba(220,2,24,0.2)] hover:border-[#DC0218]"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5 flex items-baseline gap-3"
              >
                <span className="text-2xl font-semibold text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
                  ₹{bundleData?.price ?? 0}
                </span>
                <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider">
                  Save ₹{bundleData?.savings ?? 0}
                </span>
              </motion.div>

              {loading && (
                <p className="mt-4 text-sm text-[#444444] flex items-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-[#DC0218] border-t-transparent rounded-full" />
                  Loading bundle...
                </p>
              )}

              {error && (
                <div className="mt-4 flex items-center justify-between bg-red-50 border border-red-200 p-3">
                  <p className="text-xs text-red-600 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
                  </p>
                  <button onClick={() => { setLoading(true); setError(""); loadBundle(); }} className="text-xs font-medium text-[#DC0218] hover:underline flex items-center gap-1">
                    <RefreshCw className="h-3 w-3" /> Retry
                  </button>
                </div>
              )}

              {!loading && anyUnavailable && (
                <p className="mt-4 text-sm font-medium text-[#DC0218]">
                  One or more products in this bundle are currently out of stock.
                </p>
              )}

              <motion.div whileTap={{ scale: 0.97 }} className="mt-6">
                <Button
                  onClick={handleAddBundle}
                  disabled={loading || !!error || (!loading && anyUnavailable)}
                  className={`w-full md:w-auto btn-small-caps px-10 h-12 rounded-xl transition-all duration-200 ${
                    loading || error || anyUnavailable
                      ? "bg-gray-200 text-[#444444] cursor-not-allowed"
                      : "bg-[#DC0218] hover:bg-[#C70015] text-white shadow-lg shadow-[#DC0218]/20 hover:shadow-[#DC0218]/30"
                  }`}
                >
                  {loading ? (
                    <RefreshCw className="h-3.5 w-3.5 mr-2 animate-spin" />
                  ) : (
                    <ShoppingBag className="h-3.5 w-3.5 mr-2" />
                  )}
                  {anyUnavailable ? "Out of Stock" : "Add Bundle to Cart"}
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
