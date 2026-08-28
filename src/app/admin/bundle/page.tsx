"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Plus, Trash2, Save, Loader2, Upload, AlertCircle, CheckCircle2,
  Minus, Search, ImageOff, PackageSearch,
} from "lucide-react";
import { toast } from "sonner";
import { uploadImages } from "@/lib/upload-image";

interface ProductVariant {
  label: string;
  grams: number;
  price: number;
  stock: number;
  inStock: boolean;
}

interface StockProduct {
  _id: string;
  slug: string;
  name: string;
  price: number;
  stockQuantity: number;
  inStock: boolean;
  isPublished: boolean;
  category: string;
  images?: string[];
  sizes?: ProductVariant[];
  variants?: ProductVariant[];
}

interface BundlePartDef {
  slug: string;
  quantity: number;
}

interface BundleImage {
  id: string;
  src: string;
}

const GRAM_PRESETS = [50, 80, 100, 150, 200, 250];

function gramsFromLabel(label: string): number {
  const digits = String(label || "").replace(/[^0-9]/g, "");
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

function normalizeVariants(p?: StockProduct): ProductVariant[] {
  if (Array.isArray(p?.sizes) && p.sizes.length > 0) return p!.sizes;
  if (Array.isArray(p?.variants) && p.variants.length > 0) return p!.variants;
  return [];
}

function variantForGrams(p: StockProduct, grams: number): ProductVariant | null {
  const variants = normalizeVariants(p);
  const exact = variants.find((v) => Math.floor(Number(v.grams)) === grams);
  if (exact) return exact;
  const byLabel = variants.find((v) => String(v.label).toLowerCase() === `${grams}g`);
  return byLabel || null;
}

function resolvePartAvailability(p: StockProduct, grams: number) {
  const variants = normalizeVariants(p);
  // Availability is gated by the top-level product kill-switch for every purchase
  // path, so it is checked first regardless of variant.
  if (p.inStock === false || p.isPublished === false) {
    return { available: false, reason: "Not available", unitStock: 0 };
  }
  if (variants.length > 0) {
    const v = variantForGrams(p, grams);
    if (!v) return { available: false, reason: `No ${grams}g size`, unitStock: 0 };
    if (v.inStock === false || v.stock <= 0) {
      return { available: false, reason: `Out of stock (${v.label})`, unitStock: 0 };
    }
    return { available: true, reason: "", unitStock: v.stock, variant: v };
  }
  if (p.stockQuantity <= 0) return { available: false, reason: "Out of stock", unitStock: 0 };
  return { available: true, reason: "", unitStock: p.stockQuantity };
}

export default function AdminBundlePage() {
  const [name, setName] = useState("The Trio");
  const [subtitle, setSubtitle] = useState("One of each. The best way to find your favourite.");
  const [flavors, setFlavors] = useState("");
  const [grams, setGrams] = useState(80);
  const [price, setPrice] = useState<number>(449);
  const [discount, setDiscount] = useState<number>(50);
  const [image, setImage] = useState<BundleImage | null>(null);
  const [parts, setParts] = useState<BundlePartDef[]>([
    { slug: "ghee-black-pepper", quantity: 1 },
    { slug: "ghee-curry-leaf", quantity: 1 },
    { slug: "coffee-chikki", quantity: 1 },
  ]);

  const [stock, setStock] = useState<StockProduct[]>([]);
  const [loadingStock, setLoadingStock] = useState(true);
  const [stockError, setStockError] = useState("");
  const [loaded, setLoaded] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("");
  const [addError, setAddError] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");
  const addInputRef = useRef<HTMLInputElement>(null);

  const bundleId = "trio";

  // Load existing bundle config + current stock catalogue in parallel.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingStock(true);
      setStockError("");
      try {
        const [settingsRes, productRes] = await Promise.all([
          fetch("/api/settings?key=bundle&fresh=1"),
          fetch("/api/products?admin=1&fresh=1"),
        ]);
        const settingsData = await settingsRes.json();
        const productData = await productRes.json();

        if (!productData?.success) {
          setStockError("Unable to load products. Please try again.");
          return;
        }
        const list = (productData.data as StockProduct[]).filter(Boolean);
        if (!cancelled) setStock(list);

        let cfg: Record<string, unknown> | null = null;
        if (settingsData?.success && settingsData.data?.value) {
          cfg = settingsData.data.value as Record<string, unknown>;
        }
        if (cfg && !cancelled) {
          const bt = (cfg.bundleText as Record<string, unknown>) || {};
          const sizes = Array.isArray(cfg.sizes) ? (cfg.sizes as Record<string, unknown>[]) : [];
          const size = sizes[0] || {};
          const images = Array.isArray(cfg.images) ? (cfg.images as BundleImage[]) : [];
          const prods = Array.isArray(cfg.products) ? (cfg.products as BundlePartDef[]) : [];

          if (typeof bt.title === "string" && bt.title.trim()) setName(bt.title);
          if (typeof bt.subtitle === "string") setSubtitle(bt.subtitle);
          if (typeof bt.flavors === "string") setFlavors(bt.flavors);
          const g = typeof size.label === "string" ? gramsFromLabel(size.label) : 0;
          if (g > 0) setGrams(g);
          const p = Number(size.price);
          const s = Number(size.savings);
          if (Number.isFinite(p) && p > 0) setPrice(p);
          if (Number.isFinite(s) && s >= 0) setDiscount(s);
          if (images.length > 0) setImage(images[0]);
          if (prods.length > 0) setParts(prods.map((x) => ({ slug: x.slug, quantity: Math.max(1, Math.floor(Number(x.quantity)) || 1) })));
        }
      } catch {
        if (!cancelled) setStockError("Unable to load products. Please try again.");
      } finally {
        if (!cancelled) setLoadingStock(false);
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const productBySlug = (slug: string) => stock.find((s) => s.slug === slug);

  const filteredStock = (() => {
    const term = search.trim().toLowerCase();
    const listed = stock.filter(
      (p) => !term || p.name.toLowerCase().includes(term) || p.slug.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
    );
    // Keep a stable order: in-stock first, then out-of-stock, then name.
    return [...listed].sort((a, b) => {
      const aAvail = resolvePartAvailability(a, grams).available ? 0 : 1;
      const bAvail = resolvePartAvailability(b, grams).available ? 0 : 1;
      return aAvail - bAvail || a.name.localeCompare(b.name);
    });
  })();

  const resultOf = (slug: string) => {
    const p = productBySlug(slug);
    if (!p) return { available: false, reason: "Not found", unitStock: 0 };
    return resolvePartAvailability(p, grams);
  };

  const addToBundle = (slug: string) => {
    setAddError("");
    const p = productBySlug(slug);
    if (!p) { setAddError("Product not found."); return; }
    const av = resolvePartAvailability(p, grams);
    if (!av.available) { setAddError(`${p.name}: ${av.reason}.`); return; }
    const existing = parts.find((x) => x.slug === slug);
    if (existing) {
      const nextQty = existing.quantity + 1;
      if (av.unitStock < nextQty) {
        setAddError(`Only ${av.unitStock} units available.`);
        return;
      }
      setParts(parts.map((x) => (x.slug === slug ? { ...x, quantity: nextQty } : x)));
      toast.success(`${p.name} quantity increased to ${nextQty}`);
      return;
    }
    setParts([...parts, { slug, quantity: 1 }]);
    toast.success(`${p.name} added to bundle`);
  };

  const updateQty = (slug: string, qty: number) => {
    const clamped = Math.max(1, Math.floor(qty) || 1);
    const av = resultOf(slug);
    if (av.available && av.unitStock > 0 && clamped > av.unitStock) {
      setFieldErrors((prev) => ({ ...prev, [`qty-${slug}`]: `Only ${av.unitStock} units available.` }));
      return;
    }
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[`qty-${slug}`];
      return next;
    });
    setParts(parts.map((x) => (x.slug === slug ? { ...x, quantity: clamped } : x)));
  };

  const removePart = (slug: string) => {
    setParts(parts.filter((x) => x.slug !== slug));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[`qty-${slug}`];
      return next;
    });
  };

  // ---- Image upload (single) ----
  const handleImageFiles = async (files: File[]) => {
    const file = files[0];
    if (!file || uploading) return;
    setUploadError("");
    setUploading(true);
    setUploadProgress(0);
    try {
      const { urls, errors, rejected } = await uploadImages([file], 0, (_i, pct) => setUploadProgress(pct));
      const allErrors = [...rejected, ...errors];
      if (urls.length > 0) {
        setImage({ id: `${Date.now()}-${Math.random()}`, src: urls[0] });
        toast.success("Image uploaded");
      }
      if (allErrors.length > 0) setUploadError(allErrors[0]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const startImagePick = () => addInputRef.current?.click();

  // ---- Validation + save ----
  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = "Bundle name is required.";
    if (!Number.isFinite(price) || price <= 0) errors.price = "Enter a valid price.";
    if (!Number.isFinite(discount) || discount < 0) errors.discount = "Discount cannot be negative.";
    if (discount > price) errors.discount = "Discount cannot exceed the price.";
    if (!image) errors.image = "Please upload a bundle image.";
    if (parts.length === 0) errors.products = "Add at least one product.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (uploading) return;
    if (loaded && parts.length === 0) {
      setAddError("Add at least one product to the bundle.");
      return;
    }
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        bundleId,
        images: image ? [image] : [],
        sizes: [{ label: `All ${grams}g`, price, savings: Math.round(discount) }],
        bundleText: { title: name.trim(), subtitle, flavors },
        products: parts.map((p) => ({ slug: p.slug, quantity: p.quantity })),
      };
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "bundle", value: payload }),
      });
      if (res.ok) {
        toast.success("Bundle saved successfully!");
      } else {
        let msg = "Unable to save bundle. Please try again.";
        try { const e = await res.json(); if (e?.error) msg = e.error; } catch {}
        toast.error(msg);
      }
    } catch {
      toast.error("Unable to save bundle. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const selectedProducts = parts.map((p) => {
    const prod = productBySlug(p.slug);
    const av = prod ? resolvePartAvailability(prod, grams) : { available: false, reason: "Not found", unitStock: 0 };
    return {
      ...p,
      product: prod ?? null,
      av: av as { available: boolean; reason: string; unitStock: number; variant?: ProductVariant },
    };
  });

  const youSave = Math.min(discount, price);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFFDF9] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 pt-20">
        <div className="px-4 sm:px-8 py-8 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Admin / Bundles</span>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Bundle Builder</h1>
          </motion.div>

          {/* BASIC INFORMATION */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm mt-8">
            <h3 className="font-bold text-lg text-[#1A1A1A] mb-5">Basic Information</h3>
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[#1A1A1A]">1. Bundle Name <span className="text-[#DC0218]">*</span></Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="The Trio"
                  className="bg-white border-[rgba(220,2,24,0.12)]" />
                {fieldErrors.name && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{fieldErrors.name}</p>}
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-[#1A1A1A]">2. Bundle Price (₹) <span className="text-[#DC0218]">*</span></Label>
                  <Input type="number" min={0} value={price || ""} placeholder="449"
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="bg-white border-[rgba(220,2,24,0.12)]" />
                  {fieldErrors.price && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{fieldErrors.price}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-[#1A1A1A]">3. Discount (₹) <span className="text-[#DC0218]">*</span></Label>
                  <Input type="number" min={0} value={discount || ""} placeholder="50"
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="bg-white border-[rgba(220,2,24,0.12)]" />
                  {fieldErrors.discount && <p className="text-xs text-red-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{fieldErrors.discount}</p>}
                  {Number.isFinite(discount) && discount > 0 && (
                    <p className="text-xs text-green-600">
                      <CheckCircle2 className="h-3 w-3 inline mr-1" />
                      You Save: ₹{youSave} (Original ₹{price + youSave})
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#1A1A1A]">Bundle Size (grams per product)</Label>
                <p className="text-xs text-[#666666]">The per-product size used to validate stock for every selected item.</p>
                <div className="flex flex-wrap gap-2">
                  {GRAM_PRESETS.map((g) => (
                    <button key={g} onClick={() => setGrams(g)}
                      className={`px-4 py-2 text-xs uppercase tracking-[0.06em] font-medium border transition-all ${
                        grams === g ? "bg-[#DC0218] text-white border-[#DC0218]" : "bg-white text-[#1A1A1A] border-[rgba(220,2,24,0.2)] hover:border-[#DC0218]"
                      }`}>
                      {g}g
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 border-t border-[rgba(220,2,24,0.06)] pt-5">
                <div className="space-y-2">
                  <Label className="text-[#1A1A1A]">Subtitle <span className="text-[#999999]">(storefront)</span></Label>
                  <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="bg-white border-[rgba(220,2,24,0.12)]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[#1A1A1A]">Flavors <span className="text-[#999999]">(storefront)</span></Label>
                  <Input value={flavors} onChange={(e) => setFlavors(e.target.value)} className="bg-white border-[rgba(220,2,24,0.12)]" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* BUNDLE IMAGE */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm mt-6">
            <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">4. Bundle Image <span className="text-[#DC0218]">*</span></h3>
            <input
              ref={addInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={(e) => { const f = Array.from(e.target.files || []); e.target.value = ""; void handleImageFiles(f); }}
              className="hidden"
            />
            {uploadError && (
              <p className="text-xs text-red-600 flex items-center gap-1 mb-3"><AlertCircle className="h-3 w-3" />{uploadError}</p>
            )}
            {fieldErrors.image && (
              <p className="text-xs text-red-600 flex items-center gap-1 mb-3"><AlertCircle className="h-3 w-3" />{fieldErrors.image}</p>
            )}
            {image ? (
              <div className="flex items-center gap-4">
                <div className="relative w-40 h-40 bg-[#FFF8F0] border border-[rgba(220,2,24,0.12)] overflow-hidden shrink-0">
                  <img src={image.src} alt="Bundle preview" className="w-full h-full object-cover" />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1">
                      <Loader2 className="h-5 w-5 text-white animate-spin" />
                      <span className="text-white text-[10px] font-medium">{uploadProgress}%</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button onClick={startImagePick} disabled={uploading} className="bg-[#DC0218] hover:bg-[#C70015] text-white text-xs h-9">
                    {uploading ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <Upload className="h-3.5 w-3.5 mr-1" />}
                    {uploading ? "Uploading..." : "Replace Image"}
                  </Button>
                  <Button onClick={() => setImage(null)} variant="outline" className="text-xs h-9 text-red-600 border-red-200 hover:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                  </Button>
                </div>
              </div>
            ) : (
              <button onClick={startImagePick} disabled={uploading}
                className="w-full flex items-center justify-center gap-2 py-10 border-2 border-dashed border-[rgba(220,2,24,0.2)] text-[#DC0218] text-sm font-medium hover:bg-[#FFF8F0] transition-colors">
                {uploading
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Uploading {uploadProgress}%...</>
                  : <><ImageOff className="h-4 w-4" /> Upload Bundle Image</>}
              </button>
            )}
          </motion.div>

          {/* BUNDLE PRODUCTS */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm mt-6">
            <h3 className="font-bold text-lg text-[#1A1A1A] mb-1">5. Select Products From Stock</h3>
            <p className="text-xs text-[#666666] mb-4">Pick products from the current catalogue. Quantities are per bundle.</p>

            {fieldErrors.products && (
              <p className="text-xs text-red-600 flex items-center gap-1 mb-3"><AlertCircle className="h-3 w-3" />{fieldErrors.products}</p>
            )}
            {addError && (
              <p className="text-xs text-red-600 flex items-center gap-1 mb-3"><AlertCircle className="h-3 w-3" />{addError}</p>
            )}

            {loadingStock ? (
              <div className="flex items-center gap-2 text-sm text-[#444444] py-6">
                <Loader2 className="h-4 w-4 animate-spin text-[#DC0218]" /> Loading stock...
              </div>
            ) : stockError ? (
              <div className="flex items-center justify-between bg-red-50 border border-red-200 p-3">
                <p className="text-xs text-red-600 flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5" />{stockError}</p>
                <button onClick={() => window.location.reload()} className="text-xs font-medium text-[#DC0218] hover:underline">Retry</button>
              </div>
            ) : (
              <>
                {/* Search + select */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#999999]" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
                      className="bg-white border-[rgba(220,2,24,0.12)] pl-9" />
                  </div>
                  <select
                    value={selectedSlug}
                    onChange={(e) => setSelectedSlug(e.target.value)}
                    className="bg-white border border-[rgba(220,2,24,0.12)] h-10 text-sm px-3 flex-1 sm:flex-none sm:min-w-[16rem]"
                  >
                    <option value="">Select Product</option>
                    {filteredStock.map((p) => {
                      const av = resolvePartAvailability(p, grams);
                      return (
                        <option key={p.slug} value={p.slug} disabled={!av.available}>
                          {p.name} {av.available ? "" : `— ${av.reason}`}
                        </option>
                      );
                    })}
                  </select>
                  <Button onClick={() => { if (selectedSlug) { addToBundle(selectedSlug); setSelectedSlug(""); } }}
                    disabled={!selectedSlug}
                    className="bg-[#DC0218] hover:bg-[#C70015] text-white text-sm h-10">
                    <Plus className="h-4 w-4 mr-1" /> Add Product
                  </Button>
                </div>

                {/* Quick-select chips (in-stock first) */}
                {filteredStock.length > 0 && (
                  <div className="mt-3">
                    <p className="text-[10px] uppercase tracking-[0.08em] text-[#999999] mb-2">Quick add</p>
                    <div className="flex flex-wrap gap-2">
                      {filteredStock.slice(0, 8).map((p) => {
                        const av = resolvePartAvailability(p, grams);
                        return (
                          <button key={p.slug} onClick={() => av.available && addToBundle(p.slug)} disabled={!av.available}
                            className={`text-xs px-3 py-1.5 border transition-colors ${
                              av.available
                                ? "border-[rgba(220,2,24,0.2)] text-[#DC0218] hover:bg-[#FFF8F0]"
                                : "border-[rgba(0,0,0,0.06)] text-[#999999] cursor-not-allowed line-through"
                            }`}>
                            {p.name} {av.available ? `· ${av.variant ? av.variant.label : `${grams}g`}` : `· ${av.reason}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Selected products */}
            <div className="mt-5">
              <p className="text-[10px] uppercase tracking-[0.08em] text-[#999999] mb-2">Selected Products ({selectedProducts.length})</p>
              {selectedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-[rgba(0,0,0,0.08)]">
                  <PackageSearch className="h-6 w-6 text-[#999999] mb-2" />
                  <p className="text-xs text-[#666666]">No products added yet. Search and add products to build the bundle.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence initial={false}>
                    {selectedProducts.map((sp) => (
                      <motion.div key={sp.slug} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-3 bg-white p-3 border border-[rgba(220,2,24,0.06)]">
                        <div className="w-12 h-12 bg-[#FFF8F0] overflow-hidden shrink-0">
                          {sp.product?.images?.[0] ? (
                            <img src={sp.product.images[0]} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#999999] text-xs"><PackageSearch className="h-4 w-4" /></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#1A1A1A] truncate">{sp.product?.name || sp.slug}</p>
                          <p className="text-xs text-[#666666]">
                            {sp.av.variant ? `${sp.av.variant.label} · ₹${sp.av.variant.price}` : `${grams}g`}
                            {" · "}
                            <span className={sp.av.available ? "text-green-600" : "text-red-600"}>
                              {sp.av.available ? `Stock: ${sp.av.unitStock}` : sp.av.reason}
                            </span>
                          </p>
                          {fieldErrors[`qty-${sp.slug}`] && (
                            <p className="text-xs text-red-600"><AlertCircle className="h-3 w-3 inline mr-1" />{fieldErrors[`qty-${sp.slug}`]}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={() => updateQty(sp.slug, sp.quantity - 1)} className="w-7 h-7 border border-[rgba(220,2,24,0.2)] text-[#DC0218] hover:bg-[#FFF8F0] flex items-center justify-center">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-[#1A1A1A]">{sp.quantity}</span>
                          <button onClick={() => updateQty(sp.slug, sp.quantity + 1)} disabled={!sp.av.available || sp.quantity >= sp.av.unitStock}
                            className={`w-7 h-7 border flex items-center justify-center ${sp.av.available && sp.quantity < sp.av.unitStock ? "border-[rgba(220,2,24,0.2)] text-[#DC0218] hover:bg-[#FFF8F0]" : "border-[rgba(0,0,0,0.06)] text-[#999999] cursor-not-allowed"}`}>
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <button onClick={() => removePart(sp.slug)} className="p-1.5 text-[#666666] hover:text-red-500 transition-colors shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>

          {/* BUNDLE PREVIEW */}
          {loaded && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-gradient-to-b from-white to-[#FFF8F0] p-6 border border-[rgba(220,2,24,0.1)] shadow-sm mt-6">
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">Bundle Preview</h3>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="w-36 h-36 bg-[#FFFDF9] border border-[rgba(220,2,24,0.1)] overflow-hidden shrink-0">
                  {image ? (
                    <img src={image.src} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#999999]"><ImageOff className="h-6 w-6" /></div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-xl font-bold text-[#1A1A1A]">{name.trim() || "Untitled Bundle"}</p>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-2xl font-semibold text-[#1A1A1A]">₹{Number.isFinite(price) ? price : 0}</span>
                    {youSave > 0 && (
                      <span className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider">Save ₹{youSave}</span>
                    )}
                  </div>
                  <p className="text-xs text-[#666666] mt-1">Each product at {grams}g</p>
                  <div className="mt-4">
                    <p className="text-[10px] uppercase tracking-[0.08em] text-[#999999] mb-1">Products</p>
                    <ul className="space-y-1">
                      {selectedProducts.map((sp) => (
                        <li key={sp.slug} className="text-sm text-[#444444] flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#DC0218] shrink-0" />
                          <span>{sp.product?.name || sp.slug} ×{sp.quantity}</span>
                          {!sp.av.available && <span className="text-xs text-red-600">({sp.av.reason})</span>}
                        </li>
                      ))}
                      {selectedProducts.length === 0 && <li className="text-xs text-[#999999]">No products selected.</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* SAVE */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="mt-8 flex justify-end">
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
              <Button onClick={handleSave} disabled={saving || uploading} className="bg-[#DC0218] hover:bg-[#C70015] text-white px-8 h-12 shadow-lg shadow-[#DC0218]/20">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {saving ? "Saving..." : "Save Bundle"}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
