"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, IndianRupee, ShoppingBag, Users, Package } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const metrics = [
  { icon: IndianRupee, label: "Monthly Revenue", value: "₹42,800", change: "+15.3%", up: true },
  { icon: ShoppingBag, label: "Monthly Orders", value: "156", change: "+12.1%", up: true },
  { icon: Users, label: "New Customers", value: "48", change: "+22.5%", up: true },
  { icon: Package, label: "Avg. Order Value", value: "₹274", change: "-2.4%", up: false },
];

const monthlyData = [
  { month: "Jan", revenue: 28000, orders: 98 },
  { month: "Feb", revenue: 32000, orders: 112 },
  { month: "Mar", revenue: 35000, orders: 128 },
  { month: "Apr", revenue: 38000, orders: 135 },
  { month: "May", revenue: 41000, orders: 148 },
  { month: "Jun", revenue: 42800, orders: 156 },
];

export default function AdminAnalyticsPage() {
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));
  const maxOrders = Math.max(...monthlyData.map((d) => d.orders));

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 pt-20">
        <div className="px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Admin</span>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Sales Analytics</h1>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {metrics.map((m, i) => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-[rgba(220,2,24,0.08)]">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#DC0218]/5 flex items-center justify-center">
                    <m.icon className="h-6 w-6 text-[#DC0218]" />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium ${m.up ? "text-green-600" : "text-red-600"}`}>
                    {m.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{m.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-[#1A1A1A]">{m.value}</p>
                <p className="text-[#444444] text-sm mt-1">{m.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[rgba(220,2,24,0.08)]">
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-6">Revenue (Last 6 Months)</h3>
              <div className="flex items-end gap-3 h-48">
                {monthlyData.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-[#444444] font-medium">₹{(d.revenue / 1000).toFixed(0)}K</span>
                    <div className="w-full rounded-t-lg bg-[#DC0218] transition-all duration-300 hover:bg-[#DC0218]/80" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} />
                    <span className="text-xs text-[#444444]">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[rgba(220,2,24,0.08)]">
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-6">Orders (Last 6 Months)</h3>
              <div className="flex items-end gap-3 h-48">
                {monthlyData.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs text-[#444444] font-medium">{d.orders}</span>
                    <div className="w-full rounded-t-lg bg-[#C70015] transition-all duration-300 hover:bg-[#C70015]/80" style={{ height: `${(d.orders / maxOrders) * 100}%` }} />
                    <span className="text-xs text-[#444444]">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[rgba(220,2,24,0.08)] mt-6">
            <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">Top Selling Products</h3>
            <div className="space-y-4">
              {[
                { name: "Classic Butter Bliss", sold: 234, revenue: 58266 },
                { name: "Caramel Crunch Delight", sold: 198, revenue: 59202 },
                { name: "Spicy Szechuan Kick", sold: 167, revenue: 46593 },
                { name: "Truffle Parmesan", sold: 145, revenue: 65105 },
                { name: "Chocolate Drizzle", sold: 112, revenue: 39088 },
              ].map((p, i) => {
                const maxSold = 234;
                return (
                  <div key={p.name} className="flex items-center gap-4">
                    <span className="text-sm font-bold text-[#444444] w-6">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-[#1A1A1A]">{p.name}</span>
                        <span className="text-sm text-[#444444]">{p.sold} sold · ₹{p.revenue.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-[#FFF8F0] rounded-full h-2">
                        <div className="bg-[#DC0218] h-2 rounded-full" style={{ width: `${(p.sold / maxSold) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
