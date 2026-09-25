import { NavLink } from "react-router-dom";

/**
 * SidebarItem
 * File: src/components/layout/SidebarItem.jsx
 *
 * Props:
 *  to        string   — route path
 *  icon      ReactNode
 *  label     string
 *  collapsed boolean  — sidebar collapsed state
 *  badge     number   — optional notification count
 */
export default function SidebarItem({ to, icon, label, collapsed, badge, isSubItem = false }) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        ...(isSubItem ? styles.subItem : styles.item),
        ...(isActive ? styles.active : styles.inactive),
        justifyContent: collapsed ? "center" : "flex-start",
      })}
      title={collapsed ? label : undefined}
    >
      {({ isActive }) => (
        <>
          {/* Active indicator bar */}
          {isActive && <span style={styles.indicator} />}

          {/* Icon or sub-item dot */}
          {icon ? (
            <span style={{ ...styles.icon, color: isActive ? "#1a73e8" : "#64748b" }}>
              {icon}
            </span>
          ) : isSubItem ? (
            <span style={{ width: 6, height: 6, borderRadius:"50%", background: isActive ? "#1a73e8" : "#cbd5e1", flexShrink:0 }} />
          ) : null}

          {/* Label — hidden when collapsed */}
          {!collapsed && (
            <span
              style={{
                ...styles.label,
                color: isActive ? "#1a73e8" : "#64748b",
                fontWeight: isActive ? 700 : 500,
                fontSize: isSubItem ? "0.82rem" : "0.88rem",
              }}
            >
              {label}
            </span>
          )}

          {/* Badge */}
          {!collapsed && badge > 0 && (
            <span style={styles.badge}>{badge > 99 ? "99+" : badge}</span>
          )}
        </>
      )}
    </NavLink>
  );
}

const styles = {
  item: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "0.62rem 0.85rem",
    borderRadius: 10,
    textDecoration: "none",
    transition: "background 0.18s ease, transform 0.12s ease",
    cursor: "pointer",
    overflow: "hidden",
  },
  subItem: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "0.45rem 0.75rem",
    borderRadius: 8,
    textDecoration: "none",
    transition: "background 0.15s ease",
    cursor: "pointer",
    overflow: "hidden",
  },
  active: {
    background: "#e8f0fe",
  },
  inactive: {
    background: "transparent",
  },
  indicator: {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: 3,
    height: 20,
    borderRadius: "0 3px 3px 0",
    background: "#1a73e8",
  },
  icon: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    transition: "color 0.18s",
  },
  label: {
    fontSize: "0.88rem",
    letterSpacing: "0.01em",
    transition: "color 0.18s",
    whiteSpace: "nowrap",
  },
  badge: {
    marginLeft: "auto",
    background: "#1a73e8",
    color: "#fff",
    fontSize: "0.68rem",
    fontWeight: 700,
    padding: "2px 7px",
    borderRadius: 99,
    letterSpacing: "0.02em",
  },
};
