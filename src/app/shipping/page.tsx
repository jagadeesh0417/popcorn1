"use client";

import { motion } from "framer-motion";
import { MapPin, Bike, Truck } from "lucide-react";

const sections: {
  icon: typeof MapPin;
  title: string;
  badge: string | null;
  description: string;
  address?: React.ReactNode;
  items?: string[];
}[] = [
  {
    icon: MapPin,
    title: "Pick Up in Mysore",
    badge: "FREE",
    description:
      "Order online and collect your popcorn from our kitchen in Vijayanagar 4th Stage. Simply choose \"Mysuru Pickup\" during checkout and we'll notify you when your order is ready.",
    address: (
      <>
        #30, Sri Nivasa, RCE Layout
        <br />
        Vijayanagar 4th Stage
        <br />
        Mysore – 570032
      </>
    ),
  },
  {
    icon: Bike,
    title: "Home Delivery in Mysore",
    badge: null,
    description:
      "Fresh popcorn delivered right to your doorstep anywhere within Mysore city. Choose \"Local Delivery\" during checkout.",
    items: ["Same-day or next-day delivery depending on order time."],
  },
  {
    icon: Truck,
    title: "Pan-India Shipping",
    badge: null,
    description:
      "We ship across India via India Post. Orders are dispatched within 2 working days and usually arrive in 3–7 days, depending on your location.",
    items: ["Free shipping on orders over ₹399"],
  },
];

export default function ShippingPage() {
  return (
    <div className="pt-20">
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#DC0218] via-[#DC0218] to-[#C70015]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              How you&apos;ll <span className="text-[#F9D976]">get it</span>
            </h1>
            <p className="text-white/70 mt-4 text-lg max-w-lg mx-auto">
              Pickup, local delivery, and shipping options.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {sections.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#FFF8F0] p-8 rounded-2xl border border-[rgba(220,2,24,0.08)]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#DC0218]/5 flex items-center justify-center mb-5">
                  <s.icon className="h-6 w-6 text-[#DC0218]" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-bold text-[#1A1A1A]">{s.title}</h3>
                  {s.badge && (
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {s.badge}
                    </span>
                  )}
                </div>
                <p className="text-[#444444] text-sm leading-relaxed">{s.description}</p>
                {s.address && (
                  <div className="mt-4 p-4 bg-white rounded-xl border border-[rgba(220,2,24,0.06)] text-sm text-[#444444] leading-relaxed">
                    {s.address}
                  </div>
                )}
                {s.items && (
                  <ul className="mt-4 space-y-2">
                    {s.items.map((item, j) => (
                      <li key={j} className="text-[#444444] text-sm flex items-start gap-2">
                        <span className="text-[#DC0218] mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-12 p-6 bg-[#FFF8F0] rounded-2xl border border-[rgba(220,2,24,0.08)] text-center"
          >
            <p className="text-[#444444] text-sm">
              For any shipping-related queries, contact us at <strong className="text-[#DC0218]">poprika.official@gmail.com</strong> or call <strong className="text-[#DC0218]">+91 8197175807</strong>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
