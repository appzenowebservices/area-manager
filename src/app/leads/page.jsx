// src/pages/leads/DeliveryLeadsPage.jsx

'use client';
import { useState, useMemo } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import LeadsTable from "../components/leads/LeadsTable";
import LeadCard from "../components/leads/LeadCard";
import LeadDrawer from "../components/leads/LeadDrawer";
import LeadStageBadge from "../components/leads/LeadStageBadge";
import { DELIVERY_LEADS, LEAD_STAGES } from "../data/leadsData";

export default function DeliveryLeadsPage() {
  const [leads, setLeads] = useState(DELIVERY_LEADS);
  const [selected, setSelected] = useState(null);
  const [stage, setStage] = useState("All");
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("All");

  const areas = useMemo(() => ["All", ...new Set(leads.map(l => l.area))], [leads]);

  const filtered = useMemo(() => leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !search || l.name.toLowerCase().includes(q) || l.phone.includes(q);
    const matchStage = stage === "All" || l.stage === stage;
    const matchArea = area === "All" || l.area === area;
    return matchSearch && matchStage && matchArea;
  }), [leads, search, stage, area]);

  const handleUpdate = (updated) => {
    setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
    setSelected(updated);
  };

  const handleApprove = (lead) => {
    // Auto-add to delivery boys list
    console.log("✅ Added to delivery team:", lead.name);
    // In real app: POST /api/delivery-partners with lead data
  };

  const counts = useMemo(() => {
    const c = {};
    LEAD_STAGES.forEach(s => { c[s] = s === "All" ? leads.length : leads.filter(l => l.stage === s).length; });
    return c;
  }, [leads]);

  return (
    <PageWrapper>
      <style>{css}</style>

      {/* Header */}
      <div className="dlp-header">
        <div>
          <h1 className="dlp-title">Delivery Partner Leads</h1>
          <p className="dlp-sub">Delivery partner applications from public registration form</p>
        </div>
        <a className="dlp-form-link" href="/register/delivery" target="_blank" rel="noopener noreferrer">
          🔗 Public Registration Form ↗
        </a>
      </div>

      {/* Stage Summary Cards */}
      <div className="dlp-stage-cards">
        {LEAD_STAGES.filter(s => s !== "All").map(s => (
          <div key={s} className={`dlp-stage-card${stage === s ? " dlp-stage-selected" : ""}`} onClick={() => setStage(stage === s ? "All" : s)}>
            <div className="dlp-sc-count">{counts[s]}</div>
            <LeadStageBadge stage={s} size="sm" />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="dlp-filters">
        <div className="dlp-search-wrap">
          <span className="dlp-si">🔍</span>
          <input className="dlp-search" placeholder="Search name, phone..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="dlp-clear" onClick={() => setSearch("")}>✕</button>}
        </div>

        <select className="dlp-select" value={stage} onChange={e => setStage(e.target.value)}>
          {LEAD_STAGES.map(s => <option key={s} value={s}>{s === "All" ? "All Stages" : s} {s !== "All" ? `(${counts[s]})` : ""}</option>)}
        </select>

        <select className="dlp-select" value={area} onChange={e => setArea(e.target.value)}>
          {areas.map(a => <option key={a} value={a}>{a === "All" ? "All Areas" : a}</option>)}
        </select>

        <span className="dlp-count">Showing <strong>{filtered.length}</strong> lead{filtered.length !== 1 ? "s" : ""}</span>
        {(search || stage !== "All" || area !== "All") && (
          <button className="dlp-reset" onClick={() => { setSearch(""); setStage("All"); setArea("All"); }}>✕ Clear</button>
        )}
      </div>

      {/* Desktop Table */}
      <div className="dlp-desktop">
        <LeadsTable leads={filtered} onView={setSelected} type="delivery" />
      </div>

      {/* Mobile Cards */}
      <div className="dlp-mobile">
        {filtered.length === 0
          ? <div className="dlp-empty"><span style={{ fontSize: "2.5rem" }}>📋</span><p>No leads found</p></div>
          : <div className="dlp-card-list">{filtered.map(l => <LeadCard key={l.id} lead={l} onView={setSelected} />)}</div>
        }
      </div>

      <LeadDrawer
        lead={selected}
        onClose={() => setSelected(null)}
        onUpdate={handleUpdate}
        onApprove={handleApprove}
      />
    </PageWrapper>
  );
}

const css = `
  .dlp-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; flex-wrap:wrap; gap:10px; }
  .dlp-title { font-family:'Sora',sans-serif; font-size:clamp(1.2rem,3vw,1.5rem); font-weight:800; color:#0f172a; letter-spacing:-0.02em; margin:0; }
  .dlp-sub { font-size:0.82rem; color:#94a3b8; margin-top:3px; }
  .dlp-form-link { display:inline-flex; align-items:center; gap:5px; padding:0.5rem 1rem; background:#d1fae5; color:#065f46; border-radius:10px; font-size:0.82rem; font-weight:700; text-decoration:none; white-space:nowrap; transition:background 0.15s; }
  .dlp-form-link:hover { background:#a7f3d0; }
  .dlp-stage-cards { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:1.1rem; }
  .dlp-stage-card { background:#fff; border:1.5px solid #e2e8f0; border-radius:12px; padding:0.75rem 1rem; display:flex; flex-direction:column; gap:6px; cursor:pointer; transition:all 0.15s; flex:1; min-width:80px; align-items:center; }
  .dlp-stage-card:hover { border-color:#bfdbfe; background:#f8faff; }
  .dlp-stage-selected { border-color:#10b981; background:#d1fae5; }
  .dlp-sc-count { font-family:'Sora',sans-serif; font-size:1.4rem; font-weight:800; color:#0f172a; line-height:1; }
  .dlp-filters { display:flex; gap:8px; flex-wrap:wrap; align-items:center; background:#fff; border:1px solid #e2e8f0; border-radius:14px; padding:0.85rem 1.1rem; margin-bottom:1.1rem; }
  .dlp-search-wrap { display:flex; align-items:center; flex:1; min-width:180px; background:#f8faff; border:1.5px solid #e2e8f0; border-radius:10px; padding:0 0.75rem; transition:border-color 0.2s; }
  .dlp-search-wrap:focus-within { border-color:#10b981; }
  .dlp-si { color:#94a3b8; font-size:0.85rem; }
  .dlp-search { flex:1; height:38px; border:none; outline:none; background:transparent; font-size:0.84rem; color:#0f172a; font-family:inherit; padding:0 8px; }
  .dlp-clear { background:none; border:none; color:#94a3b8; cursor:pointer; }
  .dlp-select { height:40px; padding:0 0.75rem; border:1.5px solid #e2e8f0; border-radius:10px; background:#f8faff; font-size:0.84rem; color:#334155; font-family:inherit; outline:none; cursor:pointer; }
  .dlp-select:focus { border-color:#10b981; }
  .dlp-count { font-size:0.8rem; color:#64748b; white-space:nowrap; }
  .dlp-count strong { color:#10b981; }
  .dlp-reset { background:none; border:none; color:#ef4444; font-size:0.78rem; font-weight:600; cursor:pointer; font-family:inherit; }
  .dlp-desktop { display:block; }
  .dlp-mobile  { display:none; }
  .dlp-card-list { display:flex; flex-direction:column; gap:10px; }
  .dlp-empty { display:flex; flex-direction:column; align-items:center; gap:10px; padding:4rem 1rem; color:#94a3b8; font-size:0.88rem; }
  @media (max-width:768px) { .dlp-desktop { display:none; } .dlp-mobile { display:block; } }
  @media (max-width:480px) { .dlp-stage-cards { gap:6px; } .dlp-sc-count { font-size:1.1rem; } }
`;
