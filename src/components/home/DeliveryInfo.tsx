"use client";

import { MapPin, Truck } from "lucide-react";
import { FULFILMENT, KITCHEN_ADDRESS } from "@/lib/brand";
import { useShipping } from "@/lib/shipping-settings";

export function DeliveryInfo() {
  const { settings } = useShipping();

  return (
    <section className="py-24 bg-[#FFF8F0]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="brand-rule" />
          </div>
          <h2 className="text-3xl md:text-4xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
            How you&apos;ll get it
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 border border-brand/10 shadow-[0_4px_20px_rgba(22,63,150,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(22,63,150,0.1)]">
            <div className="w-12 h-12 flex items-center justify-center mb-5 bg-brand-mist border border-brand/10">
              <MapPin className="w-5 h-5 text-brand" />
            </div>
            <h3 className="font-bold text-lg text-[#1A1A1A]">{FULFILMENT.pickup.label}</h3>
            <p className="text-[#444444] text-sm mt-3 leading-relaxed">{FULFILMENT.pickup.blurb}</p>
            <ul className="mt-4 space-y-2">
              {FULFILMENT.pickup.steps.map((step) => (
                <li key={step} className="text-[#444444] text-sm leading-relaxed flex items-start gap-2">
                  <span className="text-brand mt-0.5">•</span>
                  {step}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-brand/10">
              <p className="text-[#666666] text-xs">
                <strong>Pickup Address:</strong>
                <br />
                {KITCHEN_ADDRESS.singleLine}
              </p>
            </div>
          </div>

          <div className="bg-white p-8 border border-brand/10 shadow-[0_4px_20px_rgba(22,63,150,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_rgba(22,63,150,0.1)]">
            <div className="w-12 h-12 flex items-center justify-center mb-5 bg-brand-mist border border-brand/10">
              <Truck className="w-5 h-5 text-brand" />
            </div>
            <h3 className="font-bold text-lg text-[#1A1A1A]">{FULFILMENT.delivery.label}</h3>
            <p className="text-[#444444] text-sm mt-3 leading-relaxed">{FULFILMENT.delivery.blurb}</p>
            <ul className="mt-4 space-y-2">
              {FULFILMENT.delivery.steps.map((step) => (
                <li key={step} className="text-[#444444] text-sm leading-relaxed flex items-start gap-2">
                  <span className="text-brand mt-0.5">•</span>
                  {step}
                </li>
              ))}
              {settings.freeShippingEnabled && (
                <li className="text-[#444444] text-sm leading-relaxed flex items-start gap-2">
                  <span className="text-brand mt-0.5">•</span>
                  Free shipping on orders above ₹{settings.freeShippingThreshold}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
