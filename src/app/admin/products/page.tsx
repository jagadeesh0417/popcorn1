"use client";

import { useState } from "react";
import { products as initialProducts } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Plus, Eye, EyeOff, Star, Pencil, Trash2 } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts);

  const togglePublish = (id: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p)));
  };

  const toggleBestSeller = (id: string) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, isBestSeller: !p.isBestSeller } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen pt-20 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[#B71C1C] font-semibold text-sm uppercase tracking-[0.2em]">Admin</span>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Products</h1>
          </div>
          <Button className="bg-[#B71C1C] hover:bg-[#8E1414] text-white rounded-xl shadow-lg shadow-[#B71C1C]/20">
            <Plus className="h-4 w-4 mr-2" /> Add Product
          </Button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-[rgba(183,28,28,0.08)] overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(183,28,28,0.08)] text-left text-[#666666]">
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
                <tr key={p.id} className="border-b border-[rgba(183,28,28,0.06)] last:border-0 hover:bg-[#FFF8F0]/50 transition-colors">
                  <td className="p-4 font-medium text-[#1A1A1A]">{p.name}</td>
                  <td className="p-4"><span className="bg-[#FFF8F0] text-[#666666] px-2.5 py-1 rounded-full text-xs">{p.category}</span></td>
                  <td className="p-4 font-medium text-[#B71C1C]">₹{p.price}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {p.inStock ? `${p.stockQuantity} units` : "Out of Stock"}
                    </span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => togglePublish(p.id)} className={`p-1.5 rounded-lg transition-colors ${p.isPublished ? "text-green-600 hover:bg-green-50" : "text-[#666666] hover:bg-gray-50"}`}>
                      {p.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </td>
                  <td className="p-4">
                    <button onClick={() => toggleBestSeller(p.id)} className={`p-1.5 rounded-lg transition-colors ${p.isBestSeller ? "text-[#F9D976] hover:bg-yellow-50" : "text-[#666666] hover:bg-gray-50"}`}>
                      <Star className={`h-4 w-4 ${p.isBestSeller ? "fill-[#F9D976]" : ""}`} />
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
