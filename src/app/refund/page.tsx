"use client";

import { motion } from "framer-motion";
import { IndianRupee, Clock, ShieldCheck, CreditCard } from "lucide-react";

const refundPolicies = [
  {
    icon: IndianRupee,
    title: "Full Refund",
    description: "If your order arrives damaged, expired, or incorrect, you are eligible for a 100% refund including shipping charges.",
  },
  {
    icon: Clock,
    title: "Refund Timeline",
    description: "Refunds are processed within 5-7 business days after the return is approved. The amount is credited to your original payment method.",
  },
  {
    icon: ShieldCheck,
    title: "Eligibility",
    description: "Claims must be raised within 48 hours of delivery. We may request photographic evidence of the issue for quality assurance.",
  },
  {
    icon: CreditCard,
    title: "Payment Method",
    description: "Refunds are issued to the same payment method used at checkout. For COD orders, we will transfer the amount to your bank account.",
  },
];

export default function RefundPage() {
  return (
    <div className="pt-20">
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#B71C1C] via-[#C62828] to-[#D84315]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Refund <span className="text-[#F9D976]">Policy</span>
            </h1>
            <p className="text-white/70 mt-4 text-lg max-w-lg mx-auto">
              Your satisfaction is our priority.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {refundPolicies.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#FFF8F0] p-8 rounded-2xl border border-[rgba(183,28,28,0.08)]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#B71C1C]/5 flex items-center justify-center mb-5">
                  <p.icon className="h-6 w-6 text-[#B71C1C]" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">{p.title}</h3>
                <p className="text-[#666666] text-sm leading-relaxed">{p.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-12 p-8 rounded-2xl border border-[rgba(183,28,28,0.08)]"
          >
            <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">Important Notes</h3>
            <ul className="space-y-2">
              {[
                "Refunds are only applicable for products purchased directly from the Poprika website.",
                "We reserve the right to refuse a refund if the product has been consumed beyond a reasonable amount.",
                "Promotional or discounted items may be subject to different refund terms.",
                "Shipping charges are non-refundable for change-of-mind cancellations.",
              ].map((note, i) => (
                <li key={i} className="text-[#666666] text-sm flex items-start gap-2">
                  <span className="text-[#B71C1C] mt-0.5">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
