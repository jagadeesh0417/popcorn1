"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") || "N/A";

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-white">
      <div className="max-w-lg mx-auto px-4 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
          <div className="w-24 h-24 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-3">Thank You! 🎉</h1>
          <p className="text-[#666666] mb-2">Your order has been confirmed and is being prepared with love.</p>
          <div className="bg-[#FFF8F0] rounded-xl p-4 inline-flex items-center gap-2 mx-auto mb-8">
            <Package className="h-4 w-4 text-[#B71C1C]" />
            <span className="text-sm font-medium text-[#1A1A1A]">Order ID: {orderId}</span>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="space-y-4">
          <p className="text-sm text-[#666666]">You&apos;ll receive a confirmation email shortly with your order details and tracking information.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop">
              <Button className="bg-[#B71C1C] hover:bg-[#8E1414] text-white rounded-xl shadow-lg shadow-[#B71C1C]/20">
                Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/order-tracking">
              <Button variant="outline" className="rounded-xl border-[rgba(183,28,28,0.2)]">Track Order</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function ThanksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-[#B71C1C] border-t-transparent rounded-full" /></div>}>
      <ThankYouContent />
    </Suspense>
  );
}
