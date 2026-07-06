"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, MapPin, User, Lock, ShoppingBag, Store, Building, Home, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/lib/store";
import { toast } from "sonner";
import Link from "next/link";

type ShippingMethod = "shipping" | "pickup";
type AddressType = "home" | "office" | "other";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman & Nicobar", "Chandigarh", "Dadra & Nagar Haveli", "Daman & Diu",
  "Delhi", "Jammu & Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { state, getSubtotal, getDiscount, getShipping, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("shipping");
  const [addressType, setAddressType] = useState<AddressType>("home");
  const [saveAddress, setSaveAddress] = useState(false);
  const [billingSame, setBillingSame] = useState(true);
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    addressLine1: "", addressLine2: "", area: "", landmark: "",
    city: "", state: "", pincode: "",
    deliveryInstructions: "",
  });

  const updateField = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handlePayment = async () => {
    if (!form.firstName || !form.phone || !form.email) {
      toast.error("Please fill in your name, phone, and email");
      return;
    }
    if (shippingMethod === "shipping" && (!form.addressLine1 || !form.city || !form.state || !form.pincode)) {
      toast.error("Please fill in your delivery address");
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
      toast.success("Payment successful!");
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
          <Link href="/shop"><Button className="bg-[#B71C1C] hover:bg-[#8E1414] text-white">Start Shopping</Button></Link>
        </div>
      </div>
    );
  }

  const shipping = shippingMethod === "pickup" ? 0 : getShipping();

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-white to-[#FFFDF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-start mb-3">
            <div className="gold-rule" />
          </div>
          <span className="text-[#B71C1C] font-semibold text-sm uppercase tracking-[0.2em]">Checkout</span>
          <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1" style={{ fontFamily: "var(--font-playfair)" }}>Complete your order</h1>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-6">
            {/* Delivery Method */}
            <div className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Store className="h-5 w-5 text-[#B71C1C]" />
                <h2 className="font-bold text-lg text-[#1A1A1A]">Delivery method</h2>
              </div>
              <Select value={shippingMethod} onValueChange={(v) => v && setShippingMethod(v as ShippingMethod)}>
                <SelectTrigger className="w-full bg-white border-[rgba(183,28,28,0.12)]">
                  <SelectValue placeholder="Select delivery method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shipping">Shipping — Pan-India (3-7 days)</SelectItem>
                  <SelectItem value="pickup">Mysuru Pickup — Free</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Customer Details */}
            <div className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <User className="h-5 w-5 text-[#B71C1C]" />
                <h2 className="font-bold text-lg text-[#1A1A1A]">Contact information</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[#1A1A1A]">First name *</Label>
                  <Input id="firstName" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="John" className="bg-white border-[rgba(183,28,28,0.12)]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[#1A1A1A]">Last name</Label>
                  <Input id="lastName" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Doe" className="bg-white border-[rgba(183,28,28,0.12)]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#1A1A1A]">Phone number *</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+91 98765 43210" className="bg-white border-[rgba(183,28,28,0.12)]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#1A1A1A]">Email *</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="john@example.com" className="bg-white border-[rgba(183,28,28,0.12)]" />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {shippingMethod === "shipping" && (
              <div className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <MapPin className="h-5 w-5 text-[#B71C1C]" />
                  <h2 className="font-bold text-lg text-[#1A1A1A]">Delivery address</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="addressLine1" className="text-[#1A1A1A]">Address line 1 *</Label>
                      <Input id="addressLine1" value={form.addressLine1} onChange={(e) => updateField("addressLine1", e.target.value)} placeholder="Street number, building" className="bg-white border-[rgba(183,28,28,0.12)]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressLine2" className="text-[#1A1A1A]">Address line 2</Label>
                      <Input id="addressLine2" value={form.addressLine2} onChange={(e) => updateField("addressLine2", e.target.value)} placeholder="Apartment / unit" className="bg-white border-[rgba(183,28,28,0.12)]" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="area" className="text-[#1A1A1A]">Area / Locality</Label>
                      <Input id="area" value={form.area} onChange={(e) => updateField("area", e.target.value)} placeholder="e.g. Indiranagar" className="bg-white border-[rgba(183,28,28,0.12)]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landmark" className="text-[#1A1A1A]">Landmark</Label>
                      <Input id="landmark" value={form.landmark} onChange={(e) => updateField("landmark", e.target.value)} placeholder="Near..." className="bg-white border-[rgba(183,28,28,0.12)]" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-[#1A1A1A]">City *</Label>
                      <Input id="city" value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="Mumbai" className="bg-white border-[rgba(183,28,28,0.12)]" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-[#1A1A1A]">State *</Label>
                      <Select value={form.state} onValueChange={(v) => v && updateField("state", v)}>
                        <SelectTrigger className="w-full bg-white border-[rgba(183,28,28,0.12)]">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map((st) => (
                            <SelectItem key={st} value={st}>{st}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode" className="text-[#1A1A1A]">Pincode *</Label>
                      <Input id="pincode" value={form.pincode} onChange={(e) => updateField("pincode", e.target.value)} placeholder="400001" className="bg-white border-[rgba(183,28,28,0.12)]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#1A1A1A]">Address type</Label>
                    <div className="flex gap-3">
                      {[
                        { value: "home" as const, icon: Home, label: "Home" },
                        { value: "office" as const, icon: Building, label: "Office" },
                        { value: "other" as const, icon: Briefcase, label: "Other" },
                      ].map(({ value, icon: Icon, label }) => (
                        <button
                          key={value}
                          onClick={() => setAddressType(value)}
                          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border transition-all ${
                            addressType === value
                              ? "bg-[#B71C1C] text-white border-[#B71C1C]"
                              : "bg-white text-[#666666] border-[rgba(183,28,28,0.15)] hover:border-[#B71C1C]"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" /> {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={saveAddress} onChange={(e) => setSaveAddress(e.target.checked)} className="accent-[#B71C1C]" />
                    <span className="text-[#666666] text-xs">Save this address for next time</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={billingSame} onChange={(e) => setBillingSame(e.target.checked)} className="accent-[#B71C1C]" />
                    <span className="text-[#666666] text-xs">Billing address same as shipping</span>
                  </label>
                </div>
              </div>
            )}

            {/* Pickup info */}
            {shippingMethod === "pickup" && (
              <div className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <MapPin className="h-5 w-5 text-[#B71C1C]" />
                  <h2 className="font-bold text-lg text-[#1A1A1A]">Pickup location</h2>
                </div>
                <div className="bg-[#FFF8F0] p-5 border border-[rgba(183,28,28,0.08)]">
                  <p className="text-sm font-medium text-[#1A1A1A]">Poprika Kitchen</p>
                  <p className="text-xs text-[#666666] mt-1">
                    Vijayanagar 4th Stage<br />
                    Mysuru, Karnataka 570017
                  </p>
                  <p className="text-xs text-[#666666] mt-3">
                    We&apos;ll confirm your pickup time via WhatsApp after the order is placed.
                  </p>
                </div>
              </div>
            )}

            {/* Order notes */}
            <div className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <ShoppingBag className="h-5 w-5 text-[#B71C1C]" />
                <h2 className="font-bold text-lg text-[#1A1A1A]">Order notes</h2>
              </div>
              <Textarea value={form.deliveryInstructions} onChange={(e) => updateField("deliveryInstructions", e.target.value)} placeholder={shippingMethod === "pickup" ? "Preferred pickup time, anything we should know..." : "Gate code, landmark, delivery instructions..."} className="bg-white border-[rgba(183,28,28,0.12)] min-h-[80px]" />
            </div>

            {/* Payment — Razorpay */}
            <div className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="h-5 w-5 text-[#B71C1C]" />
                <h2 className="font-bold text-lg text-[#1A1A1A]">Payment method</h2>
              </div>
              <div className="p-5 border" style={{ borderColor: "#072654", background: "#f8faff" }}>
                <div className="flex items-center gap-2 mb-4">
                  <svg viewBox="0 0 100 30" className="h-7" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="30" rx="4" fill="#072654" />
                    <text x="12" y="20" fill="white" fontWeight="bold" fontSize="12" fontFamily="Arial">R<span style={{fill:"#3395FF"}}>azor</span>pay</text>
                  </svg>
                  <span className="bg-[#3395FF]/10 text-[#072654] text-[10px] px-2 py-0.5 font-semibold uppercase tracking-wider">Secure Checkout</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  <div className="flex items-center gap-2 bg-white p-2.5 border border-[rgba(7,38,84,0.08)]">
                    <div className="w-6 h-4 bg-[#3395FF]/10 flex items-center justify-center text-[8px] font-bold text-[#072654]">UPI</div>
                    <span className="text-[10px] text-[#072654] font-medium">Google Pay · PhonePe · Paytm</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2.5 border border-[rgba(7,38,84,0.08)]">
                    <div className="w-6 h-4 bg-[#3395FF]/10 flex items-center justify-center text-[8px] font-bold text-[#072654]">CC</div>
                    <span className="text-[10px] text-[#072654] font-medium">Visa · Mastercard · RuPay</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2.5 border border-[rgba(7,38,84,0.08)]">
                    <div className="w-6 h-4 bg-[#3395FF]/10 flex items-center justify-center text-[8px] font-bold text-[#072654]">NB</div>
                    <span className="text-[10px] text-[#072654] font-medium">All Major Banks</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2.5 border border-[rgba(7,38,84,0.08)]">
                    <div className="w-6 h-4 bg-[#3395FF]/10 flex items-center justify-center text-[8px] font-bold text-[#072654]">WL</div>
                    <span className="text-[10px] text-[#072654] font-medium">Paytm · Mobikwik</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2.5 border border-[rgba(7,38,84,0.08)]">
                    <div className="w-6 h-4 bg-[#3395FF]/10 flex items-center justify-center text-[8px] font-bold text-[#072654]">EMI</div>
                    <span className="text-[10px] text-[#072654] font-medium">No-cost EMI</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white p-2.5 border border-[rgba(7,38,84,0.08)]">
                    <div className="w-6 h-4 bg-[#3395FF]/10 flex items-center justify-center text-[8px] font-bold text-[#072654]">COD</div>
                    <span className="text-[10px] text-[#072654] font-medium">Cash on Delivery</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-[10px] text-[#666666] border-t border-[rgba(7,38,84,0.08)] pt-3">
                  <span className="flex items-center gap-1">🔒 Secure Checkout</span>
                  <span className="flex items-center gap-1">🔐 Encrypted Payments</span>
                  <span className="flex items-center gap-1">⚡ Fast Refunds</span>
                  <span className="flex items-center gap-1">⭐ Trusted by Thousands</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-[#FFFDF9] p-6 border border-[rgba(0,0,0,0.05)] shadow-sm sticky top-28">
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">Order summary</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 bg-white p-3 border border-[rgba(183,28,28,0.06)]">
                    <div className="w-12 h-12 bg-[#FFF8F0] shrink-0 flex items-center justify-center text-xs font-bold text-[#666666]">x{item.quantity}</div>
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
                <div className="flex justify-between text-[#666666]">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
                <Separator className="bg-[rgba(183,28,28,0.08)]" />
                <div className="flex justify-between text-lg font-bold"><span className="text-[#1A1A1A]">Total</span><span className="text-[#B71C1C]">₹{getSubtotal() - getDiscount() + shipping}</span></div>
              </div>

              <motion.div whileTap={{ scale: 0.97 }}>
                <Button className="w-full mt-6 bg-[#072654] hover:bg-[#051d3f] text-white h-12 text-base shadow-lg shadow-[#072654]/20 hover:shadow-[#072654]/30" onClick={handlePayment} disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2"><Lock className="h-4 w-4" /> Pay ₹{getSubtotal() - getDiscount() + shipping} securely</span>
                  )}
                </Button>
              </motion.div>
              <p className="text-[10px] text-[#666666] text-center mt-3 flex items-center justify-center gap-1">
                <span className="text-[#072654] font-semibold">Razorpay</span> Secure Checkout · Encrypted &amp; Safe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
