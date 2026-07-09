"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const contactInfo = [
  { icon: MapPin, title: "Visit Us", detail: "#30, Sri Nivasa, RCE Layout, Vijayanagar 4th Stage, Mysore – 570032, Karnataka" },
  { icon: Phone, title: "Call Us", detail: "+91 8197175807" },
  { icon: Mail, title: "Email Us", detail: "poprika.official@gmail.com" },
  { icon: Clock, title: "Business Hours", detail: "Monday – Sunday, 9:30 AM – 8:00 PM" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="pt-20">
      <section className="relative py-24 overflow-hidden bg-gradient-to-br from-[#DC0218] via-[#DC0218] to-[#C70015]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Get in <span className="text-[#F9D976]">Touch</span>
            </h1>
            <p className="text-white/70 mt-4 text-lg max-w-lg mx-auto">
              Have a question, feedback, or just want to say hello? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Contact Us</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 text-[#1A1A1A]">We&apos;re Here to Help</h2>
              <p className="text-[#666666] mt-4 leading-relaxed">
                Whether you have a question about our flavours, need help with an order, or just want to share your Poprika experience — drop us a message.
              </p>
              <div className="mt-10 space-y-6">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#DC0218]/5 flex items-center justify-center shrink-0">
                      <info.icon className="h-6 w-6 text-[#DC0218]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A1A1A]">{info.title}</p>
                      <p className="text-[#666666] text-sm mt-0.5">{info.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {submitted ? (
                <div className="bg-[#FFF8F0] rounded-[32px] p-12 text-center h-full flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <Send className="h-10 w-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">Message Sent!</h3>
                  <p className="text-[#666666]">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  className="bg-[#FFF8F0] rounded-[32px] p-8 md:p-10 space-y-5"
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-[#1A1A1A]">First Name</Label>
                      <Input id="name" required className="rounded-xl bg-white border-[rgba(220,2,24,0.12)]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lname" className="text-[#1A1A1A]">Last Name</Label>
                      <Input id="lname" className="rounded-xl bg-white border-[rgba(220,2,24,0.12)]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[#1A1A1A]">Email</Label>
                    <Input id="email" type="email" required className="rounded-xl bg-white border-[rgba(220,2,24,0.12)]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-[#1A1A1A]">Subject</Label>
                    <Input id="subject" required className="rounded-xl bg-white border-[rgba(220,2,24,0.12)]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-[#1A1A1A]">Message</Label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[rgba(220,2,24,0.12)] text-[#1A1A1A] focus:outline-none focus:border-[#DC0218] transition-colors resize-none"
                    />
                  </div>
                  <Button type="submit" className="w-full bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl h-12 shadow-lg shadow-[#DC0218]/20">
                    <Send className="h-4 w-4 mr-2" /> Send Message
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
