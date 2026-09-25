/**
 * ComplaintPriorityBadge
 * File: src/components/complaints/ComplaintPriorityBadge.jsx
 */
export default function ComplaintPriorityBadge({ priority, size = "md" }) {
  const map = {
    Low:      { bg: "#f0f9ff", color: "#0369a1", bar: "#38bdf8" },
    Medium:   { bg: "#fef3c7", color: "#d97706", bar: "#f59e0b" },
    High:     { bg: "#fee2e2", color: "#b91c1c", bar: "#ef4444" },
    Critical: { bg: "#fff1f2", color: "#9f1239", bar: "#f43f5e" },
  };
  const s = map[priority] || map["Low"];
  const sm = size === "sm";

  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: sm ? "2px 7px" : "3px 10px",
      borderRadius: 99, background: s.bg, color: s.color,
      fontSize: sm ? "0.68rem" : "0.75rem", fontWeight: 700,
      whiteSpace: "nowrap",
    }}>
      {/* Priority bars indicator */}
      <span style={{ display: "flex", alignItems: "flex-end", gap: 1.5 }}>
        {[1, 2, 3, 4].map(i => (
          <span key={i} style={{
            display: "block",
            width: sm ? 2 : 2.5,
            height: sm ? (i * 2.5) : (i * 3),
            borderRadius: 1,
            background: getPriorityLevel(priority) >= i ? s.bar : `${s.bar}40`,
          }} />
        ))}
      </span>
      {priority}
    </span>
  );
}

function getPriorityLevel(p) {
  return { Low: 1, Medium: 2, High: 3, Critical: 4 }[p] || 1;
}
