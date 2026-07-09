"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, CheckCircle, Clock, Truck, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { orders } from "@/lib/data";

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  confirmed: Package,
  packed: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
  "return-requested": XCircle,
};

const statusColors: Record<string, string> = {
  pending: "text-yellow-500",
  confirmed: "text-blue-500",
  packed: "text-purple-500",
  shipped: "text-orange-500",
  delivered: "text-green-500",
  cancelled: "text-red-500",
  "return-requested": "text-red-500",
};

const statusBg: Record<string, string> = {
  pending: "bg-yellow-50 border-yellow-200",
  confirmed: "bg-blue-50 border-blue-200",
  packed: "bg-purple-50 border-purple-200",
  shipped: "bg-orange-50 border-orange-200",
  delivered: "bg-green-50 border-green-200",
  cancelled: "bg-red-50 border-red-200",
  "return-requested": "bg-red-50 border-red-200",
};

export default function OrderTrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [trackedOrder, setTrackedOrder] = useState<typeof orders[0] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearched(true);
    const found = orders.find((o) => o.id.toLowerCase() === orderId.trim().toLowerCase());
    setTrackedOrder(found || null);
  };

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Track Your Order</span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mt-2">Order Tracking</h1>
          <p className="text-[#666666] mt-3">Enter your order ID to track your delivery status</p>
        </motion.div>

        <div className="flex gap-3 max-w-md mx-auto mb-12">
          <Input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter Order ID (e.g., ORD-001)"
            className="rounded-xl border-[rgba(220,2,24,0.12)] flex-1"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} className="bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl shadow-lg shadow-[#DC0218]/20">
            <Search className="h-4 w-4 mr-2" /> Track
          </Button>
        </div>

        {searched && !trackedOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <XCircle className="h-16 w-16 text-[#666666] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Order Not Found</h3>
            <p className="text-[#666666]">No order found with ID &quot;{orderId}&quot;. Please check and try again.</p>
          </motion.div>
        )}

        {trackedOrder && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-[#FFF8F0] rounded-2xl p-6 sm:p-8 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-xl text-[#1A1A1A]">{trackedOrder.id}</h3>
                  <p className="text-[#666666] text-sm">
                    Placed on {trackedOrder.orderDate} · {trackedOrder.items.reduce((s, i) => s + i.quantity, 0)} items
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-xl border text-sm font-medium ${statusBg[trackedOrder.status]} ${statusColors[trackedOrder.status]}`}>
                  {trackedOrder.status.charAt(0).toUpperCase() + trackedOrder.status.slice(1)}
                </div>
              </div>

              {trackedOrder.trackingId && (
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white rounded-xl border border-[rgba(220,2,24,0.08)]">
                  <div>
                    <p className="text-xs text-[#666666] mb-1">Tracking ID</p>
                    <p className="font-medium text-sm text-[#1A1A1A]">{trackedOrder.trackingId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#666666] mb-1">Courier Partner</p>
                    <p className="font-medium text-sm text-[#1A1A1A]">{trackedOrder.courierPartner}</p>
                  </div>
                  {trackedOrder.estimatedDelivery && (
                    <div className="col-span-2">
                      <p className="text-xs text-[#666666] mb-1">Estimated Delivery</p>
                      <p className="font-medium text-sm text-green-600">{trackedOrder.estimatedDelivery}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="relative">
                {trackedOrder.statusTimeline.map((event, index) => {
                  const Icon = statusIcons[event.status as keyof typeof statusIcons] || Package;
                  const isLast = index === trackedOrder.statusTimeline.length - 1;
                  const isActive = true;
                  return (
                    <div key={index} className="flex gap-4 pb-6 last:pb-0 relative">
                      {!isLast && (
                        <div className="absolute left-[17px] top-10 bottom-0 w-[2px] bg-[rgba(220,2,24,0.15)]" />
                      )}
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        isActive ? "bg-[#DC0218] text-white" : "bg-gray-200 text-gray-400"
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="pt-1.5">
                        <p className="font-medium text-sm text-[#1A1A1A] capitalize">{event.status}</p>
                        {event.note && <p className="text-xs text-[#666666] mt-0.5">{event.note}</p>}
                        <p className="text-xs text-[#666666] mt-0.5">{event.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[rgba(220,2,24,0.08)]">
              <h4 className="font-bold text-base text-[#1A1A1A] mb-4">Order Items</h4>
              <div className="space-y-3">
                {trackedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[rgba(220,2,24,0.06)] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#FFF8F0] flex items-center justify-center text-sm font-bold text-[#DC0218]">
                        x{item.quantity}
                      </div>
                      <span className="font-medium text-sm text-[#1A1A1A]">{item.product.name}</span>
                    </div>
                    <span className="font-medium text-sm text-[#DC0218]">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 pt-3 border-t border-[rgba(220,2,24,0.08)]">
                <span className="font-bold text-[#1A1A1A]">Total</span>
                <span className="font-bold text-[#DC0218]">₹{trackedOrder.total}</span>
              </div>
            </div>
          </motion.div>
        )}

        <div className="text-center mt-8">
          <Link href="/shop">
            <Button variant="outline" className="rounded-xl border-[rgba(220,2,24,0.2)]">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
