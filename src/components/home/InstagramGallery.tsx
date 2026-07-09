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
              whileHover={{ scale: 1.02 }}
              className="relative aspect-square overflow-hidden group cursor-pointer shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] transition-all duration-500"
            >
              {/* TODO: connect Instagram API — replace placeholder images with live feed */}
              <Image
                src={src}
                alt={`Instagram post ${index + 1}`}
                fill
                className="object-cover transition-all duration-500 ease-out group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-[#DC0218]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  className="w-14 h-14 rounded-full border-2 border-white/80 flex items-center justify-center"
                >
                  <Camera className="h-6 w-6 text-white" />
                </motion.div>
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
            className="text-[#DC0218] text-xs uppercase tracking-[0.12em] font-medium hover:text-[#C70015] transition-colors inline-flex items-center gap-1.5"
          >
            Follow us on Instagram <span className="text-sm">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
