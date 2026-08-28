import { connectDB } from "@/lib/db";
import Product from "@/lib/models/Product";

export interface ResolvedItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant: { label: string; grams: number } | null;
}

export interface StockResolution {
  items: ResolvedItem[];
  subtotal: number;
}

interface RawItem {
  productId?: string;
  name?: string;
  price?: number;
  quantity?: number;
  image?: string;
  variant?: { label?: string; grams?: number } | null;
}

class StockError extends Error {
  code: number;
  constructor(msg: string, code = 409) {
    super(msg);
    this.code = code;
  }
}

function normalizeImage(product: Record<string, unknown>): string {
  const images = Array.isArray(product.images) ? (product.images as unknown[]) : [];
  const first = images.find((i) => typeof i === "string" && (i as string).length > 0);
  if (first) return first as string;
  const single = (product as Record<string, unknown>).image;
  return typeof single === "string" ? single : "";
}

// Authoritative server-side stock validation.
// Returns resolved order items with real DB names/prices and a server-computed subtotal.
// Throws StockError naming the first unavailable product.
export async function validateAndResolveItems(rawItems: RawItem[]): Promise<StockResolution> {
  await connectDB();
  const items: RawItem[] = Array.isArray(rawItems) ? rawItems : [];
  if (items.length === 0) {
    throw new StockError("Order has no items", 400);
  }

  const resolved: ResolvedItem[] = [];
  let subtotal = 0;

  for (const item of items) {
    const qty = Math.floor(Number(item.quantity));
    if (!Number.isFinite(qty) || qty <= 0) {
      throw new StockError("Invalid item quantity", 400);
    }

    const ref = item.productId;
    const product = await Product.findOne({
      $or: [{ _id: ref }, { slug: ref }],
    }).lean();

    if (!product) {
      throw new StockError(`One or more items in your cart are no longer available. ("${item.name || "Unknown"}")`);
    }

    const p = product as unknown as Record<string, unknown>;
    if (p.inStock === false || p.isPublished === false) {
      throw new StockError(`${p.name || item.name} is currently out of stock.`);
    }

    let price: number;
    let variant: ResolvedItem["variant"] = null;

    const variantRef = item.variant?.label;
    const sizes = Array.isArray(p.sizes) ? (p.sizes as Record<string, unknown>[]) : [];
    if (variantRef) {
      const size = sizes.find((s) => (s as { label?: string }).label === variantRef);
      if (!size) {
        throw new StockError(`${p.name || item.name} is currently out of stock.`);
      }
      const v = size as { stock?: number; inStock?: boolean; price?: number; grams?: number };
      const stock = typeof v.stock === "number" ? v.stock : 0;
      if (v.inStock === false || stock <= 0) {
        throw new StockError(`${p.name || item.name} (${variantRef}) is currently out of stock.`);
      }
      if (stock < qty) {
        throw new StockError(`Only ${stock} unit${stock === 1 ? "" : "s"} left for ${p.name || item.name} (${variantRef}). Please reduce the quantity.`);
      }
      price = typeof v.price === "number" && v.price > 0 ? v.price : (typeof p.price === "number" ? p.price : 0);
      variant = { label: variantRef, grams: typeof v.grams === "number" ? v.grams : 0 };
    } else {
      const stock = typeof p.stockQuantity === "number" ? p.stockQuantity : 0;
      if (stock <= 0) {
        throw new StockError(`${p.name || item.name} is currently out of stock.`);
      }
      if (stock < qty) {
        throw new StockError(`Only ${stock} unit${stock === 1 ? "" : "s"} left for ${p.name || item.name}. Please reduce the quantity.`);
      }
      price = typeof p.price === "number" && p.price > 0 ? p.price : 0;
    }

    if (!price || price <= 0) {
      throw new StockError(`${p.name || item.name} is currently unavailable.`);
    }

    resolved.push({
      productId: String(p._id || item.productId),
      name: String(p.name || item.name),
      price,
      quantity: qty,
      image: normalizeImage(p) || (typeof item.image === "string" ? item.image : ""),
      variant,
    });
    subtotal += price * qty;
  }

  return { items: resolved, subtotal: Math.round(subtotal * 100) / 100 };
}

// Atomically reserve/decrement stock so two simultaneous purchases of the last unit
// cannot both succeed. Throws StockError if any item can't be satisfied.
export async function reserveStock(items: RawItem[]): Promise<void> {
  await connectDB();
  for (const item of items) {
    const qty = Math.floor(Number(item.quantity));
    if (!Number.isFinite(qty) || qty <= 0) continue;
    const ref = item.productId;

    if (item.variant?.label) {
      const label = item.variant.label;
      const res = await Product.updateOne(
        {
          $or: [{ _id: ref }, { slug: ref }],
          "sizes.label": label,
          "sizes.inStock": { $ne: false },
          "sizes.stock": { $gte: qty },
        },
        { $inc: { "sizes.$.stock": -qty } }
      );
      if (res.modifiedCount !== 1) {
        throw new StockError("Some items in your order are no longer available. Please review your cart.");
      }
      // If the variant hit 0, mark it out of stock so it can't be selected again.
      await Product.updateOne(
        { "sizes.label": label, "sizes.stock": { $lte: 0 } },
        { $set: { "sizes.$.inStock": false } }
      );
    } else {
      const res = await Product.updateOne(
        {
          $or: [{ _id: ref }, { slug: ref }],
          inStock: { $ne: false },
          stockQuantity: { $gte: qty },
        },
        { $inc: { stockQuantity: -qty } }
      );
      if (res.modifiedCount !== 1) {
        throw new StockError("Some items in your order are no longer available. Please review your cart.");
      }
      await Product.updateMany(
        { stockQuantity: { $lte: 0 } },
        { $set: { inStock: false } }
      );
    }
  }
}

export { StockError };
