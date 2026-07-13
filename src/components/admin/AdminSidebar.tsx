"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Package, ShoppingBag, Users, Percent, Box, TrendingUp, LayoutDashboard, Gift, Truck, CreditCard, LogOut } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Package, label: "Orders", href: "/admin/orders" },
  { icon: ShoppingBag, label: "Products", href: "/admin/products" },
  { icon: Gift, label: "Bundle", href: "/admin/bundle" },
  { icon: Users, label: "Customers", href: "/admin/customers" },
  { icon: Percent, label: "Coupons", href: "/admin/coupons" },
  { icon: Box, label: "Inventory", href: "/admin/inventory" },
  { icon: TrendingUp, label: "Analytics", href: "/admin/analytics" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#C70015] z-40 flex flex-col shadow-2xl">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Poprika" width={2508} height={1214} className="h-8 w-auto brightness-0 invert" />
          <span className="text-[#F9D976] text-[10px] uppercase tracking-widest font-medium">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-[#F9D976]/20 text-[#F9D976] shadow-sm"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="activeIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#F9D976]"
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                />
              )}
              <item.icon className={`h-5 w-5 ${isActive ? "text-[#F9D976]" : ""}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
          <div className="pt-4 pb-1 px-4">
            <span className="text-[#F9D976]/60 text-[10px] uppercase tracking-[0.15em] font-semibold">Settings</span>
          </div>
          {[
            { icon: Truck, label: "Shipping", href: "/admin/settings/shipping" },
            { icon: CreditCard, label: "Payments", href: "/admin/settings/payments" },
          ].map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#F9D976]/20 text-[#F9D976] shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#F9D976]"
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  />
                )}
                <item.icon className={`h-5 w-5 ${isActive ? "text-[#F9D976]" : ""}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>View Store</span>
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
