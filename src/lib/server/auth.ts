import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/lib/models/User";
import { errorResponse } from "@/lib/api-utils";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
        } catch (err) {
          console.error("[NextAuth authorize] MongoDB connection error:", err instanceof Error ? err.message : err);
          return null;
        }

        let user;
        try {
          const emailRegex = new RegExp(`^${credentials.email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");
          user = await User.findOne({ email: emailRegex });
        } catch (err) {
          console.error("[NextAuth authorize] error during user lookup:", err instanceof Error ? err.message : err);
          return null;
        }

        if (!user) {
          return null;
        }

        try {
          const isValid = await user.comparePassword(credentials.password);
          if (!isValid) {
            return null;
          }
        } catch (err) {
          console.error("[NextAuth authorize] error during password comparison:", err instanceof Error ? err.message : err);
          return null;
        }

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
};

export interface SessionUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

/** Resolve the current authenticated user from the session cookie, or null. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session.user as SessionUser;
}

/**
 * Enforce that the request is authenticated as an admin.
 * Returns a NextResponse (errorResponse) when unauthorized, or null when allowed.
 */
export async function requireAdmin(): Promise<ReturnType<typeof errorResponse> | null> {
  const user = await getSessionUser();
  if (!user) {
    return errorResponse("Unauthorized", 401);
  }
  if (user.role !== "admin") {
    return errorResponse("Forbidden", 403);
  }
  return null;
}
