"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface OrderItem {
  name: string;
  quantity: number;
  variant?: { label: string; grams: number } | null;
}

interface AdminOrder {
  _id: string;
  orderId: string;
  customerDetails: { firstName: string; lastName: string };
  items: OrderItem[];
  total: number;
  status: string;
  paymentMethod?: string;
  paymentId?: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800", confirmed: "bg-blue-100 text-blue-800",
  packed: "bg-purple-100 text-purple-800", shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800", cancelled: "bg-red-100 text-red-800",
  "return-requested": "bg-orange-100 text-orange-800",
};

const statusOptions = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled", "return-requested"];

export default function AdminOrdersPage() {
  const [orderList, setOrderList] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 pt-20">
        <div className="px-8 py-8">
          <div className="mb-8">
            <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Admin</span>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Orders</h1>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-6">{error}</div>}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#DC0218]" />
            </div>
          ) : orderList.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-[rgba(220,2,24,0.08)] text-center">
              <p className="text-[#444444]">No orders yet. Orders will appear here once customers start checking out.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(220,2,24,0.08)] overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(220,2,24,0.08)] text-left text-[#444444]">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Items</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Payment</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orderList.map((order) => (
                    <tr key={order._id} className="border-b border-[rgba(220,2,24,0.06)] last:border-0">
                      <td className="py-3 font-medium text-[#1A1A1A]">{order.orderId}</td>
                      <td className="py-3 text-[#444444]">{order.customerDetails.firstName} {order.customerDetails.lastName}</td>
                      <td className="py-3 text-[#444444]">
                        <div className="flex items-center gap-2">
                          <span>{order.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                          <button
                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                            className="text-[#DC0218] text-xs hover:underline"
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
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="py-3 font-medium text-[#DC0218]">₹{order.total}</td>
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
                      <td className="py-3 text-[#444444]">{order.paymentId || order.paymentMethod ? "Paid" : "Pending"}</td>
                      <td className="py-3">
                        <button className="text-[#DC0218] text-xs font-medium hover:underline">View</button>
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
