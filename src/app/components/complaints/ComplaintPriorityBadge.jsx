/**
 * ComplaintPriorityBadge
 * File: src/components/complaints/ComplaintPriorityBadge.jsx
 */
export default function ComplaintPriorityBadge({ priority, size = "md" }) {
  const map = {
    Low:      { bg: "#eaf6ed", color: "#2196f3", bar: "#2196f3" },
    Medium:   { bg: "#faedcc", color: "#a67a22", bar: "#e9c46a" },
    High:     { bg: "#fbebe9", color: "#8b150e", bar: "#d32f2f" },
    Critical: { bg: "#fbebe9", color: "#8b150e", bar: "#d32f2f" },
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
