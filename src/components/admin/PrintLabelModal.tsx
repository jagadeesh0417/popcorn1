"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, Loader2, Package, AlertTriangle, Phone } from "lucide-react";
import { toast } from "sonner";
import type { ShippingLabelData } from "@/lib/shipping/label";
import "./shipping-label-print.css";

interface Props {
  orderId: string | null;
  onClose: () => void;
}

function LabelBody({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const [label, setLabel] = useState<ShippingLabelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/orders/${encodeURIComponent(orderId)}/shipping-label`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.success && data.data) setLabel(data.data as ShippingLabelData);
        else setError(data?.error || "Unable to generate shipping label. Please check the order details and try again.");
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Unable to generate shipping label. Please check the order details and try again.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const handlePrint = () => {
    if (!label || printing) return;
    setPrinting(true);
    // Let React paint the "Preparing..." state before opening the native dialog.
    setTimeout(() => {
      try {
        window.print();
      } catch {
        toast.error("Unable to open the print dialog. Please try again.");
      } finally {
        setPrinting(false);
      }
    }, 50);
  };

  return (
    <>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#DC0218]" />
          <p className="mt-3 text-sm text-[#444444]">Loading shipping label...</p>
        </div>
      ) : error ? (
        <div className="py-12 text-center">
          <AlertTriangle className="h-8 w-8 text-[#DC0218] mx-auto mb-3" />
          <p className="text-[#DC0218] text-sm mb-4 px-4">{error}</p>
          <button onClick={onClose} className="text-[#DC0218] text-sm underline">Close</button>
        </div>
      ) : label ? (
        <>
          {label.recipient.incomplete && (
            <div className="shipping-label-print-ui mb-3 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-800">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>Customer address is incomplete ({label.recipient.missingFields.join(", ")}). Printing whatever valid information exists.</span>
            </div>
          )}

          {/* The printable label */}
          <div className="shipping-label-print">
            {/* Brand */}
            <div className="text-center mb-3">
              <div className="text-[22px] font-black leading-none tracking-[0.08em]">{label.sender.brand}</div>
              <div className="text-[12px] font-semibold tracking-[0.35em] mt-0.5">SHIPPING LABEL</div>
            </div>

            <div className="my-2 border-t-2 border-black" />

            {/* FROM */}
            <div className="mb-3">
              <div className="text-[13px] font-bold tracking-[0.2em]">FROM</div>
              <div className="text-[14px] font-bold mt-1">{label.sender.name}</div>
              <div className="text-[12px] mt-0.5">Mobile: {label.sender.phone}</div>
              <div className="text-[12px] mt-0.5 leading-snug">{label.sender.address}</div>
            </div>

            <div className="my-2 border-t border-black" />

            {/* TO */}
            <div className="mb-3">
              <div className="text-[13px] font-bold tracking-[0.2em]">TO</div>
              <div className="text-[26px] font-black leading-tight mt-1 break-words">{label.recipient.name}</div>
              <div className="text-[14px] font-semibold mt-1.5 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                Mobile: {label.recipient.phone}
              </div>
              <div className="text-[15px] leading-snug mt-2">
                {label.recipient.addressLines.length > 0 ? (
                  label.recipient.addressLines.map((line, i) => (
                    <div key={i} className="break-words">{line}</div>
                  ))
                ) : (
                  <div>—</div>
                )}
                {label.recipient.cityState && <div className="mt-0.5">{label.recipient.cityState}</div>}
              </div>
              {label.recipient.pincode && (
                <div className="text-[18px] font-black tracking-wide mt-2">PIN CODE: {label.recipient.pincode}</div>
              )}
            </div>

            <div className="my-2 border-t border-black" />

            {/* Meta */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <div className="flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5" />
                Items: {label.order.itemCount}
              </div>
              {label.order.id && <div className="font-semibold">Order: {label.order.id}</div>}
            </div>
          </div>

          {/* Modal actions */}
          <div className="shipping-label-print-ui mt-5 flex flex-wrap items-center justify-end gap-2">
            <button
              onClick={onClose}
              disabled={printing}
              className="px-5 py-2.5 text-sm font-medium border border-[rgba(220,2,24,0.20)] text-[#1A1A1A] rounded-lg hover:bg-[#FFF8F0] transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              disabled={loading || printing}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#DC0218] hover:bg-[#C70015] rounded-lg transition-colors disabled:opacity-60"
            >
              {printing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Preparing...
                </>
              ) : (
                <>
                  <Printer className="h-4 w-4" /> PRINT LABEL
                </>
              )}
            </button>
          </div>
        </>
      ) : null}
    </>
  );
}

export function PrintLabelModal({ orderId, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  // Mount the portal only on the client (document.body does not exist during SSR).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!orderId || !mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="shipping-label-overlay fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm pt-6 pb-10"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl mx-3 my-auto bg-white"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal header */}
          <div className="shipping-label-print-ui flex items-center justify-between px-5 py-4 border-b border-[rgba(220,2,24,0.10)]">
            <div>
              <h2 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                <Printer className="h-4 w-4 text-[#DC0218]" /> Print Shipping Label
              </h2>
              <p className="text-xs text-[#444444] mt-0.5">Verify the recipient details below, then print.</p>
            </div>
            <button onClick={onClose} aria-label="Close" className="p-2 hover:bg-[#FFF8F0] rounded-lg transition-colors">
              <X className="h-5 w-5 text-[#444444]" />
            </button>
          </div>

          {/* Modal body */}
          <div className="p-5">
            <LabelBody key={orderId} orderId={orderId} onClose={onClose} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
