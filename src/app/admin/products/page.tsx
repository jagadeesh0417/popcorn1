"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Eye, EyeOff, Star, Pencil, Trash2, Loader2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ImageUploader } from "@/components/admin/ImageUploader";

interface VariantForm {
  label: string; grams: number; price: number; originalPrice: number; discount: number;
  sku: string; barcode: string; stock: number; inStock: boolean; isDefault: boolean; displayOrder: number;
}

interface AdminProduct {
  _id: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  inStock: boolean;
  isPublished: boolean;
  isBestSeller: boolean;
  images?: string[];
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const defaultVariant = (overrides?: Partial<VariantForm>): VariantForm => ({
  label: "", grams: 0, price: 0, originalPrice: 0, discount: 0,
  sku: "", barcode: "", stock: 100, inStock: true, isDefault: false, displayOrder: 0,
  ...overrides,
});

function variantDisplayPrice(v: VariantForm) {
  if (v.originalPrice && v.originalPrice > v.price) return { price: v.price, original: v.originalPrice, discount: Math.round((1 - v.price / v.originalPrice) * 100) };
  if (v.discount && v.originalPrice) return { price: Math.round(v.originalPrice * (1 - v.discount / 100)), original: v.originalPrice, discount: v.discount };
  return { price: v.price, original: v.originalPrice || 0, discount: v.discount || 0 };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", tagline: "", description: "", shortDescription: "", price: 0, originalPrice: 0,
    category: "Classic", tags: "", ingredients: "", images: [] as string[], weight: "200g",
    stockQuantity: 100, inStock: true, isPublished: true, isBestSeller: false,
    sizes: [defaultVariant({ label: "80g", grams: 80, price: 149, displayOrder: 0 })],
    nutrition: { servingSize: "28g (1 cup)", calories: 0, totalFat: "0g", saturatedFat: "0g", transFat: "0g", cholesterol: "0mg", sodium: "0mg", totalCarb: "0g", fiber: "0g", sugar: "0g", protein: "0g" },
  });

  useEffect(() => {
    let mounted = true;
    fetch("/api/products").then((r) => r.json()).then((data) => { if (mounted) { if (data?.success) setProducts(data.data); else setError(data?.error || "Failed to load products"); setLoading(false); } }).catch(() => { if (mounted) { setError("Failed to load products"); setLoading(false); } });
    return () => { mounted = false; };
  }, []);

  const resetForm = () => {
    setForm({ name: "", slug: "", tagline: "", description: "", shortDescription: "", price: 0, originalPrice: 0, category: "Classic", tags: "", ingredients: "", images: [], weight: "200g", stockQuantity: 100, inStock: true, isPublished: true, isBestSeller: false, sizes: [defaultVariant({ label: "80g", grams: 80, price: 149, displayOrder: 0 })], nutrition: { servingSize: "28g (1 cup)", calories: 0, totalFat: "0g", saturatedFat: "0g", transFat: "0g", cholesterol: "0mg", sodium: "0mg", totalCarb: "0g", fiber: "0g", sugar: "0g", protein: "0g" } });
    setError("");
    setEditingId(null);
  };

  const startEdit = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/products/${id}`);
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      const p = result.data;
      setForm({
        name: p.name || "", slug: p.slug || "", tagline: p.tagline || "",
        description: p.description || "", shortDescription: p.shortDescription || "",
        price: p.price || 0, originalPrice: p.originalPrice || 0, category: p.category || "Classic",
        tags: (p.tags || []).join(", "), ingredients: (p.ingredients || []).join(", "),
        images: p.images || [], weight: p.weight || "200g",
        stockQuantity: p.stockQuantity ?? 100, inStock: p.inStock ?? true,
        isPublished: p.isPublished ?? true, isBestSeller: p.isBestSeller ?? false,
        sizes: (p.sizes || []).map((s: Record<string, unknown>) => defaultVariant({
          label: String(s.label || ""), grams: Number(s.grams) || 0, price: Number(s.price) || 0,
          originalPrice: Number(s.originalPrice) || 0, discount: Number(s.discount) || 0,
          sku: String(s.sku || ""), barcode: String(s.barcode || ""),
          stock: Number(s.stock) ?? (Number(s.stockQuantity) ?? 100),
          inStock: s.inStock !== undefined ? Boolean(s.inStock) : true,
          isDefault: Boolean(s.isDefault), displayOrder: Number(s.displayOrder) ?? 0,
        })),
        nutrition: p.nutritionInfo || form.nutrition,
      });
      setEditingId(id);
      setShowForm(true);
      setError("");
    } catch {
      setError("Failed to load product");
    } finally {
      setSaving(false);
    }
  };

  const updateVariant = (i: number, field: keyof VariantForm, value: string | number | boolean) => {
    const sizes = [...form.sizes];
    sizes[i] = { ...sizes[i], [field]: value };
    setForm({ ...form, sizes });
  };

  const addVariant = () => {
    setForm({ ...form, sizes: [...form.sizes, defaultVariant({ displayOrder: form.sizes.length })] });
  };

  const removeVariant = (i: number) => {
    if (form.sizes.length <= 1) return;
    setForm({ ...form, sizes: form.sizes.filter((_, j) => j !== i) });
  };

  const moveVariant = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= form.sizes.length) return;
    const sizes = [...form.sizes];
    [sizes[i], sizes[j]] = [sizes[j], sizes[i]];
    setForm({ ...form, sizes: sizes.map((s, idx) => ({ ...s, displayOrder: idx })) });
  };

  const saveProduct = async () => {
    if (!form.name || !form.slug || !form.price) { setError("Name, slug, and price are required."); return; }
    setSaving(true);
    setError("");
    try {
      const body = {
        name: form.name, slug: form.slug, tagline: form.tagline || undefined,
        description: form.description, shortDescription: form.shortDescription || form.description,
        price: form.price, originalPrice: form.originalPrice || undefined, category: form.category, weight: form.weight,
        sizes: form.sizes.filter((s) => s.label && s.grams && s.price).map((s, idx) => ({ ...s, displayOrder: s.displayOrder ?? idx })),
        stockQuantity: form.stockQuantity, inStock: form.inStock, isPublished: form.isPublished, isBestSeller: form.isBestSeller,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
        ingredients: form.ingredients ? form.ingredients.split(",").map((t) => t.trim()) : [],
        images: form.images,
        nutritionInfo: form.nutrition,
      };

      const url = editingId ? `/api/products/${editingId}` : "/api/products";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (result?.success) {
        const saved = result.data;
        if (editingId) {
          setProducts((prev) => prev.map((p) => (p._id === editingId ? { ...p, ...saved } : p)));
        } else {
          setProducts((prev) => [saved, ...prev]);
        }
        setShowForm(false);
        resetForm();
      } else {
        setError(result.error || "Failed to save product");
      }
    } catch {
      setError("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const toggleField = async (id: string, field: string, value: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (res.ok) {
        setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, [field]: value } : p)));
      }
    } catch {
      console.error("Failed to update");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch {
      console.error("Failed to delete");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const inputClass = "w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm";
  const labelClass = "block text-xs font-medium text-[#1A1A1A] mb-1";

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 pt-20">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Admin</span>
              <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Products</h1>
            </div>
            <Button onClick={() => { setShowForm(!showForm); if (!showForm) resetForm(); }} className="bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl shadow-lg shadow-[#DC0218]/20">
              <Plus className="h-4 w-4 mr-2" /> {showForm ? "Cancel" : "Add Product"}
            </Button>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-6">{error}</div>}

          {showForm && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(220,2,24,0.08)] mb-8">
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-5">{editingId ? "Edit Product" : "New Product"}</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editingId ? form.slug : slugify(e.target.value) })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Slug *</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Tagline</label>
                  <input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="e.g. One spice, done right." className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Default Price (₹) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Default Original Price (₹)</label>
                  <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Weight</label>
                  <input value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Stock Quantity</label>
                  <input type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: Number(e.target.value) })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>In Stock</label>
                  <select value={form.inStock ? "true" : "false"} onChange={(e) => setForm({ ...form, inStock: e.target.value === "true" })} className={inputClass}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Published</label>
                  <select value={form.isPublished ? "true" : "false"} onChange={(e) => setForm({ ...form, isPublished: e.target.value === "true" })} className={inputClass}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Best Seller</label>
                  <select value={form.isBestSeller ? "true" : "false"} onChange={(e) => setForm({ ...form, isBestSeller: e.target.value === "true" })} className={inputClass}>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Short Description</label>
                  <textarea value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} rows={2} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputClass} />
                </div>
              </div>

              {/* Variants Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-[#1A1A1A]">Variants (Weights & Pricing)</label>
                  <div className="flex gap-2">
                    <span className="text-xs text-[#444444]">{form.sizes.length} variant{form.sizes.length !== 1 ? "s" : ""}</span>
                    <Button type="button" onClick={addVariant} size="sm" variant="outline" className="h-7 text-xs border-[rgba(220,2,24,0.2)]">
                      <Plus className="h-3 w-3 mr-1" /> Add Variant
                    </Button>
                  </div>
                </div>
                {form.sizes.map((v, i) => {
                  const dp = variantDisplayPrice(v);
                  return (
                    <div key={i} className="border border-[rgba(220,2,24,0.1)] bg-[#FFF8F0] mb-3 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-[#DC0218] bg-white px-2 py-0.5 border border-[rgba(220,2,24,0.15)]">Variant #{i + 1}</span>
                          {dp.original > dp.price && (
                            <span className="text-xs text-green-600 font-medium">
                              {dp.discount}% off — ₹{dp.price} <span className="line-through text-[#444444]">₹{dp.original}</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => moveVariant(i, -1)} disabled={i === 0} className="p-1 text-[#444444] hover:text-[#DC0218] disabled:opacity-30"><span className="text-sm">▲</span></button>
                          <button onClick={() => moveVariant(i, 1)} disabled={i === form.sizes.length - 1} className="p-1 text-[#444444] hover:text-[#DC0218] disabled:opacity-30"><span className="text-sm">▼</span></button>
                          <button onClick={() => removeVariant(i)} disabled={form.sizes.length <= 1} className="p-1 text-red-500 hover:bg-red-50 disabled:opacity-30"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                        <div>
                          <label className={labelClass}>Weight/Size *</label>
                          <input value={v.label} onChange={(e) => updateVariant(i, "label", e.target.value)} placeholder="e.g. 500g" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Grams *</label>
                          <input type="number" value={v.grams} onChange={(e) => updateVariant(i, "grams", Number(e.target.value))} placeholder="500" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Selling Price *</label>
                          <input type="number" value={v.price} onChange={(e) => updateVariant(i, "price", Number(e.target.value))} placeholder="249" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>MRP</label>
                          <input type="number" value={v.originalPrice} onChange={(e) => updateVariant(i, "originalPrice", Number(e.target.value))} placeholder="299" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Discount %</label>
                          <input type="number" value={v.discount} onChange={(e) => updateVariant(i, "discount", Number(e.target.value))} placeholder="15" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>SKU</label>
                          <input value={v.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)} placeholder="POP-500G" className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Barcode</label>
                          <input value={v.barcode} onChange={(e) => updateVariant(i, "barcode", e.target.value)} placeholder="890..." className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Stock</label>
                          <input type="number" value={v.stock} onChange={(e) => updateVariant(i, "stock", Number(e.target.value))} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>Display Order</label>
                          <input type="number" value={v.displayOrder} onChange={(e) => updateVariant(i, "displayOrder", Number(e.target.value))} className={inputClass} />
                        </div>
                        <div>
                          <label className={labelClass}>In Stock</label>
                          <select value={v.inStock ? "true" : "false"} onChange={(e) => updateVariant(i, "inStock", e.target.value === "true")} className={inputClass}>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Default</label>
                          <select value={v.isDefault ? "true" : "false"} onChange={(e) => updateVariant(i, "isDefault", e.target.value === "true")} className={inputClass}>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelClass}>Tags (comma separated)</label>
                  <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="spicy, vegan, gluten-free" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Ingredients (comma separated)</label>
                  <input value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} placeholder="corn, butter, salt" className={inputClass} />
                </div>
              </div>
              <div className="mb-4">
                <ImageUploader
                  images={form.images}
                  onChange={(urls) => setForm({ ...form, images: urls })}
                />
              </div>
              <details className="mb-4">
                <summary className="text-sm font-medium text-[#1A1A1A] cursor-pointer">Nutrition Info (optional)</summary>
                <div className="grid sm:grid-cols-3 gap-3 mt-3 p-3 bg-[#FFF8F0]">
                  <div><label className="block text-xs text-[#444444] mb-1">Serving Size</label><input value={form.nutrition.servingSize} onChange={(e) => setForm({ ...form, nutrition: { ...form.nutrition, servingSize: e.target.value } })} className={inputClass} /></div>
                  <div><label className="block text-xs text-[#444444] mb-1">Calories</label><input type="number" value={form.nutrition.calories} onChange={(e) => setForm({ ...form, nutrition: { ...form.nutrition, calories: Number(e.target.value) } })} className={inputClass} /></div>
                  <div><label className="block text-xs text-[#444444] mb-1">Total Fat</label><input value={form.nutrition.totalFat} onChange={(e) => setForm({ ...form, nutrition: { ...form.nutrition, totalFat: e.target.value } })} className={inputClass} /></div>
                  <div><label className="block text-xs text-[#444444] mb-1">Saturated Fat</label><input value={form.nutrition.saturatedFat} onChange={(e) => setForm({ ...form, nutrition: { ...form.nutrition, saturatedFat: e.target.value } })} className={inputClass} /></div>
                  <div><label className="block text-xs text-[#444444] mb-1">Trans Fat</label><input value={form.nutrition.transFat} onChange={(e) => setForm({ ...form, nutrition: { ...form.nutrition, transFat: e.target.value } })} className={inputClass} /></div>
                  <div><label className="block text-xs text-[#444444] mb-1">Cholesterol</label><input value={form.nutrition.cholesterol} onChange={(e) => setForm({ ...form, nutrition: { ...form.nutrition, cholesterol: e.target.value } })} className={inputClass} /></div>
                  <div><label className="block text-xs text-[#444444] mb-1">Sodium</label><input value={form.nutrition.sodium} onChange={(e) => setForm({ ...form, nutrition: { ...form.nutrition, sodium: e.target.value } })} className={inputClass} /></div>
                  <div><label className="block text-xs text-[#444444] mb-1">Total Carbs</label><input value={form.nutrition.totalCarb} onChange={(e) => setForm({ ...form, nutrition: { ...form.nutrition, totalCarb: e.target.value } })} className={inputClass} /></div>
                  <div><label className="block text-xs text-[#444444] mb-1">Fiber</label><input value={form.nutrition.fiber} onChange={(e) => setForm({ ...form, nutrition: { ...form.nutrition, fiber: e.target.value } })} className={inputClass} /></div>
                  <div><label className="block text-xs text-[#444444] mb-1">Sugar</label><input value={form.nutrition.sugar} onChange={(e) => setForm({ ...form, nutrition: { ...form.nutrition, sugar: e.target.value } })} className={inputClass} /></div>
                  <div><label className="block text-xs text-[#444444] mb-1">Protein</label><input value={form.nutrition.protein} onChange={(e) => setForm({ ...form, nutrition: { ...form.nutrition, protein: e.target.value } })} className={inputClass} /></div>
                </div>
              </details>
              <div className="flex gap-2">
                <Button onClick={saveProduct} disabled={saving} className="bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl">{saving ? "Saving..." : editingId ? "Update Product" : "Save Product"}</Button>
                <Button onClick={handleCancel} variant="outline" className="rounded-xl">Cancel</Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#DC0218]" />
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-[rgba(220,2,24,0.08)] p-12 text-center">
              <p className="text-[#444444]">No products found. Add your first product to get started.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-[rgba(220,2,24,0.08)] overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(220,2,24,0.08)] text-left text-[#444444]">
                    <th className="p-4 font-medium">Name</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Stock</th>
                    <th className="p-4 font-medium">Published</th>
                    <th className="p-4 font-medium">Best Seller</th>
                    <th className="p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p._id} className="border-b border-[rgba(220,2,24,0.06)] last:border-0 hover:bg-[#FFF8F0]/50 transition-colors">
                      <td className="p-4 font-medium text-[#1A1A1A]">
                        <div className="flex items-center gap-2">
                          {p.images?.[0] && (
                            <img src={p.images[0]} alt="" className="w-8 h-8 rounded object-cover" />
                          )}
                          {p.name}
                        </div>
                      </td>
                      <td className="p-4"><span className="bg-[#FFF8F0] text-[#444444] px-2.5 py-1 rounded-full text-xs">{p.category}</span></td>
                      <td className="p-4 font-medium text-[#DC0218]">₹{p.price}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {p.inStock ? `${p.stockQuantity} units` : "Out of Stock"}
                        </span>
                      </td>
                      <td className="p-4">
                        <button onClick={() => toggleField(p._id, "isPublished", !p.isPublished)} className={`p-1.5 rounded-lg transition-colors ${p.isPublished ? "text-green-600 hover:bg-green-50" : "text-[#444444] hover:bg-gray-50"}`}>
                          {p.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="p-4">
                        <button onClick={() => toggleField(p._id, "isBestSeller", !p.isBestSeller)} className={`p-1.5 rounded-lg transition-colors ${p.isBestSeller ? "text-[#F9D976] hover:bg-yellow-50" : "text-[#444444] hover:bg-gray-50"}`}>
                          <Star className={`h-4 w-4 ${p.isBestSeller ? "fill-[#F9D976]" : ""}`} />
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          <button onClick={() => startEdit(p._id)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => deleteProduct(p._id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
