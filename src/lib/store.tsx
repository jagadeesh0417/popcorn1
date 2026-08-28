"use client";

import { createContext, useContext, useReducer, useMemo, useCallback, useEffect, ReactNode } from "react";
import { Product, CartItem, Coupon, ProductVariant } from "./types";
import { isBuyable, getAvailableQty } from "./stock";
import { toast } from "sonner";

function makeCartId(productId: string, variantLabel: string | null) {
  return variantLabel ? `${productId}__${variantLabel}` : productId;
}

function showAddedToast(product: Product, addedQty: number) {
  toast.success(`Added ${addedQty > 1 ? addedQty + "× " : ""}${product.name} to cart`, {
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
  | { type: "ADD_ITEM"; product: Product; variant: ProductVariant | null; quantity?: number }
  | { type: "REMOVE_ITEM"; cartId: string }
  | { type: "UPDATE_QUANTITY"; cartId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_COUPON"; coupon: Coupon | null; code: string }
  | { type: "LOAD_CART"; items: CartItem[] }
  | { type: "REFRESH_ITEMS"; items: CartItem[] };

interface CartContextType {
  state: CartState;
  addItem: (product: Product, variant?: ProductVariant | null, quantity?: number) => boolean;
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
    case "ADD_ITEM": {
      const cartId = makeCartId(action.product.id || action.product._id || "", action.variant?.label || null);
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
        product: action.product,
        variant: action.variant,
        quantity: action.quantity || 1,
        cartId,
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
              i.cartId === action.cartId ? { ...i, quantity: action.quantity } : i
            ),
      };
    case "CLEAR_CART":
      return { items: [], coupon: null, couponCode: "" };
    case "APPLY_COUPON":
      return { ...state, coupon: action.coupon, couponCode: action.code };
    case "LOAD_CART":
      return { ...state, items: action.items };
    case "REFRESH_ITEMS":
      return { ...state, items: action.items };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], coupon: null, couponCode: "" });

  useEffect(() => {
    const stored = localStorage.getItem("popcorn-cart");
    if (stored) {
      try {
        dispatch({ type: "LOAD_CART", items: JSON.parse(stored) });
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("popcorn-cart", JSON.stringify(state.items));
  }, [state.items]);

  // Revalidate stored cart items against fresh product data (handles items that were
  // in the cart before the admin marked a product out of stock).
  const refreshStock = useCallback(async () => {
    if (state.items.length === 0) return;
    const slugs = state.items
      .map((i) => i.product.slug)
      .filter((s): s is string => Boolean(s));
    if (slugs.length === 0) return;
    try {
      const res = await fetch(`/api/products?slugs=${encodeURIComponent(slugs.join(","))}&fresh=1`);
      const data = await res.json();
      if (!data?.success) return;
      const freshBySlug = new Map<string, Product>();
      (data.data as Product[]).forEach((p) => freshBySlug.set(p.slug, p));

      const updated: CartItem[] = state.items.map((item) => {
        const fresh = freshBySlug.get(item.product.slug);
        // Product no longer exists -> unavailable.
        if (!fresh) {
          return { ...item, unavailable: true };
        }
        const variant = fresh.sizes?.find((s) => s.label === item.variant?.label) || null;
        const available = isBuyable(fresh, variant);
        if (!available) {
          return { ...item, unavailable: true };
        }
        const maxQty = getAvailableQty(fresh, variant);
        const quantity = Math.min(item.quantity, maxQty);
        return { ...item, product: fresh, variant: variant || item.variant, quantity, unavailable: false };
      });

      dispatch({ type: "REFRESH_ITEMS", items: updated });
    } catch { /* revalidation failure is non-fatal; server stays authoritative */ }
  }, [state.items]);

  // Revalidate on mount (cart loaded from localStorage may be stale).
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
    const cartId = makeCartId(product.id || product._id || "", variant?.label || null);
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
    dispatch({ type: "ADD_ITEM", product, variant: variant || null, quantity: addQty });
    showAddedToast(product, addQty);
    return true;
  }, [state.items]);

  const removeItem = useCallback((cartId: string) => dispatch({ type: "REMOVE_ITEM", cartId }), []);
  const updateQuantity = useCallback((cartId: string, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", cartId, quantity }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const applyCoupon = useCallback((coupon: Coupon | null, code: string) => dispatch({ type: "APPLY_COUPON", coupon, code }), []);
  const hasUnavailableItems = useCallback(() => state.items.some((i) => i.unavailable), [state.items]);

  const value = useMemo(() => {
    const getPrice = (item: CartItem) => item.variant?.price ?? item.product.price ?? 0;
    const getSubtotal = () => state.items.reduce((sum, i) => sum + getPrice(i) * i.quantity, 0);
    const getDiscount = () => {
      if (!state.coupon) return 0;
      const subtotal = getSubtotal();
      if (subtotal < state.coupon.minAmount) return 0;
      return state.coupon.type === "percentage" ? (subtotal * state.coupon.discount) / 100 : state.coupon.discount;
    };
    const getShipping = () => 0;
    const getTotal = () => getSubtotal() - getDiscount() + getShipping();
    const getItemCount = () => state.items.reduce((sum, i) => sum + i.quantity, 0);
    return {
      state,
      addItem,
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
  }, [state, addItem, removeItem, updateQuantity, clearCart, applyCoupon, refreshStock, hasUnavailableItems]);

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
