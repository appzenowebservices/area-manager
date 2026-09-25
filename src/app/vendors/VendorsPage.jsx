// src/pages/vendors/VendorsPage.jsx
import { useState, useMemo } from "react";
import PageWrapper       from "../../components/layout/PageWrapper";
import VendorFilters     from "../../components/vendors/VendorFilters";
import VendorsTable      from "../../components/vendors/VendorsTable";
import VendorCard        from "../../components/vendors/VendorCard";
import VendorDrawer      from "../../components/vendors/VendorDrawer";
import AddVendorModal    from "../../components/vendors/AddVendorModal";
import VendorStatusBadge from "../../components/vendors/VendorStatusBadge";
import { VENDORS }       from "../../data/vendorsData";

export default function VendorsPage() {
  const [vendors, setVendors]   = useState(VENDORS);
  const [search,  setSearch]    = useState("");
  const [status,  setStatus]    = useState("All");
  const [category,setCategory]  = useState("All");
  const [area,    setArea]       = useState("All");
  const [selected,setSelected]  = useState(null);
  const [showAdd, setShowAdd]   = useState(false);

  const filtered = useMemo(() => vendors.filter(v => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      v.name.toLowerCase().includes(q) ||
      v.ownerName.toLowerCase().includes(q) ||
      v.phone.includes(q) ||
      v.id.toLowerCase().includes(q);
    const matchStatus   = status   === "All" || v.status   === status;
    const matchCategory = category === "All" || v.category === category;
    const matchArea     = area     === "All" || v.area     === area;
    return matchSearch && matchStatus && matchCategory && matchArea;
  }), [search, status, category, area, vendors]);

  const handleReset = () => { setSearch(""); setStatus("All"); setCategory("All"); setArea("All"); };

  const handleUpdate = (updated) => {
    setVendors(prev => prev.map(v => v.id === updated.id ? updated : v));
    setSelected(updated);
  };

  const handleAdd = (newVendor) => {
    setVendors(prev => [newVendor, ...prev]);
    setShowAdd(false);
  };

  // Stats
  const total     = vendors.length;
  const active    = vendors.filter(v => v.status === "Active").length;
  const inactive  = vendors.filter(v => v.status === "Inactive").length;
  const pendingKyc= vendors.filter(v => v.status === "Pending KYC").length;
  const verified  = vendors.filter(v => v.kyc === "Verified").length;
  const totalRev  = vendors.filter(v => v.status === "Active")
    .reduce((s, v) => s + (parseInt(v.revenue.replace(/[^0-9]/g, "")) || 0), 0);

  return (
    <PageWrapper>
      <style>{css}</style>

      {/* Header */}
      <div className="vp-header">
        <div>
          <h1 className="vp-title">Vendors</h1>
          <p className="vp-sub">Manage your area's vendor network</p>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="vp-summary">
        {[
          { label: "Total Vendors", val: total,    color: "#1a73e8", bg: "#e8f0fe" },
          { label: "Active",        val: active,   color: "#10b981", bg: "#d1fae5" },
          { label: "Inactive",      val: inactive, color: "#ef4444", bg: "#fee2e2" },
          { label: "Pending KYC",   val: pendingKyc, color: "#f59e0b", bg: "#fef3c7" },
          { label: "KYC Verified",  val: verified, color: "#10b981", bg: "#d1fae5" },
          { label: "Est. Revenue",  val: `₹${(totalRev/1000).toFixed(0)}k`, color: "#7c3aed", bg: "#ede9fe" },
        ].map(s => (
          <div key={s.label} className="vp-sum-chip" style={{ background: s.bg }}>
            <span className="vp-sum-val" style={{ color: s.color }}>{s.val}</span>
            <span className="vp-sum-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <VendorFilters
        search={search}       onSearch={setSearch}
        status={status}       onStatus={setStatus}
        category={category}   onCategory={setCategory}
        area={area}           onArea={setArea}
        total={filtered.length}
        onReset={handleReset}
        onAdd={() => setShowAdd(true)}
      />

      {/* Desktop Table */}
      <div className="vp-desktop">
        <VendorsTable vendors={filtered} onView={setSelected} />
      </div>

      {/* Mobile Cards */}
      <div className="vp-mobile">
        {filtered.length === 0 ? (
          <div className="vp-empty">
            <span style={{ fontSize: "2.5rem" }}>🏪</span>
            <p>No vendors found</p>
          </div>
        ) : (
          <div className="vp-card-list">
            {filtered.map(v => (
              <VendorCard key={v.id} vendor={v} onView={setSelected} />
            ))}
          </div>
        )}
      </div>

      {/* Vendor Detail Drawer */}
      <VendorDrawer
        vendor={selected}
        onClose={() => setSelected(null)}
        onUpdate={handleUpdate}
      />

      {/* Add Vendor Modal */}
      {showAdd && (
        <AddVendorModal
          onConfirm={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
    </PageWrapper>
  );
}

const css = `
  .vp-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.25rem; flex-wrap:wrap; gap:10px; }
  .vp-title { font-family:'Sora',sans-serif; font-size:clamp(1.2rem,3vw,1.5rem); font-weight:800; color:#0f172a; letter-spacing:-0.02em; margin:0; }
  .vp-sub { font-size:0.82rem; color:#94a3b8; margin-top:3px; }
  .vp-summary { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:1.25rem; }
  .vp-sum-chip { display:flex; flex-direction:column; align-items:center; gap:2px; padding:0.55rem 1rem; border-radius:12px; min-width:80px; flex:1; }
  .vp-sum-val { font-family:'Sora',sans-serif; font-size:1.15rem; font-weight:800; line-height:1; }
  .vp-sum-label { font-size:0.68rem; color:#64748b; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; white-space:nowrap; }
  .vp-desktop { display:block; }
  .vp-mobile  { display:none; }
  .vp-card-list { display:flex; flex-direction:column; gap:10px; }
  .vp-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; padding:4rem 1rem; color:#94a3b8; font-size:0.88rem; }
  @media (max-width:768px) {
    .vp-desktop { display:none; }
    .vp-mobile  { display:block; }
    .vp-sum-chip { min-width:60px; padding:0.45rem 0.6rem; }
    .vp-sum-val  { font-size:0.95rem; }
  }
  @media (max-width:480px) {
    .vp-summary { gap:6px; }
    .vp-sum-chip { min-width:50px; }
  }
`;
