"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface StoreSettings {
  storeName: string;
  whatsappNumber: string;
  supportEmail: string;
  instagramHandle: string;
  facebookHandle: string;
  gstNumber: string;
  fssaiNumber: string;
  storeTimings: string;
  address: string;
}

const defaults: StoreSettings = {
  storeName: "Poprika",
  whatsappNumber: "8197175807",
  supportEmail: "poprika.official@gmail.com",
  instagramHandle: "@poprika",
  facebookHandle: "",
  gstNumber: "",
  fssaiNumber: "",
  storeTimings: "Mon-Sat: 10 AM - 8 PM",
  address: "#30, Sri Nivasa, RCE Layout, Vijayanagar, Mysore",
};

export default function AdminSettingsGeneralPage() {
  const [form, setForm] = useState<StoreSettings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => {
      if (d?.success && d.data?.business) setForm({ ...defaults, ...d.data.business });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg("");
    try {
      await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "business", value: form }) });
      setMsg("Settings saved!");
    } catch { setMsg("Failed to save"); }
    setSaving(false);
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 pt-20">
        <div className="px-8 py-8">
          <div className="mb-8">
            <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Settings</span>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">General</h1>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[#DC0218]" /></div>
          ) : (
            <>
              {msg && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 text-sm mb-6">{msg}</div>}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(220,2,24,0.08)] max-w-2xl">
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Store Name</label>
                    <input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">WhatsApp Number</label>
                    <input value={form.whatsappNumber} onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Support Email</label>
                    <input value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Instagram Handle</label>
                    <input value={form.instagramHandle} onChange={(e) => setForm({ ...form, instagramHandle: e.target.value })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Facebook Handle</label>
                    <input value={form.facebookHandle} onChange={(e) => setForm({ ...form, facebookHandle: e.target.value })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">GST Number</label>
                    <input value={form.gstNumber} onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">FSSAI Number</label>
                    <input value={form.fssaiNumber} onChange={(e) => setForm({ ...form, fssaiNumber: e.target.value })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Store Timings</label>
                    <input value={form.storeTimings} onChange={(e) => setForm({ ...form, storeTimings: e.target.value })} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-1">Address</label>
                    <textarea value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} className="w-full px-3 py-2 border border-[rgba(220,2,24,0.12)] text-sm" />
                  </div>
                </div>
                <Button onClick={save} disabled={saving} className="mt-6 bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl">
                  <Save className="h-4 w-4 mr-2" /> {saving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
