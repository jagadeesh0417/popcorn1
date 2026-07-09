"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const countryCodes = [
  { code: "+91", label: "IN +91" },
  { code: "+1", label: "US +1" },
  { code: "+44", label: "UK +44" },
  { code: "+61", label: "AU +61" },
  { code: "+65", label: "SG +65" },
  { code: "+971", label: "AE +971" },
];

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [whatsapp, setWhatsapp] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) return;
    try {
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          whatsappNumber: `${countryCode}${whatsapp}`,
          consent: true,
        }),
      });
      setSubmitted(true);
    } catch {
      // silently fail — TODO: add error toast
    }
  };

  if (submitted) {
    return (
      <section className="py-24 bg-[#FFF8F0]">
        <div className="max-w-lg mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <div className="w-16 h-16 mx-auto flex items-center justify-center border-2 border-green-500 text-green-500 text-2xl mb-4">✓</div>
            <h2 className="text-2xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>You&apos;re in!</h2>
            <p className="text-[#666666] text-xs mt-2">We&apos;ll keep you posted on new drops and limited batches.</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#FFF8F0]">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="gold-rule" />
          </div>
          <h2 className="text-3xl md:text-4xl text-[#1A1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
            First in line
          </h2>
          <p className="text-[#666666] mt-2 text-xs uppercase tracking-[0.08em]">
            New flavors, limited batches, and Mysuru-only tests — hear about them before anyone else.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="mt-10 space-y-4"
        >
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full px-4 py-3 border border-[rgba(220,2,24,0.12)] text-sm text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:border-[#DC0218] transition-colors bg-white"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="px-3 py-3 border border-[rgba(220,2,24,0.12)] text-sm bg-white text-[#1A1A1A] focus:outline-none focus:border-[#DC0218] transition-colors w-24"
            >
              {countryCodes.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="WhatsApp number"
              className="flex-1 px-4 py-3 border border-[rgba(220,2,24,0.12)] text-sm text-[#1A1A1A] placeholder:text-[#999999] focus:outline-none focus:border-[#DC0218] transition-colors bg-white"
            />
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 accent-[#DC0218]"
              required
            />
            <span className="text-[#666666] text-xs leading-relaxed">
              I&apos;m okay with Poprika sending me updates on new drops and offers. No spam.
            </span>
          </label>

          <motion.div whileTap={{ scale: 0.97 }}>
            <Button
              type="submit"
              disabled={!consent}
              className={`w-full btn-small-caps h-12 transition-all duration-200 ${
                consent
                  ? "bg-[#DC0218] hover:bg-[#C70015] text-white shadow-lg shadow-[#DC0218]/20 hover:shadow-[#DC0218]/30"
                  : "bg-[#E0E0E0] text-[#999999] cursor-not-allowed"
              }`}
            >
              Sign me up
            </Button>
          </motion.div>

          <p className="text-[#999999] text-[10px] text-center">
            One or two messages a month. Unsubscribe anytime.
          </p>
        </motion.form>
      </div>
    </section>
  );
}
