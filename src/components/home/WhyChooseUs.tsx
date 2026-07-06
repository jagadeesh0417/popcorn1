"use client";

import { motion } from "framer-motion";

const points = [
  {
    title: "No palm oil. Ever.",
    description: "We use cow ghee amul butter. That's it. No hydrogenated fats, no cheap substitutes.",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
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
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#FFFDF9] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <p className="text-[#666666] mt-3 text-sm uppercase tracking-[0.08em]">
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
              className="flex gap-5"
            >
              <div className="w-11 h-11 flex items-center justify-center shrink-0 text-[#F9D976] border border-[#F9D976]/30">
                {point.svg}
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#1A1A1A] uppercase tracking-[0.06em]">{point.title}</h3>
                <p className="text-[#666666] text-xs mt-1.5 leading-relaxed">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
