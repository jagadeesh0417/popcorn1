"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

/** Points are specified in the Blue Dino requirements — wording is intentional. */
const points = [
  "Taste comes first, always.",
  "Real ghee, butter and coconut oil. No palm oil.",
  "No artificial flavours or colours.",
  "Short, clean labels.",
  "Unique Indian flavours and classics, done right.",
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-brand-mist relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231F55C7' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
            Made with purpose
          </h2>
          <p className="text-[#444444] mt-3 text-sm uppercase tracking-[0.08em]">
            Taste comes first. Everything else follows.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {points.map((point, i) => (
            <motion.div
              key={point}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="flex gap-4 p-6 bg-white border border-brand/10 shadow-[0_4px_16px_rgba(22,63,150,0.06)] hover:shadow-[0_12px_32px_rgba(22,63,150,0.12)] hover:border-brand/30 transition-all duration-300 rounded-[18px] group"
            >
              <div className="w-8 h-8 flex items-center justify-center shrink-0 text-white bg-brand shadow-[0_4px_12px_rgba(31,85,199,0.25)] rounded-full transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-deep">
                <Check className="w-4 h-4" strokeWidth={3} />
              </div>
              <p className="flex-1 text-[#1A1A1A] text-sm md:text-base font-medium leading-relaxed self-center">
                {point}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
