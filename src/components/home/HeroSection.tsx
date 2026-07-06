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
      opacity: [0, 0.6, 0.6, 0],
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

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-[#B71C1C] via-[#C62828] to-[#D84315]">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

      {/* Floating particles */}
      <FloatingParticle duration={5} delay={0} xRange={20} yRange={12} className="top-[12%] left-[8%] text-2xl">
        🍿
      </FloatingParticle>
      <FloatingParticle duration={7} delay={1.2} xRange={18} yRange={10} className="top-[25%] right-[12%] text-xl">
        🌶️
      </FloatingParticle>
      <FloatingParticle duration={6} delay={0.6} xRange={15} yRange={14} className="bottom-[30%] left-[15%] text-lg">
        🍃
      </FloatingParticle>
      <FloatingParticle duration={8} delay={2} xRange={22} yRange={8} className="top-[40%] right-[8%] text-xl">
        ☕
      </FloatingParticle>
      <FloatingParticle duration={5.5} delay={0.3} xRange={12} yRange={16} className="bottom-[20%] right-[20%] text-2xl">
        🍿
      </FloatingParticle>
      <FloatingParticle duration={6.5} delay={1.8} xRange={16} yRange={11} className="top-[60%] left-[6%] text-lg">
        🌶️
      </FloatingParticle>

      {/* Glowing circles */}
      <motion.div
        className="absolute top-[15%] right-[20%] w-32 h-32 rounded-full bg-[#F9D976]/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[25%] left-[10%] w-40 h-40 rounded-full bg-white/5 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-[45%] left-[50%] w-24 h-24 rounded-full bg-[#F9D976]/5 blur-2xl"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

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
              <Button className="bg-white text-[#B71C1C] hover:bg-[#FFF8F0] hover:text-[#B71C1C] btn-small-caps px-8 h-12 text-xs shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/15 transition-shadow">
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
