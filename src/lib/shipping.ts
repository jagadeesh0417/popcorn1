// Single source of truth for the free-shipping business rule.
// Pure TS (no React, no "use client") so both the client context and the
// server API routes can share identical calculation logic.

export interface ShippingSettings {
  freeShippingEnabled: boolean;
  freeShippingThreshold: number;
  flatDeliveryCharge: number;
  mysuruPickupEnabled: boolean;
  mysuruPickupFee: number;
  localMysuruDeliveryEnabled: boolean;
  localMysuruDeliveryFee: number;
  panIndiaShippingEnabled: boolean;
  panIndiaShippingFee: number;
  expressDeliveryEnabled: boolean;
  expressDeliveryCharge: number;
  codEnabled: boolean;
  codCharge: number;
}

export const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  freeShippingEnabled: true,
  freeShippingThreshold: 329,
  flatDeliveryCharge: 49,
  mysuruPickupEnabled: true,
  mysuruPickupFee: 0,
  localMysuruDeliveryEnabled: false,
  localMysuruDeliveryFee: 0,
  panIndiaShippingEnabled: true,
  panIndiaShippingFee: 140,
  expressDeliveryEnabled: false,
  expressDeliveryCharge: 99,
  codEnabled: false,
  codCharge: 20,
};

// A subtotal at the threshold (₹329) qualifies for free shipping, so the
// comparison MUST be >= (never >).
export function qualifiesForFreeShipping(subtotal: number, settings: ShippingSettings): boolean {
  const value = Number.isFinite(subtotal) ? subtotal : 0;
  return settings.freeShippingEnabled && value >= settings.freeShippingThreshold;
}

// Server and client compute shipping from the same rule. The shipping amount
// is derived from the subtotal + delivery method, never from a client-supplied
// fee. method: "shipping" | "pickup" | "local" | "express" (or undefined = pan-India).
export function computeShippingCost(subtotal: number, settings: ShippingSettings, method?: string): number {
  const value = Number.isFinite(subtotal) ? subtotal : 0;
  if (qualifiesForFreeShipping(value, settings)) return 0;
  switch (method) {
    case "pickup": return settings.mysuruPickupFee;
    case "local": return settings.localMysuruDeliveryFee;
    case "express": return settings.expressDeliveryEnabled ? settings.expressDeliveryCharge : settings.panIndiaShippingFee;
    default: return settings.panIndiaShippingEnabled ? settings.panIndiaShippingFee : settings.flatDeliveryCharge;
  }
}

// How much more needs to be added to the cart to unlock free shipping.
export function remainingToFreeShipping(subtotal: number, settings: ShippingSettings): number {
  const value = Number.isFinite(subtotal) ? subtotal : 0;
  return Math.max(0, settings.freeShippingThreshold - value);
}

// Currency formatting for amounts that may be fractional (e.g. ₹0.50 -> "0.5",
// ₹29 -> "29", ₹0.01 -> "0.01"). Matches how the storefront renders rupees.
export function formatRupees(value: number): string {
  const n = Number.isFinite(value) ? value : 0;
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(2).replace(/\.?0+$/, "");
}