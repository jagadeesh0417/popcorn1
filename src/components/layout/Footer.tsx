"use client";

import Link from "next/link";
import { MessageCircle, Mail, MapPin, Phone, Clock } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { InstagramIcon } from "@/components/brand/InstagramIcon";
import {
  BRAND,
  BRAND_EMAIL,
  BUSINESS_HOURS,
  KITCHEN_ADDRESS,
  PHONE,
  SOCIAL,
} from "@/lib/brand";

const whatsappNumber = SOCIAL.whatsappNumber;
const fssaiNumber = process.env.NEXT_PUBLIC_FSSAI_NUMBER || "21226198000399";

const socialButton =
  "w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-gold/30 transition-all duration-300 hover:scale-110 hover:rotate-[4deg] hover:shadow-[0_0_20px_rgba(249,217,118,0.3)] focus-brand rounded-sm";

export function Footer({ logoSrc }: { logoSrc?: string | null }) {
  return (
    <footer className="bg-gradient-to-br from-brand via-brand-deep to-brand-ink text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="mb-4">
              <BrandLogo src={logoSrc} tone="dark" heightClassName="h-12 md:h-16" />
            </div>
            <p className="text-white/70 text-xs leading-relaxed mb-5 max-w-xs">
              Small-batch popcorn. Bold Indian flavors. Made in Mysuru.
            </p>
            <div className="flex gap-3">
              {SOCIAL.instagram && (
                <a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className={socialButton}
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              )}
              {SOCIAL.youtube && (
                <a
                  href={SOCIAL.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className={socialButton}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2c-.3-1.1-1.1-1.9-2.2-2.2C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.3.5C1.6 4.3.8 5.1.5 6.2 0 8.1 0 12 0 12s0 3.9.5 5.8c.3 1.1 1.1 1.9 2.2 2.2 1.9.5 9.3.5 9.3.5s7.4 0 9.3-.5c1.1-.3 1.9-1.1 2.2-2.2.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z"/></svg>
                </a>
              )}
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className={socialButton}
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.12em] font-medium mb-5 text-gold">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { name: "About", href: "/about" },
                { name: "Shop", href: "/shop" },
                { name: "Bundles", href: "/shop#bundles" },
                { name: "Track your order", href: "/order-tracking" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 text-xs hover:text-white transition-colors focus-brand rounded-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.12em] font-medium mb-5 text-gold">Contact</h3>
            <div className="space-y-3 text-white/60 text-xs leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 text-gold/70 shrink-0 mt-0.5" />
                <span>
                  {KITCHEN_ADDRESS.line1}
                  <br />
                  {KITCHEN_ADDRESS.line2}
                  <br />
                  {KITCHEN_ADDRESS.city} – {KITCHEN_ADDRESS.zip}, {KITCHEN_ADDRESS.region}, India
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-gold/70 shrink-0" />
                <a href={`tel:${PHONE.tel}`} className="hover:text-white transition-colors focus-brand rounded-sm">
                  {PHONE.display}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-gold/70 shrink-0" />
                <a href={`mailto:${BRAND_EMAIL}`} className="hover:text-white transition-colors break-all focus-brand rounded-sm">
                  {BRAND_EMAIL}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-3.5 w-3.5 text-gold/70 shrink-0 mt-0.5" />
                <span>{BUSINESS_HOURS}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-12 pt-6 text-center">
          <p className="text-white/70 text-xs">
            &copy; 2026 {BRAND.name}. Made with patience in Mysore.
          </p>
          <p className="text-white/40 text-[10px] mt-1">FSSAI License No.: {fssaiNumber}</p>
        </div>
      </div>
    </footer>
  );
}
