"use client";

import { motion } from "framer-motion";

const points = [
  {
    title: "No palm oil. Ever.",
    description: "We use cow ghee amul butter. That's it. No hydrogenated fats, no cheap substitutes.",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2a8 8 0 0 0-8 8c0 4 8 10 8 10s8-6 8-10a8 8 0 0 0-8-8z" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="10" y1="3" x2="8" y2="8" />
      </svg>
    ),
  },
  {
    title: "Real spices, not preservatives",
    description: "No flavor mixes, no seasoning powders, no anti-caking agents. Bold Indian flavors built from single spices, the way they're meant to be tasted.",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Popped in small batches",
    description: "Every batch is handmade in small batches in our Mysuru kitchen. What you get was made this week, not last quarter.",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    title: "Made in Mysuru",
    description: "Founder-led, one kitchen, one team. When you order, you're ordering from us — not a factory.",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-[#FFF5EC] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B71C1C' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: "60px 60px",
      }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <div className="gold-rule" />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
            Why Poprika
          </h2>
          <p className="text-[#444444] mt-3 text-sm uppercase tracking-[0.08em]">
            Most popcorn brands cut corners. We don&apos;t.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {points.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className="flex gap-5 p-6 bg-[#FFF8F0] border border-[#E8C56A] shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 rounded-[18px] group"
            >
              <div className="w-10 h-10 flex items-center justify-center shrink-0 text-[#DC0218] bg-[#FFF5EC] border border-[#F9D976] shadow-[0_4px_12px_rgba(249,217,118,0.2)] rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_6px_20px_rgba(249,217,118,0.35)]">
                {point.svg}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm text-[#1A1A1A] uppercase tracking-[0.06em]">{point.title}</h3>
                <p className="text-[#555555] text-xs mt-2 leading-relaxed">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
