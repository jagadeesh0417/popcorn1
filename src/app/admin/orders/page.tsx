"use client";

import { useState } from "react";
import { orders } from "@/lib/data";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800", confirmed: "bg-blue-100 text-blue-800",
  packed: "bg-purple-100 text-purple-800", shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800", cancelled: "bg-red-100 text-red-800",
  "return-requested": "bg-orange-100 text-orange-800",
};

const statusOptions = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled", "return-requested"];

export default function AdminOrdersPage() {
  const [orderList, setOrderList] = useState(orders);

  const updateStatus = (orderId: string, newStatus: string) => {
    setOrderList((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: newStatus as typeof o.status, statusTimeline: [...o.statusTimeline, { status: newStatus, date: new Date().toISOString().split("T")[0], note: `Status updated to ${newStatus}` }] }
          : o
      )
    );
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
                  <tr key={order.id} className="border-b border-[rgba(220,2,24,0.06)] last:border-0">
                    <td className="py-3 font-medium text-[#1A1A1A]">{order.id}</td>
                    <td className="py-3 text-[#444444]">{order.customerDetails.firstName} {order.customerDetails.lastName}</td>
                    <td className="py-3 text-[#444444]">{order.items.reduce((s, i) => s + i.quantity, 0)}</td>
                    <td className="py-3 font-medium text-[#DC0218]">₹{order.total}</td>
                    <td className="py-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`px-2.5 py-1.5 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[order.status]}`}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 text-[#444444]">{order.paymentId ? "Paid" : "Pending"}</td>
                    <td className="py-3">
                      <button className="text-[#DC0218] text-xs font-medium hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
