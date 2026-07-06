"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <motion.div
        style={{ y: heroY }}
        className="absolute inset-0 bg-gradient-to-br from-[#B71C1C] via-[#C62828] to-[#D84315]"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-white/[0.04] rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-white/30 rounded-full animate-float" />
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-white/25 rounded-full animate-float-delayed" />
        <div className="absolute bottom-1/3 right-1/3 w-4 h-4 bg-white/20 rounded-full animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/4 w-2.5 h-2.5 bg-white/25 rounded-full animate-float-delayed" style={{ animationDelay: "1s" }} />
      </motion.div>

      <motion.div style={{ opacity }} className="relative w-full">
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
                <span className="text-white/90 text-sm font-medium">Premium Gourmet Popcorn</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="text-[40px] sm:text-[52px] md:text-[72px] font-bold text-white leading-[1.05] tracking-tight"
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
                Crafted with premium kernels, real ingredients and unforgettable flavours.
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
              <div className="relative w-[400px] h-[400px]">
                <div className="absolute inset-0 bg-white/[0.06] rounded-full blur-[60px]" />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-white/10 to-white/[0.02] backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden">
                  <div className="text-center">
                    <div className="w-56 h-56 mx-auto rounded-full bg-white/[0.06] mb-6 flex items-center justify-center relative">
                      <span className="text-8xl animate-float">🍿</span>
                      {[
                        [15, 20], [70, 10], [45, 75], [10, 60], [80, 45], [55, 30]
                      ].map(([t, l], i) => (
                        <div
                          key={i}
                          className="absolute w-3 h-3 bg-white/20 rounded-full animate-float"
                          style={{
                            top: `${t}%`,
                            left: `${l}%`,
                            animationDelay: `${i * 0.4}s`,
                            animationDuration: `${4 + (i % 3) * 1.5}s`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-white/60">
                      <Shield className="h-4 w-4 text-[#F9D976]" />
                      <span className="text-sm font-medium text-white/80">Premium Quality Since 2024</span>
                    </div>
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
