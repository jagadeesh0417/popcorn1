"use client";

import Link from "next/link";
import { Globe, Camera, MessageCircle, Video, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Shop All Flavours", href: "/shop" },
  { name: "Best Sellers", href: "/#best-sellers" },
  { name: "Order Tracking", href: "/order-tracking" },
];

const supportLinks = [
  { name: "FAQ", href: "/faq" },
  { name: "Shipping Policy", href: "/shipping" },
  { name: "Return Policy", href: "/returns" },
  { name: "Contact Us", href: "/#contact" },
];

const policyLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Refund Policy", href: "/refund" },
];

const socialLinks = [
  { icon: Globe, href: "#", label: "Facebook" },
  { icon: Camera, href: "#", label: "Instagram" },
  { icon: MessageCircle, href: "#", label: "Twitter" },
  { icon: Video, href: "#", label: "Youtube" },
];

export function Footer() {
  return (
    <footer className="bg-[#8E1414] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-[#8E1414] font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-xl">Popcorn</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-xs">
              Freshly popped happiness delivered to your doorstep. Premium gourmet popcorn crafted with love and the finest ingredients.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/25 transition-all duration-300"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-5 text-white/80">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 text-sm hover:text-white transition-colors flex items-center gap-1.5 group">
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-5 text-white/80">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 text-sm hover:text-white transition-colors">{link.name}</Link>
                </li>
              ))}
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/60 text-sm hover:text-white transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-5 text-white/80">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-white/40 shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm">42 Gourmet Street, Culinary District, Mumbai 400001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-white/40 shrink-0" />
                <span className="text-white/60 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-white/40 shrink-0" />
                <span className="text-white/60 text-sm">hello@popcorn.in</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">&copy; {new Date().getFullYear()} Popcorn. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-white/40 text-xs hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="text-white/40 text-xs hover:text-white transition-colors">Terms</Link>
            <Link href="/shipping" className="text-white/40 text-xs hover:text-white transition-colors">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
