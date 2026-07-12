// Creates admin user in the EXACT database the app reads.
// Uses process.env.MONGODB_URI with NO dbName option (same as src/lib/db.ts).
// Uses bcryptjs with 12 rounds (same as src/lib/models/User.ts).
// Then re-runs the exact same query authorize() uses and prints proof.

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const URI = process.env.MONGODB_URI;
if (!URI) {
  console.error("ERROR: MONGODB_URI environment variable is not set");
  process.exit(1);
}

const ADMIN_EMAIL = "poprika@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.error("ERROR: ADMIN_PASSWORD environment variable is not set");
  process.exit(1);
}

// Connect with NO dbName — mirrors src/lib/db.ts exactly
console.log(`\nConnecting to MongoDB...`);
console.log(`URI: ${URI.replace(/\/\/[^:]+:([^@]+)@/, "//***:***@")}`);
const conn = await mongoose.connect(URI, {
  bufferCommands: false,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
});

const dbName = mongoose.connection.db?.databaseName || "unknown";
console.log(`\n✅ Connected. Effective database: "${dbName}"`);

// Define a minimal User schema matching the app's model
// We avoid importing the app's model to keep this script standalone
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "customer"], default: "customer" },
  image: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  wishlist: [String],
}, { timestamps: true });

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

// The collection name Mongoose uses
const collectionName = UserModel.collection.name;
console.log(`Collection name: "${collectionName}"`);

// Hash with bcryptjs at 12 rounds — same as User.ts pre-save hook
console.log(`\nHashing password with bcryptjs (12 rounds)...`);
const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
console.log(`Hash preview: ${hashedPassword.substring(0, 20)}...`);

// Upsert the admin user
console.log(`\nUpserting admin: ${ADMIN_EMAIL}...`);
const result = await UserModel.findOneAndUpdate(
  { email: { $regex: new RegExp(`^${ADMIN_EMAIL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
  {
    name: "Admin",
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin",
  },
  { upsert: true, new: true }
);
console.log(`✅ Admin upserted: _id=${result._id}, email=${result.email}, role=${result.role}`);

// Re-run the EXACT query authorize() uses to prove login will find the user
console.log(`\nRe-running authorize() query to verify...`);
const emailRegex = new RegExp(`^${ADMIN_EMAIL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
const found = await UserModel.findOne({ email: emailRegex });
if (found) {
  console.log(`✅ authorize() WILL find this user:`);
  console.log(`   _id:     ${found._id}`);
  console.log(`   email:   ${found.email}`);
  console.log(`   role:    ${found.role}`);
  console.log(`   hash:    ${found.password.substring(0, 20)}...`);

  // Verify password match
  const pwOk = await bcrypt.compare(ADMIN_PASSWORD, found.password);
  console.log(`   password check: ${pwOk ? "✅ PASS" : "❌ FAIL"}`);
  console.log(`\nLogin credentials: email="${ADMIN_EMAIL}" / password="${ADMIN_PASSWORD}"`);
} else {
  console.log(`❌ ERROR: authorize() would NOT find this user!`);
  process.exit(1);
}

await mongoose.disconnect();
console.log(`\nDone. Database: "${dbName}", Collection: "${collectionName}"`);
