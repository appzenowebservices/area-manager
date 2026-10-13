// src/pages/leads/VendorLeadsPage.jsx
import { useState, useMemo } from "react";
import PageWrapper    from "../../components/layout/PageWrapper";
import LeadsTable     from "../../components/leads/LeadsTable";
import LeadCard       from "../../components/leads/LeadCard";
import LeadDrawer     from "../../components/leads/LeadDrawer";
import LeadStageBadge from "../../components/leads/LeadStageBadge";
import { VENDOR_LEADS, LEAD_STAGES } from "../../data/leadsData";

// When approved → add to vendorsData (in real app: API call)
// Here we use a simple in-memory store simulation
import { VENDORS } from "../../data/vendorsData";

export default function VendorLeadsPage() {
  const [leads,    setLeads]    = useState(VENDOR_LEADS);
  const [selected, setSelected] = useState(null);
  const [stage,    setStage]    = useState("All");
  const [search,   setSearch]   = useState("");
  const [area,     setArea]     = useState("All");

  const areas = useMemo(() => ["All", ...new Set(leads.map(l => l.area))], [leads]);

  const filtered = useMemo(() => leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !search || l.name.toLowerCase().includes(q) || l.phone.includes(q) || l.ownerName?.toLowerCase().includes(q);
    const matchStage  = stage === "All" || l.stage === stage;
    const matchArea   = area  === "All" || l.area  === area;
    return matchSearch && matchStage && matchArea;
  }), [leads, search, stage, area]);

  const handleUpdate = (updated) => {
    setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
    setSelected(updated);
  };

  const handleApprove = (lead) => {
    // Auto-add to vendors list (simulate)
    const newVendor = {
      id: `V-${String(VENDORS.length + 1).padStart(3, "0")}`,
      name: lead.name,
      ownerName: lead.ownerName,
      phone: lead.phone,
      altPhone: lead.altPhone || "",
      email: lead.email || "",
      area: lead.area,
      address: lead.address,
      category: lead.category,
      status: "Active",
      rating: 0,
      totalOrders: 0,
      ordersThisWeek: 0,
      commission: lead.commission,
      joinDate: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      kyc: "Pending",
      documents: lead.documents,
      revenue: "₹0",
      avgDeliveryTime: "—",
      notes: `Onboarded via lead ${lead.id}`,
    };
    VENDORS.unshift(newVendor); // add to top
  };

  // Stage counts
  const counts = useMemo(() => {
    const c = {};
    LEAD_STAGES.forEach(s => { c[s] = s === "All" ? leads.length : leads.filter(l => l.stage === s).length; });
    return c;
  }, [leads]);

  return (
    <PageWrapper>
      <style>{css}</style>

      {/* Header */}
      <div className="vlp-header">
        <div>
          <h1 className="vlp-title">Vendor Leads</h1>
          <p className="vlp-sub">Vendor registration applications from public form</p>
        </div>
        <a className="vlp-form-link" href="/register/vendor" target="_blank" rel="noopener noreferrer">
          🔗 Public Registration Form ↗
        </a>
      </div>

      {/* Stage Summary Cards */}
      <div className="vlp-stage-cards">
        {LEAD_STAGES.filter(s => s !== "All").map(s => (
          <div key={s} className={`vlp-stage-card${stage === s ? " vlp-stage-selected" : ""}`} onClick={() => setStage(stage === s ? "All" : s)}>
            <div className="vlp-sc-count">{counts[s]}</div>
            <LeadStageBadge stage={s} size="sm" />
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="vlp-filters">
        <div className="vlp-search-wrap">
          <span className="vlp-si">🔍</span>
          <input className="vlp-search" placeholder="Search name, phone..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button className="vlp-clear" onClick={() => setSearch("")}>✕</button>}
        </div>

        <select className="vlp-select" value={stage} onChange={e => setStage(e.target.value)}>
          {LEAD_STAGES.map(s => <option key={s} value={s}>{s === "All" ? "All Stages" : s} {s !== "All" ? `(${counts[s]})` : ""}</option>)}
        </select>

        <select className="vlp-select" value={area} onChange={e => setArea(e.target.value)}>
          {areas.map(a => <option key={a} value={a}>{a === "All" ? "All Areas" : a}</option>)}
        </select>

        <span className="vlp-count">
          Showing <strong>{filtered.length}</strong> lead{filtered.length !== 1 ? "s" : ""}
        </span>

        {(search || stage !== "All" || area !== "All") && (
          <button className="vlp-reset" onClick={() => { setSearch(""); setStage("All"); setArea("All"); }}>✕ Clear</button>
        )}
      </div>

      {/* Desktop Table */}
      <div className="vlp-desktop">
        <LeadsTable leads={filtered} onView={setSelected} type="vendor" />
      </div>

      {/* Mobile Cards */}
      <div className="vlp-mobile">
        {filtered.length === 0
          ? <div className="vlp-empty"><span style={{ fontSize:"2.5rem" }}>📋</span><p>No leads found</p></div>
          : <div className="vlp-card-list">{filtered.map(l => <LeadCard key={l.id} lead={l} onView={setSelected} />)}</div>
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
  .vlp-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; flex-wrap:wrap; gap:10px; }
  .vlp-title { font-family:'Sora',sans-serif; font-size:clamp(1.2rem,3vw,1.5rem); font-weight:800; color:#2d241e; letter-spacing:-0.02em; margin:0; }
  .vlp-sub { font-size:0.82rem; color:#a68b66; margin-top:3px; }
  .vlp-form-link { display:inline-flex; align-items:center; gap:5px; padding:0.5rem 1rem; background:#fdfbf7; color:#ae2012; border-radius:10px; font-size:0.82rem; font-weight:700; text-decoration:none; white-space:nowrap; transition:background 0.15s; }
  .vlp-form-link:hover { background:#f5ebe0; }

  /* Stage summary */
  .vlp-stage-cards { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:1.1rem; }
  .vlp-stage-card { background:#fff; border:1.5px solid #e9d8bf; border-radius:12px; padding:0.75rem 1rem; display:flex; flex-direction:column; gap:6px; cursor:pointer; transition:all 0.15s; flex:1; min-width:80px; align-items:center; }
  .vlp-stage-card:hover { border-color:#e9d8bf; background:#fdfbf7; }
  .vlp-stage-selected { border-color:#ae2012; background:#fdfbf7; }
  .vlp-sc-count { font-family:'Sora',sans-serif; font-size:1.4rem; font-weight:800; color:#2d241e; line-height:1; }

  /* Filters */
  .vlp-filters { display:flex; gap:8px; flex-wrap:wrap; align-items:center; background:#fff; border:1px solid #e9d8bf; border-radius:14px; padding:0.85rem 1.1rem; margin-bottom:1.1rem; }
  .vlp-search-wrap { display:flex; align-items:center; flex:1; min-width:180px; background:#fdfbf7; border:1.5px solid #e9d8bf; border-radius:10px; padding:0 0.75rem; transition:border-color 0.2s; }
  .vlp-search-wrap:focus-within { border-color:#ae2012; }
  .vlp-si { color:#a68b66; font-size:0.85rem; }
  .vlp-search { flex:1; height:38px; border:none; outline:none; background:transparent; font-size:0.84rem; color:#2d241e; font-family:inherit; padding:0 8px; }
  .vlp-clear { background:none; border:none; color:#a68b66; cursor:pointer; }
  .vlp-select { height:40px; padding:0 0.75rem; border:1.5px solid #e9d8bf; border-radius:10px; background:#fdfbf7; font-size:0.84rem; color:#4a3f35; font-family:inherit; outline:none; cursor:pointer; }
  .vlp-select:focus { border-color:#ae2012; }
  .vlp-count { font-size:0.8rem; color:#7d6b5d; white-space:nowrap; }
  .vlp-count strong { color:#ae2012; }
  .vlp-reset { background:none; border:none; color:#d32f2f; font-size:0.78rem; font-weight:600; cursor:pointer; font-family:inherit; }

  .vlp-desktop { display:block; }
  .vlp-mobile  { display:none; }
  .vlp-card-list { display:flex; flex-direction:column; gap:10px; }
  .vlp-empty { display:flex; flex-direction:column; align-items:center; gap:10px; padding:4rem 1rem; color:#a68b66; font-size:0.88rem; }

  @media (max-width:768px) { .vlp-desktop { display:none; } .vlp-mobile { display:block; } }
  @media (max-width:480px) { .vlp-stage-cards { gap:6px; } .vlp-sc-count { font-size:1.1rem; } }
`;
