"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, Loader2, AlertTriangle } from "lucide-react";
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
          <div className="shipping-label">
            {/* TO section (customer) */}
            <section className="to-section">
              <div className="section-heading">TO</div>
              <div className="recipient-name">{label.recipient.name}</div>
              {label.recipient.phone && (
                <div className="phone-line">Mobile: {label.recipient.phone}</div>
              )}
              <div className="address-block">
                {label.recipient.addressLines.length > 0 ? (
                  label.recipient.addressLines.map((line, i) => (
                    <div key={i} className={i > 0 ? "line" : ""}>{line}</div>
                  ))
                ) : (
                  <div className="line">—</div>
                )}
                {label.recipient.cityState && <div className="line">{label.recipient.cityState}</div>}
              </div>
              {label.recipient.pincode && (
                <div className="pin-line">PIN CODE: {label.recipient.pincode}</div>
              )}
            </section>

            <div className="shipping-divider" />

            {/* FROM section (sender) */}
            <section className="from-section">
              <div className="section-heading">FROM</div>
              <div className="sender-name">{label.sender.name}</div>
              <div className="phone-line">Mobile: {label.sender.phone}</div>
              <div className="address-block line">{label.sender.address}</div>
            </section>

            {label.order.id && (
              <div className="order-id">Order ID: {label.order.id}</div>
            )}
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
