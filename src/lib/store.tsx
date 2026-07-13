"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Product, CartItem, Coupon, ProductVariant } from "./types";

function makeCartId(productId: string, variantLabel: string | null) {
  return variantLabel ? `${productId}__${variantLabel}` : productId;
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
  | { type: "LOAD_CART"; items: CartItem[] };

interface CartContextType {
  state: CartState;
  addItem: (product: Product, variant?: ProductVariant | null, quantity?: number) => void;
  removeItem: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon | null, code: string) => void;
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
              ? { ...i, quantity: i.quantity + (action.quantity || 1) }
              : i
          ),
        };
      }
      const newItem: CartItem = {
        product: action.product,
        variant: action.variant,
        quantity: action.quantity || 1,
        cartId,
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

  const addItem = (product: Product, variant?: ProductVariant | null, quantity?: number) =>
    dispatch({ type: "ADD_ITEM", product, variant: variant || null, quantity });
  const removeItem = (cartId: string) => dispatch({ type: "REMOVE_ITEM", cartId });
  const updateQuantity = (cartId: string, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", cartId, quantity });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const applyCoupon = (coupon: Coupon | null, code: string) => dispatch({ type: "APPLY_COUPON", coupon, code });

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

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart, applyCoupon, getSubtotal, getDiscount, getShipping, getTotal, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
