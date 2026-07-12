// === STEP 1: INSPECTION REPORT ===
console.log("=".repeat(70));
console.log("STEP 1: INSPECTION REPORT");
console.log("=".repeat(70));

console.log(`
[A] User Model (src/lib/models/User.ts)
    Collection name: "users" (Mongoose auto-pluralizes "User")
    Fields login relies on:
      - email:   String, required, unique
      - password: String, required
      - role:     enum ["admin", "customer"] (must be "admin" for admin access)
    No isAdmin / isActive flags exist — only role: "admin" is needed.

[B] NextAuth authorize function (src/app/api/auth/[...nextauth]/route.ts)
    Query:  User.findOne({ email: emailRegex })
            where emailRegex = new RegExp("^" + escaped email + "$", "i")
            => case-insensitive exact match
    Password verification: user.comparePassword(password)
            => calls bcrypt.compare() from bcryptjs
    Hash rounds: 12 (User.ts pre-save hook: bcrypt.hash(this.password, 12))

[C] DB connection (src/lib/db.ts)
    No dbName option passed to mongoose.connect()
    URI path has NO database name
    => EFFECTIVE database: "test" (MongoDB Atlas default)
`);

// === CONNECT ===
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const RAW_URI = process.env.MONGODB_URI;
if (!RAW_URI) { console.error("FATAL: MONGODB_URI not set"); process.exit(1); }

// Convert mongodb+srv:// to mongodb:// with direct hosts (Node.js DNS on Windows
// often can't resolve Atlas SRV records, but the app on Vercel handles it fine)
function resolveSrvUri(srvUri) {
  if (!srvUri.startsWith("mongodb+srv://")) return srvUri;

  const url = new URL(srvUri);
  const username = url.username;
  const password = url.password;
  const params = url.searchParams;

  // Extract the base domain from the SRV hostname.
  // hostname is e.g. "cluster0.6lswpmy.mongodb.net" → base domain "6lswpmy.mongodb.net"
  const hostParts = url.hostname.split(".");
  const baseDomain = hostParts.slice(1).join(".");

  // Shard hostnames from the actual SRV record (confirmed via Resolve-DnsName)
  const shards = [
    `ac-nmmaecs-shard-00-00.${baseDomain}:27017`,
    `ac-nmmaecs-shard-00-01.${baseDomain}:27017`,
    `ac-nmmaecs-shard-00-02.${baseDomain}:27017`,
  ];

  params.set("ssl", "true");
  params.set("authSource", "admin");

  return `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${shards.join(",")}/?${params.toString()}`;
}

const URI = resolveSrvUri(RAW_URI);

console.log("=".repeat(70));
console.log("Connecting to MongoDB...");
await mongoose.connect(URI, {
  bufferCommands: false,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
});

const effectiveDbName = mongoose.connection.db?.databaseName || "unknown";
console.log(`✅ Connected. Effective database: "${effectiveDbName}"\n`);

// === STEP 2: SCAN ALL DATABASES + COLLECTIONS FOR USERS ===
console.log("=".repeat(70));
console.log("STEP 2: SCANNING ALL DATABASES FOR USER DOCUMENTS");
console.log("=".repeat(70));

const admin = mongoose.connection.db?.admin();
if (!admin) { console.error("FATAL: no admin handle"); process.exit(1); }

const { databases } = await admin.listDatabases();

for (const dbInfo of databases) {
  const dbName = dbInfo.name;
  if (["admin", "local", "config"].includes(dbName)) continue;

  const dbHandle = mongoose.connection.client.db(dbName);
  const collections = await dbHandle.listCollections().toArray();

  for (const col of collections) {
    const colHandle = dbHandle.collection(col.name);
    const docsWithEmail = await colHandle.find({ email: { $exists: true } }).toArray();

    for (const doc of docsWithEmail) {
      console.log(`  ${dbName}.${col.name} => email="${doc.email}", role="${doc.role || "(none)"}"`);
    }
  }
}

console.log("");

// === STEP 3: CREATE/UPDATE ADMIN IN THE EFFECTIVE DB ===
console.log("=".repeat(70));
console.log("STEP 3: CREATING/UPDATING ADMIN USER");
console.log("=".repeat(70));

const ADMIN_EMAIL = "rjagadeeswara66@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) { console.error("FATAL: ADMIN_PASSWORD not set"); process.exit(1); }

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
const collectionName = UserModel.collection.name;
console.log(`Target: database="${effectiveDbName}", collection="${collectionName}"`);

console.log(`Hashing password with bcryptjs (12 rounds)...`);
const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
console.log(`Hash preview: ${hashedPassword.substring(0, 20)}...`);

console.log(`Upserting admin: ${ADMIN_EMAIL}...`);
await UserModel.findOneAndUpdate(
  { email: { $regex: new RegExp(`^${ADMIN_EMAIL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
  {
    name: "Admin",
    email: ADMIN_EMAIL,
    password: hashedPassword,
    role: "admin",
  },
  { upsert: true, new: true }
);

// === STEP 4: VERIFY WITH AUTHORIZE'S EXACT QUERY ===
console.log("\n" + "=".repeat(70));
console.log("STEP 4: VERIFYING WITH AUTHORIZE() EXACT QUERY");
console.log("=".repeat(70));

const emailRegex = new RegExp(`^${ADMIN_EMAIL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
const found = await UserModel.findOne({ email: emailRegex });

if (found) {
  console.log(`✅ authorize() WILL find this user:`);
  console.log(`   _id:     ${found._id}`);
  console.log(`   email:   ${found.email}`);
  console.log(`   role:    ${found.role}`);

  const pwOk = await bcrypt.compare(ADMIN_PASSWORD, found.password);
  console.log(`   password check: ${pwOk ? "✅ PASS" : "❌ FAIL"}`);

  if (pwOk) {
    console.log(`\n   ✅ Login will SUCCEED with:`);
    console.log(`      email:    ${ADMIN_EMAIL}`);
    console.log(`      password: ${ADMIN_PASSWORD}`);
  }
} else {
  console.log(`❌ FATAL: authorize() would NOT find this user!`);
  process.exit(1);
}

// === STEP 5: FINAL SUMMARY ===
console.log("\n" + "=".repeat(70));
console.log("STEP 5: SUMMARY — VERCELL MONGODB_URI");
console.log("=".repeat(70));

// Construct the URI with explicit db name (based on the original SRV URI)
const uriObj = new URL(RAW_URI);
uriObj.pathname = `/${effectiveDbName}`;
const vercelUri = uriObj.toString();

console.log(`
✅ Admin written to:
   EFFECTIVE_DB:  "${effectiveDbName}"
   COLLECTION:    "${collectionName}"
   EMAIL:         ${ADMIN_EMAIL}
   PASSWORD:      ${ADMIN_PASSWORD}

⚠️  The current MONGODB_URI has NO database name (defaults to "test").
   For Vercel / production, paste this EXACT URI to ensure the deployed
   app reads the SAME database:

────────────────────────────────────────────────────────────────────────
   MONGODB_URI=${vercelUri}
────────────────────────────────────────────────────────────────────────

   This URI includes "/test" in the path so the deployed app will connect
   to the "test" database — same as it does now by default.
`);

await mongoose.disconnect();
console.log("Done.");
