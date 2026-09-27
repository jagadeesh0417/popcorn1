"use client";

import { motion } from "framer-motion";
import { Wheat, Flame, Shield, MapPin, Award, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/brand";

const values = [
  { icon: Wheat, title: "100% Natural", description: "No artificial flavours, preservatives, or palm oil. Ever." },
  { icon: Flame, title: "Small Batch", description: "Handcrafted daily in small batches for quality, not quantity." },
  { icon: Shield, title: "Premium Quality", description: "Only the finest kernels and freshest ingredients make the cut." },
  { icon: MapPin, title: "Proudly Mysuru", description: "Handcrafted with love in the cultural capital of Karnataka." },
  { icon: Award, title: "Customer First", description: "Your happiness is our success. We stand by every batch." },
];

/** Brand story — wording supplied in the requirements. Do not paraphrase. */
const story = [
  "I’ve always loved popcorn. But every bag I picked up had the same things on the back: palm oil, artificial flavours, artificial colours and unnecessary additives.",
  "I also wondered why popcorn tastes the same everywhere. I wanted flavours that surprise you, inspired by the food we grew up with, alongside the classics everyone loves, made with real ingredients.",
  "That’s how Blue Dino (earlier known as Poprika) began, with one rule: taste comes first. We use real ghee, butter and coconut oil, keep our labels short and honest, and create flavours you won’t find anywhere else.",
  "I knew nothing about starting a food business. Recipes, packaging, food safety and branding were all learned one step at a time, and every recipe still has to pass my toughest critic, my mother.",
  "If you’re here today, you’re one of the first to be part of this journey. Every order supports a small business that’s just getting started, and I’m truly grateful for your trust.",
];

/** "Made with purpose" points — wording supplied in the requirements. */
const purposePoints = [
  "Taste comes first, always.",
  "Real ghee, butter and coconut oil. No palm oil.",
  "No artificial flavours or colours.",
  "Short, clean labels.",
  "Unique Indian flavours and classics, done right.",
];

export default function AboutPage() {
  return (
    <div className="pt-12">
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-deep">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-6">
              <Award className="h-4 w-4 text-gold" /> Our Story
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              <span className="text-gold">Our Story</span>
              <br />How a Love for Popcorn Became {BRAND.name}
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {story.map((paragraph) => (
                <p key={paragraph.slice(0, 32)} className="text-[#444444] leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
              <p className="text-[#444444] leading-relaxed font-medium mt-5">
                Thank you for being part of {BRAND.name}.
              </p>
              <p className="text-[#1A1A1A] font-semibold mt-4" style={{ fontFamily: "var(--font-playfair)" }}>
                &mdash; {BRAND.founder}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-brand-mist p-8 md:p-10 border border-brand/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="brand-rule" />
                <h3 className="text-xl font-bold text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
                  Made with purpose
                </h3>
              </div>
              <ul className="space-y-4">
                {purposePoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="w-6 h-6 shrink-0 mt-0.5 rounded-full bg-brand text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-[#444444] text-sm leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-brand font-semibold text-sm uppercase tracking-[0.2em]">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-[#1A1A1A]">What We Stand For</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-brand/10 text-center group hover:shadow-md transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-brand/5 flex items-center justify-center mb-4 group-hover:bg-brand/10 transition-colors">
                  <v.icon className="h-7 w-7 text-brand" />
                </div>
                <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">{v.title}</h3>
                <p className="text-[#444444] text-sm leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-[#FFF8F0] text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              Ready to <span className="text-brand">Taste</span> the Difference?
            </h2>
            <p className="text-[#444444] mb-8 max-w-md mx-auto">Join the customers who&apos;ve made the switch to real, handcrafted popcorn.</p>
            <Link href="/shop">
              <Button size="lg" className="bg-brand hover:bg-brand-deep text-white rounded-2xl px-10 h-14 text-base shadow-lg shadow-brand/20 focus-brand">
                Shop Our Flavours
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
