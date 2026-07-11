"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  weight: string;
  price: number;
  stockQuantity: number;
  inStock: boolean;
}

export default function AdminInventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    fetch("/api/inventory").then((r) => r.json()).then((data) => { if (mounted) { if (Array.isArray(data)) setItems(data); setLoading(false); } }).catch(() => { if (mounted) { setError("Failed to load inventory"); setLoading(false); } });
    return () => { mounted = false; };
  }, []);

  const updateStock = async (id: string, stockQuantity: number) => {
    try {
      const res = await fetch("/api/inventory", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, stockQuantity, inStock: stockQuantity > 0 }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((item) => (item._id === id ? { ...item, stockQuantity, inStock: stockQuantity > 0 } : item))
        );
      }
    } catch {
      console.error("Failed to update stock");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 pt-20">
        <div className="px-8 py-8">
          <div className="mb-8">
            <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Admin</span>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Inventory</h1>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-6">{error}</div>}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#DC0218]" />
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-[rgba(220,2,24,0.08)] text-center">
              <p className="text-[#444444]">No products in inventory. Add products to see inventory data.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(220,2,24,0.08)] overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(220,2,24,0.08)] text-left text-[#444444]">
                    <th className="pb-3 font-medium">Product</th>
                    <th className="pb-3 font-medium">Category</th>
                    <th className="pb-3 font-medium">Weight</th>
                    <th className="pb-3 font-medium">Price</th>
                    <th className="pb-3 font-medium">Stock</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => {
                    const maxStock = Math.max(p.stockQuantity, 200);
                    return (
                      <tr key={p._id} className="border-b border-[rgba(220,2,24,0.06)] last:border-0">
                        <td className="py-3 font-medium text-[#1A1A1A]">{p.name}</td>
                        <td className="py-3 text-[#444444]">{p.category}</td>
                        <td className="py-3 text-[#444444]">{p.weight}</td>
                        <td className="py-3 font-medium text-[#DC0218]">₹{p.price}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              value={p.stockQuantity}
                              onChange={(e) => updateStock(p._id, Number(e.target.value))}
                              className="w-20 px-2 py-1 border border-[rgba(220,2,24,0.12)] text-sm text-center"
                              min={0}
                            />
                            <div className="w-full bg-[#FFF8F0] rounded-full h-2 max-w-[120px]">
                              <div className="bg-[#DC0218] h-2 rounded-full" style={{ width: `${Math.min(100, (p.stockQuantity / maxStock) * 100)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.stockQuantity > 50 ? "bg-green-100 text-green-700" : p.stockQuantity > 10 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                            {p.stockQuantity > 50 ? "In Stock" : p.stockQuantity > 10 ? "Low Stock" : "Critical"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
