import { Product, ProductVariant } from "./types";

// Single source of truth for stock availability on the client.
// A product is purchasable via a variant only when the product-level kill switch
// (inStock) is on, and (for variant products) the selected variant is in stock
// with units > 0, or (for non-variant products) stockQuantity > 0.

export function getProductInStock(product: Product | null | undefined): boolean {
  if (!product) return false;
  return product.inStock !== false;
}

function normalizeVariantList(product: Product | null | undefined): ProductVariant[] {
  const sizes = product?.sizes;
  const variants = product?.variants;
  if (Array.isArray(sizes) && sizes.length > 0) return sizes;
  if (Array.isArray(variants) && variants.length > 0) return variants;
  return [];
}

export function hasVariants(product: Product | null | undefined): boolean {
  return normalizeVariantList(product).length > 0;
}

export function getVariantStock(variant: ProductVariant | null | undefined): number {
  const s = variant?.stock;
  return typeof s === "number" && !isNaN(s) ? Math.max(0, Math.floor(s)) : 0;
}

export function getGenericStock(product: Product | null | undefined): number {
  const q = product?.stockQuantity;
  return typeof q === "number" && !isNaN(q) ? Math.max(0, Math.floor(q)) : 0;
}

// Maximum purchasable quantity for a (product, variant) selection.
export function getAvailableQty(product: Product | null | undefined, variant?: ProductVariant | null): number {
  if (variant) return getVariantStock(variant);
  return getGenericStock(product);
}

// Whether a specific (product, variant) selection can currently be purchased.
export function isBuyable(product: Product | null | undefined, variant?: ProductVariant | null): boolean {
  if (!getProductInStock(product)) return false;
  if (hasVariants(product)) {
    if (!variant) return false;
    if (variant.inStock === false) return false;
    return getVariantStock(variant) > 0;
  }
  return getGenericStock(product) > 0;
}

// Product-level "Out of Stock" state (used for badges on cards / details header).
export function isOutOfStock(product: Product | null | undefined): boolean {
  if (!product) return true;
  if (product.inStock === false) return true;
  if (!hasVariants(product)) return getGenericStock(product) <= 0;
  return false;
}
