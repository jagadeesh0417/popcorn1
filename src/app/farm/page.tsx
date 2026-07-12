"use client";

import { useState, useEffect, use } from "react";
import { Loader2, ShoppingCart, Minus, Plus, AlertCircle } from "lucide-react";

interface ComboProduct {
  _id: string;
  name: string;
  slug: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  images: string[];
  sizes: { label: string; grams: number; price: number }[];
  inStock: boolean;
}

export default function FarmerPortalPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = use(searchParams);
  const noCode = !code;
  const [products, setProducts] = useState<ComboProduct[]>([]);
  const [loading, setLoading] = useState(!noCode);
  const [error, setError] = useState("");
  const [qrValid, setQrValid] = useState(false);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (noCode || !code) return;
    let m = true;

    fetch("/api/qrcodes").then((r) => r.json()).then((d) => {
      if (!m) return;
      if (!d?.success) { if (!m) return; setError("Invalid QR code"); setLoading(false); return; }
      const qr = d.data.find((q: { code: string; isActive: boolean }) => q.code === code && q.isActive);
      if (!qr) { if (!m) return; setError("This QR code is invalid or has been disabled."); setLoading(false); return; }

      fetch(`/api/qrcodes/${qr._id}/scan`, { method: "POST" }).catch(() => {});

      setQrValid(true);
      fetch("/api/products").then((r2) => r2.json()).then((p) => {
        if (!m) return;
        if (p?.success) setProducts(p.data);
        setLoading(false);
      }).catch(() => { if (m) { setError("Failed to load products"); setLoading(false); } });
    }).catch(() => { if (m) { setError("Failed to verify QR code"); setLoading(false); } });

    return () => { m = false; };
  }, [code, noCode]);

  const updateQty = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalAmount = products.reduce((sum, p) => sum + (quantities[p._id] || 0) * p.price, 0);

  if (noCode) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-[rgba(220,2,24,0.08)] max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Access Denied</h1>
          <p className="text-[#444444]">Invalid access. QR code required.</p>
        </div>
      </div>
    );
  }

  if (!loading && !qrValid) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-[rgba(220,2,24,0.08)] max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">Access Denied</h1>
          <p className="text-[#444444]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
      <div className="bg-[#C70015] text-white text-center py-3 px-4">
        <p className="text-sm font-medium">Poprika Farmer Portal</p>
        <p className="text-[#F9D976] text-xs">Fresh from the farm — wholesale pricing</p>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 pb-28">
        <h2 className="text-xl font-bold text-[#1A1A1A] mb-1">Our Products</h2>
        <p className="text-sm text-[#444444] mb-6">Browse and order our gourmet popcorn collection.</p>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#DC0218]" /></div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {products.filter((p) => p.inStock).map((p) => (
              <div key={p._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[rgba(220,2,24,0.08)]">
                <div className="aspect-square bg-[#FFF8F0] overflow-hidden">
                  {p.images?.[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-[#1A1A1A] text-sm leading-tight mb-1">{p.name}</h3>
                  <p className="text-xs text-[#444444] mb-2 line-clamp-2">{p.tagline || p.sizes?.map((s) => s.label).join(", ") || ""}</p>
                  <p className="text-lg font-bold text-[#DC0218] mb-3">₹{p.price}</p>
                  <div className="flex items-center gap-2">
                    {(quantities[p._id] || 0) === 0 ? (
                      <button onClick={() => updateQty(p._id, 1)} className="flex-1 bg-[#DC0218] text-white py-3 rounded-xl text-sm font-medium active:scale-95 transition-transform touch-manipulation">
                        <ShoppingCart className="h-4 w-4 inline mr-1" /> Add
                      </button>
                    ) : (
                      <div className="flex-1 flex items-center justify-between bg-[#FFF8F0] rounded-xl p-1">
                        <button onClick={() => updateQty(p._id, -1)} className="w-10 h-10 flex items-center justify-center rounded-lg active:bg-gray-200 transition-colors touch-manipulation"><Minus className="h-5 w-5" /></button>
                        <span className="font-bold text-lg min-w-[2rem] text-center">{quantities[p._id]}</span>
                        <button onClick={() => updateQty(p._id, 1)} className="w-10 h-10 flex items-center justify-center rounded-lg active:bg-gray-200 transition-colors touch-manipulation"><Plus className="h-5 w-5" /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[rgba(220,2,24,0.08)] p-4 shadow-xl">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <div>
              <p className="text-sm text-[#444444]">{totalItems} items selected</p>
              <p className="text-xl font-bold text-[#1A1A1A]">₹{totalAmount.toLocaleString()}</p>
            </div>
            <button
              onClick={() => {
                const phone = "918197175807";
                const items = products.filter((p) => (quantities[p._id] || 0) > 0)
                  .map((p) => `• ${p.name} × ${quantities[p._id]} = ₹${(quantities[p._id] * p.price).toLocaleString()}`);
                const msg = `Hi Poprika! I'd like to place a wholesale order:\n\n${items.join("\n")}\n\nTotal: ₹${totalAmount.toLocaleString()}\n\nPlease share the payment details.`;
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
              }}
              className="bg-[#DC0218] text-white px-8 py-3 rounded-xl font-bold text-base active:scale-95 transition-transform touch-manipulation shadow-lg shadow-[#DC0218]/20"
            >
              Order on WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
