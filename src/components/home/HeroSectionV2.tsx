"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function HeroSectionV2() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: "70vh", background: "linear-gradient(135deg, #B71C1C 0%, #C62828 40%, #D84315 100%)" }}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

      {/* Soft radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl pointer-events-none" />

      {/* Glowing circles */}
      <motion.div
        className="absolute top-[12%] right-[22%] w-28 h-28 rounded-full bg-[#F9D976]/10 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.25, 0.5, 0.25] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[8%] w-36 h-36 rounded-full bg-white/5 blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.4, 0.15] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-[40%] left-[48%] w-20 h-20 rounded-full bg-[#F9D976]/5 blur-2xl"
        animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
          style={{ maxWidth: "760px", margin: "0 auto" }}
        >
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="text-[rgba(255,255,255,0.75)] text-xs sm:text-[11px] uppercase tracking-[0.35em] mb-5"
          >
            Small batch · Big flavor
          </motion.p>

          {/* Gold rule */}
          <div className="gold-rule mb-6" style={{ margin: "0 auto 1.5rem" }} />

          {/* Main heading */}
          <h1
            className="text-[32px] sm:text-[44px] md:text-[56px] font-bold text-white leading-[1.05] tracking-tight"
            style={{ fontFamily: "var(--font-playfair)", maxWidth: "700px", margin: "0 auto" }}
          >
            Bold flavors.
            <br />
            Clean ingredients.
            <br />
            <span className="text-[#F9D976]">Made in Mysuru.</span>
          </h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mt-4 text-white/80 text-sm md:text-base leading-relaxed"
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            Small-batch popcorn popped fresh in our Mysuru kitchen. No palm oil, no preservatives, no artificial anything. Just real spices, real ghee, and popcorn done properly.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/shop">
              <Button className="bg-white text-[#B71C1C] hover:bg-[#FFF8F0] hover:text-[#B71C1C] btn-small-caps px-8 h-12 text-xs shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15 transition-shadow">
                Shop the Range
              </Button>
            </Link>
            <Link href="/about" className="text-white/70 hover:text-white text-xs uppercase tracking-[0.12em] transition-colors flex items-center gap-1.5">
              Read our story <span className="text-sm">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
