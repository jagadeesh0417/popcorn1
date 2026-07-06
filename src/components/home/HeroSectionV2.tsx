"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const FloatingParticle = ({ children, duration = 6, delay = 0, xRange = 15, yRange = 10, className = "" }: {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  xRange?: number;
  yRange?: number;
  className?: string;
}) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    initial={{ opacity: 0 }}
    animate={{
      opacity: [0, 0.5, 0.5, 0],
      x: [0, xRange, -xRange, 0],
      y: [0, -yRange, yRange * 0.5, 0],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "linear",
    }}
  >
    {children}
  </motion.div>
);

export function HeroSectionV2() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#B71C1C] via-[#C62828] to-[#D84315]" style={{ minHeight: "70vh" }}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

      {/* Floating particles — scaled down ~85% */}
      <FloatingParticle duration={5} delay={0} xRange={16} yRange={10} className="top-[10%] left-[6%] text-xl opacity-[.85]">
        🍿
      </FloatingParticle>
      <FloatingParticle duration={7} delay={1.2} xRange={14} yRange={8} className="top-[20%] right-[10%] text-lg opacity-[.85]">
        🌶️
      </FloatingParticle>
      <FloatingParticle duration={6} delay={0.6} xRange={12} yRange={11} className="bottom-[25%] left-[12%] text-base opacity-[.85]">
        🍃
      </FloatingParticle>
      <FloatingParticle duration={8} delay={2} xRange={18} yRange={6} className="top-[35%] right-[6%] text-lg opacity-[.85]">
        ☕
      </FloatingParticle>
      <FloatingParticle duration={5.5} delay={0.3} xRange={10} yRange={13} className="bottom-[15%] right-[18%] text-xl opacity-[.85]">
        🍿
      </FloatingParticle>
      <FloatingParticle duration={6.5} delay={1.8} xRange={13} yRange={9} className="top-[55%] left-[4%] text-base opacity-[.85]">
        🌶️
      </FloatingParticle>

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
