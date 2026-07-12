// Seeds sample products into the EXACT database the app reads.
// Uses process.env.MONGODB_URI with NO dbName option (same as src/lib/db.ts).

import mongoose from "mongoose";

const URI = process.env.MONGODB_URI;
if (!URI) {
  console.error("ERROR: MONGODB_URI environment variable is not set");
  process.exit(1);
}

console.log(`\nConnecting to MongoDB...`);
const conn = await mongoose.connect(URI, {
  bufferCommands: false,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
});

const dbName = mongoose.connection.db?.databaseName || "unknown";
console.log(`✅ Connected. Effective database: "${dbName}"`);

// Define a minimal Product schema matching src/lib/models/Product.ts
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  tagline: String,
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  sizes: [{
    label: { type: String, required: true },
    grams: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  images: [String],
  category: { type: String, required: true },
  tags: [String],
  ingredients: [String],
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
}, { timestamps: true });

const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);
const collectionName = ProductModel.collection.name;
console.log(`Collection name: "${collectionName}"`);

const products = [
  {
    name: "Classic Butter Popcorn",
    slug: "classic-butter-popcorn",
    tagline: "The timeless favorite",
    description: "Our signature buttery popcorn made with real butter and a pinch of sea salt. Perfectly popped to golden perfection for that classic movie-night taste.",
    shortDescription: "Real butter, sea salt, golden perfection.",
    price: 149,
    originalPrice: 199,
    sizes: [
      { label: "Small (100g)", grams: 100, price: 99 },
      { label: "Medium (200g)", grams: 200, price: 149 },
      { label: "Large (400g)", grams: 400, price: 249 },
    ],
    images: ["https://res.cloudinary.com/demo/image/upload/v1/popcorn/classic-butter"],
    category: "Classic",
    tags: ["bestseller", "classic", "butter"],
    ingredients: ["Popcorn Kernels", "Butter", "Sea Salt", "Sunflower Oil"],
    nutritionInfo: {
      servingSize: "28g (1 cup)",
      calories: 140,
      totalFat: "8g",
      saturatedFat: "4g",
      transFat: "0g",
      cholesterol: "15mg",
      sodium: "180mg",
      totalCarb: "16g",
      fiber: "3g",
      sugar: "0g",
      protein: "2g",
    },
    isBestSeller: true,
    isFeatured: true,
    isPublished: true,
    inStock: true,
    stockQuantity: 200,
    weight: "200g",
    category: "Classic",
  },
  {
    name: "Spicy Peri Peri Popcorn",
    slug: "spicy-peri-peri-popcorn",
    tagline: "Bold and fiery",
    description: "Inspired by the iconic African-Portuguese chili sauce, our Peri Peri popcorn brings the heat with a citrusy, garlicky kick. Not for the faint-hearted!",
    shortDescription: "African-Portuguese spice with a citrus kick.",
    price: 169,
    sizes: [
      { label: "Small (100g)", grams: 100, price: 119 },
      { label: "Medium (200g)", grams: 200, price: 169 },
      { label: "Large (400g)", grams: 400, price: 279 },
    ],
    images: ["https://res.cloudinary.com/demo/image/upload/v1/popcorn/peri-peri"],
    category: "Spicy",
    tags: ["spicy", "peri-peri", "hot"],
    ingredients: ["Popcorn Kernels", "Peri Peri Spice Blend", "Garlic Powder", "Sunflower Oil", "Salt"],
    nutritionInfo: {
      servingSize: "28g (1 cup)",
      calories: 135,
      totalFat: "7g",
      saturatedFat: "1g",
      transFat: "0g",
      cholesterol: "0mg",
      sodium: "220mg",
      totalCarb: "16g",
      fiber: "3g",
      sugar: "1g",
      protein: "2g",
    },
    isFeatured: true,
    isPublished: true,
    inStock: true,
    stockQuantity: 150,
    weight: "200g",
  },
  {
    name: "Caramel Crunch Popcorn",
    slug: "caramel-crunch-popcorn",
    tagline: "Sweet, crunchy, irresistible",
    description: "Hand-coated in rich caramel sauce and baked to a glassy crunch. Each handful is a perfect balance of sweet and salty — dangerously addictive!",
    shortDescription: "Hand-coated caramel, baked to crunch.",
    price: 189,
    originalPrice: 229,
    sizes: [
      { label: "Small (100g)", grams: 100, price: 129 },
      { label: "Medium (200g)", grams: 200, price: 189 },
      { label: "Large (400g)", grams: 400, price: 299 },
    ],
    images: ["https://res.cloudinary.com/demo/image/upload/v1/popcorn/caramel-crunch"],
    category: "Sweet",
    tags: ["sweet", "caramel", "bestseller"],
    ingredients: ["Popcorn Kernels", "Brown Sugar", "Butter", "Vanilla Extract", "Baking Soda", "Salt"],
    nutritionInfo: {
      servingSize: "28g (1 cup)",
      calories: 170,
      totalFat: "6g",
      saturatedFat: "3g",
      transFat: "0g",
      cholesterol: "10mg",
      sodium: "120mg",
      totalCarb: "28g",
      fiber: "2g",
      sugar: "18g",
      protein: "1g",
    },
    isBestSeller: true,
    isFeatured: true,
    isPublished: true,
    inStock: true,
    stockQuantity: 180,
    weight: "200g",
  },
];

console.log(`\nInserting ${products.length} sample products...`);
for (const p of products) {
  await ProductModel.findOneAndUpdate(
    { slug: p.slug },
    p,
    { upsert: true, new: true }
  );
  console.log(`  ✅ ${p.name} (${p.slug})`);
}

const count = await ProductModel.countDocuments();
console.log(`\nTotal products in collection "${collectionName}": ${count}`);

await mongoose.disconnect();
console.log(`\nDone. Database: "${dbName}", Collection: "${collectionName}"`);
