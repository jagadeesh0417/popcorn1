"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

interface AdminCustomer {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  orders: number;
  totalSpent: number;
  joined: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/customers")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCustomers(data); else setError("Invalid response from server"); })
      .catch(() => setError("Failed to load customers"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 pt-20">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Admin</span>
              <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Customers</h1>
            </div>
            <span className="bg-[#DC0218] text-white text-sm font-medium px-4 py-2 rounded-xl">{customers.length} customers</span>
          </div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm mb-6">{error}</div>}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#DC0218]" />
            </div>
          ) : customers.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-[rgba(220,2,24,0.08)] text-center">
              <p className="text-[#444444]">No customers yet. Customers appear after placing their first order.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(220,2,24,0.08)] overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(220,2,24,0.08)] text-left text-[#444444]">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Email</th>
                    <th className="pb-3 font-medium">Phone</th>
                    <th className="pb-3 font-medium">Orders</th>
                    <th className="pb-3 font-medium">Total Spent</th>
                    <th className="pb-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c) => (
                    <tr key={c.email} className="border-b border-[rgba(220,2,24,0.06)] last:border-0">
                      <td className="py-3 font-medium text-[#1A1A1A]">{c.firstName} {c.lastName}</td>
                      <td className="py-3 text-[#444444]">{c.email}</td>
                      <td className="py-3 text-[#444444]">{c.phone}</td>
                      <td className="py-3 text-[#444444]">{c.orders}</td>
                      <td className="py-3 font-medium text-[#DC0218]">₹{c.totalSpent?.toLocaleString()}</td>
                      <td className="py-3 text-[#444444]">{c.joined ? new Date(c.joined).toLocaleDateString() : "-"}</td>
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
