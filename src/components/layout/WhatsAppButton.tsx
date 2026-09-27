"use client";

import { MessageCircle } from "lucide-react";
import { SOCIAL, WHATSAPP_MESSAGES } from "@/lib/brand";

export function WhatsAppButton() {
  const href = `https://wa.me/${SOCIAL.whatsappNumber}?text=${encodeURIComponent(
    WHATSAPP_MESSAGES.default
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-200 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="absolute -top-10 right-0 bg-[#1A1A1A] text-white text-xs px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Chat with us
      </span>
    </a>
  );
}
