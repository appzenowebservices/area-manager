import { useState } from "react";
import { SettingsCard, FormField, SaveBar, inputCss } from "./SettingsUI";
import { ORDERS }            from "../../data/ordersData";
import { DELIVERY_PARTNERS } from "../../data/deliveryData";

/**
 * AreaInfoSection
 * File: src/components/settings/AreaInfoSection.jsx
 */

function ProgressRow({ label, current, target, color }) {
  const pct = Math.min(100, Math.round((current / Math.max(target, 1)) * 100));
  return (
    <div className="ai-prog-wrap">
      <div className="ai-prog-top">
        <span className="ai-prog-label">{label}</span>
        <span className="ai-prog-vals" style={{ color }}>
          {current} / {target} <span className="ai-prog-pct">({pct}%)</span>
        </span>
      </div>
      <div className="ai-prog-track">
        <div className="ai-prog-fill" style={{ width:`${pct}%`, background:color }} />
      </div>
    </div>
  );
}

export default function AreaInfoSection() {
  const [targets, setTargets] = useState({
    weeklyOrders: 50, monthlyRevenue: 25000, newVendors: 10, newPartners: 5,
  });
  const [loading, setLoading] = useState(false);
  const [saved,   setSaved]   = useState(false);

  const delivered  = ORDERS.filter(o => o.status === "Delivered").length;
  const revenue    = ORDERS.filter(o => o.status !== "Cancelled").reduce((s,o) => s + o.finalAmount, 0);
  const vendors    = [...new Set(ORDERS.filter(o => o.vendor.id).map(o => o.vendor.id))].length;
  const areas      = [...new Set(ORDERS.map(o => o.area))];
  const available  = DELIVERY_PARTNERS.filter(p => p.status === "Available").length;

  const STATS = [
    { label:"Orders Delivered",  val:delivered,                                    color:"#1a73e8", bg:"#e8f0fe" },
    { label:"Revenue Generated", val:`₹${revenue.toLocaleString("en-IN")}`,        color:"#10b981", bg:"#d1fae5" },
    { label:"Active Vendors",    val:vendors,                                        color:"#7c3aed", bg:"#ede9fe" },
    { label:"Partners Available",val:`${available}/${DELIVERY_PARTNERS.length}`,    color:"#f59e0b", bg:"#fef3c7" },
  ];

  const handleSave = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <style>{inputCss}{css}</style>

      {/* Live stats */}
      <SettingsCard title="Live Area Overview" subtitle="Real-time data from your area">
        <div className="ai-stat-grid">
          {STATS.map(s => (
            <div key={s.label} className="ai-stat" style={{ background: s.bg }}>
              <span className="ai-stat-val" style={{ color: s.color }}>{s.val}</span>
              <span className="ai-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </SettingsCard>

      {/* Coverage areas */}
      <SettingsCard title="Coverage Areas" subtitle={`${areas.length} active areas under your management`}>
        <div className="ai-areas">
          {areas.map(a => <span key={a} className="ai-area-chip">📍 {a}</span>)}
        </div>
      </SettingsCard>

      {/* Targets */}
      <SettingsCard title="Weekly & Monthly Targets" subtitle="Set and track your performance goals">
        <div className="ai-targets-grid">
          <FormField label="Weekly Orders Target">
            <input className="si-input" type="number" min={1}
              value={targets.weeklyOrders}
              onChange={e => setTargets(t => ({...t, weeklyOrders: +e.target.value}))} />
          </FormField>
          <FormField label="Monthly Revenue Target (₹)">
            <input className="si-input" type="number" min={1}
              value={targets.monthlyRevenue}
              onChange={e => setTargets(t => ({...t, monthlyRevenue: +e.target.value}))} />
          </FormField>
          <FormField label="New Vendors Target">
            <input className="si-input" type="number" min={1}
              value={targets.newVendors}
              onChange={e => setTargets(t => ({...t, newVendors: +e.target.value}))} />
          </FormField>
          <FormField label="New Delivery Partners Target">
            <input className="si-input" type="number" min={1}
              value={targets.newPartners}
              onChange={e => setTargets(t => ({...t, newPartners: +e.target.value}))} />
          </FormField>
        </div>

        <div className="ai-progress-section">
          <ProgressRow label="Orders Delivered" current={delivered} target={targets.weeklyOrders}   color="#1a73e8" />
          <ProgressRow label="Revenue"          current={revenue}   target={targets.monthlyRevenue}  color="#10b981" />
          <ProgressRow label="Vendors Onboarded"current={vendors}   target={targets.newVendors}      color="#7c3aed" />
          <ProgressRow label="Partners Recruited"current={DELIVERY_PARTNERS.length} target={targets.newPartners} color="#f59e0b" />
        </div>

        <SaveBar loading={loading} saved={saved} savedMsg="Targets saved!" onSave={handleSave} />
      </SettingsCard>
    </>
  );
}

const css = `
  .ai-stat-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:10px; }
  .ai-stat {
    display:flex; flex-direction:column; align-items:center; gap:3px;
    padding:0.8rem 0.25rem; border-radius:12px;
  }
  .ai-stat-val { font-family:'Sora',sans-serif; font-size:1.05rem; font-weight:800; line-height:1; }
  .ai-stat-label { font-size:0.62rem; color:#64748b; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; text-align:center; }

  .ai-areas { display:flex; flex-wrap:wrap; gap:7px; }
  .ai-area-chip { padding:0.3rem 0.75rem; background:#e8f0fe; color:#1a73e8; border-radius:99px; font-size:0.78rem; font-weight:600; }

  .ai-targets-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:0.9rem; }
  .ai-progress-section { display:flex; flex-direction:column; gap:12px; }

  .ai-prog-wrap { display:flex; flex-direction:column; gap:5px; }
  .ai-prog-top { display:flex; justify-content:space-between; align-items:center; }
  .ai-prog-label { font-size:0.8rem; font-weight:600; color:#334155; }
  .ai-prog-vals  { font-size:0.78rem; font-weight:700; }
  .ai-prog-pct   { font-weight:500; color:#94a3b8; }
  .ai-prog-track { height:6px; background:#f1f5f9; border-radius:99px; overflow:hidden; }
  .ai-prog-fill  { height:100%; border-radius:99px; transition:width 0.4s ease; }

  @media (max-width:560px) {
    .ai-stat-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
    .ai-targets-grid { grid-template-columns:minmax(0,1fr); }
  }
`;
