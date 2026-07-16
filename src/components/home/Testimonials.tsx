"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials: { id: string; name: string; rating: number; comment: string; role?: string }[] = [
  { id: "1", name: "Priya Sharma", rating: 5, comment: "The Ghee & Curry Leaf popcorn is absolutely incredible! It tastes just like home. My family can't get enough of it.", role: "Verified Buyer" },
  { id: "2", name: "Arun Kumar", rating: 5, comment: "Finally a popcorn brand that uses real ingredients. No palm oil, no artificial flavors — just pure, honest snacks. Love it!", role: "Verified Buyer" },
  { id: "3", name: "Divya Patel", rating: 5, comment: "Coffee Chikki is a game-changer. Sweet, crunchy, and that hint of coffee — perfect for evening chai. Already reordered!", role: "Verified Buyer" },
  { id: "4", name: "Ravi Deshmukh", rating: 5, comment: "Ordered the Trio to try all flavors. Ghee Black Pepper is my personal favorite. The quality speaks for itself.", role: "Verified Buyer" },
  { id: "5", name: "Ananya Iyer", rating: 5, comment: "As someone from Mysuru, I'm so proud this is made locally. Fresh, authentic, and delivered within 24 hours. Highly recommend!", role: "Verified Buyer" },
  { id: "6", name: "Vikram Reddy", rating: 4, comment: "Great product and excellent packaging. Would love to see a spicy masala flavor next! The quality is top notch.", role: "Verified Buyer" },
];

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
