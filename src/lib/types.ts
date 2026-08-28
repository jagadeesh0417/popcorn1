export interface ProductVariant {
  label: string;
  grams: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  sku?: string;
  barcode?: string;
  stock?: number;
  inStock?: boolean;
  isDefault?: boolean;
  displayOrder?: number;
}

export interface Product {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  tagline?: string;
  price: number;
  originalPrice?: number;
  sizes?: ProductVariant[];
  variants?: ProductVariant[];
  images: string[];
  category: string;
  tags: string[];
  ingredients: string[];
  nutritionInfo: NutritionInfo;
  reviews: Review[];
  showOnHomepage: boolean;
  isBestSeller: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  inStock: boolean;
  stockQuantity: number;
  weight: string;
  createdAt?: string;
}

export interface NutritionInfo {
  servingSize: string;
  calories: number;
  totalFat: string;
  saturatedFat: string;
  transFat: string;
  cholesterol: string;
  sodium: string;
  totalCarb: string;
  fiber: string;
  sugar: string;
  protein: string;
}

export interface Review {
  _id?: string;
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
  userId?: string;
  isVerified?: boolean;
}

// A single product line inside a bundle, used for authoritative inventory validation.
export interface BundlePart {
  productId: string; // _id or slug of the product
  name: string;
  variantLabel?: string;
  quantity: number; // how many of this product per bundle
}

// A bundle as it appears in the cart (ONE line item with its own selling price).
export interface BundleComposition {
  bundleId: string; // stable slug/id of the bundle
  name: string;
  sizeLabel: string;
  unitPrice: number; // selling price of one bundle
  originalPrice?: number;
  image?: string;
  parts: BundlePart[]; // retained for stock validation + order recreation
}

export interface CartItem {
  cartId: string;
  type: "product" | "bundle";
  // Product lines:
  product?: Product;
  variant?: ProductVariant | null;
  // Bundle lines:
  bundle?: BundleComposition;
  quantity: number;
  unavailable?: boolean;
}

export interface OrderBundlePart {
  productId: string;
  name: string;
  variantLabel?: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type?: "product" | "bundle";
  bundleId?: string;
  variant?: { label: string; grams: number } | null;
  parts?: OrderBundlePart[];
}

export interface Order {
  _id?: string;
  id: string;
  items: OrderItem[];
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  coupon?: string;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'return-requested';
  trackingId?: string;
  courierPartner?: string;
  estimatedDelivery?: string;
  customerDetails: CustomerDetails;
  paymentId?: string;
  paymentMethod?: string;
  orderDate: string;
  statusTimeline: StatusEvent[];
  userId?: string;
}

export interface StatusEvent {
  status: string;
  date: string;
  note?: string;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  deliveryInstructions?: string;
}

export interface Coupon {
  _id?: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount: number;
  maxUses: number;
  currentUses: number;
  expiryDate: string;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
  role?: string;
}

export interface Customer {
  _id?: string;
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  joined: string;
  address?: string;
  wishlist?: string[];
}
