"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, ShoppingBag, Users, IndianRupee, ArrowUp, ArrowDown, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800", confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800", delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function AdminDashboard() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("poprika.official@gmail.com");
  const [password, setPassword] = useState("");

  const [stats, setStats] = useState([
    { icon: IndianRupee, label: "Total Revenue", value: "₹0", change: "0%", up: true },
    { icon: ShoppingBag, label: "Total Orders", value: "0", change: "0%", up: true },
    { icon: Users, label: "Total Customers", value: "0", change: "0%", up: true },
    { icon: Package, label: "Products", value: "0", change: "0%", up: true },
  ]);
  const [recentOrders, setRecentOrders] = useState<{ id: string; customer: string; items: number; total: number; status: string; date: string }[]>([]);
  const [quickStats, setQuickStats] = useState<{ label: string; value: string; color: string }[]>([]);

  useEffect(() => {
    if (isLogin) return;
    Promise.all([
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/customers").then((r) => r.json()),
    ]).then(([orders, products, customers]) => {
      const totalRevenue = orders.reduce((s: number, o: { total: number }) => s + (o.total || 0), 0);
      const pendingOrders = orders.filter((o: { status: string }) => o.status === "pending").length;
      const lowStock = products.filter((p: { stockQuantity: number }) => (p.stockQuantity || 0) <= 10).length;
      const uniqueCustomers = customers.length;

      setStats([
        { icon: IndianRupee, label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, change: "", up: true },
        { icon: ShoppingBag, label: "Total Orders", value: `${orders.length}`, change: "", up: true },
        { icon: Users, label: "Total Customers", value: `${uniqueCustomers}`, change: "", up: true },
        { icon: Package, label: "Products", value: `${products.length}`, change: "", up: true },
      ]);

      setRecentOrders(
        orders.slice(0, 4).map((o: { orderId: string; customerDetails: { firstName: string; lastName: string }; items: { quantity: number }[]; total: number; status: string; createdAt: string }) => ({
          id: o.orderId,
          customer: `${o.customerDetails.firstName} ${o.customerDetails.lastName}`,
          items: o.items.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0),
          total: o.total,
          status: o.status,
          date: new Date(o.createdAt).toLocaleDateString(),
        }))
      );

      setQuickStats([
        { label: "Pending Orders", value: `${pendingOrders}`, color: pendingOrders > 0 ? "bg-[#F9D976] text-[#C70015]" : "bg-green-100 text-green-700" },
        { label: "Low Stock Items", value: `${lowStock}`, color: lowStock > 0 ? "bg-[#DC0218] text-white" : "bg-green-100 text-green-700" },
        { label: "Total Customers", value: `${uniqueCustomers} customers`, color: "text-[#444444]" },
      ]);
    }).catch(() => {});
  }, [isLogin]);

  if (isLogin) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-8 shadow-xl border border-[rgba(220,2,24,0.08)]"
          >
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, delay: 0.1 }}
                className="w-16 h-16 mx-auto bg-[#DC0218] flex items-center justify-center mb-4 shadow-lg shadow-[#DC0218]/20"
              >
                <span className="text-white font-bold text-2xl">P</span>
              </motion.div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">Admin Login</h1>
              <p className="text-[#444444] text-sm mt-1">Sign in to manage your Poprika store</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1A1A1A]">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border-[rgba(220,2,24,0.12)]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#1A1A1A]">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border-[rgba(220,2,24,0.12)]" />
              </div>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}>
                <Button className="w-full bg-[#DC0218] hover:bg-[#C70015] text-white h-12 shadow-lg shadow-[#DC0218]/20" onClick={() => { if (password) setIsLogin(false); }}>
                  <LogIn className="h-4 w-4 mr-2" /> Sign In
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 pt-20">
        <div className="px-8 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Admin Panel</span>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Dashboard</h1>
          </motion.div>

          <motion.div variants={stagger} initial="initial" animate="animate" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -4, boxShadow: "0 12px 35px rgba(0,0,0,0.08)" }}
                className="bg-white p-6 border border-[rgba(220,2,24,0.08)] transition-all duration-300 cursor-default"
              >
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    className="w-12 h-12 bg-[#DC0218]/5 flex items-center justify-center"
                  >
                    <stat.icon className="h-6 w-6 text-[#DC0218]" />
                  </motion.div>
                  {stat.change && (
                    <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-green-600" : "text-red-600"}`}>
                      {stat.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}{stat.change}
                    </span>
                  )}
                </div>
                <p className="text-2xl font-bold text-[#1A1A1A]">{stat.value}</p>
                <p className="text-[#444444] text-sm mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 bg-white p-6 border border-[rgba(220,2,24,0.08)]"
            >
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[rgba(220,2,24,0.08)] text-left text-[#444444]">
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
                      <motion.tr
                        key={order.id}
                        whileHover={{ backgroundColor: "rgba(220,2,24,0.03)" }}
                        className="border-b border-[rgba(220,2,24,0.06)] last:border-0 transition-colors cursor-default"
                      >
                        <td className="py-3 font-medium text-[#1A1A1A]">{order.id}</td>
                        <td className="py-3 text-[#444444]">{order.customer}</td>
                        <td className="py-3 text-[#444444]">{order.items}</td>
                        <td className="py-3 text-[#DC0218] font-medium">₹{order.total}</td>
                        <td className="py-3"><span className={`px-2.5 py-1 text-xs font-medium ${statusColors[order.status]}`}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                        <td className="py-3 text-[#444444]">{order.date}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 border border-[rgba(220,2,24,0.08)]"
            >
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">Quick Stats</h3>
              <div className="space-y-4">
                {quickStats.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 bg-[#FFF8F0] transition-all duration-200 cursor-default"
                  >
                    <span className="text-sm font-medium text-[#1A1A1A]">{item.label}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 ${item.color}`}>{item.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
