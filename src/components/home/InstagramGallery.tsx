"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import Image from "next/image";
import { galleryImages } from "@/lib/data";

export function InstagramGallery() {
  return (
    <section className="py-24 bg-[#FFF8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <span className="text-[#B71C1C] font-semibold text-sm uppercase tracking-[0.2em]">Follow Us</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-3 text-[#1A1A1A]">@popcorn on Instagram</h2>
          <p className="text-[#666666] mt-4 max-w-xl mx-auto leading-relaxed">
            Tag us in your popcorn moments for a chance to be featured
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {galleryImages.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer"
            >
              <Image
                src={src}
                alt={`Instagram post ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              />
              <div className="absolute inset-0 bg-[#B71C1C]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <Camera className="h-8 w-8 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
