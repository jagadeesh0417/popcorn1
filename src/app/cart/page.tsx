"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Minus, Plus, ArrowLeft, Tag, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart, itemPrice, itemName } from "@/lib/store";
import { useShipping } from "@/lib/shipping-settings";
import { formatRupees } from "@/lib/shipping";
import { optimizeImageUrl, getProductImage } from "@/lib/image";
import { getAvailableQty } from "@/lib/stock";
import { Coupon } from "@/lib/types";

export default function CartPage() {
  const { state, updateQuantity, removeItem, getSubtotal, getDiscount, getItemCount, applyCoupon, refreshStock, hasUnavailableItems } = useCart();
  const shippingCtx = useShipping();
  const sub = getSubtotal();
  const remains = shippingCtx.freeShippingRemaining(sub);
  const isFree = shippingCtx.qualifiesForFree(sub);
  const cartShipping = shippingCtx.getShippingCost(sub);
  // Total you're saving versus MRP across every line (coupon not included).
  const mrpSavings = state.items.reduce((sum, item) => {
    const price = itemPrice(item);
    const rawMrp =
      item.type === "bundle" ? item.bundle?.originalPrice : (item.variant?.originalPrice ?? item.product?.originalPrice);
    return typeof rawMrp === "number" && rawMrp > price ? sum + (rawMrp - price) * item.quantity : sum;
  }, 0);
  const [couponInput, setCouponInput] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // Revalidate cart against fresh product data (handles items that went out of stock).
  useEffect(() => {
    refreshStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch("/api/coupons")
      .then((r) => r.json())
      .then((data) => { if (data?.success) setCoupons(data.data); })
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
      <div className="min-h-screen pt-10 md:pt-14 flex items-center justify-center bg-background">
        <div className="text-center px-4">
          <ShoppingBag className="h-16 w-16 text-[#444444] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Your cart is empty</h2>
          <p className="text-[#444444] mb-6">Looks like you haven&apos;t added any popcorn yet.</p>
          <Link href="/shop">
            <Button className="bg-brand hover:bg-brand-deep text-white rounded-xl">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-10 md:pt-14 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-brand font-semibold text-sm uppercase tracking-[0.2em]">Cart</span>
            <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Shopping Cart ({getItemCount()} items)</h1>
          </div>
          <Link href="/shop">
            <Button variant="outline" size="sm" className="rounded-xl border-brand/20 text-[#1A1A1A]">
              <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
            </Button>
          </Link>
        </div>

        {/* Free shipping banner */}
        <div className={`mb-6 p-4 text-sm font-medium flex items-center gap-2.5 border ${
          isFree
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-white border-brand/12 text-[#1A1A1A]"
        }`}>
          {isFree ? (
            <span>🎉 Congratulations! Your order qualifies for FREE delivery.</span>
          ) : (
            <span>Add <span className="font-bold text-brand">₹{formatRupees(remains)}</span> more to unlock <span className="font-bold">free shipping</span>!</span>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {state.items.map((item, index) => {
              const price = itemPrice(item);
              const isBundle = item.type === "bundle";
              const bundle = item.bundle;
              const product = item.product;
              const maxQty = isBundle ? Infinity : getAvailableQty(item.product, item.variant);
              const unavailable = item.unavailable === true;
              const linkHref = isBundle ? "/shop" : `/products/${product?.slug}`;
              const image = isBundle
                ? (bundle?.image || "")
                : (product ? (optimizeImageUrl(getProductImage(product), 200) || "") : "");
              const alt = isBundle ? (bundle?.name || "Bundle") : (product?.name || "Product");
              const itemSummary = isBundle
                ? (bundle?.sizeLabel || "Bundle")
                : (item.variant ? `${item.variant.label} · ₹${price}/pack` : (product?.weight || ""));
              // MRP display: only when the stored MRP is genuinely above the sale price.
              const rawMrp = isBundle ? bundle?.originalPrice : (item.variant?.originalPrice ?? product?.originalPrice);
              const mrp = typeof rawMrp === "number" && rawMrp > price ? rawMrp : null;
              return (
                <motion.div
                  key={item.cartId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex gap-4 p-4 bg-white rounded-2xl border shadow-sm ${unavailable ? "border-red-200 bg-red-50/40" : "border-brand/8"}`}
                >
                  <Link href={linkHref}>
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-background shrink-0">
                      {image ? (
                        <Image src={image} alt={alt} fill className="object-cover" sizes="112px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">🍿</div>
                      )}
                      {unavailable && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                          <span className="bg-brand text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">Out of Stock</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={linkHref}>
                      <h3 className="font-semibold text-[#1A1A1A] hover:text-brand transition-colors">{isBundle ? itemName(item) : product?.name}</h3>
                    </Link>
                    <p className="text-xs text-[#444444] mt-0.5">{itemSummary}</p>
                    {isBundle && bundle?.parts && (
                      <p className="text-[11px] text-[#444444] mt-0.5">
                        Includes: {bundle.parts.map((p) => `${p.quantity}× ${p.name}`).join(", ")}
                      </p>
                    )}
                    {unavailable && (
                      <p className="text-xs font-medium text-brand mt-1">{itemName(item)} is currently unavailable. Please remove it to continue.</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className={`flex items-center border rounded-lg overflow-hidden ${unavailable ? "border-gray-300 opacity-60" : "border-brand/15"}`}>
                        <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} disabled={unavailable} className="p-1.5 hover:bg-[#FFF8F0] transition-colors disabled:cursor-not-allowed">
                          <Minus className="h-3.5 w-3.5 text-[#1A1A1A]" />
                        </button>
                        <span className="px-4 text-sm font-medium min-w-[2rem] text-center text-[#1A1A1A]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} disabled={unavailable || (maxQty > 0 && item.quantity >= maxQty)} className="p-1.5 hover:bg-[#FFF8F0] transition-colors disabled:cursor-not-allowed disabled:opacity-40">
                          <Plus className="h-3.5 w-3.5 text-[#1A1A1A]" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        {mrp && (
                          <span className="text-sm text-[#999] line-through">₹{mrp * item.quantity}</span>
                        )}
                        <span className="font-bold text-lg text-brand">₹{price * item.quantity}</span>
                        <button onClick={() => removeItem(item.cartId)} className="text-[#444444] hover:text-brand transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {mrp && (
                      <p className="text-[11px] text-green-700 font-medium mt-1">
                        Save ₹{(mrp - price) * item.quantity} (MRP ₹{mrp * item.quantity})
                      </p>
                    )}
                    {!isBundle && !unavailable && maxQty > 0 && item.quantity >= maxQty && (
                      <p className="text-[11px] text-[#444444] mt-1">Only {maxQty} {maxQty === 1 ? "unit" : "units"} in stock</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div>
            <div className="bg-white border border-brand/8 rounded-2xl p-6 sticky top-28">
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#444444]">Cart Total</span>
                  <span className="font-medium text-[#1A1A1A]">₹{getSubtotal()}</span>
                </div>
                {mrpSavings > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Saved vs MRP</span>
                    <span className="font-medium">-₹{mrpSavings}</span>
                  </div>
                )}
                {getDiscount() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{getDiscount()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#444444]">Shipping</span>
                  <span className="font-medium text-[#1A1A1A]">{cartShipping === 0 ? "FREE" : `₹${cartShipping}`}</span>
                </div>
                {!isFree && (
                  <p className="text-xs text-[#444444]">Free shipping on orders of ₹{shippingCtx.settings.freeShippingThreshold} or more</p>
                )}
                <Separator className="bg-brand/8" />
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-[#1A1A1A]">Total</span>
                  <span className="font-bold text-brand">₹{getSubtotal() - getDiscount() + cartShipping}</span>
                </div>
              </div>

              {couponMsg && (
                <p className={`text-xs mt-3 ${couponMsg.includes("successfully") ? "text-green-600" : "text-brand"}`}>{couponMsg}</p>
              )}

              <div className="flex gap-2 mt-4">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#444444]" />
                  <Input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code"
                    className="pl-9 rounded-xl border-brand/12"
                  />
                </div>
                <Button variant="outline" onClick={handleApplyCoupon} className="rounded-xl border-brand/20 text-brand">Apply</Button>
              </div>

              {hasUnavailableItems() ? (
                <div className="mt-4">
                  <Button className="w-full bg-gray-200 text-[#444444] cursor-not-allowed rounded-xl h-12 text-base">
                    Some items are out of stock
                  </Button>
                  <p className="text-xs text-brand text-center mt-2">Remove out-of-stock items to continue.</p>
                </div>
              ) : (
                <Link href="/checkout">
                  <Button className="w-full mt-4 bg-brand hover:bg-brand-deep text-white rounded-xl h-12 text-base shadow-lg shadow-brand/20">
                    Proceed to Checkout — ₹{getSubtotal() - getDiscount() + cartShipping}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
