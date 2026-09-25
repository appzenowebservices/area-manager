/**
 * ComplaintSourceBadge
 * File: src/components/complaints/ComplaintSourceBadge.jsx
 */
export default function ComplaintSourceBadge({ source, size = "md" }) {
  const map = {
    "Customer":          { bg: "#ede9fe", color: "#7c3aed", icon: "👤" },
    "Vendor":            { bg: "#e8f0fe", color: "#1a73e8", icon: "🏪" },
    "Delivery Partner":  { bg: "#d1fae5", color: "#065f46", icon: "🚴" },
    "Internal/System":   { bg: "#f1f5f9", color: "#475569", icon: "⚙️" },
  };
  const s = map[source] || { bg: "#f1f5f9", color: "#475569", icon: "❓" };
  const sm = size === "sm";

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: sm ? "2px 7px" : "3px 10px",
      borderRadius: 99, background: s.bg, color: s.color,
      fontSize: sm ? "0.68rem" : "0.75rem", fontWeight: 700,
      whiteSpace: "nowrap",
    }}>
      <span style={{ fontSize: sm ? "0.7rem" : "0.78rem" }}>{s.icon}</span>
      {source}
    </span>
  );
}
