"use client";

import { motion } from "framer-motion";
import { FileText, ShoppingBag, CreditCard, AlertTriangle } from "lucide-react";

const sections = [
  {
    icon: ShoppingBag,
    title: "Orders & Acceptance",
    content: "By placing an order on Blue Dino, you agree to purchase our products in accordance with these terms. We reserve the right to cancel any order due to stock unavailability, pricing errors, or suspected fraudulent activity. You will be notified and fully refunded in such cases.",
  },
  {
    icon: CreditCard,
    title: "Payments & Pricing",
    content: "All prices are in Indian Rupees (â‚¹) and inclusive of applicable taxes. We accept payments via Razorpay gateway. Prices are subject to change without prior notice. Promotional discounts cannot be combined unless explicitly stated.",
  },
  {
    icon: AlertTriangle,
    title: "Intellectual Property",
    content: "All content on this website â€” including text, images, logos, and product descriptions â€” is the property of Blue Dino and is protected by applicable copyright and trademark laws. Unauthorized use or reproduction is strictly prohibited.",
  },
  {
    icon: FileText,
    title: "Limitation of Liability",
    content: "Blue Dino shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability is limited to the purchase value of the product in question.",
  },
];

export default function TermsPage() {
  return (
    <div className="pt-10 md:pt-14">
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-brand via-brand to-brand-deep">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Terms of <span className="text-[#F9D976]">Service</span>
            </h1>
            <p className="text-white/70 mt-4 text-lg max-w-lg mx-auto">
              Please read these terms carefully before using our website.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-16"
          >
            <p className="text-[#444444] leading-relaxed">
              Last updated: July 2026. By accessing or using the Blue Dino website, you agree to be bound by these Terms of Service.
              If you do not agree with any part of these terms, please do not use our services.
            </p>
          </motion.div>

          <div className="space-y-8">
            {sections.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white p-8 rounded-2xl border border-brand/8"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand/5 flex items-center justify-center shrink-0">
                    <s.icon className="h-6 w-6 text-brand" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">{s.title}</h3>
                    <p className="text-[#444444] text-sm leading-relaxed">{s.content}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-12 p-6 rounded-2xl border border-brand/8 text-center"
          >
            <p className="text-[#444444] text-sm">
              For any questions regarding these terms, contact us at <strong className="text-brand">bluedino.snacks@gmail.com</strong>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
