"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  ShoppingBag,
  Store,
  Bike,
  Users,
  IndianRupee,
  FileText,
  AlertTriangle,
  Settings,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import useAuthStore from "../../hooks/authStore";
import { LogoutDialog } from "../brand/LogoutDialog";

const menuItems = [
  {
    group: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Orders", href: "/orders", icon: ShoppingBag, badge: "5" },
      { label: "Vendors", href: "/vendors", icon: Store },
      { label: "Delivery", href: "/delivery", icon: Bike },
    ],
  },
  {
    group: "Growth",
    items: [
      { label: "Vendor Leads", href: "/leads/vendors", icon: Users, badge: "3" },
      { label: "Delivery Leads", href: "/leads", icon: Bike },
      { label: "Earnings", href: "/earnings", icon: IndianRupee },
      { label: "Reports", href: "/reports", icon: FileText },
    ],
  },
  {
    group: "Support",
    items: [{ label: "Complaints", href: "/complaints", icon: AlertTriangle, badge: "2" }],
  },
  {
    group: "Account",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Activity Log", href: "/activity-log", icon: History },
    ],
  },
];

export default function AreaManagerSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const name = user?.name || "Area Manager";
  const businessName = "Area Manager Console";

  const confirmLogout = async () => {
    setLoggingOut(true);
    try {
      logout();
      await signOut({ callbackUrl: "/" });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen((open) => !open)}
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-primary-600 text-white rounded-full shadow-xl shadow-primary-600/30 border-2 border-primary-700 active:scale-90 transition-transform"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 lg:relative
          ${collapsed ? "lg:w-20" : "lg:w-72"}
          ${mobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}
          bg-secondary-900 border-r-2 border-secondary-950 flex flex-col transition-all duration-300 ease-in-out
        `}
      >
        {/* Brand / profile */}
        <div className="h-20 flex items-center px-4 border-b-2 border-secondary-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0 w-10 h-10 bg-accent-400 border-2 border-secondary-950 rounded-xl flex items-center justify-center">
              <Store className="h-5 w-5 text-secondary-900" />
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0">
                <h2 className="font-display font-black text-secondary-50 text-sm truncate">
                  {businessName}
                </h2>
                <p className="text-[10px] text-accent-300 font-bold truncate uppercase tracking-widest">
                  {name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((value) => !value)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:flex absolute -right-3 top-24 bg-background-section border-2 border-secondary-900 rounded-full p-1 text-secondary-600 hover:text-primary-600 hover:border-primary-300 shadow-sm transition-all"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-3 custom-scrollbar">
          {menuItems.map((group) => (
            <div key={group.group} className="mb-6 last:mb-0">
              {(!collapsed || mobileOpen) && (
                <p className="px-4 text-[10px] font-black text-secondary-400 uppercase tracking-[0.15em] mb-2">
                  {group.group}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/leads"
                      ? pathname === "/leads"
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={`${group.group}-${item.label}`}
                      href={item.href}
                      className={`
                        group flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all relative border-2
                        ${
                          isActive
                            ? "bg-primary-600 text-white border-primary-700 shadow-[3px_3px_0px_var(--color-accent-400)]"
                            : "text-secondary-300 border-transparent hover:bg-white/5 hover:text-white"
                        }
                      `}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0 transition-transform group-active:scale-90" />
                      {(!collapsed || mobileOpen) && (
                        <span className="text-[13px] font-bold flex-1 truncate font-display">
                          {item.label}
                        </span>
                      )}
                      {item.badge && (
                        <span
                          className={`
                            ${
                              collapsed && !mobileOpen
                                ? "absolute top-1 right-1 h-2 w-2"
                                : "px-2 py-0.5 text-[10px]"
                            }
                            bg-accent-400 text-secondary-900 font-black rounded-full border border-secondary-950
                          `}
                        >
                          {collapsed && !mobileOpen ? "" : item.badge}
                        </span>
                      )}
                      {collapsed && !mobileOpen && (
                        <div className="fixed left-20 ml-2 px-2 py-1 bg-secondary-950 text-accent-300 text-xs font-bold rounded-lg border border-secondary-700 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                          {item.label}
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t-2 border-secondary-800 space-y-2">
          {(!collapsed || mobileOpen) && (
            <div className="bg-mehndi-600/20 border border-mehndi-600/40 rounded-2xl p-3">
              <p className="text-[11px] font-black uppercase tracking-widest text-mehndi-200">
                Area ops live
              </p>
              <p className="text-[11px] font-medium text-secondary-300 mt-0.5">
                Vendors · orders · delivery in one console
              </p>
            </div>
          )}
          <button
            onClick={() => setLogoutOpen(true)}
            className="flex items-center gap-3 px-3 py-3 rounded-2xl text-secondary-300 hover:bg-primary-600 hover:text-white w-full transition-all group border-2 border-transparent hover:border-primary-700"
          >
            <LogOut className="h-5 w-5 flex-shrink-0 transition-transform group-hover:-translate-x-1" />
            {(!collapsed || mobileOpen) && (
              <span className="text-[13px] font-bold">Logout</span>
            )}
          </button>
        </div>
      </aside>

      <LogoutDialog
        open={logoutOpen}
        busy={loggingOut}
        onClose={() => setLogoutOpen(false)}
        onConfirm={confirmLogout}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-secondary-700);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: var(--color-accent-500);
        }
      `}</style>
    </>
  );
}
