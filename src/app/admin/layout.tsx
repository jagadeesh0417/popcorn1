"use client";

import { useSession } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;
    if (status === "unauthenticated") {
      router.replace("/admin/login");
    }
  }, [status, pathname, router, isLoginPage]);

  if (isLoginPage) return <>{children}</>;

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#DC0218]" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  return <>{children}</>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthGuard>{children}</AuthGuard>
    </SessionProvider>
  );
}
