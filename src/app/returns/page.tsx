"use client";

import { motion } from "framer-motion";
import { RotateCcw, ShieldCheck, Clock, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  { icon: MessageCircle, title: "Contact Us", description: "Reach out within 48 hours of delivery with your order details and issue." },
  { icon: ShieldCheck, title: "We Review", description: "Our team reviews your concern and verifies the details within 24 hours." },
  { icon: RotateCcw, title: "Resolution", description: "We offer a replacement or full refund â€” your choice. No hassle, no questions." },
  { icon: Clock, title: "Quick Processing", description: "Refunds are processed within 5-7 business days to your original payment method." },
];

export default function ReturnsPage() {
  return (
    <div className="pt-10 md:pt-14">
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-deep">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Return & <span className="text-[#F9D976]">Exchange</span> Policy
            </h1>
            <p className="text-white/70 mt-4 text-lg max-w-lg mx-auto">
              We stand by the quality of every batch. If something&apos;s not right, we&apos;ll make it right.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-white border border-brand/8 p-8 md:p-10 rounded-[32px] mb-12">
              <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">Our Promise</h2>
              <p className="text-[#444444] leading-relaxed">
                Blue Dino is committed to delivering the freshest, highest-quality popcorn. If you receive a damaged,
                expired, or unsatisfactory product, we will replace it or issue a full refund â€” no questions asked.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-8 text-center">How It Works</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="text-center p-6"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-brand/5 flex items-center justify-center mb-4">
                    <s.icon className="h-8 w-8 text-brand" />
                  </div>
                  <h3 className="font-bold text-[#1A1A1A] mb-2">{s.title}</h3>
                  <p className="text-[#444444] text-sm leading-relaxed">{s.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-12 text-center p-8 rounded-2xl border border-brand/8"
          >
            <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">Need to initiate a return?</h3>
            <p className="text-[#444444] text-sm mb-6">Email us at bluedino.snacks@gmail.com with your order ID and we&apos;ll take it from there.</p>
            <Link href="/contact">
              <Button className="bg-brand hover:bg-brand-deep text-white rounded-xl shadow-lg shadow-brand/20">
                Contact Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
