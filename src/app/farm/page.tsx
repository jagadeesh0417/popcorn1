"use client";

import { motion } from "framer-motion";
import { Wheat, Leaf, Sparkles, Droplets } from "lucide-react";

const values = [
  { icon: Wheat, title: "Small-Batch Craft", desc: "Every batch is popped in small quantities to ensure maximum freshness and quality control." },
  { icon: Leaf, title: "Real Ingredients", desc: "We use only real ghee, authentic Indian spices, and natural flavorings — no shortcuts." },
  { icon: Sparkles, title: "No Palm Oil", desc: "Unlike most packaged popcorn, we never use palm oil. Every kernel is popped in pure desi ghee." },
  { icon: Droplets, title: "Made in Mysuru", desc: "Our kitchen is in the heart of Mysuru, Karnataka — where tradition meets quality." },
];

export default function FarmPage() {
  return (
    <div className="pt-20">
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#DC0218] via-[#DC0218] to-[#C70015]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Our <span className="text-[#F9D976]">Kitchen</span>
            </h1>
            <p className="text-white/70 mt-4 text-lg max-w-lg mx-auto">
              Where bold flavors meet clean ingredients — handcrafted in Mysuru with love.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-20">
            <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Our Philosophy</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-[#1A1A1A]">Real Food. Real Ingredients.</h2>
            <p className="text-[#444444] mt-4 leading-relaxed">
              Poprika was born from a simple belief: popcorn should taste like popcorn — not chemicals.
              We start with premium non-GMO corn, pop it in pure desi ghee, and coat it with real Indian spices.
              No palm oil. No artificial flavors. No preservatives.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {values.map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-[#FFF8F0] p-8 border border-[rgba(220,2,24,0.06)]">
                <div className="w-12 h-12 rounded-xl bg-[#DC0218]/5 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-[#DC0218]" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A]">{item.title}</h3>
                <p className="text-[#444444] text-sm mt-2 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
