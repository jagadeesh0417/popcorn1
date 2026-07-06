"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingKernels = [
  { top: "15%", left: "5%", size: 10, delay: 0, duration: 6 },
  { top: "25%", left: "85%", size: 8, delay: 0.5, duration: 7 },
  { top: "55%", left: "8%", size: 12, delay: 1, duration: 5.5 },
  { top: "70%", left: "90%", size: 9, delay: 1.5, duration: 6.5 },
  { top: "40%", left: "92%", size: 7, delay: 2, duration: 8 },
  { top: "80%", left: "15%", size: 11, delay: 2.5, duration: 5 },
  { top: "10%", left: "50%", size: 6, delay: 3, duration: 7.5 },
  { top: "85%", left: "75%", size: 10, delay: 3.5, duration: 6 },
];

const curryLeaves = [
  { top: "20%", left: "12%", delay: 0.3, duration: 7, rotation: -15 },
  { top: "60%", left: "88%", delay: 1.2, duration: 8, rotation: 20 },
  { top: "75%", left: "20%", delay: 2.5, duration: 6.5, rotation: -30 },
];

const peppercorns = [
  { top: "30%", left: "88%", delay: 0.8, duration: 5, size: 8 },
  { top: "45%", left: "5%", delay: 1.8, duration: 6, size: 6 },
  { top: "65%", left: "92%", delay: 2.8, duration: 5.5, size: 7 },
  { top: "12%", left: "80%", delay: 0.5, duration: 7, size: 5 },
];

const gheeDroplets = [
  { top: "35%", left: "85%", delay: 1, duration: 4, size: 6 },
  { top: "50%", left: "10%", delay: 2, duration: 5, size: 5 },
  { top: "72%", left: "82%", delay: 3, duration: 4.5, size: 7 },
];

const goldenCircles = [
  { top: "10%", left: "20%", size: 200, opacity: 0.08 },
  { top: "60%", left: "60%", size: 300, opacity: 0.05 },
  { top: "30%", left: "70%", size: 150, opacity: 0.06 },
];

const heroBadges = [
  { label: "100% Natural", emoji: "🌿" },
  { label: "No Palm Oil", emoji: "✓" },
  { label: "Made in Mysuru", emoji: "🏛️" },
  { label: "Small Batch", emoji: "👨‍🍳" },
];

export function HeroSection() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 500], [1, 0.95]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <motion.div
        style={{ y: heroY }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #B71C1C 0%, #C62828 35%, #D84315 75%, #FF6F00 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "256px 256px",
          }}
        />
        {goldenCircles.map((c, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              top: c.top, left: c.left,
              width: c.size, height: c.size,
              background: `radial-gradient(circle, rgba(249,217,118,${c.opacity}) 0%, transparent 70%)`,
            }}
          />
        ))}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.10) 0%, transparent 30%),
              radial-gradient(circle at 80% 60%, rgba(249,217,118,0.12) 0%, transparent 35%)
            `,
          }}
        />
        {floatingKernels.map((k, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/20 backdrop-blur-[1px]"
            style={{
              top: k.top, left: k.left,
              width: k.size, height: k.size,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 5, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: k.duration,
              delay: k.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        {curryLeaves.map((leaf, i) => (
          <motion.div
            key={`leaf-${i}`}
            className="absolute w-6 h-3 opacity-30"
            style={{ top: leaf.top, left: leaf.left }}
            animate={{
              y: [0, -15, 0],
              rotate: [leaf.rotation, leaf.rotation + 10, leaf.rotation],
            }}
            transition={{
              duration: leaf.duration,
              delay: leaf.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <svg viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C6 0 2 4 0 6c4 2 8 6 12 6s8-4 12-6c-4-2-8-6-12-6z" fill="#4CAF50" opacity="0.8"/>
            </svg>
          </motion.div>
        ))}
        {peppercorns.map((p, i) => (
          <motion.div
            key={`pepper-${i}`}
            className="absolute rounded-full"
            style={{
              top: p.top, left: p.left,
              width: p.size, height: p.size,
              background: "radial-gradient(circle at 35% 35%, #5D4037, #2C1A0E)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
            }}
            animate={{
              y: [0, -8, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        {gheeDroplets.map((g, i) => (
          <motion.div
            key={`ghee-${i}`}
            className="absolute rounded-full"
            style={{
              top: g.top, left: g.left,
              width: g.size, height: g.size,
              background: "radial-gradient(circle at 40% 40%, #F9D976, #E6A817)",
              boxShadow: "0 0 6px rgba(249,217,118,0.4)",
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: g.duration,
              delay: g.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      <motion.div style={{ opacity, scale }} className="relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full mb-8"
              >
                <Sparkles className="h-4 w-4 text-[#F9D976]" />
                <span className="text-white/90 text-sm font-medium">Artisanal Popcorn from Mysuru</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="text-[40px] sm:text-[52px] md:text-[72px] font-bold text-white leading-[1.05] tracking-tight"
                style={{ fontFamily: "var(--font-poppins)", fontWeight: 800 }}
              >
                Freshly Popped
                <br />
                <span className="text-[#F9D976]">Happiness</span>
                <br />
                Delivered To Your
                <br />
                Doorstep
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-6 text-lg text-white/80 max-w-lg leading-relaxed font-light"
              >
                Handcrafted in small batches with premium ingredients and traditional Mysuru recipes.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="mt-10 flex flex-col sm:flex-row gap-4"
              >
                <Link href="/shop">
                  <Button
                    size="lg"
                    className="bg-white text-[#B71C1C] hover:bg-[#FFF8F0] hover:text-[#B71C1C] font-semibold px-10 h-14 text-base rounded-2xl shadow-2xl shadow-black/20 w-full sm:w-auto transition-all duration-300"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/shop">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10 hover:text-white px-10 h-14 text-base rounded-2xl w-full sm:w-auto transition-all duration-300"
                  >
                    Explore Flavours
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="mt-14 flex items-center gap-8 md:gap-12"
              >
                {[
                  { number: "15+", label: "Flavours" },
                  { number: "10K+", label: "Happy Customers" },
                  { number: "4.9", label: "Avg. Rating" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-3xl md:text-4xl font-bold text-white">{stat.number}</div>
                    <div className="text-white/60 text-sm mt-1">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="hidden lg:flex justify-center items-center relative"
            >
              <div className="relative w-[460px] h-[500px] flex items-center justify-center">
                <div className="absolute inset-0 bg-white/[0.06] rounded-full blur-[80px]" />
                <div className="absolute w-[380px] h-[380px] rounded-full border border-white/15 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-[2px]" />
                <div className="absolute w-[320px] h-[320px] rounded-full border border-[#F9D976]/20 bg-[#F9D976]/[0.03]" />
                <div className="relative flex flex-col items-center justify-center">
                  <div className="text-[100px] leading-none mb-2 select-none">🍿</div>
                  <div className="flex flex-wrap justify-center gap-3 max-w-[260px] mt-2">
                    <span className="text-2xl opacity-60">🌿</span>
                    <span className="text-2xl opacity-50">🫘</span>
                    <span className="text-2xl opacity-60">🫚</span>
                    <span className="text-2xl opacity-50">🧈</span>
                  </div>
                  <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-[280px]">
                    {heroBadges.map((badge) => (
                      <motion.div
                        key={badge.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 + heroBadges.indexOf(badge) * 0.1 }}
                        className="flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10"
                      >
                        <span className="text-[10px]">{badge.emoji}</span>
                        <span className="text-white text-[10px] font-medium whitespace-nowrap">{badge.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
