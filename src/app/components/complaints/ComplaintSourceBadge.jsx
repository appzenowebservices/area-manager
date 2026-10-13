/**
 * ComplaintSourceBadge
 * File: src/components/complaints/ComplaintSourceBadge.jsx
 */
export default function ComplaintSourceBadge({ source, size = "md" }) {
  const map = {
    "Customer":          { bg: "#f5ebe0", color: "#4a5d23", icon: "👤" },
    "Vendor":            { bg: "#fdfbf7", color: "#ae2012", icon: "🏪" },
    "Delivery Partner":  { bg: "#d3ebd8", color: "#0a671a", icon: "🚴" },
    "Internal/System":   { bg: "#f5ebe0", color: "#5d4037", icon: "⚙️" },
  };
  const s = map[source] || { bg: "#f5ebe0", color: "#5d4037", icon: "❓" };
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
