"use client";

import { motion } from "framer-motion";
import { Leaf, TrendingUp, ShieldCheck, Truck, IndianRupee } from "lucide-react";

const trustItems = [
  { icon: Leaf, label: "100% Natural", description: "No artificial flavours" },
  { icon: TrendingUp, label: "Small Batches", description: "Handcrafted daily" },
  { icon: ShieldCheck, label: "Premium Quality", description: "Finest ingredients" },
  { icon: Truck, label: "Free Shipping", description: "On orders above ₹300" },
  { icon: IndianRupee, label: "Pay on Delivery", description: "COD available" },
];

export function TrustBar() {
  return (
    <section className="py-8 bg-[#FFF8F0] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="bg-white rounded-2xl p-4 md:p-5 flex items-center gap-3 md:gap-4 shadow-sm border border-[rgba(183,28,28,0.06)] hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#F9D976]/20 flex items-center justify-center shrink-0 group-hover:bg-[#F9D976]/30 transition-colors">
                <item.icon className="h-5 w-5 md:h-6 md:w-6 text-[#B71C1C]" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-sm md:text-base text-[#1A1A1A] leading-tight">{item.label}</p>
                <p className="text-[10px] md:text-xs text-[#666666] mt-0.5 truncate">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
