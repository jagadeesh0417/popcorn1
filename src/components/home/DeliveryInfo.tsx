"use client";

import { motion } from "framer-motion";
import { MapPin, Truck } from "lucide-react";

export function DeliveryInfo() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="gold-rule" />
          </div>
          <h2 className="text-3xl md:text-4xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
            How you&apos;ll get it
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4, boxShadow: "0 12px 35px rgba(0,0,0,0.06)" }}
            className="bg-[#FFFDF9] p-8 border border-[rgba(0,0,0,0.05)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300"
          >
            <div className="w-12 h-12 flex items-center justify-center mb-5 bg-[#FFF8F0] border border-[rgba(183,28,28,0.1)]">
              <MapPin className="h-5 w-5 text-[#B71C1C]" />
            </div>
            <h3 className="font-semibold text-sm uppercase tracking-[0.06em] text-[#1A1A1A]">Local to Mysuru?</h3>
            <p className="text-[#666666] text-xs mt-3 leading-relaxed">
              Skip shipping. Pick up your order from our kitchen in Vijayanagar 4th Stage, Mysore. Select &quot;Mysuru pickup&quot; at checkout and we&apos;ll have your popcorn ready.
            </p>
            <div className="mt-5 pt-4 border-t border-[rgba(0,0,0,0.05)]">
              <p className="text-[#999999] text-[10px] uppercase tracking-[0.08em]">#30, Sri Nivasa · RCE Layout · Vijayanagar 4th Stage · Mysore – 570032</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4, boxShadow: "0 12px 35px rgba(0,0,0,0.06)" }}
            className="bg-[#FFFDF9] p-8 border border-[rgba(0,0,0,0.05)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300"
          >
            <div className="w-12 h-12 flex items-center justify-center mb-5 bg-[#FFF8F0] border border-[rgba(183,28,28,0.1)]">
              <Truck className="h-5 w-5 text-[#B71C1C]" />
            </div>
            <h3 className="font-semibold text-sm uppercase tracking-[0.06em] text-[#1A1A1A]">Everywhere else in India</h3>
            <p className="text-[#666666] text-xs mt-3 leading-relaxed">
              We ship pan-India via India Post. Orders go out within 2 working days. Delivery usually takes 3-7 days depending on your location.
            </p>
            <div className="mt-5 pt-4 border-t border-[rgba(0,0,0,0.05)]">
              <p className="text-[#999999] text-[10px] uppercase tracking-[0.08em]">Free shipping on orders over ₹399</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
