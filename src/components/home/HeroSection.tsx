"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-[#B71C1C] via-[#C62828] to-[#D84315]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="gold-rule mb-6" />
            <h1 className="text-[36px] sm:text-[48px] md:text-[60px] font-semibold text-white leading-[1.08] tracking-tight" style={{ fontFamily: "var(--font-playfair)" }}>
              Bold flavors.
              <br />
              Clean ingredients.
              <br />
              <span className="text-[#F9D976]">Made in Mysuru.</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.5 }}
            className="mt-5 text-white/80 text-sm md:text-base leading-relaxed max-w-lg"
          >
            Small-batch popcorn popped fresh in our Mysuru kitchen. No palm oil, no preservatives, no artificial anything. Just real spices, real ghee, and popcorn done properly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <Link href="/shop">
              <Button className="bg-white text-[#B71C1C] hover:bg-[#FFF8F0] hover:text-[#B71C1C] btn-small-caps px-8 h-12 text-xs">
                Shop the Range
              </Button>
            </Link>
            <Link href="/about" className="text-white/70 hover:text-white text-xs uppercase tracking-[0.12em] transition-colors flex items-center gap-1.5">
              Read our story <span className="text-sm">→</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
