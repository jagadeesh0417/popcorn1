import { Product, Testimonial, Coupon, Order, Customer } from "./types";

export const products: Product[] = [
  {
    id: "1",
    name: "Ghee & Black Pepper",
    slug: "ghee-black-pepper",
    tagline: "One spice, done right.",
    description: "Malabar black pepper, cow ghee, salt. Nothing else.",
    shortDescription: "Malabar black pepper, cow ghee, salt. Nothing else.",
    price: 149,
    sizes: [
      { label: "80g", grams: 80, price: 149 },
      { label: "150g", grams: 150, price: 249 },
      { label: "250g", grams: 250, price: 399 },
    ],
    images: [
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80",
    ],
    category: "Savory",
    tags: ["ghee", "black pepper", "savory"],
    ingredients: ["Premium popcorn kernels", "Cow ghee", "Malabar black pepper", "Sea salt"],
    nutritionInfo: {
      servingSize: "28g (1 cup)", calories: 145, totalFat: "8g", saturatedFat: "4g", transFat: "0g",
      cholesterol: "12mg", sodium: "160mg", totalCarb: "15g", fiber: "3g", sugar: "0g", protein: "2g",
    },
    reviews: [],
    isBestSeller: true, isFeatured: true, isPublished: true, inStock: true, stockQuantity: 200, weight: "80g",
  },
  {
    id: "2",
    name: "Ghee & Curry Leaf",
    slug: "ghee-curry-leaf",
    tagline: "South Indian, in a pouch.",
    description: "Fresh curry leaves, cow ghee, salt. Fried, folded in, done.",
    shortDescription: "Fresh curry leaves, cow ghee, salt. Fried, folded in, done.",
    price: 149,
    sizes: [
      { label: "80g", grams: 80, price: 149 },
      { label: "150g", grams: 150, price: 249 },
      { label: "250g", grams: 250, price: 399 },
    ],
    images: [
      "https://images.unsplash.com/photo-1600959908209-755b03e7c66f?w=800&q=80",
    ],
    category: "Savory",
    tags: ["ghee", "curry leaf", "savory"],
    ingredients: ["Premium popcorn kernels", "Cow ghee", "Fresh curry leaves", "Sea salt"],
    nutritionInfo: {
      servingSize: "28g (1 cup)", calories: 145, totalFat: "8g", saturatedFat: "4g", transFat: "0g",
      cholesterol: "12mg", sodium: "160mg", totalCarb: "15g", fiber: "3g", sugar: "0g", protein: "2g",
    },
    reviews: [],
    isBestSeller: true, isFeatured: true, isPublished: true, inStock: true, stockQuantity: 200, weight: "80g",
  },
  {
    id: "3",
    name: "Coffee Chikki",
    slug: "coffee-chikki",
    tagline: "Sweet, with a caffeine kick.",
    description: "Jaggery caramel, roasted coffee, sea salt. Sticky, crunchy, not too sweet.",
    shortDescription: "Jaggery caramel, roasted coffee, sea salt. Sticky, crunchy, not too sweet.",
    price: 169,
    sizes: [
      { label: "80g", grams: 80, price: 169 },
      { label: "150g", grams: 150, price: 279 },
      { label: "250g", grams: 250, price: 429 },
    ],
    images: [
      "https://images.unsplash.com/photo-1600959908209-755b03e7c66f?w=800&q=80",
    ],
    category: "Sweet",
    tags: ["coffee", "chikki", "sweet"],
    ingredients: ["Premium popcorn kernels", "Jaggery", "Roasted coffee beans", "Sea salt", "Ghee"],
    nutritionInfo: {
      servingSize: "28g (1 cup)", calories: 170, totalFat: "5g", saturatedFat: "3g", transFat: "0g",
      cholesterol: "8mg", sodium: "90mg", totalCarb: "28g", fiber: "2g", sugar: "15g", protein: "1g",
    },
    reviews: [],
    isBestSeller: true, isFeatured: true, isPublished: true, inStock: true, stockQuantity: 200, weight: "80g",
  },
];

export const testimonials: Testimonial[] = [];

export const coupons: Coupon[] = [
  { code: "POP10", discount: 10, type: "percentage", minAmount: 500, maxUses: 100, currentUses: 12, expiryDate: "2026-12-31", isActive: true },
  { code: "POP50", discount: 50, type: "fixed", minAmount: 1000, maxUses: 50, currentUses: 5, expiryDate: "2026-12-31", isActive: true },
  { code: "FREESHIP", discount: 100, type: "percentage", minAmount: 300, maxUses: 200, currentUses: 45, expiryDate: "2026-12-31", isActive: true },
];

export const categories = [
  { id: "all", name: "All Flavours", icon: "🍿" },
  { id: "savory", name: "Savory", icon: "🧂" },
  { id: "sweet", name: "Sweet", icon: "🍯" },
];

export const galleryImages = [
  "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&q=80",
  "https://images.unsplash.com/photo-1600959908209-755b03e7c66f?w=400&q=80",
  "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&q=80",
  "https://images.unsplash.com/photo-1600959908209-755b03e7c66f?w=400&q=80",
  "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&q=80",
  "https://images.unsplash.com/photo-1600959908209-755b03e7c66f?w=400&q=80",
];

export const customers: Customer[] = [
  { id: "c1", name: "Priya Sharma", email: "priya@example.com", phone: "9876543210", orders: 5, totalSpent: 2490, joined: "2026-01-15" },
  { id: "c2", name: "Arjun Mehta", email: "arjun@example.com", phone: "8765432109", orders: 3, totalSpent: 1797, joined: "2026-02-20" },
  { id: "c3", name: "Neha Kapoor", email: "neha@example.com", phone: "7654321098", orders: 8, totalSpent: 4230, joined: "2025-11-05" },
  { id: "c4", name: "Rahul Verma", email: "rahul@example.com", phone: "6543210987", orders: 2, totalSpent: 898, joined: "2026-03-12" },
  { id: "c5", name: "Ananya Reddy", email: "ananya@example.com", phone: "5432109876", orders: 4, totalSpent: 2156, joined: "2026-04-01" },
];

export const orders: Order[] = [
  {
    id: "ORD-001", items: [{ product: products[0], quantity: 2 }], total: 498, subtotal: 498, shipping: 0, discount: 0,
    status: "delivered", customerDetails: { firstName: "Priya", lastName: "Sharma", email: "priya@example.com", phone: "9876543210", address: "42, Lake View Apartments", city: "Mumbai", state: "Maharashtra", zipCode: "400001" },
    paymentId: "pay_abc123", orderDate: "2026-06-15",
    statusTimeline: [{ status: "pending", date: "2026-06-15", note: "Order placed" }, { status: "confirmed", date: "2026-06-15", note: "Order confirmed" }, { status: "packed", date: "2026-06-16", note: "Packed securely" }, { status: "shipped", date: "2026-06-17", note: "Dispatched via Delhivery" }, { status: "delivered", date: "2026-06-19", note: "Delivered successfully" }],
    trackingId: "DLV-12345678", courierPartner: "Delhivery", estimatedDelivery: "2026-06-20",
  },
  {
    id: "ORD-002", items: [{ product: products[1], quantity: 1 }, { product: products[0], quantity: 1 }], total: 498, subtotal: 498, shipping: 0, discount: 0,
    status: "shipped", customerDetails: { firstName: "Arjun", lastName: "Mehta", email: "arjun@example.com", phone: "8765432109", address: "15, Green Park Colony", city: "Delhi", state: "Delhi", zipCode: "110001" },
    paymentId: "pay_def456", orderDate: "2026-06-14",
    statusTimeline: [{ status: "pending", date: "2026-06-14", note: "Order placed" }, { status: "confirmed", date: "2026-06-14", note: "Order confirmed" }, { status: "packed", date: "2026-06-15", note: "Packed" }, { status: "shipped", date: "2026-06-16", note: "In transit" }],
    trackingId: "DLV-87654321", courierPartner: "Delhivery", estimatedDelivery: "2026-06-18",
  },
  {
    id: "ORD-003", items: [{ product: products[2], quantity: 3 }], total: 507, subtotal: 507, shipping: 0, discount: 0,
    status: "pending", customerDetails: { firstName: "Neha", lastName: "Kapoor", email: "neha@example.com", phone: "7654321098", address: "7, Sunrise Towers", city: "Bangalore", state: "Karnataka", zipCode: "560001" },
    orderDate: "2026-06-13",
    statusTimeline: [{ status: "pending", date: "2026-06-13", note: "Order placed" }],
    estimatedDelivery: "2026-06-18",
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getRelatedProducts(product: Product): Product[] {
  return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestSeller);
}

export const trioProducts = products.filter((p) =>
  ["ghee-black-pepper", "ghee-curry-leaf", "coffee-chikki"].includes(p.slug)
);
