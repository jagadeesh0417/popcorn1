import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Missing env vars. Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD before running this script."
  );
  process.exit(1);
}

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

  const email = ADMIN_EMAIL;
  const rawPassword = ADMIN_PASSWORD;

  const existing = await User.findOne({ email: new RegExp(`^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") });
  if (existing) {
    console.log("Admin user already exists:");
    console.log("  Email:", existing.email);
    console.log("  Role:", existing.role);

    const match = await existing.comparePassword(rawPassword);
    console.log("  Current password matches:", match);
    if (!match) {
      console.log("  Password mismatch — updating password...");
      const hashed = await bcrypt.hash(rawPassword, 12);
      await User.updateOne({ _id: existing._id }, { $set: { password: hashed } });
      console.log("  Password updated successfully!");
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
