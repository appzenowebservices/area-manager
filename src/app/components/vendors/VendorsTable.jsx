// src/components/vendors/VendorsTable.jsx
import VendorStatusBadge from "./VendorStatusBadge";

const StarIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#e9c46a" stroke="#e9c46a" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const KycIcon = ({ verified }) => verified
  ? <span style={{ color: "#0c831f", fontSize: "0.7rem", fontWeight: 700 }}>✓</span>
  : <span style={{ color: "#e9c46a", fontSize: "0.7rem", fontWeight: 700 }}>⏳</span>;

/**
 * VendorsTable — Desktop table view
 * Props: vendors[], onView fn(vendor)
 */
export default function VendorsTable({ vendors, onView }) {
  return (
    <>
      <style>{css}</style>
      <div className="vt-wrap">
        <table className="vt-table">
          <thead>
            <tr>
              {["Vendor","Owner","Area","Category","Orders","Rating","Commission","KYC","Status","Action"].map(h => (
                <th key={h} className="vt-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vendors.length === 0 ? (
              <tr>
                <td colSpan={10} className="vt-empty">
                  <span style={{ fontSize: "2rem" }}>🏪</span>
                  <p>No vendors found for selected filters</p>
                </td>
              </tr>
            ) : vendors.map(v => (
              <tr key={v.id} className="vt-tr">
                <td className="vt-td">
                  <div className="vt-vendor-cell">
                    <div className="vt-avatar" style={{ background: avatarBg(v.category) }}>
                      {v.name.charAt(0)}
                    </div>
                    <div>
                      <div className="vt-name">{v.name}</div>
                      <div className="vt-id">{v.id}</div>
                    </div>
                  </div>
                </td>
                <td className="vt-td">
                  <div className="vt-owner">{v.ownerName}</div>
                  <div className="vt-phone">📞 {v.phone}</div>
                </td>
                <td className="vt-td"><span className="vt-area">📍 {v.area}</span></td>
                <td className="vt-td"><span className="vt-cat-badge">{v.category}</span></td>
                <td className="vt-td">
                  <div className="vt-orders-total">{v.totalOrders}</div>
                  <div className="vt-orders-week">+{v.ordersThisWeek} this week</div>
                </td>
                <td className="vt-td">
                  {v.rating > 0 ? (
                    <div className="vt-rating">
                      <StarIcon /> {v.rating.toFixed(1)}
                    </div>
                  ) : <span className="vt-no-rating">—</span>}
                </td>
                <td className="vt-td">
                  <span className="vt-commission">{v.commission}%</span>
                </td>
                <td className="vt-td">
                  <div className="vt-kyc-row">
                    <KycIcon verified={v.kyc === "Verified"} />
                    <span className={v.kyc === "Verified" ? "vt-kyc-ok" : "vt-kyc-pending"}>
                      {v.kyc}
                    </span>
                  </div>
                </td>
                <td className="vt-td"><VendorStatusBadge status={v.status} size="sm" /></td>
                <td className="vt-td">
                  <button className="vt-view-btn" onClick={() => onView(v)}>👁 View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

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

const css = `
  .vt-wrap { overflow-x:auto; border-radius:14px; border:1px solid #e9d8bf; }
  .vt-table { width:100%; border-collapse:collapse; font-size:0.83rem; min-width:1000px; }
  .vt-th { text-align:left; padding:0.65rem 0.9rem; background:#fdfbf7; color:#a68b66; font-size:0.69rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1px solid #e9d8bf; white-space:nowrap; }
  .vt-th:first-child { border-radius:14px 0 0 0; }
  .vt-th:last-child  { border-radius:0 14px 0 0; }
  .vt-tr { transition:background 0.12s; }
  .vt-tr:hover .vt-td { background:#fdfbf7; }
  .vt-td { padding:0.75rem 0.9rem; border-bottom:1px solid #f5ebe0; vertical-align:middle; white-space:nowrap; background:#fff; transition:background 0.12s; }
  .vt-tr:last-child .vt-td { border-bottom:none; }
  .vt-vendor-cell { display:flex; align-items:center; gap:10px; }
  .vt-avatar { width:34px; height:34px; border-radius:9px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:0.9rem; font-weight:800; font-family:'Sora',sans-serif; flex-shrink:0; }
  .vt-name { font-weight:700; color:#2d241e; font-size:0.84rem; }
  .vt-id { font-size:0.7rem; color:#a68b66; margin-top:1px; }
  .vt-owner { font-weight:600; color:#4a3f35; font-size:0.82rem; }
  .vt-phone { font-size:0.72rem; color:#a68b66; margin-top:2px; }
  .vt-area { font-size:0.78rem; color:#7d6b5d; }
  .vt-cat-badge { background:#fdfbf7; color:#ae2012; padding:2px 9px; border-radius:99px; font-size:0.72rem; font-weight:700; }
  .vt-orders-total { font-weight:800; color:#2d241e; font-size:0.9rem; font-family:'Sora',sans-serif; }
  .vt-orders-week { font-size:0.68rem; color:#0c831f; font-weight:600; margin-top:1px; }
  .vt-rating { display:inline-flex; align-items:center; gap:4px; font-weight:700; color:#2d241e; font-size:0.84rem; }
  .vt-no-rating { color:#a68b66; font-size:0.84rem; }
  .vt-commission { background:#f5ebe0; color:#4a5d23; padding:2px 9px; border-radius:99px; font-size:0.75rem; font-weight:700; }
  .vt-kyc-row { display:flex; align-items:center; gap:5px; }
  .vt-kyc-ok { font-size:0.75rem; color:#0c831f; font-weight:600; }
  .vt-kyc-pending { font-size:0.75rem; color:#e9c46a; font-weight:600; }
  .vt-view-btn { display:inline-flex; align-items:center; gap:5px; padding:0.35rem 0.85rem; background:#fdfbf7; color:#ae2012; border:none; border-radius:8px; font-size:0.78rem; font-weight:700; cursor:pointer; font-family:inherit; transition:background 0.15s; white-space:nowrap; }
  .vt-view-btn:hover { background:#f5ebe0; }
  .vt-empty { text-align:center; padding:3rem 1rem; color:#a68b66; }
  .vt-empty p { margin-top:8px; font-size:0.88rem; }
`;
