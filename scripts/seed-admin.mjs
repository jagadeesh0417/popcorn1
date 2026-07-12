import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = "mongodb+srv://popcorn:poprika123@cluster0.6lswpmy.mongodb.net/popcorn?appName=Cluster0";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
}, { timestamps: true });

// IMPORTANT: This schema has NO pre-save hook (unlike the app's User model).
// We must hash the password here ourselves.
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const email = "poprika@gmail.com";
  const rawPassword = "admin123";

  const existing = await User.findOne({ email: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") });
  if (existing) {
    console.log("Admin user already exists:");
    console.log("  Email:", existing.email);
    console.log("  Role:", existing.role);
    console.log("  Hash preview:", existing.password?.substring(0, 20) || "MISSING");

    const match = await existing.comparePassword(rawPassword);
    console.log("  Password admin123 matches:", match);
    if (!match) {
      console.log("  WARNING: Password mismatch! The stored hash is not for 'admin123'.");
      console.log("  This can happen if the password was double-hashed by the pre-save hook.");
    }
  } else {
    // Manually hash — this schema has no pre-save hook
    const hashed = await bcrypt.hash(rawPassword, 12);
    await User.create({ name: "Admin", email, password: hashed, role: "admin" });
    console.log("Admin user created successfully:");
    console.log("  Email:", email);
    console.log("  Password:", rawPassword);
  }

  await mongoose.disconnect();
}

seed().catch((e) => { console.error("Seed failed:", e); process.exit(1); });
