"use client";

import { MapPin, Truck } from "lucide-react";

export function DeliveryInfo() {
  return (
    <section className="py-24 bg-white">
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
          {/* Box 1 - Mysore */}
          <div className="bg-[#FFFDF9] p-8 border border-[rgba(0,0,0,0.05)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)]">
            <div className="w-12 h-12 flex items-center justify-center mb-5 bg-[#FFF8F0] border border-[rgba(220,2,24,0.1)]">
              <MapPin className="h-5 w-5 text-[#DC0218]" />
            </div>
            <h3 className="font-semibold text-sm uppercase tracking-[0.06em] text-[#1A1A1A]">Mysore (Pickup & Local Delivery)</h3>
            <p className="text-[#444444] text-xs mt-3 leading-relaxed">
              If you&apos;re in Mysore, you can either:
            </p>
            <ul className="mt-3 space-y-2">
              <li className="text-[#444444] text-xs leading-relaxed flex items-start gap-2">
                <span className="text-[#DC0218] mt-0.5">•</span>
                Pick up your order from our kitchen in Vijayanagar 4th Stage, or
              </li>
              <li className="text-[#444444] text-xs leading-relaxed flex items-start gap-2">
                <span className="text-[#DC0218] mt-0.5">•</span>
                Get it delivered to your doorstep within the city.
              </li>
            </ul>
            <p className="text-[#444444] text-xs mt-3 leading-relaxed">
              Simply choose your preferred option during checkout.
            </p>
            <div className="mt-5 pt-4 border-t border-[rgba(0,0,0,0.05)]">
              <p className="text-[#666666] text-[10px] uppercase tracking-[0.08em]">
                <strong>Pickup Address:</strong><br />
                #30, Sri Nivasa, RCE Layout, Vijayanagar 4th Stage, Mysore – 570032
              </p>
            </div>
            <p className="text-[#444444] text-xs mt-3 leading-relaxed">
              Same-day or next-day delivery available depending on order time.
            </p>
          </div>

          {/* Box 2 - Pan-India */}
          <div className="bg-[#FFFDF9] p-8 border border-[rgba(0,0,0,0.05)] shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)]">
            <div className="w-12 h-12 flex items-center justify-center mb-5 bg-[#FFF8F0] border border-[rgba(220,2,24,0.1)]">
              <Truck className="h-5 w-5 text-[#DC0218]" />
            </div>
            <h3 className="font-semibold text-sm uppercase tracking-[0.06em] text-[#1A1A1A]">Outside Mysore (Pan-India Shipping)</h3>
            <p className="text-[#444444] text-xs mt-3 leading-relaxed">
              We ship across India via India Post.
            </p>
            <ul className="mt-3 space-y-2">
              <li className="text-[#444444] text-xs leading-relaxed flex items-start gap-2">
                <span className="text-[#DC0218] mt-0.5">•</span>
                Orders are dispatched within 2 working days
              </li>
              <li className="text-[#444444] text-xs leading-relaxed flex items-start gap-2">
                <span className="text-[#DC0218] mt-0.5">•</span>
                Delivery usually takes 3–7 business days, depending on your location
              </li>
              <li className="text-[#444444] text-xs leading-relaxed flex items-start gap-2">
                <span className="text-[#DC0218] mt-0.5">•</span>
                Free shipping on orders above ₹399
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
