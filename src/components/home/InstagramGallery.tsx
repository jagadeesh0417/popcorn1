"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import Image from "next/image";
import { galleryImages } from "@/lib/data";

export function InstagramGallery() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="gold-rule" />
          </div>
          <h2 className="text-3xl md:text-4xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
            @poprika on Instagram
          </h2>
          <p className="text-[#666666] mt-3 text-xs uppercase tracking-[0.08em]">
            Follow the build — batch days, new flavors, and behind-the-scenes from the Mysuru kitchen.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {galleryImages.map((src, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="relative aspect-square overflow-hidden group cursor-pointer"
            >
              {/* TODO: connect Instagram API — replace placeholder images with live feed */}
              <Image
                src={src}
                alt={`Instagram post ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-[#B71C1C]/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="https://instagram.com/poprika"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B71C1C] text-xs uppercase tracking-[0.12em] font-medium hover:text-[#8E1414] transition-colors inline-flex items-center gap-1.5"
          >
            Follow us on Instagram <span className="text-sm">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
