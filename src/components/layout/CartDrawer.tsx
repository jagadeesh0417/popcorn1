"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store";

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { state, removeItem, updateQuantity, getSubtotal, getItemCount } = useCart();

  useEffect(() => {
    const handleToggle = () => setOpen((p) => !p);
    window.addEventListener("toggle-cart", handleToggle);
    return () => window.removeEventListener("toggle-cart", handleToggle);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-[#DC0218] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-200 md:hidden"
        aria-label="Open cart"
      >
        <ShoppingBag className="h-6 w-6" />
        {getItemCount() > 0 && (
          <span className="absolute -top-1 -right-1 bg-white text-[#DC0218] text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
            {getItemCount()}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-[rgba(220,2,24,0.08)]">
                <h2 className="text-xl font-semibold" style={{ fontFamily: "var(--font-playfair)" }}>Your Cart</h2>
                <button onClick={() => setOpen(false)} className="p-2 hover:bg-[#FFF8F0] rounded transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {state.items.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <ShoppingBag className="h-16 w-16 text-[#DC0218]/20 mb-4" />
                  <p className="text-[#444444] mb-2">Your cart is empty. Go find something good.</p>
                  <Link href="/shop" onClick={() => setOpen(false)}>
                    <Button className="bg-[#DC0218] hover:bg-[#C70015] text-white btn-small-caps">
                      Browse Flavors
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {state.items.map((item) => {
                      const price = item.variant?.price ?? item.product.price ?? 0;
                      return (
                      <div key={item.cartId} className="flex gap-4 border-b border-[rgba(220,2,24,0.06)] pb-4">
                        <div className="w-20 h-20 bg-[#FFF8F0] rounded overflow-hidden shrink-0">
                          {item.product.images?.[0] ? (
                            <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🍿</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-[#1A1A1A]">{item.product.name}</h4>
                          <p className="text-[#DC0218] font-semibold text-sm mt-1">₹{price}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                              className="p-1 rounded hover:bg-[#FFF8F0] transition-colors"
                            >
                              {item.quantity === 1 ? <Trash2 className="h-4 w-4 text-red-500" /> : <Minus className="h-4 w-4" />}
                            </button>
                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                              className="p-1 rounded hover:bg-[#FFF8F0] transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <button onClick={() => removeItem(item.cartId)} className="p-1 self-start text-[#444444] hover:text-red-500 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      );
                    })}
                  </div>
                  <div className="p-6 border-t border-[rgba(220,2,24,0.08)] space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#444444]">Subtotal</span>
                      <span className="font-semibold">₹{getSubtotal()}</span>
                    </div>
                    <Link href="/checkout" onClick={() => setOpen(false)}>
                      <Button className="w-full bg-[#DC0218] hover:bg-[#C70015] text-white btn-small-caps h-12">
                        Checkout
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
