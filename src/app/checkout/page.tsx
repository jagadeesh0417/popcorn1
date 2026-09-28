"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, MapPin, User, Lock, ShoppingBag, Store, Building, Home, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart, itemPrice, itemName } from "@/lib/store";
import { useShipping } from "@/lib/shipping-settings";
import { getProductImage } from "@/lib/image";
import { toast } from "sonner";
import Link from "next/link";
import { BRAND, FULFILMENT, KITCHEN_ADDRESS, ORDER_ID_PREFIX } from "@/lib/brand";

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

/** Internal selection. `shipping` is the pan-India/Mysore delivery rate. */
type ShippingMethod = "shipping" | "pickup" | "local";
type AddressType = "home" | "office" | "other";

const isPickup = (method: ShippingMethod) => method === "pickup";
const isDelivery = (method: ShippingMethod) => method === "shipping" || method === "local";

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
  const { state, getSubtotal, getDiscount, clearCart, applyCoupon, refreshStock, hasUnavailableItems } = useCart();
  const shippingCtx = useShipping();
  const [orderId] = useState(() => ORDER_ID_PREFIX + Date.now());
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const loadingRef = useRef(false);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("shipping");
  const [addressType, setAddressType] = useState<AddressType>("home");
  const [paymentMethod, setPaymentMethod] = useState<"razorpay" | "cod">("razorpay");

  // Clear the re-entrancy guard whenever the submit finishes (any path that sets
  // loading false), so a subsequent legitimate Pay click is never blocked.
  useEffect(() => {
    if (!loading) loadingRef.current = false;
  }, [loading]);

  // Revalidate cart against fresh product data so unavailable items block checkout.
  useEffect(() => {
    refreshStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    addressLine1: "", addressLine2: "", area: "", landmark: "",
    city: "", state: "", pincode: "",
    deliveryInstructions: "",
  });
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const updateField = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponMessage({ type: "error", text: "Please enter a coupon code" });
      return;
    }
    if (state.couponCode) {
      setCouponMessage({ type: "error", text: "A coupon is already applied to this order" });
      return;
    }
    setCouponLoading(true);
    setCouponMessage(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal: getSubtotal() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setCouponMessage({ type: "error", text: data.error || "Invalid coupon code" });
        return;
      }
      applyCoupon(data.data.coupon, data.data.code);
      setCouponInput("");
      setCouponMessage({ type: "success", text: "Coupon applied to your order" });
    } catch {
      setCouponMessage({ type: "error", text: "Could not validate coupon. Please try again." });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    applyCoupon(null, "");
    setCouponMessage(null);
  };

  /**
   * The only fields the browser sends to the server: line items, fulfilment
   * choice, coupon code and customer details. Totals, statuses and payment ids
   * are computed/owned server-side — this payload deliberately excludes them.
   */
  const buildCheckoutPayload = () => ({
    orderId,
    items: state.items.map((i) => {
      if (i.type === "bundle") {
        const bundle = i.bundle!;
        return {
          type: "bundle",
          bundleId: bundle.bundleId,
          productId: `bundle:${bundle.bundleId}`,
          name: bundle.name,
          price: bundle.unitPrice,
          quantity: i.quantity,
          sizeLabel: bundle.sizeLabel,
          image: bundle.image || "",
          parts: bundle.parts.map((p) => ({ productId: p.productId, name: p.name, variantLabel: p.variantLabel, quantity: p.quantity })),
        };
      }
      return {
        type: "product",
        productId: i.product?.id || i.product?._id || "",
        name: i.product?.name || "Product",
        price: itemPrice(i),
        quantity: i.quantity,
        image: (i.product ? getProductImage(i.product) : "") || "",
        variant: i.variant ? { label: i.variant.label, grams: i.variant.grams } : null,
      };
    }),
    shippingMethod,
    coupon: state.couponCode || undefined,
    fulfillmentMethod: isPickup(shippingMethod) ? "pickup" : "delivery",
    ...(isPickup(shippingMethod) ? { pickupLocation: KITCHEN_ADDRESS.singleLine } : {}),
    ...(isDelivery(shippingMethod)
      ? { deliveryRegion: /mysore|mysuru/i.test(form.city) ? "mysore" : "pan_india" }
      : {}),
    customerDetails: {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      address: isPickup(shippingMethod)
        ? KITCHEN_ADDRESS.singleLine
        : `${form.addressLine1}${form.addressLine2 ? ", " + form.addressLine2 : ""}${form.area ? ", " + form.area : ""}${form.landmark ? " (" + form.landmark + ")" : ""}`,
      city: isPickup(shippingMethod) ? KITCHEN_ADDRESS.city : form.city,
      state: isPickup(shippingMethod) ? KITCHEN_ADDRESS.region : form.state,
      zipCode: isPickup(shippingMethod) ? KITCHEN_ADDRESS.zip : form.pincode,
      deliveryInstructions: form.deliveryInstructions || undefined,
    },
  });

  /** Load the Razorpay checkout script once per page, reusing an existing tag. */
  const loadRazorpayScript = () =>
    new Promise<void>((resolve, reject) => {
      if ((window as unknown as Record<string, unknown>).Razorpay) return resolve();
      const existing = document.querySelector<HTMLScriptElement>('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay")));
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay"));
      document.head.appendChild(script);
    });

  const handlePayment = async () => {
    if (loadingRef.current) return;
    if (!form.firstName || !form.phone || !form.email) {
      toast.error("Please fill in your name, phone, and email");
      return;
    }
    if (isDelivery(shippingMethod) && (!form.addressLine1 || !form.city || !form.state || !form.pincode)) {
      toast.error("Please fill in your delivery address");
      return;
    }
    if (state.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (hasUnavailableItems()) {
      toast.error("One or more items in your cart are no longer available.");
      return;
    }
    setLoading(true);
    loadingRef.current = true;
    try {
      if (paymentMethod === "cod") {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildCheckoutPayload()),
        });
        const result = await res.json().catch(() => null);
        if (!res.ok || !result?.success) {
          throw new Error(result?.error || "Failed to create order");
        }
        clearCart();
        router.push(`/thanks?order=${result.data.orderId}`);
        return;
      }

      const orderRes = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...buildCheckoutPayload(), currency: "INR" }),
      });
      if (!orderRes.ok) {
        let errMsg = "Failed to create payment. Please try again.";
        try { const e = await orderRes.json(); if (e?.error) errMsg = e.error; } catch {}
        toast.error(errMsg);
        setLoading(false);
        return;
      }
      const orderData_ = await orderRes.json();
      if (!orderData_?.success) {
        toast.error(orderData_?.error || "Failed to create payment. Please try again.");
        setLoading(false);
        return;
      }
      const razorpayOrderId = orderData_.data.razorpayOrderId;
      const serverOrderId = orderData_.data.orderId as string;
      const serverAmount = orderData_.data.amount;
      const keyId = orderData_.data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      await loadRazorpayScript();

      if (!keyId) {
        toast.error("Payment is not configured. Please contact support.");
        setLoading(false);
        return;
      }
      const options = {
        key: keyId,
        amount: serverAmount,
        currency: "INR",
        name: BRAND.name,
        description: "Gourmet Popcorn",
        order_id: razorpayOrderId,
        prefill: {
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          contact: form.phone,
        },
        handler: async (response: RazorpayResponse) => {
          // Show the verification overlay until we know the truth (or hand the
          // decision over to the confirmation page's reconcile polling).
          setVerifying(true);
          try {
            let paid = false;
            try {
              const verifyRes = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: serverOrderId,
                }),
              });
              const verifyResult = await verifyRes.json().catch(() => null);
              paid = verifyResult?.success === true && verifyResult?.data?.paymentStatus === "paid";
              if (paid) {
                clearCart();
              } else if (verifyResult?.error && !verifyResult?.retryable) {
                // Transient "retryable" states stay quiet — the confirmation
                // page polls until the payment settles either way.
                toast.error(verifyResult.error);
              }
            } catch (err) {
              // Network hiccup during verification: never guess — the
              // confirmation page reconciles against the gateway instead.
              console.error("[CHECKOUT] verify request failed:", err);
            }
            // Paid, pending or failed: always land on the confirmation page,
            // which polls /api/razorpay/reconcile and shows the real state.
            router.push(`/thanks?order=${serverOrderId}`);
          } catch (err) {
            console.error("[CHECKOUT] handler error:", err);
            toast.error("Something went wrong after payment. Please note your payment ID and contact support.");
            setLoading(false);
            setVerifying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error("Payment cancelled. You can try again.");
          },
        },
      };

      const RazorpayCtor = (window as unknown as Record<string, unknown>).Razorpay as new (o: Record<string, unknown>) => { on: (e: string, h: () => void) => void; open: () => void };
      const rzp = new RazorpayCtor(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
      loadingRef.current = false;
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen pt-10 md:pt-14 flex items-center justify-center bg-background">
        <div className="text-center px-4">
          <ShoppingBag className="h-16 w-16 text-[#444444] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">Nothing to checkout</h2>
          <p className="text-[#444444] mb-6">Add some popcorn to your cart first!</p>
          <Link href="/shop"><Button className="bg-brand hover:bg-brand-deep text-white">Start Shopping</Button></Link>
        </div>
      </div>
    );
  }

  // Pickup is always free of delivery/shipping charges (see lib/shipping.ts).
  const pickupAvailable = shippingCtx.settings.mysuruPickupEnabled;
  const shipping = shippingCtx.getShippingCost(getSubtotal(), shippingMethod);

  return (
    <div className="min-h-screen pt-10 md:pt-14 bg-background">
      {verifying && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white px-8 py-7 max-w-sm mx-4 text-center border border-brand/10 shadow-2xl">
            <span className="animate-spin h-8 w-8 border-[3px] border-brand border-t-transparent rounded-full mx-auto block" />
            <p className="mt-4 text-base font-semibold text-[#1A1A1A]">Verifying your payment…</p>
            <p className="mt-1.5 text-sm text-[#444444]">Please wait — don&apos;t close or refresh this page.</p>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex justify-start mb-3">
            <div className="gold-rule" />
          </div>
          <span className="text-brand font-semibold text-sm uppercase tracking-[0.2em]">Checkout</span>
          <h1 className="text-3xl font-bold text-[#1A1A1A] mt-1" style={{ fontFamily: "var(--font-playfair)" }}>Complete your order</h1>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3 space-y-6">
            {/* Fulfilment method */}
            <div className="bg-white p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <Store className="h-5 w-5 text-brand" />
                <h2 className="font-bold text-lg text-[#1A1A1A]">How would you like your order?</h2>
              </div>
              <Select value={shippingMethod} onValueChange={(v) => v && setShippingMethod(v as ShippingMethod)}>
                <SelectTrigger className="w-full bg-white border-brand/12">
                  <SelectValue placeholder="Select delivery or pickup" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shipping">{FULFILMENT.delivery.label}</SelectItem>
                  {pickupAvailable && <SelectItem value="pickup">{FULFILMENT.pickup.label}</SelectItem>}
                </SelectContent>
              </Select>

              <div className="mt-5 bg-brand-mist border border-brand/10 p-4">
                <p className="text-sm text-[#1A1A1A] font-medium">
                  {isPickup(shippingMethod) ? FULFILMENT.pickup.label : FULFILMENT.delivery.label}
                </p>
                <p className="text-[#444444] text-sm mt-1.5 leading-relaxed">
                  {isPickup(shippingMethod) ? FULFILMENT.pickup.blurb : FULFILMENT.delivery.blurb}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {(isPickup(shippingMethod) ? FULFILMENT.pickup.steps : FULFILMENT.delivery.steps).map((step) => (
                    <li key={step} className="text-[#444444] text-xs leading-relaxed flex items-start gap-2">
                      <span className="text-brand mt-0.5">•</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <User className="h-5 w-5 text-brand" />
                <h2 className="font-bold text-lg text-[#1A1A1A]">Contact information</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-[#1A1A1A]">First name *</Label>
                  <Input id="firstName" value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="John" className="bg-white border-brand/12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-[#1A1A1A]">Last name</Label>
                  <Input id="lastName" value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Doe" className="bg-white border-brand/12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#1A1A1A]">Phone number *</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+91 8197175807" className="bg-white border-brand/12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#1A1A1A]">Email *</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="john@example.com" className="bg-white border-brand/12" />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {isDelivery(shippingMethod) && (
              <div className="bg-white p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <MapPin className="h-5 w-5 text-brand" />
                  <h2 className="font-bold text-lg text-[#1A1A1A]">{shippingMethod === "local" ? "Local delivery address" : "Delivery address"}</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="addressLine1" className="text-[#1A1A1A]">Address line 1 *</Label>
                      <Input id="addressLine1" value={form.addressLine1} onChange={(e) => updateField("addressLine1", e.target.value)} placeholder="Street number, building" className="bg-white border-brand/12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="addressLine2" className="text-[#1A1A1A]">Address line 2</Label>
                      <Input id="addressLine2" value={form.addressLine2} onChange={(e) => updateField("addressLine2", e.target.value)} placeholder="Apartment / unit" className="bg-white border-brand/12" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="area" className="text-[#1A1A1A]">Area / Locality</Label>
                      <Input id="area" value={form.area} onChange={(e) => updateField("area", e.target.value)} placeholder="e.g. Indiranagar" className="bg-white border-brand/12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="landmark" className="text-[#1A1A1A]">Landmark</Label>
                      <Input id="landmark" value={form.landmark} onChange={(e) => updateField("landmark", e.target.value)} placeholder="Near..." className="bg-white border-brand/12" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-[#1A1A1A]">City *</Label>
                      <Input id="city" value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="Mumbai" className="bg-white border-brand/12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-[#1A1A1A]">State *</Label>
                      <Select value={form.state} onValueChange={(v) => v && updateField("state", v)}>
                        <SelectTrigger className="w-full bg-white border-brand/12">
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
                      <Input id="pincode" value={form.pincode} onChange={(e) => updateField("pincode", e.target.value)} placeholder="400001" className="bg-white border-brand/12" />
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
                              ? "bg-brand text-white border-brand"
                              : "bg-white text-[#444444] border-brand/15 hover:border-brand"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" /> {label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Pickup info */}
            {isPickup(shippingMethod) && (
              <div className="bg-white p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
                <div className="flex items-center gap-2 mb-5">
                  <MapPin className="h-5 w-5 text-brand" />
                  <h2 className="font-bold text-lg text-[#1A1A1A]">Pickup location</h2>
                </div>
                <div className="bg-brand-mist p-5 border border-brand/10">
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[#666666] mb-1">Pickup Address</p>
                  <p className="text-sm font-medium text-[#1A1A1A]">{KITCHEN_ADDRESS.singleLine}</p>
                  <ul className="mt-4 space-y-1.5">
                    {FULFILMENT.pickup.steps.map((step) => (
                      <li key={step} className="text-[#444444] text-xs leading-relaxed flex items-start gap-2">
                        <span className="text-brand mt-0.5">•</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-[#444444] mt-4 pt-3 border-t border-brand/10">
                    No delivery charge applies to pickup orders.
                  </p>
                </div>
              </div>
            )}

            {/* Order notes */}
            <div className="bg-white p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <ShoppingBag className="h-5 w-5 text-brand" />
                <h2 className="font-bold text-lg text-[#1A1A1A]">Order notes</h2>
              </div>
              <Textarea value={form.deliveryInstructions} onChange={(e) => updateField("deliveryInstructions", e.target.value)} placeholder={isPickup(shippingMethod) ? "Preferred pickup time, anything we should know..." : shippingMethod === "local" ? "Delivery instructions, landmark..." : "Gate code, landmark, delivery instructions..."} className="bg-white border-brand/12 min-h-[80px]" />
            </div>

            {/* Payment method */}
            <div className="bg-white p-6 border border-[rgba(0,0,0,0.05)] shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="h-5 w-5 text-brand" />
                <h2 className="font-bold text-lg text-[#1A1A1A]">Payment method</h2>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`w-full flex items-center gap-4 p-4 border text-left transition-all ${
                    paymentMethod === "razorpay"
                      ? "border-[#072654] bg-[#f8faff]"
                      : "border-[rgba(0,0,0,0.08)] bg-white"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    paymentMethod === "razorpay" ? "border-[#072654]" : "border-[#999]"
                  }`}>
                    {paymentMethod === "razorpay" && <div className="w-2.5 h-2.5 rounded-full bg-[#072654]" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <svg viewBox="0 0 100 30" className="h-6" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100" height="30" rx="4" fill="#072654" />
                        <text x="12" y="20" fill="white" fontWeight="bold" fontSize="12" fontFamily="Arial">Razorpay</text>
                      </svg>
                      <span className="bg-[#3395FF]/10 text-[#072654] text-[10px] px-2 py-0.5 font-semibold uppercase">Pay Online</span>
                    </div>
                    <p className="text-xs text-[#444444]">UPI · Cards · Net Banking · Wallets · EMI</p>
                  </div>
                </button>

                {shippingCtx.settings.codEnabled && (
                  <button
                    onClick={() => setPaymentMethod("cod")}
                    className={`w-full flex items-center gap-4 p-4 border text-left transition-all ${
                      paymentMethod === "cod"
                        ? "border-brand bg-[#f8faff]"
                        : "border-[rgba(0,0,0,0.08)] bg-white"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      paymentMethod === "cod" ? "border-brand" : "border-[#999]"
                    }`}>
                      {paymentMethod === "cod" && <div className="w-2.5 h-2.5 rounded-full bg-brand" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-[#1A1A1A]">Cash on Delivery</span>
                        <span className="bg-brand/10 text-brand text-[10px] px-2 py-0.5 font-semibold uppercase">Pay Later</span>
                      </div>
                      <p className="text-xs text-[#444444]">Pay when you receive your order · No extra charges</p>
                    </div>
                  </button>
                )}

                {paymentMethod === "razorpay" && (
                  <div className="flex flex-wrap gap-3 text-[10px] text-[#444444] pt-1">
                    <span className="flex items-center gap-1">🔒 Secure Checkout</span>
                    <span className="flex items-center gap-1">🔐 Encrypted Payments</span>
                    <span className="flex items-center gap-1">⚡ Fast Refunds</span>
                    <span className="flex items-center gap-1">⭐ Trusted by Thousands</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 border border-[rgba(0,0,0,0.05)] shadow-sm sticky top-24">
              <h3 className="font-bold text-lg text-[#1A1A1A] mb-4">Order summary</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
                {state.items.map((item) => {
                  const price = itemPrice(item);
                  const isBundle = item.type === "bundle";
                  return (
                    <div key={item.cartId} className="flex items-center gap-3 bg-white p-3 border border-brand/6">
                      <div className="w-12 h-12 bg-brand-mist shrink-0 flex items-center justify-center text-xs font-bold text-[#444444]">x{item.quantity}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1A1A] truncate">{isBundle ? itemName(item) : item.product?.name}</p>
                        <p className="text-xs text-[#444444]">
                          {isBundle
                            ? `${item.bundle?.sizeLabel || "Bundle"} · ₹${price} each`
                            : item.variant
                              ? `${item.variant.label} · ₹${price} each`
                              : `₹${price} each`}
                        </p>
                      </div>
                      <span className="font-semibold text-sm text-[#1A1A1A]">₹{price * item.quantity}</span>
                    </div>
                  );
                })}
              </div>

              <Separator className="mb-4 bg-brand/8" />

              {/* Coupon */}
              <div className="mb-4">
                {state.couponCode ? (
                  <div className="flex items-between gap-2 bg-green-50 border border-green-200 p-3">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      <div>
                        <p className="text-sm font-semibold text-green-700">Coupon applied: {state.couponCode}</p>
                        <p className="text-xs text-green-600">You&apos;re saving ₹{getDiscount()}</p>
                      </div>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-xs font-medium text-brand hover:underline shrink-0 ml-2">Remove</button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <Input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApplyCoupon(); } }}
                        placeholder="Enter coupon code"
                        className="bg-white border-brand/15 uppercase"
                        disabled={couponLoading}
                      />
                      <Button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                        className="shrink-0 bg-[#1A1A1A] hover:bg-black text-white px-4"
                      >
                        {couponLoading ? (
                          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          "Apply"
                        )}
                      </Button>
                    </div>
                    {couponMessage && (
                      <p className={`text-xs mt-2 ${couponMessage.type === "error" ? "text-brand" : "text-green-600"}`}>
                        {couponMessage.text}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-[#444444]"><span>Cart Total</span><span>₹{getSubtotal()}</span></div>
                {getDiscount() > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{getDiscount()}</span></div>}
                <div className="flex justify-between text-[#444444]">
                  <span>{isPickup(shippingMethod) ? "Pickup" : "Delivery"}</span>
                  <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
                <Separator className="bg-brand/8" />
                <div className="flex justify-between text-lg font-bold"><span className="text-[#1A1A1A]">Total</span><span className="text-brand">₹{getSubtotal() - getDiscount() + shipping}</span></div>
              </div>

              <motion.div whileTap={{ scale: 0.97 }}>
                <Button
                  className={`w-full mt-6 h-12 text-base shadow-lg ${
                    paymentMethod === "cod"
                      ? "bg-brand hover:bg-brand-deep text-white shadow-brand/20 hover:shadow-brand/30"
                      : "bg-[#072654] hover:bg-[#051d3f] text-white shadow-[#072654]/20 hover:shadow-[#072654]/30"
                  }`}
                  onClick={handlePayment}
                  disabled={loading || verifying}
                >
                  {loading || verifying ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      {verifying ? "Verifying your payment..." : "Processing..."}
                    </span>
                  ) : paymentMethod === "cod" ? (
                    <span className="flex items-center gap-2"><Lock className="h-4 w-4" /> Place Order (COD)</span>
                  ) : (
                    <span className="flex items-center gap-2"><Lock className="h-4 w-4" /> Pay ₹{getSubtotal() - getDiscount() + shipping} securely</span>
                  )}
                </Button>
              </motion.div>
              {paymentMethod === "razorpay" && (
                <p className="text-[10px] text-[#444444] text-center mt-3 flex items-center justify-center gap-1">
                  <span className="text-[#072654] font-semibold">Razorpay</span> Secure Checkout · Encrypted &amp; Safe
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
