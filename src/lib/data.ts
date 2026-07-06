import { Product, Testimonial, Coupon, Order, Customer } from "./types";

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Butter Bliss",
    slug: "classic-butter-bliss",
    description: "Our signature classic butter popcorn made with premium kernels and real creamery butter. Light, fluffy, and perfectly golden – this timeless favorite delivers that melt-in-your-mouth experience every time.",
    shortDescription: "Timeless buttery perfection with real creamery butter",
    price: 249,
    originalPrice: 299,
    images: [
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80",
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&q=80",
    ],
    category: "Classic",
    tags: ["sweet", "classic"],
    ingredients: ["Premium popcorn kernels", "Real creamery butter", "Sea salt", "Natural flavoring"],
    nutritionInfo: {
      servingSize: "28g (1 cup)", calories: 140, totalFat: "8g", saturatedFat: "4g", transFat: "0g",
      cholesterol: "15mg", sodium: "180mg", totalCarb: "16g", fiber: "3g", sugar: "1g", protein: "2g",
    },
    reviews: [
      { id: "r1", name: "Priya S.", rating: 5, comment: "Absolutely love this! Tastes just like movie theater popcorn but better.", date: "2026-06-15" },
      { id: "r2", name: "Arjun M.", rating: 4, comment: "Great quality, fresh and buttery. Will order again.", date: "2026-06-10" },
    ],
    isBestSeller: true, isFeatured: true, isPublished: true, inStock: true, stockQuantity: 200, weight: "200g",
  },
  {
    id: "2",
    name: "Caramel Crunch Delight",
    slug: "caramel-crunch-delight",
    description: "Luxuriously coated in house-made caramel sauce, each piece is crunchy, sweet, and utterly addictive. Made with a secret blend of vanilla and a hint of sea salt to balance the sweetness.",
    shortDescription: "House-made caramel coating with a touch of sea salt",
    price: 299,
    images: [
      "https://images.unsplash.com/photo-1600959908209-755b03e7c66f?w=800&q=80",
      "https://images.unsplash.com/photo-1600959908209-755b03e7c66f?w=400&q=80",
    ],
    category: "Caramel",
    tags: ["sweet", "caramel", "gourmet"],
    ingredients: ["Premium popcorn kernels", "Brown sugar", "Butter", "Vanilla extract", "Sea salt", "Baking soda"],
    nutritionInfo: {
      servingSize: "28g (1 cup)", calories: 180, totalFat: "7g", saturatedFat: "3.5g", transFat: "0g",
      cholesterol: "10mg", sodium: "120mg", totalCarb: "28g", fiber: "2g", sugar: "18g", protein: "1g",
    },
    reviews: [
      { id: "r3", name: "Neha K.", rating: 5, comment: "Best caramel popcorn I've ever had! So fresh and crunchy.", date: "2026-06-12" },
      { id: "r4", name: "Rahul V.", rating: 5, comment: "Addictive! Can't stop eating once I open the bag.", date: "2026-06-08" },
    ],
    isBestSeller: true, isFeatured: true, isPublished: true, inStock: true, stockQuantity: 180, weight: "200g",
  },
  {
    id: "3",
    name: "Spicy Szechuan Kick",
    slug: "spicy-szechuan-kick",
    description: "For the bold and adventurous! Our Szechuan popcorn is tossed in a fiery blend of Szechuan peppers, chili oil, and exotic spices.",
    shortDescription: "Fiery Szechuan peppers and exotic spice blend",
    price: 279,
    images: [
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80",
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&q=80",
    ],
    category: "Spicy", tags: ["spicy", "savory"],
    ingredients: ["Premium popcorn kernels", "Szechuan peppercorns", "Chili oil", "Garlic powder", "Onion powder", "Sea salt", "Spice blend"],
    nutritionInfo: {
      servingSize: "28g (1 cup)", calories: 150, totalFat: "9g", saturatedFat: "2g", transFat: "0g",
      cholesterol: "0mg", sodium: "220mg", totalCarb: "15g", fiber: "3g", sugar: "1g", protein: "2g",
    },
    reviews: [{ id: "r5", name: "Vikram P.", rating: 5, comment: "Perfect level of spice! Not too overwhelming but definitely kicks.", date: "2026-06-05" }],
    isBestSeller: true, isFeatured: true, isPublished: true, inStock: true, stockQuantity: 150, weight: "200g",
  },
  {
    id: "4", name: "Cheese Explosion", slug: "cheese-explosion",
    description: "Double-coated in a blend of aged cheddar, parmesan, and a secret cheese powder mix.",
    shortDescription: "Double-coated aged cheddar & parmesan blend",
    price: 269,
    images: [
      "https://images.unsplash.com/photo-1600959908209-755b03e7c66f?w=800&q=80",
      "https://images.unsplash.com/photo-1600959908209-755b03e7c66f?w=400&q=80",
    ],
    category: "Cheese", tags: ["cheese", "savory"],
    ingredients: ["Premium popcorn kernels", "Aged cheddar powder", "Parmesan cheese", "Buttermilk", "Sea salt", "Natural flavors"],
    nutritionInfo: {
      servingSize: "28g (1 cup)", calories: 160, totalFat: "10g", saturatedFat: "5g", transFat: "0g",
      cholesterol: "20mg", sodium: "310mg", totalCarb: "14g", fiber: "2g", sugar: "1g", protein: "4g",
    },
    reviews: [{ id: "r6", name: "Ananya R.", rating: 4, comment: "So cheesy and delicious! My kids absolutely love it.", date: "2026-06-03" }],
    isBestSeller: false, isFeatured: true, isPublished: true, inStock: true, stockQuantity: 160, weight: "200g",
  },
  {
    id: "5", name: "Truffle Parmesan", slug: "truffle-parmesan",
    description: "An exquisite gourmet creation featuring premium black truffle oil, aged parmesan, and a hint of fresh herbs.",
    shortDescription: "Black truffle oil with aged parmesan & herbs",
    price: 449, originalPrice: 499,
    images: [
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80",
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&q=80",
    ],
    category: "Gourmet", tags: ["gourmet", "savory", "premium"],
    ingredients: ["Premium popcorn kernels", "Black truffle oil", "Aged parmesan", "Fresh rosemary", "Sea salt", "Black pepper"],
    nutritionInfo: {
      servingSize: "28g (1 cup)", calories: 170, totalFat: "11g", saturatedFat: "4g", transFat: "0g",
      cholesterol: "15mg", sodium: "250mg", totalCarb: "13g", fiber: "2g", sugar: "1g", protein: "3g",
    },
    reviews: [
      { id: "r7", name: "Karan S.", rating: 5, comment: "This is gourmet popcorn at its finest. Perfect for parties!", date: "2026-05-28" },
      { id: "r8", name: "Maya T.", rating: 5, comment: "The truffle aroma is incredible. Worth every penny!", date: "2026-05-20" },
    ],
    isBestSeller: true, isFeatured: true, isPublished: true, inStock: true, stockQuantity: 80, weight: "150g",
  },
  {
    id: "6", name: "Masala Magic", slug: "masala-magic",
    description: "Inspired by Indian street food flavors, this popcorn is tossed in a aromatic blend of chaat masala, cumin, tangy mango powder, and fresh curry leaves.",
    shortDescription: "Indian street food inspired masala blend",
    price: 259,
    images: [
      "https://images.unsplash.com/photo-1600959908209-755b03e7c66f?w=800&q=80",
      "https://images.unsplash.com/photo-1600959908209-755b03e7c66f?w=400&q=80",
    ],
    category: "Spicy", tags: ["spicy", "savory", "gourmet"],
    ingredients: ["Premium popcorn kernels", "Chaat masala", "Cumin powder", "Mango powder", "Curry leaves", "Red chili powder", "Sea salt"],
    nutritionInfo: {
      servingSize: "28g (1 cup)", calories: 145, totalFat: "8g", saturatedFat: "1.5g", transFat: "0g",
      cholesterol: "0mg", sodium: "200mg", totalCarb: "16g", fiber: "3g", sugar: "2g", protein: "2g",
    },
    reviews: [{ id: "r9", name: "Divya N.", rating: 5, comment: "Reminds me of Mumbai chaat! Absolutely brilliant flavor.", date: "2026-05-25" }],
    isBestSeller: false, isFeatured: true, isPublished: true, inStock: true, stockQuantity: 140, weight: "200g",
  },
  {
    id: "7", name: "Chocolate Drizzle", slug: "chocolate-drizzle",
    description: "Premium popcorn elegantly drizzled with Belgian dark chocolate and white chocolate.",
    shortDescription: "Belgian dark & white chocolate drizzle",
    price: 349,
    images: [
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80",
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&q=80",
    ],
    category: "Sweet", tags: ["sweet", "gourmet", "chocolate"],
    ingredients: ["Premium popcorn kernels", "Belgian dark chocolate", "Belgian white chocolate", "Cocoa butter", "Vanilla extract", "Sea salt"],
    nutritionInfo: {
      servingSize: "28g (1 cup)", calories: 200, totalFat: "12g", saturatedFat: "7g", transFat: "0g",
      cholesterol: "5mg", sodium: "60mg", totalCarb: "24g", fiber: "3g", sugar: "16g", protein: "2g",
    },
    reviews: [{ id: "r10", name: "Isha G.", rating: 5, comment: "Chocolate and popcorn - the perfect combo! This is dangerous.", date: "2026-05-18" }],
    isBestSeller: true, isFeatured: false, isPublished: true, inStock: true, stockQuantity: 120, weight: "180g",
  },
  {
    id: "8", name: "Honey Roasted", slug: "honey-roasted",
    description: "Golden popcorn kissed with pure wild honey and a touch of cinnamon. Roasted to perfection.",
    shortDescription: "Pure wild honey roasted with cinnamon",
    price: 289,
    images: [
      "https://images.unsplash.com/photo-1600959908209-755b03e7c66f?w=800&q=80",
      "https://images.unsplash.com/photo-1600959908209-755b03e7c66f?w=400&q=80",
    ],
    category: "Sweet", tags: ["sweet", "honey", "natural"],
    ingredients: ["Premium popcorn kernels", "Wild honey", "Cinnamon", "Butter", "Vanilla extract", "Sea salt"],
    nutritionInfo: {
      servingSize: "28g (1 cup)", calories: 170, totalFat: "6g", saturatedFat: "3g", transFat: "0g",
      cholesterol: "8mg", sodium: "90mg", totalCarb: "26g", fiber: "2g", sugar: "15g", protein: "1g",
    },
    reviews: [],
    isBestSeller: false, isFeatured: false, isPublished: true, inStock: true, stockQuantity: 130, weight: "200g",
  },
  {
    id: "9", name: "Peri Peri Burst", slug: "peri-peri-burst",
    description: "African bird's eye chili meets premium popcorn. A zesty, fiery flavor explosion that keeps you coming back for more.",
    shortDescription: "African peri peri spiced flavor explosion",
    price: 289,
    images: [
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80",
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&q=80",
    ],
    category: "Spicy", tags: ["spicy", "peri-peri", "savory"],
    ingredients: ["Premium popcorn kernels", "Peri peri seasoning", "Garlic", "Lemon zest", "Sea salt", "Sunflower oil"],
    nutritionInfo: {
      servingSize: "28g (1 cup)", calories: 145, totalFat: "8g", saturatedFat: "1.5g", transFat: "0g",
      cholesterol: "0mg", sodium: "210mg", totalCarb: "15g", fiber: "3g", sugar: "1g", protein: "2g",
    },
    reviews: [],
    isBestSeller: false, isFeatured: true, isPublished: true, inStock: true, stockQuantity: 110, weight: "200g",
  },
  {
    id: "10", name: "Salt & Pepper Classic", slug: "salt-pepper-classic",
    description: "Sometimes simple is best. Hand-ground black pepper and flaky sea salt on perfectly popped kernels.",
    shortDescription: "Hand-ground pepper & flaky sea salt perfection",
    price: 219,
    images: [
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=800&q=80",
      "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?w=400&q=80",
    ],
    category: "Classic", tags: ["classic", "savory", "simple"],
    ingredients: ["Premium popcorn kernels", "Flaky sea salt", "Hand-ground black pepper", "Sunflower oil"],
    nutritionInfo: {
      servingSize: "28g (1 cup)", calories: 130, totalFat: "7g", saturatedFat: "1g", transFat: "0g",
      cholesterol: "0mg", sodium: "240mg", totalCarb: "15g", fiber: "3g", sugar: "0g", protein: "2g",
    },
    reviews: [],
    isBestSeller: false, isFeatured: false, isPublished: true, inStock: true, stockQuantity: 200, weight: "200g",
  },
];

export const testimonials: Testimonial[] = [
  { id: "t1", name: "Priya Sharma", rating: 5, comment: "The truffle parmesan popcorn is absolutely divine! It arrived fresh and the flavors are incredible. My go-to for movie nights.", role: "Regular Customer" },
  { id: "t2", name: "Arjun Mehta", rating: 5, comment: "Ordered the variety pack for a party and everyone raved about it. The caramel crunch is dangerously addictive!", role: "Verified Buyer" },
  { id: "t3", name: "Neha Kapoor", rating: 4, comment: "Finally, premium popcorn that delivers on its promise. Fresh ingredients, beautiful packaging, and amazing taste.", role: "Food Blogger" },
  { id: "t4", name: "Rahul Verma", rating: 5, comment: "I've tried every flavor and there isn't a single one I didn't love. The Szechuan kick is perfect for spice lovers!", role: "Premium Member" },
  { id: "t5", name: "Ananya Reddy", rating: 5, comment: "The packaging alone is worth it! Makes a great gift. And the popcorn inside is even better than the beautiful box.", role: "Gift Buyer" },
];

export const coupons: Coupon[] = [
  { code: "POP10", discount: 10, type: "percentage", minAmount: 500, maxUses: 100, currentUses: 12, expiryDate: "2026-12-31", isActive: true },
  { code: "POP50", discount: 50, type: "fixed", minAmount: 1000, maxUses: 50, currentUses: 5, expiryDate: "2026-12-31", isActive: true },
  { code: "FREESHIP", discount: 100, type: "percentage", minAmount: 300, maxUses: 200, currentUses: 45, expiryDate: "2026-12-31", isActive: true },
];

export const categories = [
  { id: "all", name: "All Flavours", icon: "🍿" },
  { id: "classic", name: "Classic", icon: "✨" },
  { id: "sweet", name: "Sweet", icon: "🍯" },
  { id: "salty", name: "Salty", icon: "🧂" },
  { id: "cheese", name: "Cheese", icon: "🧀" },
  { id: "caramel", name: "Caramel", icon: "🍬" },
  { id: "spicy", name: "Spicy", icon: "🌶️" },
  { id: "gourmet", name: "Gourmet", icon: "🌟" },
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
    id: "ORD-002", items: [{ product: products[1], quantity: 1 }, { product: products[4], quantity: 1 }], total: 748, subtotal: 748, shipping: 0, discount: 0,
    status: "shipped", customerDetails: { firstName: "Arjun", lastName: "Mehta", email: "arjun@example.com", phone: "8765432109", address: "15, Green Park Colony", city: "Delhi", state: "Delhi", zipCode: "110001" },
    paymentId: "pay_def456", orderDate: "2026-06-14",
    statusTimeline: [{ status: "pending", date: "2026-06-14", note: "Order placed" }, { status: "confirmed", date: "2026-06-14", note: "Order confirmed" }, { status: "packed", date: "2026-06-15", note: "Packed" }, { status: "shipped", date: "2026-06-16", note: "In transit" }],
    trackingId: "DLV-87654321", courierPartner: "Delhivery", estimatedDelivery: "2026-06-18",
  },
  {
    id: "ORD-003", items: [{ product: products[2], quantity: 3 }], total: 837, subtotal: 837, shipping: 0, discount: 0,
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
