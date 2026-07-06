"use client";

import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Product, CartItem, Coupon } from "./types";

interface CartState {
  items: CartItem[];
  coupon: Coupon | null;
  couponCode: string;
}

type CartAction =
  | { type: "ADD_ITEM"; product: Product; quantity?: number }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "CLEAR_CART" }
  | { type: "APPLY_COUPON"; coupon: Coupon | null; code: string }
  | { type: "LOAD_CART"; items: CartItem[] };

interface CartContextType {
  state: CartState;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
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
      const existing = state.items.find((i) => i.product.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + (action.quantity || 1) }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { product: action.product, quantity: action.quantity || 1 }],
      };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.product.id !== action.productId) };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: action.quantity <= 0
          ? state.items.filter((i) => i.product.id !== action.productId)
          : state.items.map((i) =>
              i.product.id === action.productId ? { ...i, quantity: action.quantity } : i
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

  const addItem = (product: Product, quantity?: number) => dispatch({ type: "ADD_ITEM", product, quantity });
  const removeItem = (productId: string) => dispatch({ type: "REMOVE_ITEM", productId });
  const updateQuantity = (productId: string, quantity: number) => dispatch({ type: "UPDATE_QUANTITY", productId, quantity });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });
  const applyCoupon = (coupon: Coupon | null, code: string) => dispatch({ type: "APPLY_COUPON", coupon, code });

  const getSubtotal = () => state.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const getDiscount = () => {
    if (!state.coupon) return 0;
    const subtotal = getSubtotal();
    if (subtotal < state.coupon.minAmount) return 0;
    return state.coupon.type === "percentage" ? (subtotal * state.coupon.discount) / 100 : state.coupon.discount;
  };
  const getShipping = () => (getSubtotal() >= 300 ? 0 : 40);
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
