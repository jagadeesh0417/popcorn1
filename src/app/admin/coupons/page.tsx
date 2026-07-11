"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface Coupon {
  _id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  minAmount: number;
  maxUses: number;
  currentUses: number;
  expiryDate: string;
  isActive: boolean;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", discount: 0, type: "percentage" as "percentage" | "fixed", minAmount: 0, maxUses: 100, expiryDate: "", isActive: true });

  useEffect(() => {
    let mounted = true;
    fetch("/api/coupons").then((r) => r.json()).then((data) => { if (mounted) { setCoupons(data); setLoading(false); } }).catch(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const deleteCoupon = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      }
    } catch {
      console.error("Failed to delete");
    }
  };

  const createCoupon = async () => {
    if (!form.code || !form.discount || !form.expiryDate) return;
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const coupon = await res.json();
        setCoupons((prev) => [coupon, ...prev]);
        setShowForm(false);
        setForm({ code: "", discount: 0, type: "percentage", minAmount: 0, maxUses: 100, expiryDate: "", isActive: true });
      }
    } catch {
      console.error("Failed to create coupon");
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
              <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Coupons</h1>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl">
              <Plus className="h-4 w-4 mr-2" /> Add Coupon
            </Button>
          </div>

          {showForm && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(220,2,24,0.08)] mb-6">
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">New Coupon</h3>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Code</label>
                  <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="POPRIKA20" className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Discount</label>
                  <input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "percentage" | "fixed" })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm">
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Min Amount</label>
                  <input type="number" value={form.minAmount} onChange={(e) => setForm({ ...form, minAmount: Number(e.target.value) })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Max Uses</label>
                  <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Expiry Date</label>
                  <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={createCoupon} className="bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl">Save</Button>
                <Button onClick={() => setShowForm(false)} variant="outline" className="rounded-xl">Cancel</Button>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#DC0218]" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(220,2,24,0.08)]">
              <div className="grid gap-4">
                {coupons.map((c) => (
                  <div key={c._id} className="flex items-center justify-between p-4 border border-[rgba(220,2,24,0.08)] rounded-xl hover:bg-[#FFF8F0]/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-[#DC0218]/5 flex items-center justify-center text-2xl">🎫</div>
                      <div>
                        <p className="font-bold text-[#1A1A1A]">{c.code}</p>
                        <p className="text-sm text-[#444444]">
                          {c.type === "percentage" ? `${c.discount}% off` : `₹${c.discount} off`} · Min. ₹{c.minAmount} · Expires {new Date(c.expiryDate).toLocaleDateString()} · Used {c.currentUses}/{c.maxUses}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`${c.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} text-xs font-medium px-2.5 py-1 rounded-full`}>
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                      <button onClick={() => deleteCoupon(c._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
