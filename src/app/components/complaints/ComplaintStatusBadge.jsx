/**
 * ComplaintStatusBadge
 * File: src/components/complaints/ComplaintStatusBadge.jsx
 */
export default function ComplaintStatusBadge({ status, size = "md" }) {
  const map = {
    "Open":        { bg: "#fbebe9", color: "#8b150e", dot: "#d32f2f" },
    "In Progress": { bg: "#faedcc", color: "#a67a22", dot: "#e9c46a" },
    "Resolved":    { bg: "#d3ebd8", color: "#0a671a", dot: "#0c831f" },
    "Escalated":   { bg: "#fbebe9", color: "#8b150e", dot: "#d32f2f" },
  };
  const s = map[status] || { bg: "#f5ebe0", color: "#5d4037", dot: "#a68b66" };
  const sm = size === "sm";

  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      gap: sm ? 4 : 5,
      padding: sm ? "2px 8px" : "3px 10px",
      borderRadius: 99, background: s.bg, color: s.color,
      fontSize: sm ? "0.68rem" : "0.75rem",
      fontWeight: 700, whiteSpace: "nowrap",
    }}>
      <span style={{
        width: sm ? 5 : 6, height: sm ? 5 : 6,
        borderRadius: "50%", background: s.dot, flexShrink: 0,
        ...(status === "Open" ? { animation: "cmpPulse 1.5s infinite" } : {}),
      }} />
      {status}
      <style>{`@keyframes cmpPulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </span>
  );
}
