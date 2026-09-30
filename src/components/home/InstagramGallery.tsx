"use client";

import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import Image from "next/image";
import { InstagramIcon } from "@/components/brand/InstagramIcon";
import { BRAND, SOCIAL } from "@/lib/brand";

const galleryImages = [
  "/insta-1.png",
  "/insta-2.png",
  "/insta-3.png",
];

const externalLinkProps = {
  target: "_blank",
  rel: "noopener noreferrer",
} as const;

export function InstagramGallery() {
  const instagramUrl = SOCIAL.instagram;

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="brand-rule" />
          </div>
          <h2 className="text-3xl md:text-4xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
            {instagramUrl ? (
              <a
                href={instagramUrl}
                {...externalLinkProps}
                className="group inline-flex items-center gap-2.5 cursor-pointer transition-colors duration-300 hover:text-brand focus-brand rounded-sm"
                aria-label={`${BRAND.name} on Instagram (opens in a new tab)`}
              >
                <InstagramIcon className="h-7 w-7 md:h-8 md:w-8 shrink-0 text-[#1A1A1A] transition-colors duration-300 group-hover:text-brand" />
                {BRAND.name} on Instagram
              </a>
            ) : (
              `${BRAND.name} on Instagram`
            )}
          </h2>
          <p className="text-[#444444] mt-3 text-xs uppercase tracking-[0.08em]">
            Follow the build — batch days, new flavors, and behind-the-scenes from the Mysuru kitchen.
          </p>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 max-w-3xl mx-auto">
          {galleryImages.map((src, index) => {
            const tile = (
              <>
                <Image
                  src={src}
                  alt={`Instagram post ${index + 1}`}
                  fill
                  className="object-cover transition-all duration-500 ease-out group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-brand/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    whileHover={{ scale: 1 }}
                    className="w-14 h-14 rounded-full border-2 border-white/80 flex items-center justify-center"
                  >
                    <Camera className="h-6 w-6 text-white" />
                  </motion.div>
                </div>
              </>
            );

            const tileClass = `relative aspect-square overflow-hidden group shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)] transition-all duration-500 ${instagramUrl ? "cursor-pointer" : ""}`;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className={tileClass}
              >
                {instagramUrl ? (
                  <a
                    href={instagramUrl}
                    {...externalLinkProps}
                    className="absolute inset-0 block focus-brand rounded-sm"
                    aria-label={`View ${BRAND.name} on Instagram (opens in a new tab)`}
                  >
                    {tile}
                  </a>
                ) : (
                  tile
                )}
              </motion.div>
            );
          })}
        </div>

        {instagramUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <a
              href={instagramUrl}
              {...externalLinkProps}
              className="inline-flex items-center gap-2 border border-brand px-6 py-3 text-xs uppercase tracking-[0.12em] font-medium text-brand bg-transparent hover:bg-brand hover:text-white focus-brand rounded-sm cursor-pointer transition-colors duration-300"
            >
              <InstagramIcon className="h-4 w-4 shrink-0" />
              Follow us on Instagram
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
