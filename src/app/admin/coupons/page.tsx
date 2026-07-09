"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { coupons as initialCoupons } from "@/lib/data";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState(initialCoupons);

  const deleteCoupon = (code: string) => {
    setCoupons((prev) => prev.filter((c) => c.code !== code));
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
            <Button className="bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl">
              <Plus className="h-4 w-4 mr-2" /> Add Coupon
            </Button>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(220,2,24,0.08)]">
            <div className="grid gap-4">
              {coupons.map((c) => (
                <div key={c.code} className="flex items-center justify-between p-4 border border-[rgba(220,2,24,0.08)] rounded-xl hover:bg-[#FFF8F0]/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#DC0218]/5 flex items-center justify-center text-2xl">🎫</div>
                    <div>
                      <p className="font-bold text-[#1A1A1A]">{c.code}</p>
                      <p className="text-sm text-[#666666]">
                        {c.type === "percentage" ? `${c.discount}% off` : `₹${c.discount} off`} · Min. ₹{c.minAmount} · Expires {c.expiryDate} · Used {c.currentUses}/{c.maxUses}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">Active</span>
                    <button onClick={() => deleteCoupon(c.code)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
