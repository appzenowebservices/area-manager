import { useState, useEffect } from "react";
import DeliveryStatusBadge from "./DeliveryStatusBadge";
import { getDeliveryStats } from "../../data/deliveryData";
import OrderStatusBadge from "../orders/OrderStatusBadge";

/**
 * DeliveryDrawer
 * File: src/components/delivery/DeliveryDrawer.jsx
 *
 * Right-side slide-in drawer showing full delivery partner profile.
 * Shows live assigned orders from ordersData.
 *
 * Props:
 *   partner       object | null
 *   onClose       fn
 *   onStatusChange fn(partner, newStatus)
 */

const STATUSES = ["Available", "Busy", "Inactive"];

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#e9c46a" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

function Section({ title, children }) {
  return (
    <div className="dd-section">
      <div className="dd-section-title">{title}</div>
      {children}
    </div>
  );
}

function InfoRow({ label, val }) {
  return (
    <div className="dd-row">
      <span className="dd-row-label">{label}</span>
      <span className="dd-row-val">{val}</span>
    </div>
  );
}

export default function DeliveryDrawer({ partner: initialPartner, onClose, onStatusChange }) {
  const [partner, setPartner] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (initialPartner) {
      setPartner(initialPartner);
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      const t = setTimeout(() => setPartner(null), 300);
      document.body.style.overflow = "";
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ""; };
  }, [initialPartner]);

  if (!partner) return null;

  const stats = getDeliveryStats(partner.id);

  const handleStatusChange = (newStatus) => {
    const updated = { ...partner, status: newStatus };
    setPartner(updated);
    onStatusChange?.(updated);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const statusStyle = {
    Available: { bg: "#d3ebd8", border: "#93d3a0", color: "#0a671a" },
    Busy:      { bg: "#f5ebe0", border: "#e9d8bf", color: "#8b150e" },
    Inactive:  { bg: "#f5ebe0", border: "#e9d8bf", color: "#5d4037" },
  };

  return (
    <>
      <style>{css}</style>

      {/* Backdrop */}
      <div
        className={`dd-backdrop${visible ? " dd-backdrop-in" : ""}`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className={`dd-drawer${visible ? " dd-drawer-in" : ""}`}>

        {/* ── Fixed Header ── */}
        <div className="dd-header">
          <div className="dd-header-inner">
            <div className="dd-avatar">{partner.avatar}</div>
            <div className="dd-header-info">
              <div className="dd-header-name">{partner.name}</div>
              <div className="dd-header-meta">{partner.id} · {partner.area}</div>
            </div>
          </div>
          <button className="dd-close" onClick={handleClose} aria-label="Close">✕</button>
        </div>

        {/* Rating + Status strip */}
        <div className="dd-strip">
          <div className="dd-rating">
            <StarIcon /> <span>{partner.rating}</span>
            <span className="dd-rating-label">Rating</span>
          </div>
          <div className="dd-divider-v" />
          <div className="dd-joins">
            <span className="dd-strip-val">{partner.totalDeliveries}</span>
            <span className="dd-strip-label">Total Deliveries</span>
          </div>
          <div className="dd-divider-v" />
          <DeliveryStatusBadge status={partner.status} />
        </div>

        {/* ── Scrollable Body ── */}
        <div className="dd-body">

          {/* KPI Cards */}
          <div className="dd-kpi-row">
            {[
              { label: "Active",    val: stats.pending,   color: "#ae2012", bg: "#fdfbf7" },
              { label: "Delivered", val: stats.delivered, color: "#0c831f", bg: "#d3ebd8" },
              { label: "Cancelled", val: stats.cancelled, color: "#d32f2f", bg: "#fbebe9" },
              { label: "Revenue",   val: `₹${stats.revenue.toLocaleString("en-IN")}`, color: "#4a5d23", bg: "#f5ebe0" },
            ].map(k => (
              <div key={k.label} className="dd-kpi" style={{ background: k.bg }}>
                <span className="dd-kpi-val" style={{ color: k.color }}>{k.val}</span>
                <span className="dd-kpi-label">{k.label}</span>
              </div>
            ))}
          </div>

          {/* Personal Info */}
          <Section title="👤 Personal Info">
            <InfoRow label="Phone"      val={`📞 ${partner.phone}`} />
            {partner.altPhone && <InfoRow label="Alt Phone" val={`📞 ${partner.altPhone}`} />}
            <InfoRow label="Email"      val={partner.email} />
            <InfoRow label="Address"    val={partner.address} />
            <InfoRow label="Joined"     val={partner.joinDate} />
            <InfoRow label="ID Proof"   val={partner.idProof} />
            <InfoRow label="Emergency"  val={`📞 ${partner.emergencyContact}`} />
          </Section>

          {/* Vehicle Info */}
          <Section title="🚗 Vehicle Info">
            <InfoRow label="Type"       val={partner.vehicle} />
            <InfoRow label="Vehicle No" val={partner.vehicleNo} />
          </Section>

          {/* Change Status */}
          <Section title="🔄 Change Status">
            <div className="dd-status-grid">
              {STATUSES.map(s => {
                const st = statusStyle[s];
                const isActive = partner.status === s;
                return (
                  <button
                    key={s}
                    className="dd-status-btn"
                    style={isActive ? {
                      background: st.bg,
                      borderColor: st.border,
                      color: st.color,
                    } : {}}
                    onClick={() => handleStatusChange(s)}
                  >
                    {s === "Available" ? "✅" : s === "Busy" ? "🔄" : "⏸"} {s}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Assigned Orders */}
          <Section title={`📦 Assigned Orders (${stats.orders.length})`}>
            {stats.orders.length === 0 ? (
              <p className="dd-no-orders">No orders assigned yet.</p>
            ) : (
              <div className="dd-orders-list">
                {stats.orders.map(o => (
                  <div key={o.id} className="dd-order-row">
                    <div className="dd-order-left">
                      <span className="dd-order-id">{o.id}</span>
                      <span className="dd-order-customer">{o.customer.name}</span>
                    </div>
                    <div className="dd-order-right">
                      <span className="dd-order-amt">₹{o.finalAmount.toLocaleString("en-IN")}</span>
                      <OrderStatusBadge status={o.status} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Section>

        </div>
      </div>
    </>
  );
}

const css = `
  /* Backdrop */
  .dd-backdrop {
    position: fixed; inset: 0;
    background: rgba(45, 36, 30,0);
    z-index: 300;
    transition: background 0.28s ease;
    pointer-events: none;
  }
  .dd-backdrop-in {
    background: rgba(45, 36, 30,0.45);
    backdrop-filter: blur(2px);
    pointer-events: all;
  }

  /* Drawer */
  .dd-drawer {
    position: fixed;
    top: 0; right: 0; bottom: 0;
    width: min(460px, 100vw);
    height: 100vh;
    background: #fdfbf7;
    z-index: 301;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: -8px 0 40px rgba(45, 36, 30,0.15);
    border-left: 1px solid #e9d8bf;
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.32,0.72,0,1);
  }
  .dd-drawer-in { transform: translateX(0); }

  /* Header — fixed, never scrolls */
  .dd-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.1rem 1.3rem;
    background: #fff;
    border-bottom: 1px solid #e9d8bf;
    flex-shrink: 0;
  }
  .dd-header-inner { display: flex; align-items: center; gap: 12px; }
  .dd-avatar {
    width: 44px; height: 44px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ae2012, #2d241e);
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.88rem; font-weight: 700;
    flex-shrink: 0;
  }
  .dd-header-name {
    font-family: 'Sora', sans-serif;
    font-size: 1rem; font-weight: 800;
    color: #2d241e;
  }
  .dd-header-meta { font-size: 0.73rem; color: #a68b66; margin-top: 2px; }
  .dd-close {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    background: #fdfbf7; border: none; border-radius: 8px;
    font-size: 0.9rem; color: #7d6b5d; cursor: pointer;
    transition: background 0.15s, color 0.15s; flex-shrink: 0;
  }
  .dd-close:hover { background: #fbebe9; color: #d32f2f; }

  /* Rating strip — fixed */
  .dd-strip {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 0.75rem 1.3rem;
    background: #fff;
    border-bottom: 1px solid #f5ebe0;
    flex-shrink: 0;
  }
  .dd-rating {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.88rem; font-weight: 700; color: #2d241e;
  }
  .dd-rating-label { font-size: 0.68rem; color: #a68b66; font-weight: 500; }
  .dd-joins {
    display: flex; flex-direction: column; gap: 1px;
  }
  .dd-strip-val { font-weight: 700; color: #2d241e; font-size: 0.88rem; }
  .dd-strip-label { font-size: 0.65rem; color: #a68b66; font-weight: 600; text-transform: uppercase; }
  .dd-divider-v { width: 1px; height: 28px; background: #e9d8bf; flex-shrink: 0; }

  /* Scrollable body */
  .dd-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .dd-body::-webkit-scrollbar { width: 4px; }
  .dd-body::-webkit-scrollbar-track { background: transparent; }
  .dd-body::-webkit-scrollbar-thumb { background: #e9d8bf; border-radius: 99px; }

  /* KPI row */
  .dd-kpi-row {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
  }
  .dd-kpi {
    display: flex; flex-direction: column;
    align-items: center; gap: 2px;
    padding: 0.65rem 0.25rem;
    border-radius: 12px;
  }
  .dd-kpi-val {
    font-family: 'Sora', sans-serif;
    font-size: 1rem; font-weight: 800;
  }
  .dd-kpi-label {
    font-size: 0.62rem;
    color: #7d6b5d;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  /* Section */
  .dd-section {
    background: #fff;
    border: 1px solid #e9d8bf;
    border-radius: 14px;
    padding: 1rem 1.1rem;
    box-shadow: 0 1px 3px rgba(45, 36, 30,0.04);
  }
  .dd-section-title {
    font-family: 'Sora', sans-serif;
    font-size: 0.82rem; font-weight: 700;
    color: #2d241e;
    padding-bottom: 8px;
    margin-bottom: 10px;
    border-bottom: 1px solid #f5ebe0;
  }

  /* Info rows */
  .dd-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    padding: 0.38rem 0;
    border-bottom: 1px solid #fdfbf7;
    font-size: 0.83rem;
  }
  .dd-row:last-child { border-bottom: none; }
  .dd-row-label {
    font-size: 0.68rem;
    color: #a68b66;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex-shrink: 0;
    padding-top: 2px;
    min-width: 80px;
  }
  .dd-row-val {
    color: #4a3f35;
    font-weight: 500;
    font-size: 0.83rem;
    text-align: right;
    word-break: break-word;
  }

  /* Status grid */
  .dd-status-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 7px;
  }
  .dd-status-btn {
    padding: 0.55rem;
    border: 1.5px solid #e9d8bf;
    border-radius: 9px;
    background: #fff;
    color: #7d6b5d;
    font-size: 0.78rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .dd-status-btn:hover { background: #fdfbf7; border-color: #e9d8bf; }

  /* Orders list */
  .dd-orders-list { display: flex; flex-direction: column; gap: 6px; }
  .dd-order-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.55rem 0.75rem;
    background: #fdfbf7;
    border: 1px solid #f5ebe0;
    border-radius: 10px;
    gap: 8px;
  }
  .dd-order-left { display: flex; flex-direction: column; gap: 2px; }
  .dd-order-id {
    font-family: 'Sora', sans-serif;
    font-size: 0.78rem; font-weight: 700; color: #ae2012;
  }
  .dd-order-customer { font-size: 0.73rem; color: #5d4037; font-weight: 500; }
  .dd-order-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
  .dd-order-amt { font-weight: 700; color: #2d241e; font-size: 0.82rem; }
  .dd-no-orders { font-size: 0.82rem; color: #a68b66; text-align: center; padding: 1rem 0; }

  @media (max-width: 520px) { .dd-drawer { width: 100vw; } }
  @media (max-width: 380px) {
    .dd-kpi-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
`;
