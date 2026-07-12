"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Truck, Store, Zap, IndianRupee, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ShippingSettings {
  freeShippingEnabled: boolean;
  freeShippingThreshold: number;
  panIndiaShippingEnabled: boolean;
  panIndiaShippingFee: number;
  flatDeliveryCharge: number;
  mysuruPickupEnabled: boolean;
  mysuruPickupFee: number;
  localMysuruDeliveryEnabled: boolean;
  localMysuruDeliveryFee: number;
  expressDeliveryEnabled: boolean;
  expressDeliveryCharge: number;
  codEnabled: boolean;
  codCharge: number;
}

const defaults: ShippingSettings = {
  freeShippingEnabled: true,
  freeShippingThreshold: 500,
  panIndiaShippingEnabled: true,
  panIndiaShippingFee: 80,
  flatDeliveryCharge: 50,
  mysuruPickupEnabled: true,
  mysuruPickupFee: 0,
  localMysuruDeliveryEnabled: true,
  localMysuruDeliveryFee: 20,
  expressDeliveryEnabled: false,
  expressDeliveryCharge: 100,
  codEnabled: true,
  codCharge: 20,
};

export default function AdminShippingSettings() {
  const [settings, setSettings] = useState<ShippingSettings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => {
      if (d?.success && d.data?.shipping) {
        setSettings({ ...defaults, ...d.data.shipping });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggle = (key: keyof ShippingSettings) => {
    if (typeof settings[key] === "boolean") {
      setSettings({ ...settings, [key]: !settings[key] });
    }
  };

  const set = (key: keyof ShippingSettings, value: number | boolean) => {
    setSettings({ ...settings, [key]: value });
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "shipping", value: settings }),
      });
      const d = await res.json();
      if (!d.success) throw new Error("Save failed");
      toast.success("Shipping settings saved!");
    } catch {
      toast.error("Failed to save settings");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex">
        <AdminSidebar />
        <div className="flex-1 ml-64 pt-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#DC0218]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFFDF9] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 pt-20">
        <div className="px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Admin / Settings</span>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Shipping Settings</h1>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            {/* Free Shipping */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-[#DC0218]" />
                  <h3 className="font-bold text-lg text-[#1A1A1A]">Free Shipping</h3>
                </div>
                <button onClick={() => toggle("freeShippingEnabled")}
                  className={`relative w-10 h-5 transition-colors ${settings.freeShippingEnabled ? "bg-[#DC0218]" : "bg-[#E0E0E0]"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white shadow-sm transition-all ${settings.freeShippingEnabled ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-[#1A1A1A] text-xs">Free shipping threshold (₹)</Label>
                  <Input type="number" value={settings.freeShippingThreshold}
                    onChange={(e) => set("freeShippingThreshold", Number(e.target.value))}
                    className="bg-white border-[rgba(220,2,24,0.12)]" />
                </div>
                <p className="text-xs text-[#444444]">
                  Orders at or above ₹{settings.freeShippingThreshold} qualify for free delivery.
                </p>
              </div>
            </motion.div>

            {/* Flat / Pan India */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-[#DC0218]" />
                  <h3 className="font-bold text-lg text-[#1A1A1A]">Delivery Charges</h3>
                </div>
                <button onClick={() => toggle("panIndiaShippingEnabled")}
                  className={`relative w-10 h-5 transition-colors ${settings.panIndiaShippingEnabled ? "bg-[#DC0218]" : "bg-[#E0E0E0]"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 bg-white shadow-sm transition-all ${settings.panIndiaShippingEnabled ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-[#1A1A1A] text-xs">Pan-India shipping fee (₹)</Label>
                  <Input type="number" value={settings.panIndiaShippingFee}
                    onChange={(e) => set("panIndiaShippingFee", Number(e.target.value))}
                    className="bg-white border-[rgba(220,2,24,0.12)]" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#1A1A1A] text-xs">Flat delivery charge (₹)</Label>
                  <Input type="number" value={settings.flatDeliveryCharge}
                    onChange={(e) => set("flatDeliveryCharge", Number(e.target.value))}
                    className="bg-white border-[rgba(220,2,24,0.12)]" />
                </div>
              </div>
            </motion.div>

            {/* Mysuru */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-[#DC0218]" />
                  <h3 className="font-bold text-lg text-[#1A1A1A]">Mysuru Options</h3>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#1A1A1A]">Mysuru pickup</span>
                  <button onClick={() => toggle("mysuruPickupEnabled")}
                    className={`relative w-10 h-5 transition-colors ${settings.mysuruPickupEnabled ? "bg-[#DC0218]" : "bg-[#E0E0E0]"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white shadow-sm transition-all ${settings.mysuruPickupEnabled ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
                {settings.mysuruPickupEnabled && (
                  <div className="space-y-1.5">
                    <Label className="text-[#1A1A1A] text-xs">Pickup fee (₹) — default 0</Label>
                    <Input type="number" value={settings.mysuruPickupFee}
                      onChange={(e) => set("mysuruPickupFee", Number(e.target.value))}
                      className="bg-white border-[rgba(220,2,24,0.12)]" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#1A1A1A]">Local Mysuru delivery</span>
                  <button onClick={() => toggle("localMysuruDeliveryEnabled")}
                    className={`relative w-10 h-5 transition-colors ${settings.localMysuruDeliveryEnabled ? "bg-[#DC0218]" : "bg-[#E0E0E0]"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white shadow-sm transition-all ${settings.localMysuruDeliveryEnabled ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
                {settings.localMysuruDeliveryEnabled && (
                  <div className="space-y-1.5">
                    <Label className="text-[#1A1A1A] text-xs">Local delivery fee (₹)</Label>
                    <Input type="number" value={settings.localMysuruDeliveryFee}
                      onChange={(e) => set("localMysuruDeliveryFee", Number(e.target.value))}
                      className="bg-white border-[rgba(220,2,24,0.12)]" />
                  </div>
                )}
              </div>
            </motion.div>

            {/* Express + COD */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#DC0218]" />
                  <h3 className="font-bold text-lg text-[#1A1A1A]">Additional</h3>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#1A1A1A]">Express delivery</span>
                  <button onClick={() => toggle("expressDeliveryEnabled")}
                    className={`relative w-10 h-5 transition-colors ${settings.expressDeliveryEnabled ? "bg-[#DC0218]" : "bg-[#E0E0E0]"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white shadow-sm transition-all ${settings.expressDeliveryEnabled ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
                {settings.expressDeliveryEnabled && (
                  <div className="space-y-1.5">
                    <Label className="text-[#1A1A1A] text-xs">Express charge (₹)</Label>
                    <Input type="number" value={settings.expressDeliveryCharge}
                      onChange={(e) => set("expressDeliveryCharge", Number(e.target.value))}
                      className="bg-white border-[rgba(220,2,24,0.12)]" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#1A1A1A]">Cash on delivery</span>
                  <button onClick={() => toggle("codEnabled")}
                    className={`relative w-10 h-5 transition-colors ${settings.codEnabled ? "bg-[#DC0218]" : "bg-[#E0E0E0]"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white shadow-sm transition-all ${settings.codEnabled ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
                {settings.codEnabled && (
                  <div className="space-y-1.5">
                    <Label className="text-[#1A1A1A] text-xs">COD charge (₹)</Label>
                    <Input type="number" value={settings.codCharge}
                      onChange={(e) => set("codCharge", Number(e.target.value))}
                      className="bg-white border-[rgba(220,2,24,0.12)]" />
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 flex justify-end">
            <Button onClick={save} disabled={saving}
              className="bg-[#DC0218] hover:bg-[#C70015] text-white px-8 h-12 shadow-lg shadow-[#DC0218]/20">
              <Save className="h-4 w-4 mr-2" /> {saving ? "Saving..." : "Save Changes"}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
