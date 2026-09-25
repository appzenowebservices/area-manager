// src/components/leads/LeadCard.jsx
import LeadStageBadge from "./LeadStageBadge";

/**
 * LeadCard — Mobile card for a lead
 * Props: lead, onView fn(lead)
 */
export default function LeadCard({ lead, onView }) {
  const isVendor = lead.type === "vendor";
  const docCount = Object.values(lead.documents).filter(Boolean).length;
  const docTotal = Object.keys(lead.documents).length;

  return (
    <>
      <style>{css}</style>
      <div className="lc-card">
        <div className="lc-top">
          <div className="lc-avatar" style={{ background: isVendor ? "linear-gradient(135deg,#1a73e8,#0d47a1)" : "linear-gradient(135deg,#10b981,#065f46)" }}>
            {lead.name.charAt(0)}
          </div>
          <div className="lc-info">
            <div className="lc-name">{lead.name}</div>
            <div className="lc-sub">{lead.id} &nbsp;·&nbsp; {isVendor ? lead.category : lead.vehicle}</div>
          </div>
          <LeadStageBadge stage={lead.stage} size="sm" />
        </div>

        <div className="lc-meta-row">
          <span className="lc-meta">📞 {lead.phone}</span>
          <span className="lc-meta">📍 {lead.area}</span>
          <span className="lc-meta">📅 {lead.appliedDate}</span>
        </div>

        <div className="lc-divider" />

        <div className="lc-grid">
          {isVendor ? (
            <>
              <Chip label="Experience" val={lead.experience} />
              <Chip label="Commission" val={`${lead.commission}%`} accent />
            </>
          ) : (
            <>
              <Chip label="Age" val={`${lead.age} yrs`} />
              <Chip label="Experience" val={lead.experience} />
            </>
          )}
          <Chip label="Documents" val={`${docCount}/${docTotal}`} ok={docCount === docTotal} warn={docCount > 0 && docCount < docTotal} />
          {lead.lastContactDate && <Chip label="Last Contact" val={lead.lastContactDate} />}
        </div>

        {lead.notes && <div className="lc-note">💬 {lead.notes}</div>}

        <button className="lc-btn" onClick={() => onView(lead)}>View & Manage →</button>
      </div>
    </>
  );
}

function Chip({ label, val, accent, ok, warn }) {
  return (
    <div className="lc-chip-item">
      <span className="lc-chip-label">{label}</span>
      <span className={`lc-chip-val ${accent ? "lc-accent" : ok ? "lc-ok" : warn ? "lc-warn" : ""}`}>{val}</span>
    </div>
  );
}

const css = `
  .lc-card { background:#fff; border-radius:14px; border:1px solid #e2e8f0; padding:1rem 1.1rem; box-shadow:0 1px 4px rgba(15,23,42,0.04); }
  .lc-top { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
  .lc-avatar { width:36px; height:36px; border-radius:9px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.95rem; font-weight:800; font-family:'Sora',sans-serif; flex-shrink:0; }
  .lc-info { flex:1; min-width:0; }
  .lc-name { font-size:0.9rem; font-weight:700; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .lc-sub { font-size:0.71rem; color:#94a3b8; margin-top:1px; }
  .lc-meta-row { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:4px; }
  .lc-meta { font-size:0.74rem; color:#64748b; }
  .lc-divider { height:1px; background:#f1f5f9; margin:8px 0; }
  .lc-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:6px 12px; margin-bottom:8px; }
  .lc-chip-item { display:flex; flex-direction:column; gap:1px; }
  .lc-chip-label { font-size:0.62rem; color:#94a3b8; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; }
  .lc-chip-val { font-size:0.8rem; color:#334155; font-weight:600; }
  .lc-accent { color:#7c3aed; }
  .lc-ok   { color:#10b981; }
  .lc-warn { color:#f59e0b; }
  .lc-note { background:#f0f5ff; border-radius:8px; padding:0.4rem 0.7rem; font-size:0.74rem; color:#334155; margin-bottom:8px; }
  .lc-btn { width:100%; padding:0.6rem; background:#e8f0fe; color:#1a73e8; border:none; border-radius:9px; font-size:0.83rem; font-weight:700; font-family:inherit; cursor:pointer; transition:background 0.15s; }
  .lc-btn:hover { background:#d2e3fc; }
`;
