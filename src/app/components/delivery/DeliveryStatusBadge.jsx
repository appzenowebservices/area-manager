/**
 * DeliveryStatusBadge
 * File: src/components/delivery/DeliveryStatusBadge.jsx
 *
 * Props:
 *   status  "Available" | "Busy" | "Inactive"
 *   size    "sm" | "md"
 */
export default function DeliveryStatusBadge({ status, size = "md" }) {
  const map = {
    Available: { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
    Busy:      { bg: "#dbeafe", color: "#1e40af", dot: "#1a73e8" },
    Inactive:  { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
  };
  const s = map[status] || map["Inactive"];

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size === "sm" ? 4 : 5,
      padding: size === "sm" ? "2px 8px" : "3px 10px",
      borderRadius: 99,
      background: s.bg,
      color: s.color,
      fontSize: size === "sm" ? "0.68rem" : "0.75rem",
      fontWeight: 700,
      whiteSpace: "nowrap",
      letterSpacing: "0.01em",
    }}>
      <span style={{
        width:  size === "sm" ? 5 : 6,
        height: size === "sm" ? 5 : 6,
        borderRadius: "50%",
        background: s.dot,
        flexShrink: 0,
        ...(status === "Available" ? {
          boxShadow: `0 0 0 2px rgba(16,185,129,0.25)`,
          animation: "dsBlink 2s infinite",
        } : {}),
      }} />
      {status}
      <style>{`@keyframes dsBlink { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
    </span>
  );
}
