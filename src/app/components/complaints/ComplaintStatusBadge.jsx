/**
 * ComplaintStatusBadge
 * File: src/components/complaints/ComplaintStatusBadge.jsx
 */
export default function ComplaintStatusBadge({ status, size = "md" }) {
  const map = {
    "Open":        { bg: "#fee2e2", color: "#b91c1c", dot: "#ef4444" },
    "In Progress": { bg: "#fef3c7", color: "#d97706", dot: "#f59e0b" },
    "Resolved":    { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
    "Escalated":   { bg: "#fdf2f8", color: "#9d174d", dot: "#ec4899" },
  };
  const s = map[status] || { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" };
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
