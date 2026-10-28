"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuthStore from "../../hooks/authStore";
import AreaManagerSidebar from "./AreaManagerSidebar";
import AreaManagerHeader from "./AreaManagerHeader";

const PUBLIC_PATHS = new Set(["/", "/auth", "/login", "/set-password"]);

export default function AreaManagerShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isPublic =
    PUBLIC_PATHS.has(pathname) || pathname.startsWith("/set-password");

  useEffect(() => {
    if (!mounted || isPublic) return;
    if (!isAuthenticated) router.replace("/");
  }, [mounted, isPublic, isAuthenticated, router]);

  if (isPublic) return <>{children}</>;

  if (!mounted || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background font-body">
        <div className="text-center bg-background-section border-2 border-secondary-900 rounded-3xl p-10 shadow-[8px_8px_0px_var(--color-secondary-900)]">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-primary-600 mx-auto mb-4" />
          <p className="font-display font-black text-secondary-900 text-lg">
            Apni Desi Dukaan
          </p>
          <p className="text-secondary-600 font-semibold text-sm mt-1">
            Loading your area console…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh max-h-dvh bg-background font-body overflow-hidden">
      <AreaManagerSidebar />
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <AreaManagerHeader />
        <main className="flex-1 min-h-0 overflow-y-auto overscroll-contain brand-page">
          {children}
        </main>
      </div>
    </div>
  );
}
