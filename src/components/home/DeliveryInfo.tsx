"use client";

import { motion } from "framer-motion";
import { MapPin, Truck } from "lucide-react";

export function DeliveryInfo() {
  return (
    <section className="py-24 bg-[#FFF8F0]">
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
            className="bg-white p-8 border border-[rgba(183,28,28,0.08)]"
          >
            <div className="w-11 h-11 flex items-center justify-center mb-4 text-[#B71C1C] border border-[#B71C1C]/20">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-sm uppercase tracking-[0.06em] text-[#1A1A1A]">Local to Mysuru?</h3>
            <p className="text-[#666666] text-xs mt-3 leading-relaxed">
              Skip shipping. Pick up your order from our kitchen in Vijayanagar 4th Stage. Select &quot;Mysuru pickup&quot; at checkout.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 border border-[rgba(183,28,28,0.08)]"
          >
            <div className="w-11 h-11 flex items-center justify-center mb-4 text-[#B71C1C] border border-[#B71C1C]/20">
              <Truck className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-sm uppercase tracking-[0.06em] text-[#1A1A1A]">Everywhere else</h3>
            <p className="text-[#666666] text-xs mt-3 leading-relaxed">
              We ship pan-India via India Post. Orders go out within 2 working days. Delivery usually takes 3-7 days depending on where you are.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
