// src/components/vendors/VendorStatusBadge.jsx

/**
 * VendorStatusBadge
 * Props: status string, size "sm"|"md"
 */
export default function VendorStatusBadge({ status, size = "md" }) {
  const { bg, color, dot } = statusMap[status] || statusMap["default"];
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size === "sm" ? 4 : 5,
      padding: size === "sm" ? "2px 8px" : "3px 10px",
      borderRadius: 99,
      background: bg,
      color,
      fontSize: size === "sm" ? "0.68rem" : "0.75rem",
      fontWeight: 700,
      whiteSpace: "nowrap",
      letterSpacing: "0.02em",
    }}>
      <span style={{ width: size === "sm" ? 5 : 6, height: size === "sm" ? 5 : 6, borderRadius: "50%", background: dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

const statusMap = {
  "Active":      { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
  "Inactive":    { bg: "#fee2e2", color: "#b91c1c", dot: "#ef4444" },
  "Pending KYC": { bg: "#fef3c7", color: "#d97706", dot: "#f59e0b" },
  "default":     { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
};
