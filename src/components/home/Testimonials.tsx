"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";

export function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Testimonials</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-3 text-[#1A1A1A]">What Our Customers Say</h2>
          <p className="text-[#444444] mt-4 max-w-xl mx-auto leading-relaxed">
            Real reviews from real popcorn lovers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-[rgba(220,2,24,0.08)] relative"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-[#DC0218]/10" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#DC0218]/10 flex items-center justify-center text-[#DC0218] font-bold text-sm">
                  {testimonial.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#1A1A1A]">{testimonial.name}</p>
                  {testimonial.role && <p className="text-[#444444] text-xs">{testimonial.role}</p>}
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < testimonial.rating ? "text-[#F9D976] fill-[#F9D976]" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-[#444444] text-sm leading-relaxed">&ldquo;{testimonial.comment}&rdquo;</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
