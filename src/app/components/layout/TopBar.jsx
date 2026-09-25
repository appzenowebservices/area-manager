import { useState } from "react";
import { useLocation } from "react-router-dom";

/* ── Injected CSS for responsive hamburger ── */
const TOPBAR_CSS = `
  .topbar-hamburger {
    display: none;
    background: #f0f5ff;
    border: none;
    border-radius: 9px;
    width: 36px; height: 36px;
    align-items: center; justify-content: center;
    color: #475569;
    cursor: pointer;
    flex-shrink: 0;
  }
  @media (max-width: 768px) {
    .topbar-hamburger { display: flex !important; }
  }
`;

/**
 * TopBar
 * File: src/components/layout/TopBar.jsx
 *
 * Props:
 *  sidebarCollapsed  boolean
 *  onMobileMenuOpen  fn
 */

/* ─── Route → Title map ─── */
const PAGE_TITLES = {
  "/dashboard":  { title: "Dashboard",   sub: "Welcome back, here's what's happening." },
  "/orders":     { title: "Orders",      sub: "Track and manage all customer orders."   },
  "/vendors":    { title: "Vendors",     sub: "Manage your area's vendor network."      },
  "/delivery":   { title: "Delivery",    sub: "Delivery boys and assignments."          },
  "/leads":      { title: "Leads",       sub: "Track and convert potential vendors."    },
  "/earnings":   { title: "Earnings",    sub: "Your commissions and payouts."           },
  "/reports":    { title: "Reports",     sub: "Performance data and analytics."         },
  "/complaints": { title: "Complaints",  sub: "Customer and vendor complaints."         },
  "/settings":   { title: "Settings",    sub: "Account and notification preferences."  },
};

const BellIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

export default function TopBar({ sidebarCollapsed, onMobileMenuOpen }) {
  const { pathname } = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");

  const page = PAGE_TITLES[pathname] || { title: "Area Manager", sub: "" };

  return (
    <>
      <style>{TOPBAR_CSS}</style>
    <header style={styles.bar}>
      {/* Left: hamburger (mobile) + page title */}
      <div style={styles.left}>
        {/* Hamburger — mobile only */}
        <button
          className="topbar-hamburger"
          onClick={onMobileMenuOpen}
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>

        {/* Page title */}
        <div>
          <h1 style={styles.title}>{page.title}</h1>
          {page.sub && <p style={styles.sub}>{page.sub}</p>}
        </div>
      </div>

      {/* Right: search + notifications + date */}
      <div style={styles.right}>
        {/* Search */}
        <div style={{ ...styles.searchWrap, ...(searchOpen ? styles.searchOpen : {}) }}>
          <span style={styles.searchIcon}><SearchIcon /></span>
          <input
            style={styles.searchInput}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => { setSearchOpen(false); setSearch(""); }}
          />
        </div>

        {/* Date */}
        <div style={styles.datePill}>
          {new Date().toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </div>

        {/* Notifications */}
        <button style={styles.notifBtn} aria-label="Notifications">
          <BellIcon />
          <span style={styles.notifDot} />
        </button>
      </div>
    </header>
    </>
  );
}

const styles = {
  bar: {
    height: 65,
    background: "#fff",
    borderBottom: "1px solid #dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 1.5rem",
    gap: "1rem",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  hamburger: {
    // visibility controlled by .topbar-hamburger CSS class
  },
  title: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.01em",
    lineHeight: 1.2,
  },
  sub: {
    fontSize: "0.73rem",
    color: "#94a3b8",
    marginTop: 1,
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#f8faff",
    border: "1.5px solid #e2e8f0",
    borderRadius: 10,
    padding: "0.4rem 0.75rem",
    transition: "width 0.25s ease, border-color 0.2s",
    width: 160,
    overflow: "hidden",
  },
  searchOpen: {
    borderColor: "#1a73e8",
    width: 220,
  },
  searchIcon: {
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
  },
  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "0.84rem",
    color: "#0f172a",
    width: "100%",
    fontFamily: "inherit",
  },
  datePill: {
    padding: "0.38rem 0.85rem",
    background: "#f0f5ff",
    border: "1px solid #dbeafe",
    borderRadius: 99,
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#1a73e8",
    whiteSpace: "nowrap",
  },
  notifBtn: {
    position: "relative",
    width: 38, height: 38,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "#f0f5ff",
    border: "1.5px solid #dbeafe",
    borderRadius: 10,
    color: "#475569",
    cursor: "pointer",
  },
  notifDot: {
    position: "absolute",
    top: 7, right: 7,
    width: 8, height: 8,
    borderRadius: "50%",
    background: "#ef4444",
    border: "1.5px solid #fff",
  },
};
