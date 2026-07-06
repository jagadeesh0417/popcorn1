"use client";

import { motion } from "framer-motion";
import { Wheat, Flame, Shield, MapPin, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const storyPoints = [
  {
    year: "2024",
    title: "The Beginning",
    description: "Poprika was born in a small kitchen in Mysuru with a simple mission — create the finest gourmet popcorn using traditional Indian ingredients and techniques.",
  },
  {
    year: "2025",
    title: "Small Batches, Big Flavours",
    description: "We perfected our signature recipes — Ghee & Black Pepper, Coffee Chikki, Ghee & Curry Leaf — each crafted in small batches for peak freshness.",
  },
  {
    year: "2026",
    title: "Loved by Thousands",
    description: "From a Mysuru kitchen to homes across India. Thousands of customers, hundreds of 5-star reviews, and just getting started.",
  },
];

const values = [
  { icon: Wheat, title: "100% Natural", description: "No artificial flavours, preservatives, or palm oil. Ever." },
  { icon: Flame, title: "Small Batch", description: "Handcrafted daily in small batches for quality, not quantity." },
  { icon: Shield, title: "Premium Quality", description: "Only the finest kernels and freshest ingredients make the cut." },
  { icon: MapPin, title: "Proudly Mysuru", description: "Handcrafted with love in the cultural capital of Karnataka." },
  { icon: Award, title: "Customer First", description: "Your happiness is our success. We stand by every batch." },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#B71C1C] via-[#C62828] to-[#D84315]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-6">
              <Award className="h-4 w-4 text-[#F9D976]" /> Our Story
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Crafting <span className="text-[#F9D976]">Premium Popcorn</span>
              <br />from the Heart of Mysuru
            </h1>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-[#B71C1C] font-semibold text-sm uppercase tracking-[0.2em]">Our Mission</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 text-[#1A1A1A]">
                Popcorn Reimagined with <span className="text-[#B71C1C]">Indian Soul</span>
              </h2>
              <p className="text-[#666666] mt-6 leading-relaxed">
                Poprika started with a simple belief — great popcorn deserves great ingredients. We take the finest
                premium kernels and coat them with flavours inspired by India&apos;s rich culinary heritage.
              </p>
              <p className="text-[#666666] mt-4 leading-relaxed">
                From the ghee-laden kitchens of Mysuru to the spice bazaars of Kerala, every flavour tells a story.
                No palm oil. No artificial flavours. Just real food, made with love.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="bg-[#FFF8F0] rounded-[32px] p-8 md:p-12 text-center"
            >
              <div className="text-7xl mb-6">🍿</div>
              <h3 className="text-2xl font-bold text-[#1A1A1A] mb-3">Made in Mysuru</h3>
              <p className="text-[#666666] text-sm leading-relaxed">
                Every batch is handcrafted in our Mysuru kitchen, using traditional methods and premium ingredients
                sourced from across India.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#FFF8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-[#B71C1C] font-semibold text-sm uppercase tracking-[0.2em]">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-[#1A1A1A]">What We Stand For</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-[rgba(183,28,28,0.08)] text-center group hover:shadow-md transition-all duration-300"
              >
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#B71C1C]/5 flex items-center justify-center mb-4 group-hover:bg-[#B71C1C]/10 transition-colors">
                  <v.icon className="h-7 w-7 text-[#B71C1C]" />
                </div>
                <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">{v.title}</h3>
                <p className="text-[#666666] text-sm leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <span className="text-[#B71C1C] font-semibold text-sm uppercase tracking-[0.2em]">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-[#1A1A1A]">How It All Started</h2>
          </motion.div>
          <div className="max-w-3xl mx-auto space-y-12">
            {storyPoints.map((point, i) => (
              <motion.div
                key={point.year}
                initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative pl-12 border-l-2 border-[rgba(183,28,28,0.2)]"
              >
                <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-[#B71C1C] border-4 border-white shadow-sm" />
                <span className="text-[#B71C1C] font-bold text-sm">{point.year}</span>
                <h3 className="text-xl font-bold text-[#1A1A1A] mt-1">{point.title}</h3>
                <p className="text-[#666666] mt-2 leading-relaxed">{point.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#FFF8F0] text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">
              Ready to <span className="text-[#B71C1C]">Taste</span> the Difference?
            </h2>
            <p className="text-[#666666] mb-8 max-w-md mx-auto">Join thousands of happy customers who&apos;ve made the switch to real, handcrafted popcorn.</p>
            <Link href="/shop">
              <Button size="lg" className="bg-[#B71C1C] hover:bg-[#8E1414] text-white rounded-2xl px-10 h-14 text-base shadow-lg shadow-[#B71C1C]/20">
                Shop Our Flavours
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
