"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Search, User, Calendar } from "lucide-react";
import useAuthStore from "../../hooks/authStore";
import { api } from "~/trpc/react";

export default function AreaManagerHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const user = useAuthStore((state) => state.user);
  const { data: badges } = api.areaManagerData.badges.useQuery(undefined, {
    refetchInterval: 60_000,
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) =>
    date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (date) =>
    date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <header className="bg-background-section border-b-2 border-secondary-900 px-4 sm:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search orders, vendors, leads…"
              className="w-full pl-11 pr-4 py-2.5 bg-secondary-50 border-2 border-secondary-200 rounded-2xl text-sm font-semibold text-primary-text placeholder:text-text-muted outline-none focus:border-primary-600 focus:bg-background-section transition-all"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-5 ml-4">
          <div className="hidden md:flex flex-col items-end">
            <div className="flex items-center gap-2 text-xs font-bold text-secondary-600">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(currentTime)}</span>
            </div>
            <div className="font-display text-lg font-black text-primary-600 tabular-nums leading-none mt-0.5">
              {formatTime(currentTime)}
            </div>
          </div>

          <Link
            href="/activity-log"
            aria-label="Activity log"
            title="Activity log"
            className="relative w-10 h-10 flex items-center justify-center bg-background-section border-2 border-secondary-900 rounded-2xl text-secondary-900 hover:bg-accent-400 transition-colors shadow-[3px_3px_0px_var(--color-secondary-900)]"
          >
            <Bell className="h-5 w-5" />
            {(badges?.complaints ?? 0) > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] font-black min-w-5 h-5 px-1 rounded-full flex items-center justify-center border-2 border-secondary-900">
                {(badges?.complaints ?? 0) > 9 ? "9+" : badges?.complaints}
              </span>
            )}
          </Link>

          <Link
            href="/settings"
            aria-label="My profile"
            title={user?.name || "My profile"}
            className="flex items-center gap-2 p-1 pr-2 hover:bg-secondary-100 rounded-2xl border-2 border-transparent hover:border-secondary-200 transition-all"
          >
            <div className="w-10 h-10 bg-secondary-900 border-2 border-accent-400 rounded-2xl flex items-center justify-center">
              <User className="h-5 w-5 text-accent-400" />
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-[11px] font-black text-secondary-900 max-w-28 truncate">
                {user?.name || "Area Manager"}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-secondary-500">
                Area Manager
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

