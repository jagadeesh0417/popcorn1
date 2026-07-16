"use client";

import { MapPin, Truck } from "lucide-react";

export function DeliveryInfo() {
  return (
    <section className="py-24 bg-[#FFF8F0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="gold-rule" />
          </div>
          <h2 className="text-3xl md:text-4xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
            How you&apos;ll get it
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 border border-[rgba(220,2,24,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)]">
            <div className="w-12 h-12 flex items-center justify-center mb-5 bg-[#FFF8F0] border border-[rgba(220,2,24,0.1)]">
              <span className="text-xl">📍</span>
            </div>
            <h3 className="font-bold text-lg text-[#1A1A1A]">Pickup (Mysore Only)</h3>
            <p className="text-[#444444] text-sm mt-3 leading-relaxed">
              If you&apos;re in Mysore, you can collect your order directly from our kitchen.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="text-[#444444] text-sm leading-relaxed flex items-start gap-2">
                <span className="text-[#DC0218] mt-0.5">•</span>
                Choose &quot;Pickup&quot; during checkout
              </li>
              <li className="text-[#444444] text-sm leading-relaxed flex items-start gap-2">
                <span className="text-[#DC0218] mt-0.5">•</span>
                We&apos;ll notify you when your order is ready
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-[rgba(220,2,24,0.08)]">
              <p className="text-[#666666] text-xs">
                <strong>Pickup Address:</strong><br />
                #30, Sri Nivasa, RCE Layout, Vijayanagar 4th Stage, Mysore – 570032
              </p>
            </div>
          </div>

          <div className="bg-white p-8 border border-[rgba(220,2,24,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)]">
            <div className="w-12 h-12 flex items-center justify-center mb-5 bg-[#FFF8F0] border border-[rgba(220,2,24,0.1)]">
              <span className="text-xl">🚚</span>
            </div>
            <h3 className="font-bold text-lg text-[#1A1A1A]">Delivery (Mysore &amp; Pan-India)</h3>
            <p className="text-[#444444] text-sm mt-3 leading-relaxed">
              We deliver fresh popcorn across India, including Mysore.
            </p>
            <ul className="mt-4 space-y-2">
              <li className="text-[#444444] text-sm leading-relaxed flex items-start gap-2">
                <span className="text-[#DC0218] mt-0.5">•</span>
                Orders are dispatched within 2 working days
              </li>
              <li className="text-[#444444] text-sm leading-relaxed flex items-start gap-2">
                <span className="text-[#DC0218] mt-0.5">•</span>
                Delivery usually takes 3–7 business days, depending on your location
              </li>
              <li className="text-[#444444] text-sm leading-relaxed flex items-start gap-2">
                <span className="text-[#DC0218] mt-0.5">•</span>
                Free shipping on orders above ₹399
              </li>
            </ul>
            <p className="text-[#444444] text-sm mt-6 leading-relaxed">
              Simply choose &quot;Delivery&quot; during checkout, and we&apos;ll ship your order to your doorstep.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
