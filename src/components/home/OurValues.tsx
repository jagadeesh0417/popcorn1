"use client";

import { motion } from "framer-motion";
import { BRAND_VALUES } from "@/lib/brand-values";

export function OurValues() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-14"
        >
          <div className="flex justify-center mb-4">
            <div className="brand-rule" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
            Our Values
          </h2>
          <p className="text-[#444444] mt-3 text-sm uppercase tracking-[0.08em]">What we stand for</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          {BRAND_VALUES.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] p-8 bg-brand-mist border border-brand/10 rounded-[18px] text-center group hover:shadow-[0_12px_32px_rgba(22,63,150,0.12)] hover:border-brand/30 transition-all duration-300"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white shadow-[0_4px_12px_rgba(31,85,199,0.08)] flex items-center justify-center mb-4 group-hover:bg-brand group-hover:shadow-[0_6px_16px_rgba(31,85,199,0.3)] transition-all duration-300">
                <value.icon className="h-7 w-7 text-brand group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">{value.title}</h3>
              <p className="text-[#444444] text-sm leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
