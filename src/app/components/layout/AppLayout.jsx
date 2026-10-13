import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

/**
 * AppLayout
 * File: src/components/layout/AppLayout.jsx
 *
 * The shell for every protected page.
 * Used inside ProtectedRoute in AppRouter.
 *
 * Layout:
 *  ┌──────────┬──────────────────────┐
 *  │          │  TopBar              │
 *  │ Sidebar  ├──────────────────────┤
 *  │          │  <Outlet />          │
 *  │          │  (page content)      │
 *  └──────────┴──────────────────────┘
 */

const SIDEBAR_FULL      = 240;
const SIDEBAR_COLLAPSED = 68;

export default function AppLayout() {
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [isMobile,    setIsMobile]    = useState(window.innerWidth < 768);

  /* ── Responsive: detect mobile ── */
  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false); // close mobile drawer on resize
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const sidebarWidth = isMobile ? 0 : (collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_FULL);

  return (
    <>
      <style>{layoutCSS}</style>
      <div className="app-shell">
        {/* ── Sidebar ── */}
        <Sidebar
          collapsed={!isMobile && collapsed}
          onCollapse={() => setCollapsed((c) => !c)}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
        />

        {/* ── Main area (shifts right to make room for sidebar) ── */}
        <div
          className="app-main"
          style={{ marginLeft: sidebarWidth }}
        >
          {/* Top bar */}
          <TopBar
            sidebarCollapsed={collapsed}
            onMobileMenuOpen={() => setMobileOpen(true)}
          />

          {/* Page content rendered here */}
          <main className="app-content">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

const layoutCSS = `
  .app-shell {
    display: flex;
    min-height: 100vh;
    background: #fdfbf7;
  }

  .app-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    transition: margin-left 0.25s cubic-bezier(0.4,0,0.2,1);
  }

  .app-content {
    flex: 1;
  }

  /* ── Mobile ── */
  @media (max-width: 768px) {
    .app-main {
      margin-left: 0 !important;
    }

    /* show hamburger in topbar */
    header button[aria-label="Open menu"] {
      display: flex !important;
    }
  }

  /* ── Hide date pill on small screens ── */
  @media (max-width: 480px) {
    .date-pill { display: none; }
  }
`;
