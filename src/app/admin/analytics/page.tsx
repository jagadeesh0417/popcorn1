"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, IndianRupee, ShoppingBag, Users, Package, Loader2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState([
    { icon: IndianRupee, label: "Monthly Revenue", value: "₹0", change: "0%", up: true },
    { icon: ShoppingBag, label: "Monthly Orders", value: "0", change: "0%", up: true },
    { icon: Users, label: "New Customers", value: "0", change: "0%", up: true },
    { icon: Package, label: "Avg. Order Value", value: "₹0", change: "0%", up: true },
  ]);
  const [monthlyData, setMonthlyData] = useState<{ month: string; revenue: number; orders: number }[]>([]);
  const [topProducts, setTopProducts] = useState<{ name: string; sold: number; revenue: number }[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/customers").then((r) => r.json()),
    ])
      .then(([orders, customers]) => {
        if (!mounted) return;
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const monthlyOrders = orders.filter((o: { createdAt: string }) => {
          const d = new Date(o.createdAt);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });

        const monthlyRevenue = monthlyOrders.reduce((s: number, o: { total: number }) => s + (o.total || 0), 0);
        const avgOrderValue = monthlyOrders.length > 0 ? Math.round(monthlyRevenue / monthlyOrders.length) : 0;

        setMetrics([
          { icon: IndianRupee, label: "Monthly Revenue", value: `₹${monthlyRevenue.toLocaleString()}`, change: "", up: true },
          { icon: ShoppingBag, label: "Monthly Orders", value: `${monthlyOrders.length}`, change: "", up: true },
          { icon: Users, label: "New Customers", value: `${customers.length}`, change: "", up: true },
          { icon: Package, label: "Avg. Order Value", value: `₹${avgOrderValue}`, change: "", up: true },
        ]);

        const months: { month: string; revenue: number; orders: number }[] = [];
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        for (let i = 5; i >= 0; i--) {
          const m = new Date(currentYear, currentMonth - i, 1);
          const monthOrders = orders.filter((o: { createdAt: string }) => {
            const d = new Date(o.createdAt);
            return d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear();
          });
          months.push({
            month: monthNames[m.getMonth()],
            revenue: monthOrders.reduce((s: number, o: { total: number }) => s + (o.total || 0), 0),
            orders: monthOrders.length,
          });
        }
        setMonthlyData(months);

        const productSales: Record<string, { sold: number; revenue: number; name: string }> = {};
        orders.forEach((o: { items: { productId: string; name: string; price: number; quantity: number }[] }) => {
          o.items.forEach((item) => {
            if (!productSales[item.productId]) {
              productSales[item.productId] = { sold: 0, revenue: 0, name: item.name };
            }
            productSales[item.productId].sold += item.quantity;
            productSales[item.productId].revenue += item.price * item.quantity;
          });
        });
        setTopProducts(
          Object.values(productSales)
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 5)
        );
      })
      .catch(() => console.error("Failed to fetch analytics"))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 1);
  const maxOrders = Math.max(...monthlyData.map((d) => d.orders), 1);
  const maxSold = Math.max(...topProducts.map((p) => p.sold), 1);

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
                  {m.change && (
                    <span className={`flex items-center gap-1 text-xs font-medium ${m.up ? "text-green-600" : "text-red-600"}`}>
                      {m.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{m.change}
                    </span>
                  )}
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
              {topProducts.length === 0 ? (
                <p className="text-[#444444] text-sm">No sales data yet.</p>
              ) : (
                topProducts.map((p, i) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
