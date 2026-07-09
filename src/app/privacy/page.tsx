"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database } from "lucide-react";

const sections = [
  {
    icon: Shield,
    title: "Information We Collect",
    content: "We collect information you provide directly — name, email address, phone number, shipping address, and payment details. We also automatically collect certain technical data like IP address, browser type, and device information to improve your shopping experience.",
  },
  {
    icon: Lock,
    title: "How We Use Your Data",
    content: "Your data is used to process orders, deliver products, send order updates, respond to inquiries, improve our services, and send promotional communications (only with your consent). We never sell your personal information to third parties.",
  },
  {
    icon: Eye,
    title: "Data Protection",
    content: "We implement industry-standard security measures including SSL encryption, secure payment gateways, and regular security audits. Your payment information is processed directly by Razorpay and is never stored on our servers.",
  },
  {
    icon: Database,
    title: "Your Rights",
    content: "You have the right to access, correct, or delete your personal data at any time. You can unsubscribe from marketing emails at any time. For data-related requests, email us at poprika.official@gmail.com.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="pt-20">
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#B71C1C] via-[#C62828] to-[#D84315]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Privacy <span className="text-[#F9D976]">Policy</span>
            </h1>
            <p className="text-white/70 mt-4 text-lg max-w-lg mx-auto">
              How we handle and protect your personal data.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="prose max-w-none mb-16"
          >
            <p className="text-[#666666] leading-relaxed">
              Last updated: July 2026. At Poprika, we take your privacy seriously. This policy describes how we collect,
              use, and protect your personal information when you use our website and services.
            </p>
          </motion.div>

          <div className="space-y-8">
            {sections.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#FFF8F0] p-8 rounded-2xl border border-[rgba(183,28,28,0.08)]"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#B71C1C]/5 flex items-center justify-center shrink-0">
                    <s.icon className="h-6 w-6 text-[#B71C1C]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{s.title}</h3>
                    <p className="text-[#666666] text-sm leading-relaxed">{s.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-12 p-6 rounded-2xl border border-[rgba(183,28,28,0.08)] text-center"
          >
            <p className="text-[#666666] text-sm">
              Questions about privacy? Contact us at <strong className="text-[#B71C1C]">poprika.official@gmail.com</strong>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
