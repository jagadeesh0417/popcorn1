"use client";

import { motion } from "framer-motion";
import { Truck, Package, Clock, MapPin } from "lucide-react";

const policies = [
  {
    icon: Truck,
    title: "Delivery Timeline",
    items: [
      "Orders are dispatched within 24 hours of placement",
      "Standard delivery: 2-3 business days across India",
      "Metro cities: 1-2 business days",
      "Remote locations: 3-5 business days",
    ],
  },
  {
    icon: Package,
    title: "Shipping Charges",
    items: [
      "Free shipping on all orders above ₹300",
      "Flat ₹40 shipping fee for orders below ₹300",
      "No hidden charges — what you see is what you pay",
      "COD orders include a nominal ₹20 convenience fee",
    ],
  },
  {
    icon: Clock,
    title: "Order Processing",
    items: [
      "All orders are freshly popped on the day of dispatch",
      "Orders placed before 2 PM are shipped the same day",
      "Orders placed after 2 PM are shipped the next business day",
      "You will receive a tracking link once your order ships",
    ],
  },
  {
    icon: MapPin,
    title: "Serviceable Areas",
    items: [
      "We currently deliver across all states in India",
      "Serviceable pin codes are verified at checkout",
      "International shipping coming soon — join our newsletter for updates",
      "Bulk/corporate orders can be arranged for any location",
    ],
  },
];

export default function ShippingPage() {
  return (
    <div className="pt-20">
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#DC0218] via-[#DC0218] to-[#C70015]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Shipping <span className="text-[#F9D976]">Policy</span>
            </h1>
            <p className="text-white/70 mt-4 text-lg max-w-lg mx-auto">
              How we get your popcorn fresh to your doorstep.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {policies.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-[#FFF8F0] p-8 rounded-2xl border border-[rgba(220,2,24,0.08)]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#DC0218]/5 flex items-center justify-center mb-5">
                  <p.icon className="h-6 w-6 text-[#DC0218]" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-4">{p.title}</h3>
                <ul className="space-y-2.5">
                  {p.items.map((item, j) => (
                    <li key={j} className="text-[#666666] text-sm flex items-start gap-2">
                      <span className="text-[#DC0218] mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-12 p-6 bg-[#FFF8F0] rounded-2xl border border-[rgba(220,2,24,0.08)] text-center"
          >
            <p className="text-[#666666] text-sm">
              For any shipping-related queries, contact us at <strong className="text-[#DC0218]">poprika.official@gmail.com</strong> or call <strong className="text-[#DC0218]">+91 8197175807</strong>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
