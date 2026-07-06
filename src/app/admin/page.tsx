"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Package, ShoppingBag, Users, Percent, Box, TrendingUp, IndianRupee, ArrowUp, ArrowDown, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const stats = [
  { icon: IndianRupee, label: "Total Revenue", value: "₹1,28,490", change: "+12.5%", up: true, color: "bg-green-500" },
  { icon: ShoppingBag, label: "Total Orders", value: "486", change: "+8.2%", up: true, color: "bg-blue-500" },
  { icon: Users, label: "Total Customers", value: "342", change: "+18.7%", up: true, color: "bg-purple-500" },
  { icon: Package, label: "Products", value: "10", change: "0%", up: true, color: "bg-orange-500" },
];

const recentOrders = [
  { id: "ORD-004", customer: "Rohit K.", items: 2, total: 598, status: "pending", date: "2026-07-06" },
  { id: "ORD-005", customer: "Sneha P.", items: 1, total: 299, status: "confirmed", date: "2026-07-05" },
  { id: "ORD-006", customer: "Amit S.", items: 3, total: 837, status: "shipped", date: "2026-07-04" },
  { id: "ORD-007", customer: "Kiran B.", items: 1, total: 449, status: "delivered", date: "2026-07-03" },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800", confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800", delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const navItems = [
  { icon: Package, label: "Orders", href: "/admin/orders", count: "12" },
  { icon: ShoppingBag, label: "Products", href: "/admin/products", count: "10" },
  { icon: Users, label: "Customers", href: "/admin/customers", count: "342" },
  { icon: Percent, label: "Coupons", href: "/admin/coupons", count: "3" },
  { icon: Box, label: "Inventory", href: "/admin/inventory" },
  { icon: TrendingUp, label: "Analytics", href: "/admin/analytics" },
];

export default function AdminDashboard() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("admin@popcorn.in");
  const [password, setPassword] = useState("");

  if (isLogin) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-4">
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-[rgba(183,28,28,0.08)]">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-[#B71C1C] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#B71C1C]/20">
                <span className="text-white font-bold text-2xl">P</span>
              </div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Admin Login</h1>
              <p className="text-[#666666] text-sm mt-1">Sign in to access the dashboard</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1A1A1A]">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border-[rgba(183,28,28,0.12)]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#1A1A1A]">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-xl border-[rgba(183,28,28,0.12)]" />
              </div>
              <Button className="w-full bg-[#B71C1C] hover:bg-[#8E1414] text-white rounded-xl h-12 shadow-lg shadow-[#B71C1C]/20" onClick={() => { if (password) setIsLogin(false); }}>
                <LogIn className="h-4 w-4 mr-2" /> Sign In
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[#B71C1C] font-semibold text-sm uppercase tracking-[0.2em]">Admin Panel</span>
          <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Dashboard</h1>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-[rgba(183,28,28,0.08)]">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} bg-opacity-20 flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-green-600" : "text-red-600"}`}>
                  {stat.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}{stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</p>
              <p className="text-[#666666] text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-[rgba(183,28,28,0.08)]">
            <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[rgba(183,28,28,0.08)] text-left text-[#666666]">
                    <th className="pb-3 font-medium">Order</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Items</th>
                    <th className="pb-3 font-medium">Total</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-[rgba(183,28,28,0.06)] last:border-0">
                      <td className="py-3 font-medium text-[#1A1A1A]">{order.id}</td>
                      <td className="py-3 text-[#666666]">{order.customer}</td>
                      <td className="py-3 text-[#666666]">{order.items}</td>
                      <td className="py-3 text-[#B71C1C] font-medium">₹{order.total}</td>
                      <td className="py-3"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                      <td className="py-3 text-[#666666]">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[rgba(183,28,28,0.08)]">
            <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">Quick Links</h3>
            <div className="space-y-2">
              {navItems.map((item) => (
                <a key={item.label} href={item.href} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FFF8F0] transition-colors">
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-[#B71C1C]" />
                    <span className="font-medium text-sm text-[#1A1A1A]">{item.label}</span>
                  </div>
                  {item.count && <span className="bg-[#B71C1C]/10 text-[#B71C1C] text-xs font-bold px-2 py-0.5 rounded-full">{item.count}</span>}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
