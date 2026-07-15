"use client";

import { MapPin, Bike, Truck } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="pt-20">
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#DC0218] via-[#DC0218] to-[#C70015]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              How You&apos;ll <span className="text-[#F9D976]">Get It</span>
            </h1>
            <p className="text-white/70 mt-4 text-lg max-w-lg mx-auto">
              Pickup, local delivery, and shipping options.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* Card 1 - Pick Up in Mysore */}
            <div className="flex flex-col bg-[#FFF8F0] p-8 rounded-2xl border border-[rgba(220,2,24,0.08)] shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#DC0218]/5 flex items-center justify-center mb-5 shrink-0">
                <MapPin className="h-6 w-6 text-[#DC0218]" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold text-[#1A1A1A]">Pick Up in Mysore</h3>
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">FREE</span>
              </div>
              <p className="text-[#444444] text-sm leading-relaxed mb-4">
                Order online and collect your popcorn from our kitchen in Vijayanagar 4th Stage. Simply choose &quot;Mysuru Pickup&quot; during checkout and we&apos;ll notify you when your order is ready.
              </p>
              <div className="mt-auto p-4 bg-white rounded-xl border border-[rgba(220,2,24,0.06)] text-sm text-[#444444] leading-relaxed">
                #30, Sri Nivasa,<br />
                RCE Layout,<br />
                Vijayanagar 4th Stage,<br />
                Mysore – 570032
              </div>
            </div>

            {/* Card 2 - Home Delivery in Mysore */}
            <div className="flex flex-col bg-[#FFF8F0] p-8 rounded-2xl border border-[rgba(220,2,24,0.08)] shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#DC0218]/5 flex items-center justify-center mb-5 shrink-0">
                <Bike className="h-6 w-6 text-[#DC0218]" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold text-[#1A1A1A]">Home Delivery in Mysore</h3>
              </div>
              <p className="text-[#444444] text-sm leading-relaxed mb-4">
                Fresh popcorn delivered right to your doorstep anywhere within Mysore city.
              </p>
              <ul className="mt-auto space-y-2">
                <li className="text-[#444444] text-sm flex items-start gap-2">
                  <span className="text-[#DC0218] mt-0.5">•</span>
                  Choose &quot;Local Delivery&quot; during checkout.
                </li>
                <li className="text-[#444444] text-sm flex items-start gap-2">
                  <span className="text-[#DC0218] mt-0.5">•</span>
                  Same-day or next-day delivery depending on order time.
                </li>
              </ul>
            </div>

            {/* Card 3 - Pan-India Shipping */}
            <div className="flex flex-col bg-[#FFF8F0] p-8 rounded-2xl border border-[rgba(220,2,24,0.08)] shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-[#DC0218]/5 flex items-center justify-center mb-5 shrink-0">
                <Truck className="h-6 w-6 text-[#DC0218]" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-bold text-[#1A1A1A]">Pan-India Shipping</h3>
              </div>
              <p className="text-[#444444] text-sm leading-relaxed mb-4">
                We ship across India via India Post.
              </p>
              <ul className="mt-auto space-y-2">
                <li className="text-[#444444] text-sm flex items-start gap-2">
                  <span className="text-[#DC0218] mt-0.5">•</span>
                  Orders are dispatched within 2 working days and usually arrive in 3–7 days depending on your location.
                </li>
                <li className="text-[#444444] text-sm flex items-start gap-2">
                  <span className="text-[#DC0218] mt-0.5">•</span>
                  Free Shipping on Orders Above ₹399.
                </li>
              </ul>
            </div>

          </div>

          <div className="mt-12 p-6 bg-[#FFF8F0] rounded-2xl border border-[rgba(220,2,24,0.08)] text-center">
            <p className="text-[#444444] text-sm">
              For any shipping-related queries, contact us at{" "}
              <strong className="text-[#DC0218]">poprika.official@gmail.com</strong> or call{" "}
              <strong className="text-[#DC0218]">+91 8197175807</strong>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
