// src/components/vendors/VendorCard.jsx
import VendorStatusBadge from "./VendorStatusBadge";

const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#e9c46a" stroke="#e9c46a" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

function avatarBg(category) {
  const m = {
    "Grocery": "linear-gradient(135deg,#ae2012,#2d241e)",
    "Dairy": "linear-gradient(135deg,#2196f3,#2196f3)",
    "Bakery": "linear-gradient(135deg,#e9c46a,#a67a22)",
    "Meat & Fish": "linear-gradient(135deg,#d32f2f,#8b150e)",
    "Fruits & Vegetables": "linear-gradient(135deg,#0c831f,#0a671a)",
    "Pharmacy": "linear-gradient(135deg,#4a5d23,#4a5d23)",
    "General Store": "linear-gradient(135deg,#7d6b5d,#4a3f35)",
  };
  return m[category] || "linear-gradient(135deg,#a68b66,#7d6b5d)";
}

/**
 * VendorCard — Mobile card for a single vendor
 * Props: vendor, onView fn(vendor)
 */
export default function VendorCard({ vendor: v, onView }) {
  return (
    <>
      <style>{css}</style>
      <div className="vc-card">
        <div className="vc-top">
          <div className="vc-avatar-wrap">
            <div className="vc-avatar" style={{ background: avatarBg(v.category) }}>
              {v.name.charAt(0)}
            </div>
          </div>
          <div className="vc-header-info">
            <div className="vc-name">{v.name}</div>
            <div className="vc-owner">👤 {v.ownerName} &nbsp;·&nbsp; {v.id}</div>
          </div>
          <VendorStatusBadge status={v.status} size="sm" />
        </div>

        <div className="vc-meta-row">
          <span className="vc-meta">📞 {v.phone}</span>
          <span className="vc-meta">📍 {v.area}</span>
          <span className="vc-cat">{v.category}</span>
        </div>

        <div className="vc-divider" />

        <div className="vc-grid">
          <div className="vc-item">
            <span className="vc-label">Orders</span>
            <span className="vc-val">{v.totalOrders}</span>
          </div>
          <div className="vc-item">
            <span className="vc-label">Rating</span>
            <span className="vc-val">
              {v.rating > 0 ? <><StarIcon /> {v.rating.toFixed(1)}</> : "—"}
            </span>
          </div>
          <div className="vc-item">
            <span className="vc-label">Commission</span>
            <span className="vc-val vc-commission">{v.commission}%</span>
          </div>
          <div className="vc-item">
            <span className="vc-label">Revenue</span>
            <span className="vc-val vc-revenue">{v.revenue}</span>
          </div>
          <div className="vc-item">
            <span className="vc-label">KYC</span>
            <span className={`vc-val ${v.kyc === "Verified" ? "vc-kyc-ok" : "vc-kyc-pending"}`}>
              {v.kyc === "Verified" ? "✓ Verified" : "⏳ Pending"}
            </span>
          </div>
          <div className="vc-item">
            <span className="vc-label">This Week</span>
            <span className="vc-val vc-week">+{v.ordersThisWeek}</span>
          </div>
        </div>

        <button className="vc-btn" onClick={() => onView(v)}>View Full Details →</button>
      </div>
    </>
  );
}

const css = `
  .vc-card { background:#fff; border-radius:14px; border:1px solid #e9d8bf; padding:1rem 1.1rem; box-shadow:0 1px 4px rgba(45, 36, 30,0.04); transition:box-shadow 0.18s; }
  .vc-card:hover { box-shadow:0 4px 16px rgba(45, 36, 30,0.08); }
  .vc-top { display:flex; align-items:center; gap:10px; margin-bottom:8px; }
  .vc-avatar { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:1rem; font-weight:800; font-family:'Sora',sans-serif; flex-shrink:0; }
  .vc-header-info { flex:1; min-width:0; }
  .vc-name { font-size:0.92rem; font-weight:700; color:#2d241e; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .vc-owner { font-size:0.72rem; color:#a68b66; margin-top:2px; }
  .vc-meta-row { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:4px; }
  .vc-meta { font-size:0.75rem; color:#7d6b5d; }
  .vc-cat { background:#fdfbf7; color:#ae2012; padding:1px 8px; border-radius:99px; font-size:0.7rem; font-weight:700; }
  .vc-divider { height:1px; background:#f5ebe0; margin:10px 0; }
  .vc-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px 12px; margin-bottom:10px; }
  .vc-item { display:flex; flex-direction:column; gap:2px; }
  .vc-label { font-size:0.62rem; color:#a68b66; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; }
  .vc-val { font-size:0.82rem; color:#4a3f35; font-weight:600; display:inline-flex; align-items:center; gap:3px; }
  .vc-commission { color:#4a5d23; }
  .vc-revenue { color:#2d241e; font-weight:800; font-family:'Sora',sans-serif; }
  .vc-kyc-ok { color:#0c831f; }
  .vc-kyc-pending { color:#e9c46a; }
  .vc-week { color:#0c831f; }
  .vc-btn { width:100%; padding:0.6rem; background:#fdfbf7; color:#ae2012; border:none; border-radius:9px; font-size:0.83rem; font-weight:700; font-family:inherit; cursor:pointer; transition:background 0.15s; }
  .vc-btn:hover { background:#f5ebe0; }
`;
