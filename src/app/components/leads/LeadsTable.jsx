// src/components/leads/LeadsTable.jsx
import LeadStageBadge from "./LeadStageBadge";

/**
 * LeadsTable — Desktop table for vendor or delivery leads
 * Props: leads[], onView fn(lead), type "vendor"|"delivery"
 */
export default function LeadsTable({ leads, onView, type }) {
  const isVendor = type === "vendor";

  return (
    <>
      <style>{css}</style>
      <div className="lt-wrap">
        <table className="lt-table">
          <thead>
            <tr>
              {isVendor
                ? ["Applicant","Phone","Area","Category","Experience","Commission","Documents","Stage","Applied","Action"].map(h => <th key={h} className="lt-th">{h}</th>)
                : ["Applicant","Phone","Area","Vehicle","Age","Experience","Documents","Stage","Applied","Action"].map(h => <th key={h} className="lt-th">{h}</th>)
              }
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr><td colSpan={10} className="lt-empty"><span style={{ fontSize:"2rem" }}>📋</span><p>No leads found</p></td></tr>
            ) : leads.map(lead => {
              const docCount = Object.values(lead.documents).filter(Boolean).length;
              const docTotal = Object.keys(lead.documents).length;
              return (
                <tr key={lead.id} className="lt-tr">
                  <td className="lt-td">
                    <div className="lt-applicant">
                      <div className="lt-avatar" style={{ background: isVendor ? "linear-gradient(135deg,#1a73e8,#0d47a1)" : "linear-gradient(135deg,#10b981,#065f46)" }}>
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <div className="lt-name">{lead.name}</div>
                        <div className="lt-id">{lead.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="lt-td"><span className="lt-phone">📞 {lead.phone}</span></td>
                  <td className="lt-td"><span className="lt-area">📍 {lead.area}</span></td>
                  <td className="lt-td">
                    {isVendor
                      ? <span className="lt-cat">{lead.category}</span>
                      : <span className="lt-cat">{lead.vehicle}</span>}
                  </td>
                  <td className="lt-td">
                    {isVendor
                      ? <span className="lt-exp">{lead.experience}</span>
                      : <span className="lt-exp">{lead.age} yrs</span>}
                  </td>
                  <td className="lt-td">
                    {isVendor
                      ? <span className="lt-commission">{lead.commission}%</span>
                      : <span className="lt-exp">{lead.experience}</span>}
                  </td>
                  <td className="lt-td">
                    <div className="lt-docs">
                      <span className={`lt-doc-count ${docCount === docTotal ? "lt-doc-full" : docCount > 0 ? "lt-doc-partial" : "lt-doc-none"}`}>
                        {docCount}/{docTotal}
                      </span>
                      <div className="lt-doc-dots">
                        {Object.values(lead.documents).map((ok, i) => (
                          <span key={i} className={`lt-doc-dot ${ok ? "lt-doc-dot-ok" : "lt-doc-dot-no"}`} />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="lt-td"><LeadStageBadge stage={lead.stage} size="sm" /></td>
                  <td className="lt-td"><span className="lt-date">{lead.appliedDate}</span></td>
                  <td className="lt-td">
                    <button className="lt-view-btn" onClick={() => onView(lead)}>👁 View</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

const css = `
  .lt-wrap { overflow-x:auto; border-radius:14px; border:1px solid #e2e8f0; }
  .lt-table { width:100%; border-collapse:collapse; font-size:0.83rem; min-width:960px; }
  .lt-th { text-align:left; padding:0.65rem 0.9rem; background:#f8faff; color:#94a3b8; font-size:0.69rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1px solid #e2e8f0; white-space:nowrap; }
  .lt-th:first-child { border-radius:14px 0 0 0; }
  .lt-th:last-child  { border-radius:0 14px 0 0; }
  .lt-tr:hover .lt-td { background:#f8faff; }
  .lt-td { padding:0.75rem 0.9rem; border-bottom:1px solid #f1f5f9; vertical-align:middle; white-space:nowrap; background:#fff; transition:background 0.12s; }
  .lt-tr:last-child .lt-td { border-bottom:none; }
  .lt-applicant { display:flex; align-items:center; gap:10px; }
  .lt-avatar { width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.85rem; font-weight:800; font-family:'Sora',sans-serif; flex-shrink:0; }
  .lt-name { font-weight:700; color:#0f172a; font-size:0.83rem; }
  .lt-id { font-size:0.68rem; color:#94a3b8; }
  .lt-phone { font-size:0.78rem; color:#64748b; }
  .lt-area { font-size:0.78rem; color:#64748b; }
  .lt-cat { background:#f0f5ff; color:#1a73e8; padding:2px 8px; border-radius:99px; font-size:0.72rem; font-weight:700; }
  .lt-exp { font-size:0.8rem; color:#334155; font-weight:500; }
  .lt-commission { background:#ede9fe; color:#7c3aed; padding:2px 8px; border-radius:99px; font-size:0.74rem; font-weight:700; }
  .lt-date { font-size:0.76rem; color:#94a3b8; }
  .lt-docs { display:flex; flex-direction:column; gap:3px; align-items:center; }
  .lt-doc-count { font-size:0.72rem; font-weight:700; }
  .lt-doc-full    { color:#10b981; }
  .lt-doc-partial { color:#f59e0b; }
  .lt-doc-none    { color:#ef4444; }
  .lt-doc-dots { display:flex; gap:3px; }
  .lt-doc-dot { width:7px; height:7px; border-radius:50%; }
  .lt-doc-dot-ok { background:#10b981; }
  .lt-doc-dot-no { background:#e2e8f0; }
  .lt-view-btn { display:inline-flex; align-items:center; gap:5px; padding:0.35rem 0.85rem; background:#e8f0fe; color:#1a73e8; border:none; border-radius:8px; font-size:0.78rem; font-weight:700; cursor:pointer; font-family:inherit; transition:background 0.15s; }
  .lt-view-btn:hover { background:#d2e3fc; }
  .lt-empty { text-align:center; padding:3rem 1rem; color:#94a3b8; }
  .lt-empty p { margin-top:8px; font-size:0.88rem; }
`;
