import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("[NextAuth authorize] Starting...");
        console.log("[NextAuth authorize] Email received:", credentials?.email);
        console.log("[NextAuth authorize] Password received:", credentials?.password ? "[REDACTED]" : "NONE");
        console.log("[NextAuth authorize] NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "set" : "MISSING");
        console.log("[NextAuth authorize] MONGODB_URI:", process.env.MONGODB_URI ? "set" : "MISSING");

        if (!credentials?.email || !credentials?.password) {
          console.log("[NextAuth authorize] FAILED: missing email or password");
          return null;
        }

        try {
          console.log("[NextAuth authorize] Connecting to MongoDB...");
          await connectDB();
          console.log("[NextAuth authorize] MongoDB connected successfully");
        } catch (err) {
          console.error("[NextAuth authorize] FAILED: MongoDB connection error:", err instanceof Error ? err.message : err);
          return null;
        }

        let user;
        try {
          const emailRegex = new RegExp(`^${credentials.email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
          console.log("[NextAuth authorize] Looking up user with regex:", emailRegex);
          user = await User.findOne({ email: emailRegex });
          if (!user) {
            console.log("[NextAuth authorize] FAILED: no user found for email:", credentials.email);
            return null;
          }
          console.log("[NextAuth authorize] User found:", user.email, "| role:", user.role);
          console.log("[NextAuth authorize] Stored password hash preview:", user.password.substring(0, 20) + "...");
        } catch (err) {
          console.error("[NextAuth authorize] FAILED: error during user lookup:", err instanceof Error ? err.message : err);
          return null;
        }

        try {
          console.log("[NextAuth authorize] Comparing password...");
          const isValid = await user.comparePassword(credentials.password);
          console.log("[NextAuth authorize] Password comparison result:", isValid);
          if (!isValid) {
            console.log("[NextAuth authorize] FAILED: password does not match");
            return null;
          }
        } catch (err) {
          console.error("[NextAuth authorize] FAILED: error during password comparison:", err instanceof Error ? err.message : err);
          return null;
        }

        console.log("[NextAuth authorize] SUCCESS: returning user:", user.email);
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role || "customer";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).role = token.role;
        (session.user as Record<string, unknown>).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
