"use client";

import { createContext, useContext, useReducer, useMemo, useCallback, useEffect, ReactNode } from "react";
import { Product, CartItem, Coupon, ProductVariant, BundleComposition } from "./types";
import { isBuyable, getAvailableQty } from "./stock";
import { toast } from "sonner";

const CART_KEY = "popcorn-cart";

function makeProductCartId(productId: string, variantLabel: string | null) {
  return variantLabel ? `${productId}__${variantLabel}` : productId;
}

function makeBundleCartId(bundle: BundleComposition) {
  return `bundle:${bundle.bundleId}__${bundle.sizeLabel}`;
}

export function itemPrice(item: CartItem): number {
  if (item.type === "bundle") return item.bundle?.unitPrice ?? 0;
  return item.variant?.price ?? item.product?.price ?? 0;
}

export function itemName(item: CartItem): string {
  if (item.type === "bundle") return item.bundle?.name ?? "Bundle";
  return item.product?.name ?? "Product";
}

export function itemUnitLabel(item: CartItem): string {
  if (item.type === "bundle") return item.bundle?.sizeLabel ?? "Bundle";
  if (item.variant) return item.variant.label;
  return "";
}

function showAddedToast(itemNameLabel: string, addedQty: number) {
  toast.success(`Added ${addedQty > 1 ? addedQty + "× " : ""}${itemNameLabel} to cart`, {
    description: "Checkout anytime from your cart.",
    action: {
      label: "View Cart",
      onClick: () => { window.location.href = "/cart"; },
    },
    duration: 3000,
  });
}

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  couponCode: string;
}

type CartAction =
  | { type: "ADD_PRODUCT"; product: Product; variant: ProductVariant | null; quantity?: number }
  | { type: "ADD_BUNDLE"; bundle: BundleComposition }
  | { type: "REMOVE_ITEM"; cartId: string }
  | { type: "UPDATE_QUANTITY"; cartId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_COUPON"; coupon: Coupon | null; code: string }
  | { type: "LOAD_CART"; items: CartItem[] }
  | { type: "REFRESH_ITEMS"; items: CartItem[] }
  | { type: "MARK_UNAVAILABLE"; cartId: string; unavailable: boolean };

interface CartContextType {
  state: CartState;
  addItem: (product: Product, variant?: ProductVariant | null, quantity?: number) => boolean;
  addBundle: (bundle: BundleComposition) => boolean;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon | null, code: string) => void;
  refreshStock: () => Promise<void>;
  hasUnavailableItems: () => boolean;
  getSubtotal: () => number;
  getDiscount: () => number;
  getShipping: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_PRODUCT": {
      const cartId = makeProductCartId(action.product.id || action.product._id || "", action.variant?.label || null);
      const existing = state.items.find((i) => i.cartId === cartId);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.cartId === cartId
              ? { ...i, quantity: i.quantity + (action.quantity || 1), unavailable: false }
              : i
          ),
        };
      }
      const newItem: CartItem = {
        cartId,
        type: "product",
        product: action.product,
        variant: action.variant ?? null,
        quantity: action.quantity || 1,
        unavailable: false,
      };
      return { ...state, items: [...state.items, newItem] };
    }
    case "ADD_BUNDLE": {
      const cartId = makeBundleCartId(action.bundle);
      const existing = state.items.find((i) => i.cartId === cartId);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.cartId === cartId
              ? { ...i, quantity: i.quantity + 1, unavailable: false, bundle: action.bundle }
              : i
          ),
        };
      }
      const newItem: CartItem = {
        cartId,
        type: "bundle",
        bundle: action.bundle,
        quantity: 1,
        unavailable: false,
      };
      return { ...state, items: [...state.items, newItem] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.cartId !== action.cartId) };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: action.quantity <= 0
          ? state.items.filter((i) => i.cartId !== action.cartId)
          : state.items.map((i) =>
              i.cartId === action.cartId ? { ...i, quantity: action.quantity, unavailable: false } : i
            ),
      };
    case "CLEAR_CART":
      return { items: [], coupon: null, couponCode: "" };
    case "APPLY_COUPON":
      return { ...state, coupon: action.coupon, couponCode: action.code };
    case "LOAD_CART":
      // Normalize legacy persisted lines (added before bundles existed) to product lines.
      const normalized = action.items.map((i) =>
        i && i.type ? i : { ...i, type: "product" as const }
      );
      return { ...state, items: normalized };
    case "REFRESH_ITEMS":
      return { ...state, items: action.items };
    case "MARK_UNAVAILABLE":
      return {
        ...state,
        items: state.items.map((i) =>
          i.cartId === action.cartId ? { ...i, unavailable: action.unavailable } : i
        ),
      };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], coupon: null, couponCode: "" });

  // Load persisted cart once on mount.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        dispatch({ type: "LOAD_CART", items: Array.isArray(parsed) ? parsed : [] });
      }
    } catch { /* ignore */ }
  }, []);

  // Persist any cart change.
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(state.items));
    } catch { /* ignore */ }
  }, [state.items]);

  // Revalidate stored cart against fresh data on mount (handles products/bundles that
  // went out of stock after the item was added).
  const refreshStock = useCallback(async () => {
    if (state.items.length === 0) return;

    // Products need re-fetching by slug; bundle lines are re-derivable from their parts.
    const productSlugs = state.items
      .filter((i) => i.type === "product" && i.product?.slug)
      .map((i) => i.product!.slug as string)
      .filter(Boolean);
    if (productSlugs.length > 0) {
      try {
        const res = await fetch(`/api/products?slugs=${encodeURIComponent(productSlugs.join(","))}&fresh=1`);
        const data = await res.json();
        const freshBySlug = new Map<string, Product>();
        if (data?.success) (data.data as Product[]).forEach((p) => freshBySlug.set(p.slug, p));

        const updated: CartItem[] = state.items.map((item) => {
          if (item.type === "bundle") return item;
          const fresh = item.product?.slug ? freshBySlug.get(item.product.slug) : undefined;
          if (!fresh) return { ...item, unavailable: true };
          const variant = fresh.sizes?.find((s) => s.label === item.variant?.label) || null;
          const available = isBuyable(fresh, variant);
          if (!available) return { ...item, unavailable: true };
          const maxQty = getAvailableQty(fresh, variant);
          const quantity = Math.min(item.quantity, maxQty);
          return { ...item, product: fresh, variant: variant || item.variant, quantity, unavailable: false };
        });
        dispatch({ type: "REFRESH_ITEMS", items: updated });
      } catch { /* revalidation failure is non-fatal; server stays authoritative */ }
    }
  }, [state.items]);

  useEffect(() => {
    refreshStock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addItem = useCallback((product: Product, variant?: ProductVariant | null, quantity?: number): boolean => {
    if (!isBuyable(product, variant)) {
      toast.error("Sorry, this product is currently out of stock.");
      return false;
    }
    const qty = Math.max(1, Math.floor(quantity || 1));
    const maxQty = getAvailableQty(product, variant);
    const cartId = makeProductCartId(product.id || product._id || "", variant?.label || null);
    const existing = state.items.find((i) => i.cartId === cartId);
    const currentQty = existing?.quantity ?? 0;
    const addQty = Math.max(0, Math.min(qty, maxQty - currentQty));
    if (addQty <= 0) {
      toast.error(
        currentQty >= maxQty && maxQty > 0
          ? `Only ${maxQty} ${maxQty === 1 ? "unit" : "units"} in stock. Please update the quantity in your cart.`
          : "Sorry, this product is currently out of stock."
      );
      return false;
    }
    if (addQty < qty) {
      toast.warning(`Only ${maxQty} ${maxQty === 1 ? "unit" : "units"} in stock. Added ${addQty} to your cart.`);
    }
    dispatch({ type: "ADD_PRODUCT", product, variant: variant ?? null, quantity: addQty });
    showAddedToast(product.name, addQty);
    return true;
  }, [state.items]);

  const addBundle = useCallback((bundle: BundleComposition): boolean => {
    if (!bundle || !bundle.parts || bundle.parts.length === 0) {
      toast.error("Unable to load bundle products. Please retry.");
      return false;
    }
    const cartId = makeBundleCartId(bundle);
    const existing = state.items.find((i) => i.cartId === cartId);
    if (existing) {
      const nextQty = existing.quantity + 1;
      dispatch({ type: "UPDATE_QUANTITY", cartId, quantity: nextQty });
      showAddedToast(bundle.name, 1);
      return true;
    }
    dispatch({ type: "ADD_BUNDLE", bundle });
    showAddedToast(bundle.name, 1);
    return true;
  }, [state.items]);

  const removeItem = useCallback((cartId: string) => dispatch({ type: "REMOVE_ITEM", cartId }), []);
  const updateQuantity = useCallback((cartId: string, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", cartId, quantity }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const applyCoupon = useCallback((coupon: Coupon | null, code: string) => dispatch({ type: "APPLY_COUPON", coupon, code }), []);
  const hasUnavailableItems = useCallback(() => state.items.some((i) => i.unavailable), [state.items]);

  const value = useMemo(() => {
    const getSubtotal = () => state.items.reduce((sum, i) => sum + itemPrice(i) * i.quantity, 0);
    const getDiscount = () => {
      if (!state.coupon) return 0;
      const subtotal = getSubtotal();
      if (subtotal < state.coupon.minAmount) return 0;
      return state.coupon.type === "percentage" ? Math.round((subtotal * state.coupon.discount) / 100) : state.coupon.discount;
    };
    const getShipping = () => 0;
    const getTotal = () => getSubtotal() - getDiscount() + getShipping();
    const getItemCount = () => state.items.reduce((sum, i) => sum + i.quantity, 0);
    return {
      state,
      addItem,
      addBundle,
      removeItem,
      updateQuantity,
      clearCart,
      applyCoupon,
      refreshStock,
      hasUnavailableItems,
      getSubtotal,
      getDiscount,
      getShipping,
      getTotal,
      getItemCount,
    };
  }, [state, addItem, addBundle, removeItem, updateQuantity, clearCart, applyCoupon, refreshStock, hasUnavailableItems]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

// Shared availability helper so the cart UI can cap quantities for bundle lines too.
export function cartItemMaxQty(item: CartItem): number {
  return itemPrice(item) > 0 ? Infinity : 0;
}
