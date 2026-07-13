"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { OrderItem } from "@/lib/types";

interface OrderDetails {
  orderId: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  status: string;
  paymentMethod?: string;
  paymentId?: string;
  customerDetails: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") || "N/A";
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isInvalidId = orderId === "N/A";

  useEffect(() => {
    if (isInvalidId) return;
    let cancelled = false;
    let retries = 0;
    const maxRetries = 5;
    const fetchOrder = () => {
      fetch(`/api/orders/${orderId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Order not found");
          return res.json();
        })
        .then((data) => {
          if (cancelled) return;
          if (data?.success) {
            setOrder(data.data);
            setLoading(false);
          } else if (retries < maxRetries) {
            retries++;
            setTimeout(fetchOrder, 800);
          } else {
            setError("Could not load order details");
            setLoading(false);
          }
        })
        .catch(() => {
          if (cancelled) return;
          if (retries < maxRetries) {
            retries++;
            setTimeout(fetchOrder, 800);
          } else {
            setError("Could not load order details");
            setLoading(false);
          }
        });
    };
    fetchOrder();
    return () => { cancelled = true; };
  }, [orderId]);

  if (isInvalidId) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white">
        <div className="text-center px-4">
          <Package className="h-16 w-16 text-[#444444] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1A1A1A] mb-2">Order reference</h2>
          <p className="text-[#444444] mb-6">Your order has been placed but we couldn&apos;t load details.</p>
          <Link href="/shop"><Button className="bg-[#DC0218] hover:bg-[#C70015] text-white">Continue Shopping</Button></Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white">
        <div className="animate-spin h-8 w-8 border-4 border-[#DC0218] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A]">Order Confirmed!</h1>
          <p className="text-[#444444] mt-1">Thank you for your order. It&apos;s being prepared with love.</p>
        </motion.div>

        {order && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
            <div className="bg-[#FFF8F0] p-5 flex items-center gap-3">
              <Package className="h-5 w-5 text-[#DC0218]" />
              <div>
                <p className="text-xs text-[#444444] uppercase tracking-[0.06em]">Order ID</p>
                <p className="font-semibold text-[#1A1A1A]">{order.orderId}</p>
              </div>
              {order.paymentMethod && (
                <div className="ml-auto text-right">
                  <p className="text-xs text-[#444444] uppercase tracking-[0.06em]">Payment</p>
                  <span className={`text-xs font-semibold ${order.paymentMethod === "COD" ? "text-[#DC0218]" : "text-green-600"}`}>
                    {order.paymentMethod === "COD" ? "Pending (COD)" : "Paid"}
                  </span>
                </div>
              )}
            </div>

            <div className="border border-[rgba(220,2,24,0.08)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-[#DC0218]" />
                <span className="font-semibold text-sm text-[#1A1A1A]">Customer</span>
              </div>
              <p className="text-sm text-[#1A1A1A]">{order.customerDetails.firstName} {order.customerDetails.lastName}</p>
              <div className="flex items-start gap-2 mt-3">
                <MapPin className="h-4 w-4 text-[#DC0218] mt-0.5" />
                <p className="text-sm text-[#444444]">{order.customerDetails.address}, {order.customerDetails.city}, {order.customerDetails.state} — {order.customerDetails.zipCode}</p>
              </div>
            </div>

            <div className="border border-[rgba(220,2,24,0.08)] p-5">
              <h3 className="font-semibold text-sm text-[#1A1A1A] mb-3">Items Ordered</h3>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-[#444444]">
                      {item.name}
                      {item.variant ? <span className="text-[#999]"> ({item.variant.label})</span> : ""}
                      <span className="text-[#999]"> x{item.quantity}</span>
                    </span>
                    <span className="font-medium text-[#1A1A1A]">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-3 bg-[rgba(220,2,24,0.08)]" />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-[#444444]"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{order.discount}</span></div>}
                <div className="flex justify-between text-[#444444]"><span>Shipping</span><span>{order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</span></div>
                <Separator className="my-2 bg-[rgba(220,2,24,0.08)]" />
                <div className="flex justify-between font-bold text-lg"><span className="text-[#1A1A1A]">Total</span><span className="text-[#DC0218]">₹{order.total}</span></div>
              </div>
            </div>
          </motion.div>
        )}

        {error && !order && (
          <div className="text-center py-8">
            <p className="text-[#DC0218] text-sm mb-2">{error}</p>
            <p className="text-[#444444] text-xs mb-4">But your order ID is: <strong>{orderId}</strong></p>
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link href="/shop">
            <Button className="w-full sm:w-auto bg-[#DC0218] hover:bg-[#C70015] text-white shadow-lg shadow-[#DC0218]/20">
              Continue Shopping <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/order-tracking">
            <Button variant="outline" className="w-full sm:w-auto border-[rgba(220,2,24,0.2)]">Track Order</Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function ThanksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20 flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-[#DC0218] border-t-transparent rounded-full" /></div>}>
      <ThankYouContent />
    </Suspense>
  );
}
