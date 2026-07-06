"use client";

import { motion } from "framer-motion";
import { Wheat, Flame, Truck, Gift, Shield } from "lucide-react";

const features = [
  { icon: Wheat, title: "Fresh Ingredients", description: "We source the finest premium kernels and real, natural ingredients for every batch." },
  { icon: Flame, title: "Handcrafted Daily", description: "Each flavour is freshly handcrafted daily in small batches for peak perfection." },
  { icon: Gift, title: "Premium Packaging", description: "Elegant, resealable packaging that keeps your popcorn fresh and makes gifting effortless." },
  { icon: Truck, title: "Fast Delivery", description: "Freshly popped and packed, delivered to your doorstep within 24-48 hours." },
  { icon: Shield, title: "100% Quality Checked", description: "Every batch undergoes strict quality checks to ensure you get only the best." },
];

export function WhyChooseUs() {
  return (
    <section className="py-24 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="text-[#B71C1C] font-semibold text-sm uppercase tracking-[0.2em]">Why Popcorn</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-3 text-[#1A1A1A]">
            Why Choose Us
          </h2>
          <p className="text-[#666666] mt-4 max-w-xl mx-auto leading-relaxed">
            We don&apos;t just make popcorn. We create experiences worth savoring.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-[rgba(183,28,28,0.08)] text-center group"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#B71C1C]/5 flex items-center justify-center mb-4 group-hover:bg-[#B71C1C]/10 transition-colors">
                <feature.icon className="h-7 w-7 text-[#B71C1C]" />
              </div>
              <h3 className="font-bold text-sm text-[#1A1A1A] mb-2">{feature.title}</h3>
              <p className="text-[#666666] text-xs leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
