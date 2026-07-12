import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = "mongodb+srv://popcorn:V5dUXOpYfVSd5wnJ@cluster0.6lswpmy.mongodb.net/popcorn?retryWrites=true&w=majority&appName=Cluster0";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const email = "poprika.official@gmail.com";
  const password = "Admin@123";

  const existing = await User.findOne({ email: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") });
  if (existing) {
    console.log("Admin user already exists:");
    console.log("  Email:", existing.email);
    console.log("  Role:", existing.role);
    console.log("  Password stored as hash:", existing.password ? "yes" : "no");
  } else {
    const hashed = await bcrypt.hash(password, 12);
    await User.create({ name: "Admin", email, password: hashed, role: "admin" });
    console.log("Admin user created successfully:");
    console.log("  Email:", email);
    console.log("  Password:", password);
    console.log();
    console.log("IMPORTANT: Change the password after first login.");
  }

  await mongoose.disconnect();
}

seed().catch((e) => { console.error("Seed failed:", e); process.exit(1); });
