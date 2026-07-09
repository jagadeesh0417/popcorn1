"use client";

import { motion } from "framer-motion";
import { MapPin, Truck } from "lucide-react";

export function DeliverySection() {
  return (
    <section className="py-24 bg-[#FFF8F0] relative overflow-hidden">
      <motion.div
        className="absolute -right-20 -top-20 w-64 h-64 text-[#DC0218]/5"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 10C45 10 10 45 10 100s35 90 90 90 90-35 90-90S155 10 100 10z" stroke="currentColor" strokeWidth="1" fill="none" />
          <path d="M100 30C62 30 30 62 30 100s32 70 70 70 70-32 70-70-32-70-70-70z" stroke="currentColor" strokeWidth="0.5" fill="none" />
        </svg>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Delivery</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-3 text-[#1A1A1A]">
              Freshly Popped, Delivered from{" "}
              <span className="text-[#DC0218]">Mysuru</span>
            </h2>
            <p className="text-[#444444] mt-4 max-w-md leading-relaxed">
              Handcrafted in our Mysuru kitchen and delivered fresh across India within 24-48 hours.
              No preservatives, no shortcuts — just pure popcorn perfection.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: MapPin, text: "Handcrafted in Mysuru, Karnataka" },
                { icon: Truck, text: "Free delivery on orders above ₹300" },
                { icon: Truck, text: "Track your order in real-time" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#DC0218]/5 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-[#DC0218]" />
                  </div>
                  <span className="text-sm text-[#1A1A1A] font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-center relative"
          >
            <div className="relative w-[300px] h-[300px] md:w-[380px] md:h-[380px]">
              <svg viewBox="0 0 380 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <g opacity="0.08">
                  <path d="M190 10C90 10 10 90 10 190s80 180 180 180 180-80 180-180S290 10 190 10z" stroke="#DC0218" strokeWidth="2" fill="none" />
                </g>
                <g opacity="0.12">
                  <path d="M190 50C133 50 50 133 50 190s83 140 140 140 140-83 140-140S247 50 190 50z" stroke="#DC0218" strokeWidth="1.5" fill="none" />
                </g>
                <g opacity="0.15">
                  <path d="M250 95c-30-15-75-5-95 25s-10 75 20 95 75 5 95-25 10-75-20-95z" stroke="#F9D976" strokeWidth="1.5" fill="none" />
                  <circle cx="250" cy="95" r="4" fill="#DC0218" />
                  <circle cx="155" cy="120" r="4" fill="#DC0218" />
                  <circle cx="175" cy="195" r="4" fill="#DC0218" />
                </g>
                <text x="190" y="200" textAnchor="middle" dominantBaseline="central" fill="#1A1A1A" fontSize="14" fontWeight="600" opacity="0.6">MYSURU</text>
                <circle cx="190" cy="200" r="20" fill="#DC0218" opacity="0.1" stroke="#DC0218" strokeWidth="2" />
                <circle cx="190" cy="200" r="6" fill="#DC0218" />
              </svg>
              <motion.div
                className="absolute"
                style={{ top: "40%", left: "10%" }}
                animate={{ x: [0, 200, 0], y: [0, 30, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Truck className="h-8 w-8 text-[#DC0218]" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
