"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-24 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#B71C1C]/5 flex items-center justify-center mb-6">
            <Mail className="h-8 w-8 text-[#B71C1C]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">Stay in the Pop Loop</h2>
          <p className="text-[#666666] mb-8 max-w-md mx-auto leading-relaxed">
            Subscribe for exclusive flavours, early access to new drops, and special discounts.
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
        </motion.div>
      </div>
    </section>
  );
}
