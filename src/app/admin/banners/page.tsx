"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Loader2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/AdminSidebar";


interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  order: number;
  isActive: boolean;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", subtitle: "", image: "", link: "", isActive: true });

  useEffect(() => {
    let m = true;
    fetch("/api/banners").then((r) => r.json()).then((d) => { if (m) { if (d?.success) setBanners(d.data); setLoading(false); } }).catch(() => { if (m) { setError("Failed to load"); setLoading(false); } });
    return () => { m = false; };
  }, []);

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try { const r = await fetch(`/api/banners/${id}`, { method: "DELETE" }); if (r.ok) setBanners((p) => p.filter((b) => b._id !== id)); } catch { console.error("delete failed"); }
  };

  const saveBanner = async () => {
    if (!form.image) return;
    try {
      const r = await fetch("/api/banners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json();
      if (d?.success) { setBanners((p) => [...p, d.data]); setShowForm(false); setForm({ title: "", subtitle: "", image: "", link: "", isActive: true }); }
    } catch { console.error("save failed"); }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const next = [...banners];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    setBanners(next);
    for (let i = 0; i < next.length; i++) {
      await fetch(`/api/banners/${next[i]._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: i }) });
    }
  };

  const moveDown = async (index: number) => {
    if (index === banners.length - 1) return;
    const next = [...banners];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    setBanners(next);
    for (let i = 0; i < next.length; i++) {
      await fetch(`/api/banners/${next[i]._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ order: i }) });
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
              <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Banners</h1>
              <p className="text-sm text-[#444444] mt-1">Drag to reorder. Banners auto-rotate on the homepage.</p>
            </div>
            <Button onClick={() => setShowForm(!showForm)} className="bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl">
              <Plus className="h-4 w-4 mr-2" /> Add Banner
            </Button>
          </div>

          {showForm && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(220,2,24,0.08)] mb-6">
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">New Banner</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Subtitle</label>
                  <input value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Link (optional)</label>
                  <input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/shop" className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Banner Image URL *</label>
                {form.image && <img src={form.image} alt="" className="w-full h-32 object-cover rounded-lg mb-2 border border-[rgba(220,2,24,0.12)]" />}
                <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://res.cloudinary.com/..." className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveBanner} disabled={!form.image} className="bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl">Save</Button>
                <Button onClick={() => setShowForm(false)} variant="outline" className="rounded-xl">Cancel</Button>
              </div>
            </div>
          )}

          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-6">{error}</div>}
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#DC0218]" /></div>
          ) : banners.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-[rgba(220,2,24,0.08)] text-center"><p className="text-[#444444]">No banners yet.</p></div>
          ) : (
            <div className="space-y-3">
              {banners.map((b, i) => (
                <div key={b._id} className="bg-white rounded-2xl p-4 shadow-sm border border-[rgba(220,2,24,0.08)] flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <button onClick={() => moveUp(i)} disabled={i === 0} className={`p-1 rounded ${i === 0 ? "text-gray-300" : "text-[#444444] hover:bg-gray-100"}`}>▲</button>
                    <span className="text-xs text-center text-[#444444]">{i + 1}</span>
                    <button onClick={() => moveDown(i)} disabled={i === banners.length - 1} className={`p-1 rounded ${i === banners.length - 1 ? "text-gray-300" : "text-[#444444] hover:bg-gray-100"}`}>▼</button>
                  </div>
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-[#FFF8F0] shrink-0">
                    {b.image ? <img src={b.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="h-6 w-6 text-[#444444]" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1A1A1A] truncate">{b.title || "Untitled"}</p>
                    <p className="text-xs text-[#444444] truncate">{b.subtitle || b.link || "No subtitle"}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`${b.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} text-xs px-2.5 py-1 rounded-full`}>{b.isActive ? "Active" : "Inactive"}</span>
                    <button onClick={() => deleteBanner(b._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
