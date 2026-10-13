/**
 * BrandPanel
 * File: src/components/auth/BrandPanel.jsx
 *
 * Left decorative panel on the Login screen.
 * Shows brand identity, tagline and key stats.
 */

const stats = [
  { value: "1,200+", label: "Vendors" },
  { value: "48k",    label: "Orders" },
  { value: "99%",    label: "Uptime"  },
];

export default function BrandPanel() {
  return (
    <div style={styles.panel}>
      {/* Background decoration */}
      <div style={styles.circle1} />
      <div style={styles.circle2} />
      <div style={styles.grid} />

      <div style={styles.inner}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logo}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill="rgba(255,255,255,0.25)" stroke="#fff" strokeWidth="1.5"/>
              <path d="M9 22V12h6v10" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Brand name */}
        <h1 style={styles.brandName}>
          Apni Desi<br />
          <span style={styles.brandAccent}>Dukaan</span>
        </h1>
        <p style={styles.tagline}>Area Manager Portal</p>

        {/* Divider */}
        <div style={styles.divider} />

        {/* Description */}
        <p style={styles.desc}>
          Manage your area's vendors, orders and deliveries — all from one powerful dashboard.
        </p>

        {/* Stats */}
        <div style={styles.statsRow}>
          {stats.map((s) => (
            <div key={s.label} style={styles.statItem}>
              <div style={styles.statValue}>{s.value}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Badge */}
        <div style={styles.badge}>
          <div style={styles.dot} />
          All systems operational
        </div>
      </div>
    </div>
  );
}

const styles = {
  panel: {
    width: "45%",
    minHeight: "100vh",
    background: "linear-gradient(145deg, #ae2012 0%, #ae2012 55%, #2d241e 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 2.5rem",
    position: "relative",
    overflow: "hidden",
    animation: "panelIn 0.7s cubic-bezier(0.22,1,0.36,1) both",
  },
  circle1: {
    position: "absolute",
    width: 340, height: 340,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.06)",
    top: -80, right: -80,
    pointerEvents: "none",
  },
  circle2: {
    position: "absolute",
    width: 200, height: 200,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.04)",
    bottom: 40, left: -60,
    pointerEvents: "none",
  },
  grid: {
    position: "absolute",
    inset: 0,
    opacity: 0.04,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  inner: {
    position: "relative",
    zIndex: 2,
    animation: "fadeUp 0.8s 0.3s cubic-bezier(0.22,1,0.36,1) both",
    opacity: 0,
  },
  logoWrap: {
    marginBottom: "1.5rem",
  },
  logo: {
    width: 72, height: 72,
    borderRadius: 20,
    background: "rgba(255,255,255,0.15)",
    border: "1.5px solid rgba(255,255,255,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: "blur(8px)",
    animation: "popIn 0.6s 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
    opacity: 0,
  },
  brandName: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "2.2rem",
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1.1,
    letterSpacing: "-0.02em",
  },
  brandAccent: {
    color: "#f5dfa6",
  },
  tagline: {
    marginTop: "0.5rem",
    fontSize: "0.78rem",
    fontWeight: 500,
    color: "rgba(255,255,255,0.55)",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  divider: {
    width: 48, height: 2,
    background: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    margin: "1.75rem 0",
  },
  desc: {
    fontSize: "0.9rem",
    lineHeight: 1.75,
    color: "rgba(255,255,255,0.6)",
    maxWidth: 270,
  },
  statsRow: {
    display: "flex",
    gap: "2rem",
    marginTop: "2.5rem",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  statValue: {
    fontFamily: "'Sora', sans-serif",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#fff",
  },
  statLabel: {
    fontSize: "0.72rem",
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  badge: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: "2.5rem",
    padding: "0.5rem 0.9rem",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 99,
    fontSize: "0.78rem",
    color: "rgba(255,255,255,0.75)",
    width: "fit-content",
  },
  dot: {
    width: 7, height: 7,
    borderRadius: "50%",
    background: "#4fbf6e",
    boxShadow: "0 0 6px #4fbf6e",
  },
};
