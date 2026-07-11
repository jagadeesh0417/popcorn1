"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Eye, EyeOff, Star, Pencil, Trash2, Loader2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface AdminProduct {
  _id: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  inStock: boolean;
  isPublished: boolean;
  isBestSeller: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/products").then((r) => r.json()).then((data) => { if (mounted) { setProducts(data); setLoading(false); } }).catch(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

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
            <Button className="bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl shadow-lg shadow-[#DC0218]/20">
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </Button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#DC0218]" />
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
                      <td className="p-4 font-medium text-[#1A1A1A]">{p.name}</td>
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
                          <button className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"><Pencil className="h-4 w-4" /></button>
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
