"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface Coupon {
  _id: string;
  code: string;
  name: string;
  discount: number;
  type: "percentage" | "flat";
  maxDiscount: number;
  minAmount: number;
  applicableCategories: string[];
  applicableProducts: string[];
  scope: "grocery" | "combo" | "universal";
  expiryDate: string;
  maxUses: number;
  currentUses: number;
  perUserLimit: number;
  isActive: boolean;
  autoApply: boolean;
  firstOrderOnly: boolean;
}

const defaultForm = {
  code: "", name: "", discount: 0, type: "percentage" as "percentage" | "flat",
  maxDiscount: 0, minAmount: 0, applicableCategories: [] as string[],
  applicableProducts: [] as string[], scope: "universal" as "grocery" | "combo" | "universal",
  expiryDate: "", maxUses: 100, perUserLimit: 1, isActive: true, autoApply: false, firstOrderOnly: false,
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    let m = true;
    fetch("/api/coupons").then((r) => r.json()).then((d) => { if (m) { if (d?.success) setCoupons(d.data); setLoading(false); } }).catch(() => { if (m) { setError("Failed to load"); setLoading(false); } });
    return () => { m = false; };
  }, []);

  const deleteCoupon = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try { const r = await fetch(`/api/coupons/${id}`, { method: "DELETE" }); if (r.ok) setCoupons((p) => p.filter((c) => c._id !== id)); } catch { console.error("delete failed"); }
  };

  const saveCoupon = async () => {
    if (!form.code || !form.discount) return;
    try {
      const r = await fetch("/api/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json();
      if (d?.success) { setCoupons((p) => [d.data, ...p]); setShowForm(false); setForm(defaultForm); }
    } catch { console.error("save failed"); }
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
            <Button onClick={() => { setShowForm(!showForm); setForm(defaultForm); }} className="bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl">
              <Plus className="h-4 w-4 mr-2" /> Add Coupon
            </Button>
          </div>

          {showForm && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(220,2,24,0.08)] mb-6">
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">New Coupon</h3>
              <div className="grid sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Code *</label>
                  <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Scope</label>
                  <select value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value as "grocery" | "combo" | "universal" })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm">
                    <option value="universal">Universal</option>
                    <option value="grocery">Grocery only</option>
                    <option value="combo">Combo only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Discount *</label>
                  <input type="number" value={form.discount} onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "percentage" | "flat" })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm">
                    <option value="percentage">Percentage</option>
                    <option value="flat">Flat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Max Discount (0 = unlimited)</label>
                  <input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Min Cart Value</label>
                  <input type="number" value={form.minAmount} onChange={(e) => setForm({ ...form, minAmount: Number(e.target.value) })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Max Uses</label>
                  <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Per User Limit</label>
                  <input type="number" value={form.perUserLimit} onChange={(e) => setForm({ ...form, perUserLimit: Number(e.target.value) })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Expiry Date</label>
                  <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                </div>
                <div className="flex items-end gap-4 pb-2">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.autoApply} onChange={(e) => setForm({ ...form, autoApply: e.target.checked })} /> Auto Apply</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.firstOrderOnly} onChange={(e) => setForm({ ...form, firstOrderOnly: e.target.checked })} /> First Order Only</label>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={saveCoupon} className="bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl">Save</Button>
                <Button onClick={() => setShowForm(false)} variant="outline" className="rounded-xl">Cancel</Button>
              </div>
            </div>
          )}

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-6">{error}</div>}
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#DC0218]" /></div>
          ) : coupons.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-[rgba(220,2,24,0.08)] text-center"><p className="text-[#444444]">No coupons yet.</p></div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(220,2,24,0.08)] overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(220,2,24,0.08)] text-left text-[#444444]">
                    <th className="pb-3 font-medium">Code</th>
                    <th className="pb-3 font-medium">Discount</th>
                    <th className="pb-3 font-medium">Scope</th>
                    <th className="pb-3 font-medium">Usage</th>
                    <th className="pb-3 font-medium">Expires</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c._id} className="border-b border-[rgba(220,2,24,0.06)] last:border-0 hover:bg-[#FFF8F0]/50">
                      <td className="py-3 font-bold text-[#1A1A1A]">{c.code}</td>
                      <td className="py-3">{c.type === "percentage" ? `${c.discount}%` : `₹${c.discount}`}</td>
                      <td className="py-3"><span className="text-xs bg-[#FFF8F0] px-2 py-1 rounded-full">{c.scope}</span></td>
                      <td className="py-3">{c.currentUses}/{c.maxUses}</td>
                      <td className="py-3">{c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : "—"}</td>
                      <td className="py-3"><span className={`${c.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} text-xs px-2.5 py-1 rounded-full`}>{c.isActive ? "Active" : "Inactive"}</span></td>
                      <td className="py-3">
                        <button onClick={() => deleteCoupon(c._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
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
