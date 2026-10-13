import { COMPLAINTS } from "../../data/complaintsData";

/**
 * ComplaintsStatsBar
 * File: src/components/complaints/ComplaintsStatsBar.jsx
 */
export default function ComplaintsStatsBar() {
  const total      = COMPLAINTS.length;
  const open       = COMPLAINTS.filter(c => c.status === "Open").length;
  const inProgress = COMPLAINTS.filter(c => c.status === "In Progress").length;
  const resolved   = COMPLAINTS.filter(c => c.status === "Resolved").length;
  const escalated  = COMPLAINTS.filter(c => c.status === "Escalated").length;
  const critical   = COMPLAINTS.filter(c => c.priority === "Critical").length;
  const high       = COMPLAINTS.filter(c => c.priority === "High").length;

  const CHIPS = [
    { label: "Total",       val: total,      color: "#ae2012", bg: "#fdfbf7" },
    { label: "Open",        val: open,       color: "#8b150e", bg: "#fbebe9" },
    { label: "In Progress", val: inProgress, color: "#a67a22", bg: "#faedcc" },
    { label: "Resolved",    val: resolved,   color: "#0a671a", bg: "#d3ebd8" },
    { label: "Escalated",   val: escalated,  color: "#8b150e", bg: "#fbebe9" },
    { label: "Critical",    val: critical,   color: "#8b150e", bg: "#fbebe9" },
    { label: "High",        val: high,       color: "#8b150e", bg: "#fbebe9" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="csb-wrap">
        {CHIPS.map(c => (
          <div key={c.label} className="csb-chip" style={{ background: c.bg }}>
            <span className="csb-val" style={{ color: c.color }}>{c.val}</span>
            <span className="csb-label">{c.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

const css = `
  .csb-wrap {
    display: flex; gap: 8px;
    flex-wrap: wrap; margin-bottom: 1.1rem;
  }
  .csb-chip {
    display: flex; flex-direction: column;
    align-items: center; gap: 2px;
    padding: 0.5rem 0.85rem;
    border-radius: 12px; flex: 1; min-width: 68px;
  }
  .csb-val {
    font-family: 'Sora', sans-serif;
    font-size: 1.15rem; font-weight: 800; line-height: 1;
  }
  .csb-label {
    font-size: 0.62rem; color: #7d6b5d;
    font-weight: 600; text-transform: uppercase;
    letter-spacing: 0.04em; white-space: nowrap;
  }
  @media (max-width: 600px) {
    .csb-chip { min-width: 58px; padding: 0.4rem 0.5rem; }
    .csb-val  { font-size: 0.95rem; }
    .csb-label { font-size: 0.58rem; }
  }
`;
