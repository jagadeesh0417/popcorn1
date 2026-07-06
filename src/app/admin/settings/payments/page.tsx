"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, CreditCard, CheckCircle, XCircle, TrendingUp, IndianRupee } from "lucide-react";
import { toast } from "sonner";

interface PaymentConfig {
  enabled: boolean;
  keyId: string;
  keySecret: string;
  testMode: boolean;
  upiEnabled: boolean;
  cardsEnabled: boolean;
  netBankingEnabled: boolean;
  walletsEnabled: boolean;
  codEnabled: boolean;
  codCharge: number;
}

const defaultConfig: PaymentConfig = {
  enabled: true,
  keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_xxxxxxxx",
  keySecret: "xxxxxxxxxxxxxxxx",
  testMode: true,
  upiEnabled: true,
  cardsEnabled: true,
  netBankingEnabled: true,
  walletsEnabled: true,
  codEnabled: false,
  codCharge: 20,
};

const stats = [
  { icon: IndianRupee, label: "Total Payments", value: "₹1,28,490", change: "+12.5%", up: true },
  { icon: CheckCircle, label: "Successful", value: "472", change: "+11.2%", up: true },
  { icon: XCircle, label: "Failed", value: "14", change: "-5.3%", up: false },
  { icon: TrendingUp, label: "Avg. Order Value", value: "₹264", change: "+3.8%", up: true },
];

export default function AdminPaymentSettings() {
  const [config, setConfig] = useState<PaymentConfig>(defaultConfig);
  const [showSecret, setShowSecret] = useState(false);

  const toggle = (key: keyof PaymentConfig) => {
    if (typeof config[key] === "boolean") {
      setConfig({ ...config, [key]: !config[key] as boolean });
    }
  };

  const paymentMethods = [
    { key: "upiEnabled" as const, label: "UPI", desc: "Google Pay, PhonePe, Paytm, BHIM" },
    { key: "cardsEnabled" as const, label: "Cards", desc: "Visa, Mastercard, RuPay" },
    { key: "netBankingEnabled" as const, label: "Net Banking", desc: "All major banks" },
    { key: "walletsEnabled" as const, label: "Wallets", desc: "Paytm, Mobikwik, Freecharge" },
    { key: "codEnabled" as const, label: "Cash on Delivery", desc: "Pay at doorstep" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFFDF9] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 pt-20">
        <div className="px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#B71C1C] font-semibold text-sm uppercase tracking-[0.2em]">Admin / Settings</span>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Payment Settings</h1>
          </motion.div>

          {/* Status banner */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
            className={`mt-6 flex items-center gap-3 px-5 py-3 border ${config.enabled ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
            {config.enabled
              ? <CheckCircle className="h-5 w-5 text-green-600" />
              : <XCircle className="h-5 w-5 text-red-500" />}
            <span className={`text-sm font-medium ${config.enabled ? "text-green-700" : "text-red-700"}`}>
              Gateway {config.enabled ? "Active" : "Disabled"}
              {config.testMode && config.enabled && " · Test Mode"}
            </span>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                whileHover={{ y: -2 }}
                className="bg-[#FFFDF9] p-4 border border-[rgba(0,0,0,0.05)] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-8 h-8 bg-[#B71C1C]/5 flex items-center justify-center">
                    <stat.icon className="h-4 w-4 text-[#B71C1C]" />
                  </div>
                  <span className={`text-[10px] font-medium ${stat.up ? "text-green-600" : "text-red-600"}`}>{stat.change}</span>
                </div>
                <p className="text-lg font-bold text-[#1A1A1A]">{stat.value}</p>
                <p className="text-[10px] text-[#666666]">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            {/* Gateway Config */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="h-5 w-5 text-[#B71C1C]" />
                <h3 className="font-bold text-lg text-[#1A1A1A]">Razorpay Configuration</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#1A1A1A]">Enable Razorpay</span>
                  <button onClick={() => toggle("enabled")}
                    className={`relative w-10 h-5 transition-colors ${config.enabled ? "bg-[#B71C1C]" : "bg-[#E0E0E0]"}`}>
                    <span className={`absolute top-0.5 w-4 h-4 bg-white shadow-sm transition-all ${config.enabled ? "left-5" : "left-0.5"}`} />
                  </button>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#1A1A1A] text-xs">Key ID</Label>
                  <Input value={config.keyId} onChange={(e) => setConfig({ ...config, keyId: e.target.value })}
                    className="bg-white border-[rgba(183,28,28,0.12)] font-mono text-xs" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[#1A1A1A] text-xs">Key Secret</Label>
                  <div className="flex gap-2">
                    <Input type={showSecret ? "text" : "password"} value={config.keySecret}
                      onChange={(e) => setConfig({ ...config, keySecret: e.target.value })}
                      className="bg-white border-[rgba(183,28,28,0.12)] font-mono text-xs flex-1" />
                    <button onClick={() => setShowSecret(!showSecret)}
                      className="text-[10px] text-[#B71C1C] underline whitespace-nowrap">
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
                      <p className="text-[10px] text-[#666666]">{pm.desc}</p>
                    </div>
                    <button onClick={() => toggle(pm.key)}
                      className={`relative w-10 h-5 transition-colors ${config[pm.key] ? "bg-[#B71C1C]" : "bg-[#E0E0E0]"}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white shadow-sm transition-all ${config[pm.key] ? "left-5" : "left-0.5"}`} />
                    </button>
                  </div>
                ))}
                {config.codEnabled && (
                  <div className="space-y-1.5 pt-2 border-t border-[rgba(0,0,0,0.05)]">
                    <Label className="text-[#1A1A1A] text-xs">COD charge (₹)</Label>
                    <Input type="number" value={config.codCharge}
                      onChange={(e) => setConfig({ ...config, codCharge: Number(e.target.value) })}
                      className="bg-white border-[rgba(183,28,28,0.12)] w-28" />
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 flex justify-end">
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
              <Button onClick={() => toast.success("Payment settings saved!")} className="bg-[#B71C1C] hover:bg-[#8E1414] text-white px-8 h-12 shadow-lg shadow-[#B71C1C]/20">
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </Button>
            </motion.div>
          </motion.div>
          <p className="text-[#999999] text-[10px] mt-3 text-right">
            TODO: connect to MongoDB.
          </p>
        </div>
      </div>
    </div>
  );
}
