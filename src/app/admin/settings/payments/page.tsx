"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, CreditCard, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PaymentConfig {
  enabled: boolean;
  mode: "razorpay" | "whatsapp";
  keyId: string;
  keySecret: string;
  testMode: boolean;
  upiEnabled: boolean;
  cardsEnabled: boolean;
  netBankingEnabled: boolean;
  walletsEnabled: boolean;
  codEnabled: boolean;
  codCharge: number;
  whatsappNumber: string;
}

const defaults: PaymentConfig = {
  enabled: true,
  mode: "razorpay",
  keyId: "",
  keySecret: "",
  testMode: true,
  upiEnabled: true,
  cardsEnabled: true,
  netBankingEnabled: true,
  walletsEnabled: true,
  codEnabled: false,
  codCharge: 20,
  whatsappNumber: "8197175807",
};

export default function AdminPaymentSettings() {
  const [config, setConfig] = useState<PaymentConfig>(defaults);
  const [showSecret, setShowSecret] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((d) => {
      if (d?.success && d.data?.payments) {
        setConfig({ ...defaults, ...d.data.payments });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggle = (key: keyof PaymentConfig) => {
    if (typeof config[key] === "boolean") {
      setConfig({ ...config, [key]: !config[key] as boolean });
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "payments", value: config }),
      });
      const d = await res.json();
      if (!d.success) throw new Error("Save failed");
      toast.success("Payment settings saved!");
    } catch {
      toast.error("Failed to save settings");
    }
    setSaving(false);
  };

  const paymentMethods = [
    { key: "upiEnabled" as const, label: "UPI", desc: "Google Pay, PhonePe, Paytm, BHIM" },
    { key: "cardsEnabled" as const, label: "Cards", desc: "Visa, Mastercard, RuPay" },
    { key: "netBankingEnabled" as const, label: "Net Banking", desc: "All major banks" },
    { key: "walletsEnabled" as const, label: "Wallets", desc: "Paytm, Mobikwik, Freecharge" },
    { key: "codEnabled" as const, label: "Cash on Delivery", desc: "Pay at doorstep" },
  ];

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
            <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Payment Settings</h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className={`mt-6 flex items-center gap-3 px-5 py-3 border ${config.enabled ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            {config.enabled
              ? <CheckCircle className="h-5 w-5 text-green-600" />
              : <XCircle className="h-5 w-5 text-red-500" />}
            <span className={`text-sm font-medium ${config.enabled ? "text-green-700" : "text-red-700"}`}>
              {config.mode === "whatsapp" ? "WhatsApp Checkout" : "Razorpay Gateway"} {config.enabled ? "Active" : "Disabled"}
              {config.testMode && config.enabled && config.mode === "razorpay" && " · Test Mode"}
            </span>
          </motion.div>

          {/* Payment Mode Toggle */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm mt-6">
            <h3 className="font-bold text-lg text-[#1A1A1A] mb-5">Checkout Mode</h3>
            <div className="flex gap-4">
              {(["razorpay", "whatsapp"] as const).map((m) => (
                <button key={m} onClick={() => setConfig({ ...config, mode: m })}
                  className={`flex-1 p-4 border text-center transition-all ${
                    config.mode === m
                      ? "border-[#DC0218] bg-[#FFF8F0]"
                      : "border-[rgba(0,0,0,0.08)] bg-white"
                  }`}>
                  <p className="font-bold text-sm text-[#1A1A1A] capitalize">{m === "razorpay" ? "Razorpay" : "WhatsApp"}</p>
                  <p className="text-xs text-[#444444] mt-1">
                    {m === "razorpay" ? "Online payments (UPI, Cards, etc.)" : "Orders via WhatsApp message"}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            {/* Gateway Config */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="h-5 w-5 text-[#DC0218]" />
                <h3 className="font-bold text-lg text-[#1A1A1A]">Razorpay Configuration</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#1A1A1A]">Enable Razorpay</span>
                  <button onClick={() => toggle("enabled")}
                    className={`relative w-10 h-5 transition-colors ${config.enabled ? "bg-[#DC0218]" : "bg-[#E0E0E0]"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white shadow-sm transition-all ${config.enabled ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#1A1A1A] text-xs">Key ID</Label>
                  <Input value={config.keyId} onChange={(e) => setConfig({ ...config, keyId: e.target.value })}
                    className="bg-white border-[rgba(220,2,24,0.12)] font-mono text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#1A1A1A] text-xs">Key Secret</Label>
                  <div className="flex gap-2">
                    <Input type={showSecret ? "text" : "password"} value={config.keySecret}
                      onChange={(e) => setConfig({ ...config, keySecret: e.target.value })}
                      className="bg-white border-[rgba(220,2,24,0.12)] font-mono text-xs flex-1" />
                    <button onClick={() => setShowSecret(!showSecret)}
                      className="text-[10px] text-[#DC0218] underline whitespace-nowrap">
                      {showSecret ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#1A1A1A]">Test mode</span>
                  <button onClick={() => toggle("testMode")}
                    className={`relative w-10 h-5 transition-colors ${config.testMode ? "bg-[#F9D976]" : "bg-[#E0E0E0]"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white shadow-sm transition-all ${config.testMode ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Payment Methods */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-5">Payment Methods</h3>
              <div className="space-y-4">
                {paymentMethods.map((pm) => (
                  <div key={pm.key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[#1A1A1A]">{pm.label}</p>
                      <p className="text-[10px] text-[#444444]">{pm.desc}</p>
                    </div>
                    <button onClick={() => toggle(pm.key)}
                      className={`relative w-10 h-5 transition-colors ${config[pm.key] ? "bg-[#DC0218]" : "bg-[#E0E0E0]"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white shadow-sm transition-all ${config[pm.key] ? "left-5" : "left-0.5"}`} />
                    </button>
                  </div>
                ))}
                {config.codEnabled && (
                  <div className="space-y-1.5 pt-2 border-t border-[rgba(0,0,0,0.05)]">
                    <Label className="text-[#1A1A1A] text-xs">COD charge (₹)</Label>
                    <Input type="number" value={config.codCharge}
                      onChange={(e) => setConfig({ ...config, codCharge: Number(e.target.value) })}
                      className="bg-white border-[rgba(220,2,24,0.12)] w-28" />
                  </div>
                )}
                <div className="pt-2 border-t border-[rgba(0,0,0,0.05)] space-y-1.5">
                  <Label className="text-[#1A1A1A] text-xs">WhatsApp Number (for orders)</Label>
                  <Input value={config.whatsappNumber}
                    onChange={(e) => setConfig({ ...config, whatsappNumber: e.target.value })}
                    className="bg-white border-[rgba(220,2,24,0.12)]" />
                </div>
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
