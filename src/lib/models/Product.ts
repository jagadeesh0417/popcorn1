import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  sizes?: { label: string; grams: number; price: number }[];
  images: string[];
  category: string;
  tags: string[];
  ingredients: string[];
  nutritionInfo: {
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
  };
  isBestSeller: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  inStock: boolean;
  stockQuantity: number;
  weight: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    tagline: { type: String },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    sizes: [{
      label: { type: String, required: true },
      grams: { type: Number, required: true },
      price: { type: Number, required: true },
    }],
    images: [{ type: String }],
    category: { type: String, required: true },
    tags: [{ type: String }],
    ingredients: [{ type: String }],
    nutritionInfo: {
      servingSize: { type: String, default: "28g (1 cup)" },
      calories: { type: Number, default: 0 },
      totalFat: { type: String, default: "0g" },
      saturatedFat: { type: String, default: "0g" },
      transFat: { type: String, default: "0g" },
      cholesterol: { type: String, default: "0mg" },
      sodium: { type: String, default: "0mg" },
      totalCarb: { type: String, default: "0g" },
      fiber: { type: String, default: "0g" },
      sugar: { type: String, default: "0g" },
      protein: { type: String, default: "0g" },
    },
    isBestSeller: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 100 },
    weight: { type: String, default: "200g" },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
