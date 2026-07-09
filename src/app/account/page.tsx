"use client";

import { motion } from "framer-motion";
import { User, Package, Heart, MapPin, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const menuItems = [
  { icon: Package, label: "My Orders", href: "/order-tracking", desc: "View & track your orders" },
  { icon: Heart, label: "Wishlist", href: "/wishlist", desc: "Your saved favourites" },
  { icon: MapPin, label: "Addresses", href: "/addresses", desc: "Manage delivery addresses" },
];

export default function AccountPage() {
  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#DC0218]/10 flex items-center justify-center">
              <User className="h-8 w-8 text-[#DC0218]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1A1A1A]">My Account</h1>
              <p className="text-[#666666] text-sm">Manage your profile and orders</p>
            </div>
          </div>

          <div className="space-y-3">
            {menuItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <div className="flex items-center justify-between p-4 bg-[#FFF8F0] rounded-xl hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-[#DC0218]" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-[#1A1A1A]">{item.label}</p>
                      <p className="text-xs text-[#666666]">{item.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#666666] group-hover:text-[#DC0218] transition-colors" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 p-4 bg-[#FFF8F0] rounded-xl">
            <h3 className="font-bold text-sm text-[#1A1A1A] mb-4">Profile Details</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Name", value: "Guest User" },
                { label: "Email", value: "guest@example.com" },
                { label: "Phone", value: "+91 8197175807" },
                { label: "Member Since", value: "July 2026" },
              ].map((field) => (
                <div key={field.label}>
                  <p className="text-xs text-[#666666]">{field.label}</p>
                  <p className="font-medium text-sm text-[#1A1A1A]">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          <Button variant="outline" className="w-full mt-6 rounded-xl border-[rgba(220,2,24,0.2)] text-[#666666]">
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
