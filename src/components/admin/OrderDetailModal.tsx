"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Printer, Loader2, MapPin, Phone, Mail, User, CreditCard, ShoppingBag, Truck, Package, Hash, Calendar, IndianRupee } from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: { label: string; grams: number } | null;
}

interface CustomerDetails {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  deliveryInstructions?: string;
}

interface StatusEvent {
  status: string;
  date: string;
  note?: string;
}

interface OrderData {
  _id: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  coupon?: string;
  status: string;
  paymentId?: string;
  razorpayOrderId?: string;
  paymentMethod?: string;
  customerDetails: CustomerDetails;
  statusTimeline?: StatusEvent[];
  trackingId?: string;
  courierPartner?: string;
  estimatedDelivery?: string;
  createdAt: string;
  deliveryInstructions?: string;
}

interface Props {
  orderId: string | null;
  onClose: () => void;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800", confirmed: "bg-blue-100 text-blue-800",
  packed: "bg-purple-100 text-purple-800", shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800", cancelled: "bg-red-100 text-red-800",
  "return-requested": "bg-orange-100 text-orange-800",
};

export function OrderDetailModal({ orderId, onClose }: Props) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.success) setOrder(data.data);
        else setError(data.error || "Failed to load order");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load order");
        setLoading(false);
      });
  }, [orderId]);

  const copyOrderId = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.orderId);
    toast.success("Order ID copied");
  };

  const getDeliveryMethod = () => {
    if (!order) return "";
    const addr = order.customerDetails.address;
    if (addr?.toLowerCase().includes("pickup")) return "Mysuru Pickup";
    return "Home Delivery";
  };

  if (!orderId) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-10 pb-10 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[rgba(220,2,24,0.08)]">
            <div>
              <h2 className="text-xl font-bold text-[#1A1A1A]">Order Details</h2>
              <p className="text-xs text-[#444444] mt-0.5">Complete order information</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-[#FFF8F0] rounded-lg transition-colors">
              <X className="h-5 w-5 text-[#444444]" />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#DC0218]" />
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-[#DC0218] text-sm mb-2">{error}</p>
              <button onClick={onClose} className="text-[#DC0218] text-sm underline">Close</button>
            </div>
          ) : order ? (
            <div className="p-6 space-y-6">
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button onClick={copyOrderId} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[rgba(220,2,24,0.15)] text-[#1A1A1A] rounded-lg hover:bg-[#FFF8F0] transition-colors">
                  <Copy className="h-3.5 w-3.5" /> Copy Order ID
                </button>
                <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium border border-[rgba(220,2,24,0.15)] text-[#1A1A1A] rounded-lg hover:bg-[#FFF8F0] transition-colors">
                  <Printer className="h-3.5 w-3.5" /> Print Invoice
                </button>
              </div>

              {/* Order IDs */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-[#FFF8F0] p-4 rounded-xl border border-[rgba(220,2,24,0.06)]">
                  <div className="flex items-center gap-2 mb-1">
                    <Hash className="h-4 w-4 text-[#DC0218]" />
                    <span className="text-xs text-[#444444] uppercase tracking-wide">Order ID</span>
                  </div>
                  <p className="font-semibold text-[#1A1A1A] text-sm break-all">{order.orderId}</p>
                </div>
                <div className="bg-[#FFF8F0] p-4 rounded-xl border border-[rgba(220,2,24,0.06)]">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-[#DC0218]" />
                    <span className="text-xs text-[#444444] uppercase tracking-wide">Order Date</span>
                  </div>
                  <p className="font-semibold text-[#1A1A1A] text-sm">{new Date(order.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-4 w-4 text-[#DC0218]" />
                  <h3 className="font-semibold text-sm text-[#1A1A1A]">Payment Information</h3>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-[rgba(220,2,24,0.06)]">
                    <p className="text-[10px] text-[#888] uppercase tracking-wide mb-0.5">Payment ID</p>
                    <p className="text-sm font-medium text-[#1A1A1A] break-all">{order.paymentId || "—"}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[rgba(220,2,24,0.06)]">
                    <p className="text-[10px] text-[#888] uppercase tracking-wide mb-0.5">Razorpay Order ID</p>
                    <p className="text-sm font-medium text-[#1A1A1A] break-all">{order.razorpayOrderId || "—"}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-[rgba(220,2,24,0.06)]">
                    <p className="text-[10px] text-[#888] uppercase tracking-wide mb-0.5">Payment Method</p>
                    <p className="text-sm font-medium text-[#1A1A1A]">{order.paymentMethod || "—"}</p>
                  </div>
                </div>
              </div>

              {/* Customer */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-[#DC0218]" />
                  <h3 className="font-semibold text-sm text-[#1A1A1A]">Customer Details</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[rgba(220,2,24,0.06)] space-y-2">
                  <p className="text-sm text-[#1A1A1A] font-medium">{order.customerDetails.firstName} {order.customerDetails.lastName}</p>
                  <div className="flex items-center gap-1.5 text-xs text-[#444444]">
                    <Mail className="h-3.5 w-3.5" /> {order.customerDetails.email}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#444444]">
                    <Phone className="h-3.5 w-3.5" /> {order.customerDetails.phone}
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-[#DC0218]" />
                  <h3 className="font-semibold text-sm text-[#1A1A1A]">Delivery Address</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[rgba(220,2,24,0.06)]">
                  <p className="text-sm text-[#1A1A1A]">{order.customerDetails.address}</p>
                  <p className="text-xs text-[#444444] mt-1">{order.customerDetails.city}, {order.customerDetails.state} — {order.customerDetails.zipCode}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <Truck className="h-3.5 w-3.5 text-[#DC0218]" />
                    <span className="text-xs font-medium text-[#DC0218]">{getDeliveryMethod()}</span>
                  </div>
                  {order.customerDetails.deliveryInstructions && (
                    <div className="mt-2 p-2 bg-[#FFF8F0] rounded-lg text-xs text-[#444444]">
                      <span className="font-medium">Notes:</span> {order.customerDetails.deliveryInstructions}
                    </div>
                  )}
                </div>
              </div>

              {/* Products */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ShoppingBag className="h-4 w-4 text-[#DC0218]" />
                  <h3 className="font-semibold text-sm text-[#1A1A1A]">Products Ordered</h3>
                </div>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white p-3 rounded-xl border border-[rgba(220,2,24,0.06)]">
                      <div className="w-14 h-14 bg-[#FFF8F0] rounded-lg flex items-center justify-center text-lg shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                          <Package className="h-6 w-6 text-[#DC0218]/40" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1A1A]">{item.name}</p>
                        {item.variant?.label && <p className="text-xs text-[#444444]">{item.variant.label}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-medium text-[#1A1A1A]">x{item.quantity}</p>
                        <p className="text-xs text-[#444444]">₹{item.price} each</p>
                      </div>
                      <div className="text-right shrink-0 min-w-[60px]">
                        <p className="text-sm font-semibold text-[#DC0218]">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee className="h-4 w-4 text-[#DC0218]" />
                  <h3 className="font-semibold text-sm text-[#1A1A1A]">Order Summary</h3>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[rgba(220,2,24,0.06)] space-y-1.5 text-sm">
                  <div className="flex justify-between text-[#444444]"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600"><span>Discount {order.coupon ? `(${order.coupon})` : ""}</span><span>-₹{order.discount}</span></div>
                  )}
                  <div className="flex justify-between text-[#444444]"><span>Shipping</span><span>{order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</span></div>
                  <div className="border-t border-[rgba(220,2,24,0.06)] pt-1.5 flex justify-between font-bold text-[#1A1A1A]">
                    <span>Grand Total</span>
                    <span className="text-[#DC0218]">₹{order.total}</span>
                  </div>
                </div>
              </div>

              {/* Status & Timeline */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4 text-[#DC0218]" />
                  <h3 className="font-semibold text-sm text-[#1A1A1A]">Order Status</h3>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.paymentId ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {order.paymentId ? "Paid" : "Pending"}
                  </span>
                </div>
                {order.statusTimeline && order.statusTimeline.length > 0 && (
                  <div className="space-y-2">
                    {order.statusTimeline.map((event, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 mt-1.5 rounded-full bg-[#DC0218] shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-[#1A1A1A] capitalize">{event.status}</p>
                          <p className="text-xs text-[#444444]">{new Date(event.date).toLocaleString("en-IN")}{event.note ? ` — ${event.note}` : ""}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
