"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const faqs = [
  {
    q: "What makes Poprika popcorn different?",
    a: "Poprika is handcrafted in small batches in Mysuru using 100% natural ingredients. We use premium kernels, real ghee, and traditional Indian flavours. No palm oil, no artificial preservatives, no shortcuts.",
  },
  {
    q: "How long does delivery take?",
    a: "We deliver across India within 24-48 hours via our partner couriers. Orders are freshly popped and packed on the day of dispatch to ensure peak freshness.",
  },
  {
    q: "Do you offer free shipping?",
    a: "We offer free shipping on all orders across India.",
  },
  {
    q: "What is your return policy?",
    a: "We stand by the quality of our popcorn. If you're not satisfied with your order, contact us within 48 hours of delivery and we'll make it right — including a replacement or full refund.",
  },
  {
    q: "How should I store my popcorn?",
    a: "Store in a cool, dry place away from direct sunlight. Once opened, consume within 5-7 days for the best crunch. Our resealable packaging helps maintain freshness.",
  },
  {
    q: "Are your products gluten-free?",
    a: "Yes, all our popcorn is naturally gluten-free. However, our facility also processes other ingredients, so we recommend checking individual product labels for specific allergen information.",
  },
  {
    q: "Do you use palm oil?",
    a: "No. We never use palm oil in any of our products. We use pure ghee, cold-pressed coconut oil, and premium sunflower oil instead.",
  },
  {
    q: "Can I order in bulk for events or corporate gifting?",
    a: "Absolutely! We offer bulk orders and custom corporate gifting solutions. Contact us at poprika.official@gmail.com with your requirements and we'll create a tailored package.",
  },
  {
    q: "Do you ship internationally?",
    a: "Currently we ship across India. We're working on expanding internationally — stay tuned for updates!",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, UPI (Google Pay, PhonePe, Paytm), net banking, and Cash on Delivery (COD) for eligible orders.",
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = faqs.filter((f) =>
    f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-20">
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#DC0218] via-[#DC0218] to-[#C70015]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Frequently Asked <span className="text-[#F9D976]">Questions</span>
            </h1>
            <p className="text-white/70 mt-4 text-lg max-w-lg mx-auto">
              Everything you need to know about Poprika.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#444444]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search FAQs..."
                className="pl-12 rounded-xl border-[rgba(220,2,24,0.12)]"
              />
            </div>
          </motion.div>

          <div className="space-y-3">
            {filtered.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="border border-[rgba(220,2,24,0.1)] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-[#FFF8F0] transition-colors"
                >
                  <span className="font-semibold text-[#1A1A1A] text-sm pr-4">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-[#DC0218] shrink-0 transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`} />
                </button>
                {openIndex === i && (
                  <div className="px-5 pb-5">
                    <p className="text-[#444444] text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
