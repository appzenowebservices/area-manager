import { useLocation } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import useAuthStore from "../../store/authStore";

/**
 * Sidebar
 * File: src/components/layout/Sidebar.jsx
 *
 * Props:
 *  collapsed  boolean
 *  onCollapse fn
 *  mobileOpen boolean
 *  onMobileClose fn
 */

/* ─── Nav Icons ─── */
const Icon = ({ d, viewBox = "0 0 24 24" }) => (
  <svg width="19" height="19" viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d)
      ? d.map((path, i) => <path key={i} d={path} />)
      : <path d={d} />}
  </svg>
);

const DashIcon    = () => <Icon d={["M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"]} />;
const OrderIcon   = () => <Icon d={["M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2","M9 5a2 2 0 002 2h2a2 2 0 002-2","M9 5a2 2 0 012-2h2a2 2 0 012 2","M9 12h6M9 16h4"]} />;
const VendorIcon  = () => <Icon d={["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"]} />;
const DeliveryIcon= () => <Icon d={["M1 3h15v13H1z","M16 8h4l3 3v5h-7V8z","M5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"]} />;
const LeadIcon    = () => <Icon d={["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87","M16 3.13a4 4 0 010 7.75"]} />;
const EarningIcon = () => <Icon d={["M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"]} />;
const ReportIcon  = () => <Icon d={["M18 20V10","M12 20V4","M6 20v-6"]} />;
const ComplaintIcon=() => <Icon d={["M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z","M12 9v4","M12 17h.01"]} />;
const SettingIcon = () => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);
const CollapseIcon = ({ collapsed }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {collapsed
      ? <><path d="M9 18l6-6-6-6"/></>
      : <><path d="M15 18l-6-6 6-6"/></>}
  </svg>
);
const LogoutIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
);
const ActivityIcon = () => <Icon d={["M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2z","M7 7h.01"]} />;

/* ─── Nav Config ─── */
const NAV_ITEMS = [
  { to: "/dashboard",       icon: <DashIcon />,      label: "Dashboard"    },
  { to: "/orders",          icon: <OrderIcon />,     label: "Orders",      badge: 5 },
  { to: "/vendors",         icon: <VendorIcon />,    label: "Vendors"      },
  { to: "/delivery",        icon: <DeliveryIcon />,  label: "Delivery"     },
  {
    group: true,
    icon: <LeadIcon />,
    label: "Leads",
    badge: 3,
    children: [
      { to: "/leads/vendors",  label: "Vendor Leads"   },
      { to: "/leads/delivery", label: "Delivery Leads" },
    ],
  },
  { to: "/earnings",        icon: <EarningIcon />,   label: "Earnings"     },
  { to: "/reports",         icon: <ReportIcon />,    label: "Reports"      },
  { to: "/complaints",      icon: <ComplaintIcon />, label: "Complaints",  badge: 2 },
  {
    group: true,
    icon: <SettingIcon />,
    label: "Settings",
    groupKey: "settings",
    children: [
      { to: "/settings",      label: "Preferences"    },
      { to: "/activity-log",  label: "Activity Log",  icon: "📋" },
    ],
  },
];

export default function Sidebar({ collapsed, onCollapse, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuthStore();
  const { pathname } = useLocation();
  const leadsOpen    = pathname.startsWith("/leads");
  const settingsOpen = pathname.startsWith("/settings") || pathname.startsWith("/activity-log");

  const sidebarWidth = collapsed ? 68 : 240;

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div style={styles.mobileOverlay} onClick={onMobileClose} />
      )}

      <aside
        style={{
          ...styles.sidebar,
          width: sidebarWidth,
          transform: mobileOpen
            ? "translateX(0)"
            : window.innerWidth < 768
              ? "translateX(-100%)"
              : "translateX(0)",
        }}
      >
        {/* ── Brand ── */}
        <div style={{ ...styles.brand, justifyContent: collapsed ? "center" : "space-between" }}>
          {!collapsed && (
            <div style={styles.brandName}>
              <div style={styles.brandLogo}>A</div>
              <div>
                <div style={styles.brandTitle}>ADD</div>
                <div style={styles.brandSub}>Area Manager</div>
              </div>
            </div>
          )}

          {/* Collapse toggle — desktop only */}
          <button
            style={{
              ...styles.collapseBtn,
              ...(collapsed ? { margin: "0 auto" } : {}),
            }}
            onClick={onCollapse}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <CollapseIcon collapsed={collapsed} />
          </button>
        </div>

        {/* ── Nav ── */}
        <nav style={styles.nav}>
          {NAV_ITEMS.map((item) =>
            item.group ? (
              <div key={item.label}>
                {/* Group header */}
                {(() => {
                  const isOpen = item.groupKey === "settings" ? settingsOpen : leadsOpen;
                  return (
                    <div style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: collapsed ? "0.62rem 0" : "0.62rem 0.85rem",
                      justifyContent: collapsed ? "center" : "flex-start",
                      color: isOpen ? "#ae2012" : "#7d6b5d",
                      fontWeight: isOpen ? 700 : 500,
                      fontSize: "0.88rem", borderRadius: 10,
                      background: isOpen ? "#fdfbf7" : "transparent",
                      cursor: "default", position: "relative", marginBottom: 2,
                    }}>
                      {isOpen && (
                        <span style={{ position:"absolute", left:0, top:"50%", transform:"translateY(-50%)", width:3, height:20, borderRadius:"0 3px 3px 0", background:"#ae2012" }} />
                      )}
                      <span style={{ display:"flex", alignItems:"center", flexShrink:0, color: isOpen ? "#ae2012" : "#7d6b5d" }}>
                        {item.icon}
                      </span>
                      {!collapsed && <span style={{ flex:1 }}>{item.label}</span>}
                      {!collapsed && item.badge > 0 && (
                        <span style={{ background:"#ae2012", color:"#fff", fontSize:"0.68rem", fontWeight:700, padding:"2px 7px", borderRadius:99 }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  );
                })()}
                {/* Sub-items */}
                {!collapsed && (
                  <div style={{ paddingLeft: 14, display:"flex", flexDirection:"column", gap:2, marginBottom:2 }}>
                    {item.children.map(child => (
                      <SidebarItem
                        key={child.to}
                        to={child.to}
                        icon={null}
                        label={child.label}
                        collapsed={false}
                        isSubItem
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <SidebarItem
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                collapsed={collapsed}
                badge={item.badge}
              />
            )
          )}
        </nav>

        {/* ── User + Logout ── */}
        <div style={styles.footer}>
          {!collapsed && (
            <div style={styles.userCard}>
              <div style={styles.avatar}>
                {user?.name?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div style={styles.userInfo}>
                <p style={styles.userName}>{user?.name || "Area Manager"}</p>
                <p style={styles.userRole}>Area Manager</p>
              </div>
            </div>
          )}

          <button
            style={{
              ...styles.logoutBtn,
              ...(collapsed ? { justifyContent: "center", padding: "0.65rem" } : {}),
            }}
            onClick={logout}
            title="Logout"
          >
            <LogoutIcon />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

const styles = {
  mobileOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(45, 36, 30,0.45)",
    zIndex: 99,
    backdropFilter: "blur(2px)",
  },
  sidebar: {
    position: "fixed",
    top: 0, left: 0, bottom: 0,
    background: "#fff",
    borderRight: "1px solid #f5ebe0",
    display: "flex",
    flexDirection: "column",
    zIndex: 100,
    transition: "width 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s ease",
    overflow: "hidden",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    padding: "1.1rem 0.9rem",
    borderBottom: "1px solid #fdfbf7",
    minHeight: 65,
    gap: 10,
  },
  brandName: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    overflow: "hidden",
  },
  brandLogo: {
    width: 36, height: 36,
    borderRadius: 10,
    background: "linear-gradient(135deg, #ae2012, #2d241e)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#fff",
    fontSize: "1rem", fontWeight: 800,
    flexShrink: 0,
    fontFamily: "'Sora', sans-serif",
  },
  brandTitle: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#2d241e",
    letterSpacing: "-0.01em",
    lineHeight: 1.2,
    fontFamily: "'Sora', sans-serif",
  },
  brandSub: {
    fontSize: "0.68rem",
    color: "#a68b66",
    letterSpacing: "0.04em",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  collapseBtn: {
    background: "#fdfbf7",
    border: "none",
    borderRadius: 8,
    width: 30, height: 30,
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#7d6b5d",
    cursor: "pointer",
    flexShrink: 0,
    transition: "background 0.15s",
  },
  nav: {
    flex: 1,
    padding: "0.75rem 0.6rem",
    display: "flex",
    flexDirection: "column",
    gap: 3,
    overflowY: "auto",
    overflowX: "hidden",
  },
  footer: {
    padding: "0.75rem 0.6rem",
    borderTop: "1px solid #fdfbf7",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0.55rem 0.7rem",
    background: "#fdfbf7",
    borderRadius: 10,
    overflow: "hidden",
  },
  avatar: {
    width: 32, height: 32,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ae2012, #2d241e)",
    color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "0.85rem", fontWeight: 700,
    flexShrink: 0,
  },
  userInfo: {
    overflow: "hidden",
  },
  userName: {
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#2d241e",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userRole: {
    fontSize: "0.7rem",
    color: "#a68b66",
    marginTop: 1,
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    width: "100%",
    padding: "0.6rem 0.8rem",
    background: "none",
    border: "1px solid #fbebe9",
    borderRadius: 9,
    color: "#d32f2f",
    fontSize: "0.84rem",
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "background 0.15s",
  },
};
