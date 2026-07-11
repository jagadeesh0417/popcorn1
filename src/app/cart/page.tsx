"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus, ArrowLeft, Tag, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/store";
import { useShipping } from "@/lib/shipping-settings";
import { Coupon } from "@/lib/types";

export default function CartPage() {
  const { state, updateQuantity, removeItem, getSubtotal, getDiscount, getItemCount, applyCoupon } = useCart();
  const shippingCtx = useShipping();
  const sub = getSubtotal();
  const remains = shippingCtx.freeShippingRemaining(sub);
  const isFree = shippingCtx.qualifiesForFree(sub);
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    fetch("/api/coupons")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCoupons(data); })
      .catch(console.error);
  }, []);

  const handleApplyCoupon = () => {
    const found = coupons.find((c) => c.code.toLowerCase() === couponInput.trim().toLowerCase());
    if (found) {
      if (getSubtotal() >= found.minAmount) {
        applyCoupon(found, found.code);
        setCouponMsg("Coupon applied successfully!");
      } else {
        setCouponMsg(`Minimum order of ₹${found.minAmount} required`);
      }
    } else {
      setCouponMsg("Invalid coupon code");
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white">
        <div className="text-center px-4">
          <ShoppingBag className="h-16 w-16 text-[#444444] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Your cart is empty</h2>
          <p className="text-[#444444] mb-6">Looks like you haven&apos;t added any popcorn yet.</p>
          <Link href="/shop">
            <Button className="bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[#DC0218] font-semibold text-sm uppercase tracking-[0.2em]">Cart</span>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Shopping Cart ({getItemCount()} items)</h1>
          </div>
          <Link href="/shop">
            <Button variant="outline" size="sm" className="rounded-xl border-[rgba(220,2,24,0.2)] text-[#1A1A1A]">
              <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Free shipping banner */}
        <div className={`mb-6 p-4 text-sm font-medium flex items-center gap-2.5 border ${
          isFree
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-[#FFF8F0] border-[rgba(220,2,24,0.12)] text-[#1A1A1A]"
        }`}>
          {isFree ? (
            <span>🎉 Congratulations! Your order qualifies for FREE delivery.</span>
          ) : (
            <span>Add <span className="font-bold text-[#DC0218]">₹{remains}</span> more to unlock <span className="font-bold">free shipping</span>!</span>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item, index) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 p-4 bg-white rounded-2xl border border-[rgba(220,2,24,0.08)] shadow-sm"
              >
                <Link href={`/products/${item.product.slug}`}>
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#FFF8F0] shrink-0">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="112px" />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.slug}`}>
                    <h3 className="font-semibold text-[#1A1A1A] hover:text-[#DC0218] transition-colors">{item.product.name}</h3>
                  </Link>
                  <p className="text-xs text-[#444444] mt-0.5">{item.product.weight}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-[rgba(220,2,24,0.15)] rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="p-1.5 hover:bg-[#FFF8F0] transition-colors">
                        <Minus className="h-3.5 w-3.5 text-[#1A1A1A]" />
                      </button>
                      <span className="px-4 text-sm font-medium min-w-[2rem] text-center text-[#1A1A1A]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="p-1.5 hover:bg-[#FFF8F0] transition-colors">
                        <Plus className="h-3.5 w-3.5 text-[#1A1A1A]" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-[#DC0218]">₹{item.product.price * item.quantity}</span>
                      <button onClick={() => removeItem(item.product.id)} className="text-[#444444] hover:text-[#DC0218] transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div>
            <div className="bg-[#FFF8F0] rounded-2xl p-6 sticky top-28">
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#444444]">Subtotal</span>
                  <span className="font-medium text-[#1A1A1A]">₹{getSubtotal()}</span>
                </div>
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{getDiscount()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#444444]">Shipping</span>
                  <span className="font-medium text-[#1A1A1A]">{isFree ? "FREE" : `₹${shippingCtx.settings.panIndiaShippingFee}`}</span>
                </div>
                {!isFree && (
                  <p className="text-xs text-[#444444]">Free shipping on orders above ₹{shippingCtx.settings.freeShippingThreshold}</p>
                )}
                <Separator className="bg-[rgba(220,2,24,0.08)]" />
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-[#1A1A1A]">Total</span>
                  <span className="font-bold text-[#DC0218]">₹{getSubtotal() - getDiscount() + (isFree ? 0 : shippingCtx.settings.panIndiaShippingFee)}</span>
                </div>
              </div>

              {couponMsg && (
                <p className={`text-xs mt-3 ${couponMsg.includes("successfully") ? "text-green-600" : "text-[#DC0218]"}`}>{couponMsg}</p>
              )}

              <div className="flex gap-2 mt-4">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#444444]" />
                  <Input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code"
                    className="pl-9 rounded-xl border-[rgba(220,2,24,0.12)]"
                  />
                </div>
                <Button variant="outline" onClick={handleApplyCoupon} className="rounded-xl border-[rgba(220,2,24,0.2)] text-[#DC0218]">Apply</Button>
              </div>

              <Link href="/checkout">
                <Button className="w-full mt-4 bg-[#DC0218] hover:bg-[#C70015] text-white rounded-xl h-12 text-base shadow-lg shadow-[#DC0218]/20">
                  Proceed to Checkout — ₹{getSubtotal() - getDiscount() + (isFree ? 0 : shippingCtx.settings.panIndiaShippingFee)}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
