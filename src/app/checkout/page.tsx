"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, MapPin, User, MessageSquare, Lock, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/lib/store";
import { toast } from "sonner";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { state, getSubtotal, getDiscount, getShipping, getTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zipCode: "", deliveryInstructions: "",
  });

  const updateField = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handlePayment = async () => {
    if (!form.firstName || !form.email || !form.phone || !form.address || !form.city || !form.state || !form.zipCode) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (state.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setLoading(true);
    try {
      const orderId = "ORD-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Payment successful! 🎉");
      clearCart();
      router.push(`/thanks?order=${orderId}`);
    } catch {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-white">
        <div className="text-center px-4">
          <ShoppingBag className="h-16 w-16 text-[#666666] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Nothing to checkout</h2>
          <p className="text-[#666666] mb-6">Add some popcorn to your cart first!</p>
          <Link href="/shop"><Button className="bg-[#B71C1C] hover:bg-[#8E1414] text-white rounded-xl">Start Shopping</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <span className="text-[#B71C1C] font-semibold text-sm uppercase tracking-[0.2em]">Checkout</span>
          <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1">Complete Your Order</h1>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[#FFF8F0] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <User className="h-5 w-5 text-[#B71C1C]" />
                <h2 className="font-bold text-lg text-[#1A1A1A]">Customer Details</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { id: "firstName", label: "First Name *", placeholder: "John" },
                  { id: "lastName", label: "Last Name", placeholder: "Doe" },
                  { id: "email", label: "Email *", placeholder: "john@example.com", type: "email" },
                  { id: "phone", label: "Phone *", placeholder: "+91 98765 43210", type: "tel" },
                ].map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id} className="text-[#1A1A1A]">{field.label}</Label>
                    <Input id={field.id} type={field.type || "text"} value={(form as Record<string, string>)[field.id]} onChange={(e) => updateField(field.id, e.target.value)} placeholder={field.placeholder} className="rounded-xl bg-white border-[rgba(183,28,28,0.12)]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FFF8F0] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <MapPin className="h-5 w-5 text-[#B71C1C]" />
                <h2 className="font-bold text-lg text-[#1A1A1A]">Delivery Address</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-[#1A1A1A]">Address *</Label>
                  <Textarea id="address" value={form.address} onChange={(e) => updateField("address", e.target.value)} placeholder="Street, building, apartment" className="rounded-xl bg-white border-[rgba(183,28,28,0.12)] min-h-[80px]" />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { id: "city", label: "City *", placeholder: "Mumbai" },
                    { id: "state", label: "State *", placeholder: "Maharashtra" },
                    { id: "zipCode", label: "ZIP Code *", placeholder: "400001" },
                  ].map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id} className="text-[#1A1A1A]">{field.label}</Label>
                      <Input id={field.id} value={(form as Record<string, string>)[field.id]} onChange={(e) => updateField(field.id, e.target.value)} placeholder={field.placeholder} className="rounded-xl bg-white border-[rgba(183,28,28,0.12)]" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#FFF8F0] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <MessageSquare className="h-5 w-5 text-[#B71C1C]" />
                <h2 className="font-bold text-lg text-[#1A1A1A]">Delivery Instructions</h2>
              </div>
              <Textarea value={form.deliveryInstructions} onChange={(e) => updateField("deliveryInstructions", e.target.value)} placeholder="Gate code, landmark, preferred delivery time..." className="rounded-xl bg-white border-[rgba(183,28,28,0.12)] min-h-[80px]" />
            </div>

            <div className="bg-[#FFF8F0] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="h-5 w-5 text-[#B71C1C]" />
                <h2 className="font-bold text-lg text-[#1A1A1A]">Payment Method</h2>
              </div>
              <RadioGroup defaultValue="razorpay">
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[rgba(183,28,28,0.12)]">
                  <RadioGroupItem value="razorpay" id="razorpay" />
                  <Label htmlFor="razorpay" className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="w-10 h-7 bg-[#B71C1C]/10 rounded flex items-center justify-center text-xs font-bold text-[#B71C1C]">RZP</div>
                    <div>
                      <p className="font-medium text-sm text-[#1A1A1A]">Razorpay</p>
                      <p className="text-xs text-[#666666]">Credit/Debit Card, UPI, Net Banking, Wallet</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-[#FFF8F0] rounded-2xl p-6 sticky top-28">
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">Order Summary</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[rgba(183,28,28,0.06)]">
                    <div className="w-12 h-12 rounded-lg bg-[#FFF8F0] shrink-0 flex items-center justify-center text-xs font-bold text-[#666666]">x{item.quantity}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1A1A1A] truncate">{item.product.name}</p>
                      <p className="text-xs text-[#666666]">₹{item.product.price} each</p>
                    </div>
                    <span className="font-semibold text-sm text-[#1A1A1A]">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <Separator className="mb-4 bg-[rgba(183,28,28,0.08)]" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#666666]"><span>Subtotal</span><span>₹{getSubtotal()}</span></div>
                {getDiscount() > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{getDiscount()}</span></div>}
                <div className="flex justify-between text-[#666666]"><span>Shipping</span><span>{getShipping() === 0 ? "FREE" : `₹${getShipping()}`}</span></div>
                <Separator className="bg-[rgba(183,28,28,0.08)]" />
                <div className="flex justify-between text-lg font-bold"><span className="text-[#1A1A1A]">Total</span><span className="text-[#B71C1C]">₹{getTotal()}</span></div>
              </div>

              <Button className="w-full mt-6 bg-[#B71C1C] hover:bg-[#8E1414] text-white rounded-xl h-12 text-base shadow-lg shadow-[#B71C1C]/20" onClick={handlePayment} disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2"><Lock className="h-4 w-4" /> Pay ₹{getTotal()} Securely</span>
                )}
              </Button>
              <p className="text-xs text-[#666666] text-center mt-3">Secured by Razorpay. Your data is safe.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
