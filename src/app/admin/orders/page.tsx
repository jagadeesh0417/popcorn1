"use client";

import { useState, useEffect } from "react";
import { Loader2, Printer } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { OrderDetailModal } from "@/components/admin/OrderDetailModal";
import { PrintLabelModal } from "@/components/admin/PrintLabelModal";

interface OrderItem {
  name: string;
  quantity: number;
  variant?: { label: string; grams: number } | null;
  price?: number;
  mrp?: number;
  offerPercent?: number;
}

type PaymentStatusValue = "pending" | "paid" | "failed" | "refunded";

interface AdminOrder {
  _id: string;
  orderId: string;
  customerDetails: { firstName: string; lastName: string; address?: string };
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod?: string;
  paymentId?: string;
  paymentStatus?: PaymentStatusValue;
  createdAt?: string;
  fulfillmentMethod?: "pickup" | "delivery";
  deliveryRegion?: "mysore" | "pan_india";
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800", confirmed: "bg-blue-100 text-blue-800",
  packed: "bg-purple-100 text-purple-800", shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800", cancelled: "bg-red-100 text-red-800",
  "return-requested": "bg-orange-100 text-orange-800",
};

const statusOptions = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled", "return-requested"];

const paymentStatusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-green-100 text-green-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-blue-100 text-blue-800",
};

/** Mirrors the server-side transition rules — invalid options are never offered. */
const paymentTransitions: Record<PaymentStatusValue, PaymentStatusValue[]> = {
  pending: ["paid", "failed", "refunded"],
  failed: ["pending", "paid", "refunded"],
  paid: ["refunded"],
  refunded: [],
};

/** Falls back to the legacy address marker for orders placed before fulfilment was stored. */
function fulfilmentLabel(order: AdminOrder): string {
  if (order.fulfillmentMethod === "pickup") return "Pickup (Mysore)";
  if (order.fulfillmentMethod === "delivery") {
    return order.deliveryRegion === "mysore" ? "Delivery (Mysore)" : "Delivery (Pan-India)";
  }
  return order.customerDetails.address?.toLowerCase().includes("pickup")
    ? "Pickup (Mysore)"
    : "Delivery";
}

export default function AdminOrdersPage() {
  const [orderList, setOrderList] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [labelOrderId, setLabelOrderId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/orders").then((r) => r.json()).then((data) => { if (mounted) { if (data?.success) setOrderList(data.data); setLoading(false); } }).catch(() => { if (mounted) { setError("Failed to load orders"); setLoading(false); } });
    return () => { mounted = false; };
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrderList((prev) =>
          prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch {
      console.error("Failed to update status");
    }
  };

  /** Manual payment override — server re-validates the transition and audits it. */
  const updatePaymentStatus = async (orderId: string, next: PaymentStatusValue) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: next }),
      });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        const updated = data?.data;
        setOrderList((prev) =>
          prev.map((o) =>
            o.orderId === orderId
              ? {
                  ...o,
                  paymentStatus: next,
                  // Server moves a manually-paid order out of "pending".
                  status: updated?.status || o.status,
                }
              : o
          )
        );
      } else {
        const err = await res.json().catch(() => null);
        alert(err?.error || "Failed to update payment status");
      }
    } catch {
      console.error("Failed to update payment status");
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 pt-10">
        <div className="px-8 py-8">
          <div className="mb-8">
            <span className="text-brand font-semibold text-sm uppercase tracking-[0.2em]">Admin</span>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Orders</h1>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-6">{error}</div>}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
          ) : orderList.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-brand/8 text-center">
              <p className="text-[#444444]">No orders yet. Orders will appear here once customers start checking out.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand/8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-brand/8 text-left text-[#444444]">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Items</th>
                    <th className="pb-3 font-medium">Fulfilment</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Payment</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orderList.map((order) => (
                    <tr key={order._id} className="border-b border-brand/6 last:border-0">
                      <td className="py-3 font-medium text-[#1A1A1A]">{order.orderId}</td>
                      <td className="py-3 text-[#444444]">{order.customerDetails.firstName} {order.customerDetails.lastName}</td>
                      <td className="py-3 text-[#444444]">
                        <div className="flex items-center gap-2">
                          <span>{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                            className="text-brand text-xs hover:underline"
                          >
                            {expandedOrder === order._id ? "Hide" : "View"}
                          </button>
                        </div>
                        {expandedOrder === order._id && (
                          <div className="mt-2 space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="text-xs text-[#666666]">
                                {item.name}
                                {item.variant?.label ? ` (${item.variant.label})` : ""}
                                {" — "}x{item.quantity}
                                {typeof item.price === "number" && (
                                  <span className="text-[#999]"> @ ₹{item.price}</span>
                                )}
                                {typeof item.mrp === "number" && item.mrp > (item.price ?? 0) && (
                                  <span className="text-[#999] line-through"> (MRP ₹{item.mrp})</span>
                                )}
                                {item.offerPercent ? (
                                  <span className="ml-1 text-green-700 font-medium">-{item.offerPercent}%</span>
                                ) : null}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-brand/10 text-brand whitespace-nowrap">
                          {fulfilmentLabel(order)}
                        </span>
                      </td>
                      <td className="py-3 font-medium text-brand">₹{order.total}</td>
                      <td className="py-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.orderId, e.target.value)}
                          className={`px-2.5 py-1.5 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-col gap-1.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium w-fit ${
                              paymentStatusColors[order.paymentStatus || "pending"] || "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {order.paymentStatus === "paid"
                              ? "Paid"
                              : order.paymentStatus === "failed"
                                ? "Failed"
                                : order.paymentStatus === "refunded"
                                  ? "Refunded"
                                  : order.paymentMethod === "COD"
                                    ? "COD pending"
                                    : "Pending"}
                          </span>
                          {(paymentTransitions[order.paymentStatus || "pending"] || []).length > 0 && (
                            <select
                              value=""
                              onChange={(e) => {
                                const v = e.target.value as PaymentStatusValue;
                                if (v) updatePaymentStatus(order.orderId, v);
                              }}
                              className="px-2 py-1 rounded-md text-xs border border-brand/20 bg-white text-[#444444] cursor-pointer"
                              title="Change payment status (audited)"
                            >
                              <option value="">Set payment…</option>
                              {paymentTransitions[order.paymentStatus || "pending"].map((s) => (
                                <option key={s} value={s}>
                                  {s === "paid" ? "Mark as Paid" : s === "refunded" ? "Mark as Refunded" : s === "failed" ? "Mark as Failed" : "Back to Pending"}
                                </option>
                              ))}
                            </select>
                          )}
                          {order.paymentId && (
                            <span className="text-[10px] text-[#999] font-mono" title={order.paymentId}>
                              {order.paymentId.length > 16 ? `${order.paymentId.slice(0, 16)}…` : order.paymentId}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button onClick={() => setSelectedOrderId(order.orderId)} className="text-brand text-xs font-medium hover:underline">View</button>
                          <button
                            onClick={() => setLabelOrderId(order.orderId)}
                            className="inline-flex items-center gap-1 text-brand text-xs font-medium border border-brand/25 rounded-md px-2 py-1 hover:bg-[#FFF8F0] transition-colors"
                            title="Print shipping label"
                          >
                            <Printer className="h-3 w-3" /> Print Label
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <OrderDetailModal orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />
      <PrintLabelModal orderId={labelOrderId} onClose={() => setLabelOrderId(null)} />
    </div>
  );
}
