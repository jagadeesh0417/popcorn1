"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

const defaultSettings: ShippingSettings = {
  freeShippingEnabled: true,
  freeShippingThreshold: 399,
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

const STORAGE_KEY = "blue-dino-shipping";
/** Pre-rebrand key, read once so existing admin shipping config is preserved. */
const LEGACY_STORAGE_KEY = "poprika-shipping";

function loadInitialSettings(): ShippingSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const stored =
      localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (stored) {
      const parsed = { ...defaultSettings, ...JSON.parse(stored) };
      if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch { /* ignore */ }
  return defaultSettings;
}

interface ShippingContextType {
  settings: ShippingSettings;
  updateSettings: (s: ShippingSettings) => void;
  getShippingCost: (subtotal: number, method?: string) => number;
  freeShippingRemaining: (subtotal: number) => number;
  qualifiesForFree: (subtotal: number) => boolean;
}

const ShippingContext = createContext<ShippingContextType | undefined>(undefined);

export function ShippingProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ShippingSettings>(loadInitialSettings);

  useEffect(() => {
    fetch("/api/settings?key=shipping")
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data.data?.value) {
          const merged = { ...defaultSettings, ...data.data.value };
          setSettings(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        }
      })
      .catch(() => {});
  }, []);

  const updateSettings = (s: ShippingSettings) => {
    setSettings(s);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  };

  const qualifiesForFree = (subtotal: number) =>
    settings.freeShippingEnabled && subtotal >= settings.freeShippingThreshold;

  const freeShippingRemaining = (subtotal: number) =>
    Math.max(0, settings.freeShippingThreshold - subtotal);

  const getShippingCost = (subtotal: number, method?: string) => {
    if (method === "pickup") return 0;
    if (qualifiesForFree(subtotal)) return 0;
    switch (method) {
      case "local": return settings.localMysuruDeliveryFee;
      case "express": return settings.expressDeliveryEnabled ? settings.expressDeliveryCharge : settings.panIndiaShippingFee;
      default: return settings.panIndiaShippingEnabled ? settings.panIndiaShippingFee : settings.flatDeliveryCharge;
    }
  };

  return (
    <ShippingContext.Provider value={{ settings, updateSettings, getShippingCost, freeShippingRemaining, qualifiesForFree }}>
      {children}
    </ShippingContext.Provider>
  );
}

export function useShipping() {
  const ctx = useContext(ShippingContext);
  if (!ctx) throw new Error("useShipping must be used within ShippingProvider");
  return ctx;
}
