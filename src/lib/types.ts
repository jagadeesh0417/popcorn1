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

export interface CartItem {
  product: Product;
  variant: ProductVariant | null;
  quantity: number;
  cartId: string;
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

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: { label: string; grams: number } | null;
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
