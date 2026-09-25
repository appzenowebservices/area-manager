// src/components/vendors/VendorDrawer.jsx
import { useState, useEffect, useRef } from "react";
import VendorStatusBadge from "./VendorStatusBadge";

/**
 * VendorDrawer — Slide-in panel showing full vendor detail
 * Props: vendor object|null, onClose fn, onUpdate fn(updatedVendor)
 */
export default function VendorDrawer({ vendor: initialVendor, onClose, onUpdate }) {
  const [vendor,  setVendor]  = useState(null);
  const [visible, setVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const bodyRef = useRef(null);

  useEffect(() => {
    if (initialVendor) {
      setVendor(initialVendor);
      setEditing(false);
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      const t = setTimeout(() => setVendor(null), 300);
      document.body.style.overflow = "";
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ""; };
  }, [initialVendor]);

  if (!vendor) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleStatusChange = (newStatus) => {
    const updated = { ...vendor, status: newStatus };
    setVendor(updated);
    onUpdate?.(updated);
  };

  const handleEditSave = () => {
    const updated = { ...vendor, ...editData };
    setVendor(updated);
    onUpdate?.(updated);
    setEditing(false);
    setEditData({});
  };

  const startEdit = () => {
    setEditData({
      commission: vendor.commission,
      notes: vendor.notes,
      phone: vendor.phone,
    });
    setEditing(true);
  };

  const docCount = Object.values(vendor.documents).filter(Boolean).length;
  const docTotal = Object.keys(vendor.documents).length;

  return (
    <>
      <style>{css}</style>

      <div className={`vd-backdrop${visible ? " vd-backdrop-in" : ""}`} onClick={handleClose} />

      <div className={`vd-drawer${visible ? " vd-drawer-in" : ""}`}>

        {/* Header */}
        <div className="vd-dh">
          <div className="vd-dh-left">
            <div className="vd-dh-avatar" style={{ background: avatarBg(vendor.category) }}>
              {vendor.name.charAt(0)}
            </div>
            <div>
              <div className="vd-dh-name">{vendor.name}</div>
              <div className="vd-dh-id">{vendor.id} &nbsp;·&nbsp; {vendor.category}</div>
            </div>
          </div>
          <button className="vd-close-btn" onClick={handleClose} aria-label="Close">✕</button>
        </div>
        <div className="vd-dh-meta">
          <VendorStatusBadge status={vendor.status} size="sm" />
          &nbsp;&nbsp;
          <span style={{ fontSize: "0.74rem", color: "#94a3b8" }}>Joined {vendor.joinDate}</span>
        </div>

        {/* Body */}
        <div className="vd-body" ref={bodyRef}>

          {/* Quick Stats */}
          <div className="vd-stats-row">
            {[
              { label: "Total Orders", val: vendor.totalOrders, color: "#1a73e8" },
              { label: "Revenue",      val: vendor.revenue,     color: "#10b981" },
              { label: "Rating",       val: vendor.rating > 0 ? `⭐ ${vendor.rating}` : "—", color: "#f59e0b" },
              { label: "Avg Delivery", val: vendor.avgDeliveryTime, color: "#64748b" },
            ].map(s => (
              <div key={s.label} className="vd-stat-chip">
                <div className="vd-stat-val" style={{ color: s.color }}>{s.val}</div>
                <div className="vd-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Owner Info */}
          <Section title="👤 Owner Details">
            <Row label="Owner Name" val={vendor.ownerName} />
            {editing ? (
              <div className="vd-edit-row">
                <span className="vd-row-label">PHONE</span>
                <input className="vd-edit-input" value={editData.phone} onChange={e => setEditData(p => ({ ...p, phone: e.target.value }))} />
              </div>
            ) : (
              <Row label="Phone" val={`📞 ${vendor.phone}`} />
            )}
            {vendor.altPhone && <Row label="Alt Phone" val={`📞 ${vendor.altPhone}`} />}
            {vendor.email && <Row label="Email" val={`✉️ ${vendor.email}`} />}
            <Row label="Area" val={`📍 ${vendor.area}`} />
            <Row label="Address" val={vendor.address} full />
          </Section>

          {/* Business Info */}
          <Section title="🏪 Business Details">
            <Row label="Category" val={vendor.category} />
            {editing ? (
              <div className="vd-edit-row">
                <span className="vd-row-label">COMMISSION</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <input className="vd-edit-input" style={{ width: 70 }} type="number" value={editData.commission} onChange={e => setEditData(p => ({ ...p, commission: Number(e.target.value) }))} />
                  <span style={{ fontSize: "0.8rem", color: "#64748b" }}>%</span>
                </div>
              </div>
            ) : (
              <Row label="Commission" val={<span style={{ color: "#7c3aed", fontWeight: 700 }}>{vendor.commission}%</span>} />
            )}
            <Row label="This Week" val={`${vendor.ordersThisWeek} orders`} />
            <Row label="Avg Delivery" val={vendor.avgDeliveryTime} />
          </Section>

          {/* KYC & Documents */}
          <Section title={`📄 KYC & Documents (${docCount}/${docTotal})`}>
            <div className="vd-kyc-status">
              <span className={vendor.kyc === "Verified" ? "vd-kyc-badge-ok" : "vd-kyc-badge-pending"}>
                {vendor.kyc === "Verified" ? "✓ KYC Verified" : "⏳ KYC Pending"}
              </span>
            </div>
            <div className="vd-docs-grid">
              {Object.entries(vendor.documents).map(([doc, ok]) => (
                <div key={doc} className={`vd-doc-chip ${ok ? "vd-doc-ok" : "vd-doc-missing"}`}>
                  {ok ? "✓" : "✗"} {docLabels[doc]}
                </div>
              ))}
            </div>
            {vendor.kyc !== "Verified" && (
              <button className="vd-action-btn vd-btn-yellow" style={{ marginTop: 10 }}>
                📤 Request Documents
              </button>
            )}
          </Section>

          {/* Notes */}
          <Section title="📝 Notes">
            {editing ? (
              <textarea
                className="vd-edit-textarea"
                value={editData.notes}
                onChange={e => setEditData(p => ({ ...p, notes: e.target.value }))}
                placeholder="Add notes about this vendor..."
                rows={3}
              />
            ) : (
              vendor.notes
                ? <div className="vd-note-text">{vendor.notes}</div>
                : <div className="vd-no-notes">No notes added.</div>
            )}
          </Section>

          {/* Status Change */}
          <Section title="🔄 Change Status">
            <div className="vd-status-grid">
              {["Active", "Inactive", "Pending KYC"].map(s => (
                <button
                  key={s}
                  className={`vd-status-btn${vendor.status === s ? " vd-status-active" : ""}`}
                  style={vendor.status === s ? activeStyle(s) : {}}
                  onClick={() => handleStatusChange(s)}
                >
                  {statusEmoji(s)} {s}
                </button>
              ))}
            </div>
          </Section>

          {/* Action Buttons */}
          <div className="vd-actions">
            {editing ? (
              <>
                <button className="vd-action-btn vd-btn-green" onClick={handleEditSave}>✓ Save Changes</button>
                <button className="vd-action-btn vd-btn-gray" onClick={() => setEditing(false)}>✕ Cancel</button>
              </>
            ) : (
              <>
                <button className="vd-action-btn vd-btn-blue" onClick={startEdit}>✏️ Edit Vendor</button>
                <button className="vd-action-btn vd-btn-red">🗑 Remove Vendor</button>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

/* Sub-components */
function Section({ title, children }) {
  return (
    <div className="vd-section">
      <div className="vd-section-title">{title}</div>
      {children}
    </div>
  );
}
function Row({ label, val, full }) {
  return (
    <div className={`vd-row${full ? " vd-row-full" : ""}`}>
      <span className="vd-row-label">{label}</span>
      <span className="vd-row-val">{val}</span>
    </div>
  );
}

function avatarBg(category) {
  const m = {
    "Grocery": "linear-gradient(135deg,#1a73e8,#0d47a1)",
    "Dairy": "linear-gradient(135deg,#06b6d4,#0891b2)",
    "Bakery": "linear-gradient(135deg,#f59e0b,#d97706)",
    "Meat & Fish": "linear-gradient(135deg,#ef4444,#b91c1c)",
    "Fruits & Vegetables": "linear-gradient(135deg,#10b981,#065f46)",
    "Pharmacy": "linear-gradient(135deg,#8b5cf6,#6d28d9)",
    "General Store": "linear-gradient(135deg,#64748b,#334155)",
  };
  return m[category] || "linear-gradient(135deg,#94a3b8,#64748b)";
}

const docLabels = { aadhaar: "Aadhaar", pan: "PAN", gst: "GST", fssai: "FSSAI" };

function statusEmoji(s) {
  return { Active: "✅", Inactive: "❌", "Pending KYC": "⏳" }[s] || "";
}
function activeStyle(s) {
  return {
    Active:        { background: "#d1fae5", color: "#10b981", borderColor: "#6ee7b7" },
    Inactive:      { background: "#fee2e2", color: "#ef4444", borderColor: "#fecaca" },
    "Pending KYC": { background: "#fef3c7", color: "#f59e0b", borderColor: "#fde68a" },
  }[s] || {};
}

const css = `
  .vd-backdrop { position:fixed; inset:0; background:rgba(15,23,42,0); z-index:1200; transition:background 0.28s ease; pointer-events:none; }
  .vd-backdrop-in { background:rgba(15,23,42,0.45); backdrop-filter:blur(2px); pointer-events:all; }

  .vd-drawer {
    position:fixed; top:0; right:0;
    width:min(500px,100vw);
    background:#f8faff;
    z-index:1201;
    display:flex; flex-direction:column;
    height:100dvh; max-height:100dvh;
    overflow:hidden;
    box-shadow:-8px 0 40px rgba(15,23,42,0.15);
    transform:translateX(100%);
    transition:transform 0.3s cubic-bezier(0.32,0.72,0,1);
    border-left:1px solid #e2e8f0;
  }
  .vd-drawer-in { transform:translateX(0); }

  .vd-dh { display:flex; justify-content:space-between; align-items:center; padding:1rem 1.3rem 0.6rem; background:#fff; border-bottom:1px solid #e2e8f0; flex-shrink:0; }
  .vd-dh-left { display:flex; align-items:center; gap:10px; min-width:0; }
  .vd-dh-avatar { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:1rem; font-weight:800; font-family:'Sora',sans-serif; flex-shrink:0; }
  .vd-dh-name { font-family:'Sora',sans-serif; font-size:0.98rem; font-weight:800; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .vd-dh-id { font-size:0.72rem; color:#94a3b8; margin-top:1px; }
  .vd-dh-meta { padding:0.4rem 1.3rem 0.7rem; background:#fff; border-bottom:1px solid #f1f5f9; flex-shrink:0; display:flex; align-items:center; }
  .vd-close-btn { width:32px; height:32px; display:flex; align-items:center; justify-content:center; background:#f0f5ff; border:none; border-radius:8px; font-size:0.9rem; color:#64748b; cursor:pointer; transition:background 0.15s; flex-shrink:0; }
  .vd-close-btn:hover { background:#fee2e2; color:#ef4444; }

  .vd-body { flex:1 1 0; min-height:0; overflow-y:auto; overflow-x:hidden; padding:1rem; display:flex; flex-direction:column; gap:10px; }
  .vd-body::-webkit-scrollbar { width:4px; }
  .vd-body::-webkit-scrollbar-thumb { background:#bfdbfe; border-radius:99px; }

  /* Quick stats */
  .vd-stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; }
  .vd-stat-chip { background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:0.7rem 0.6rem; text-align:center; }
  .vd-stat-val { font-family:'Sora',sans-serif; font-size:0.95rem; font-weight:800; line-height:1; margin-bottom:4px; }
  .vd-stat-label { font-size:0.62rem; color:#94a3b8; font-weight:600; text-transform:uppercase; letter-spacing:0.04em; }

  .vd-section { background:#fff; border-radius:14px; border:1px solid #e2e8f0; padding:1rem 1.1rem; }
  .vd-section-title { font-family:'Sora',sans-serif; font-size:0.82rem; font-weight:700; color:#0f172a; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid #f1f5f9; }
  .vd-row { display:flex; justify-content:space-between; align-items:flex-start; gap:8px; padding:0.38rem 0; border-bottom:1px solid #f8faff; font-size:0.83rem; }
  .vd-row:last-of-type { border-bottom:none; }
  .vd-row-full { flex-direction:column; gap:2px; }
  .vd-row-label { font-size:0.68rem; color:#94a3b8; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; flex-shrink:0; padding-top:2px; }
  .vd-row-val { color:#334155; font-weight:500; text-align:right; font-size:0.83rem; }
  .vd-row-full .vd-row-val { text-align:left; font-size:0.8rem; color:#64748b; }

  /* Edit inline */
  .vd-edit-row { display:flex; justify-content:space-between; align-items:center; gap:8px; padding:0.38rem 0; border-bottom:1px solid #f8faff; }
  .vd-edit-input { border:1.5px solid #1a73e8; border-radius:7px; padding:0.3rem 0.6rem; font-size:0.82rem; font-family:inherit; color:#0f172a; outline:none; background:#f0f5ff; }
  .vd-edit-textarea { width:100%; border:1.5px solid #1a73e8; border-radius:9px; padding:0.6rem 0.75rem; font-size:0.82rem; font-family:inherit; color:#0f172a; outline:none; background:#f0f5ff; resize:vertical; box-sizing:border-box; }

  /* KYC */
  .vd-kyc-status { margin-bottom:10px; }
  .vd-kyc-badge-ok { display:inline-flex; align-items:center; gap:5px; background:#d1fae5; color:#065f46; padding:3px 10px; border-radius:99px; font-size:0.78rem; font-weight:700; }
  .vd-kyc-badge-pending { display:inline-flex; align-items:center; gap:5px; background:#fef3c7; color:#d97706; padding:3px 10px; border-radius:99px; font-size:0.78rem; font-weight:700; }
  .vd-docs-grid { display:grid; grid-template-columns:1fr 1fr; gap:6px; }
  .vd-doc-chip { padding:0.45rem 0.8rem; border-radius:8px; font-size:0.76rem; font-weight:700; text-align:center; }
  .vd-doc-ok { background:#d1fae5; color:#065f46; }
  .vd-doc-missing { background:#fee2e2; color:#b91c1c; }

  /* Notes */
  .vd-note-text { font-size:0.82rem; color:#334155; line-height:1.5; background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:0.5rem 0.75rem; }
  .vd-no-notes { font-size:0.8rem; color:#94a3b8; font-style:italic; }

  /* Status */
  .vd-status-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:7px; }
  .vd-status-btn { padding:0.55rem; border:1.5px solid #e2e8f0; border-radius:9px; background:#fff; color:#64748b; font-size:0.74rem; font-weight:600; font-family:inherit; cursor:pointer; transition:all 0.15s; }
  .vd-status-btn:hover:not(.vd-status-active) { background:#f0f5ff; border-color:#bfdbfe; }

  /* Action buttons */
  .vd-actions { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .vd-action-btn { width:100%; padding:0.65rem; border:none; border-radius:10px; font-size:0.82rem; font-weight:700; font-family:inherit; cursor:pointer; transition:opacity 0.15s; }
  .vd-action-btn:hover { opacity:0.85; }
  .vd-btn-blue  { background:#e8f0fe; color:#1a73e8; }
  .vd-btn-green { background:#d1fae5; color:#10b981; }
  .vd-btn-red   { background:#fee2e2; color:#ef4444; }
  .vd-btn-gray  { background:#f1f5f9; color:#64748b; }
  .vd-btn-yellow { background:#fef3c7; color:#d97706; }

  @media (max-width:520px) { .vd-drawer { width:100vw; } .vd-stats-row { grid-template-columns:repeat(2,1fr); } }
`;
