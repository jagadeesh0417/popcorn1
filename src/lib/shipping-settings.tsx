"use client";

import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from "react";
import {
  DEFAULT_SHIPPING_SETTINGS,
  ShippingSettings,
  qualifiesForFreeShipping,
  computeShippingCost,
  remainingToFreeShipping,
} from "@/lib/shipping";

const STORAGE_KEY = "blue-dino-shipping";
/** Pre-rebrand key, read once so existing admin shipping config is preserved. */
const LEGACY_STORAGE_KEY = "poprika-shipping";

function loadInitialSettings(): ShippingSettings {
  if (typeof window === "undefined") return { ...DEFAULT_SHIPPING_SETTINGS };
  try {
    const stored =
      localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (stored) {
      const parsed = { ...DEFAULT_SHIPPING_SETTINGS, ...JSON.parse(stored) };
      if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch { /* ignore */ }
  return { ...DEFAULT_SHIPPING_SETTINGS };
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
          const merged = { ...DEFAULT_SHIPPING_SETTINGS, ...data.data.value };
          setSettings(merged);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        }
      })
      .catch(() => {});
  }, []);

  const updateSettings = useCallback((s: ShippingSettings) => {
    setSettings(s);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  }, []);

  const qualifiesForFree = useCallback(
    (subtotal: number) => qualifiesForFreeShipping(subtotal, settings),
    [settings]
  );

  const freeShippingRemaining = useCallback(
    (subtotal: number) => remainingToFreeShipping(subtotal, settings),
    [settings]
  );

  const getShippingCost = useCallback(
    (subtotal: number, method?: string) => computeShippingCost(subtotal, settings, method),
    [settings]
  );

  const value = useMemo(
    () => ({ settings, updateSettings, getShippingCost, freeShippingRemaining, qualifiesForFree }),
    [settings, updateSettings, getShippingCost, freeShippingRemaining, qualifiesForFree]
  );

  return (
    <ShippingContext.Provider value={value}>
      {children}
    </ShippingContext.Provider>
  );
}

export function useShipping() {
  const ctx = useContext(ShippingContext);
  if (!ctx) throw new Error("useShipping must be used within ShippingProvider");
  return ctx;
}