"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-24 relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #FFF8F0, #FFF3E0)",
        }}
      />
      <div className="absolute top-0 right-0 text-[#B71C1C]/3 text-8xl select-none pointer-events-none leading-none">🍿</div>
      <div className="absolute bottom-0 left-4 text-[#B71C1C]/3 text-7xl select-none pointer-events-none leading-none rotate-12">🍿</div>
      <div className="absolute top-1/2 left-1/4 text-[#F9D976]/10 text-5xl select-none pointer-events-none leading-none">🌾</div>
      <div className="absolute bottom-1/4 right-1/3 text-[#F9D976]/10 text-4xl select-none pointer-events-none leading-none">✨</div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-2xl mx-auto"
        >
          <div
            className="p-8 md:p-12 rounded-[32px] shadow-lg border border-[rgba(183,28,28,0.08)]"
            style={{
              background: "linear-gradient(135deg, #FFF8F0, #FFF3E0)",
            }}
          >
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
                Join the <span className="text-[#B71C1C]">Poprika</span> Club
              </h2>
              <p className="text-[#666666] mb-8 max-w-md mx-auto leading-relaxed">
                Be the first to know about new flavours, exclusive drops, and special offers.
              </p>
              <form
                onSubmit={(e) => { e.preventDefault(); setEmail(""); }}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-5 py-3.5 rounded-2xl bg-white border border-[rgba(183,28,28,0.12)] text-[#1A1A1A] placeholder:text-[#666666] focus:outline-none focus:border-[#B71C1C] transition-colors shadow-sm"
                />
                <Button type="submit" className="bg-[#B71C1C] text-white hover:bg-[#8E1414] font-semibold px-8 rounded-2xl h-12 transition-all duration-300 shadow-lg shadow-[#B71C1C]/20">
                  <Send className="h-4 w-4 mr-2" />
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
