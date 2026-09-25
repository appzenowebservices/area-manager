' use client';
import { LEAD_STAGE_CONFIG } from "../../data/leadsData";

/**
 * LeadStageBadge
 * Props: stage string, size "sm"|"md"
 */
export default function LeadStageBadge({ stage, size = "md" }) {
  const cfg = LEAD_STAGE_CONFIG[stage] || { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      gap: size === "sm" ? 4 : 5,
      padding: size === "sm" ? "2px 8px" : "3px 10px",
      borderRadius: 99, background: cfg.bg, color: cfg.color,
      fontSize: size === "sm" ? "0.68rem" : "0.75rem",
      fontWeight: 700, whiteSpace: "nowrap", letterSpacing: "0.02em",
    }}>
      <span style={{ width: size === "sm" ? 5 : 6, height: size === "sm" ? 5 : 6, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
      {stage}
    </span>
  );
}
