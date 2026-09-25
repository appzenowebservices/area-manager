import DeliveryStatusBadge from "./DeliveryStatusBadge";
import { getDeliveryStats } from "../../data/deliveryData";

/**
 * DeliveryCard
 * File: src/components/delivery/DeliveryCard.jsx
 *
 * Mobile card view for one delivery partner.
 * Props:  partner, onView fn(partner)
 */

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export default function DeliveryCard({ partner: p, onView }) {
  const stats = getDeliveryStats(p.id);

  return (
    <>
      <style>{css}</style>
      <div className="dc-card">
        {/* Top */}
        <div className="dc-top">
          <div className="dc-left">
            <div className="dc-avatar">{p.avatar}</div>
            <div>
              <div className="dc-name">{p.name}</div>
              <div className="dc-id">{p.id} · {p.area}</div>
            </div>
          </div>
          <DeliveryStatusBadge status={p.status} size="sm" />
        </div>

        {/* Meta */}
        <div className="dc-meta-row">
          <span className="dc-meta">📞 {p.phone}</span>
          <span className="dc-meta">🚗 {p.vehicle}</span>
          <span className="dc-meta">
            <StarIcon /> {p.rating}
          </span>
        </div>

        <div className="dc-divider" />

        {/* Stats grid */}
        <div className="dc-stats">
          <div className="dc-stat">
            <span className="dc-stat-val">{p.totalDeliveries}</span>
            <span className="dc-stat-label">Total</span>
          </div>
          <div className="dc-stat">
            <span className="dc-stat-val" style={{ color: "#1a73e8" }}>{stats.pending}</span>
            <span className="dc-stat-label">Active</span>
          </div>
          <div className="dc-stat">
            <span className="dc-stat-val" style={{ color: "#10b981" }}>{stats.delivered}</span>
            <span className="dc-stat-label">Delivered</span>
          </div>
          <div className="dc-stat">
            <span className="dc-stat-val" style={{ color: "#10b981" }}>
              ₹{stats.revenue.toLocaleString("en-IN")}
            </span>
            <span className="dc-stat-label">Revenue</span>
          </div>
        </div>

        <button className="dc-btn" onClick={() => onView(p)}>
          View Full Profile →
        </button>
      </div>
    </>
  );
}

const css = `
  .dc-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 1rem 1.1rem;
    box-shadow: 0 1px 4px rgba(15,23,42,0.04);
    transition: box-shadow 0.18s;
  }
  .dc-card:hover { box-shadow: 0 4px 14px rgba(26,115,232,0.1); }
  .dc-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
  }
  .dc-left { display: flex; align-items: center; gap: 10px; }
  .dc-avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1a73e8, #0d47a1);
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.78rem; font-weight: 700;
    flex-shrink: 0;
  }
  .dc-name { font-weight: 700; color: #0f172a; font-size: 0.92rem; }
  .dc-id   { font-size: 0.72rem; color: #94a3b8; margin-top: 2px; }
  .dc-meta-row {
    display: flex; flex-wrap: wrap; gap: 10px;
    margin-bottom: 4px;
  }
  .dc-meta {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 0.76rem; color: #64748b;
  }
  .dc-divider { height: 1px; background: #f1f5f9; margin: 10px 0; }
  .dc-stats {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
    margin-bottom: 10px;
  }
  .dc-stat {
    display: flex; flex-direction: column;
    align-items: center; gap: 2px;
    background: #f8faff;
    border-radius: 10px;
    padding: 0.5rem 0.25rem;
  }
  .dc-stat-val {
    font-family: 'Sora', sans-serif;
    font-size: 0.95rem;
    font-weight: 800;
    color: #0f172a;
  }
  .dc-stat-label {
    font-size: 0.62rem;
    color: #94a3b8;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .dc-btn {
    width: 100%;
    padding: 0.6rem;
    background: #e8f0fe;
    color: #1a73e8;
    border: none;
    border-radius: 9px;
    font-size: 0.83rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.15s;
  }
  .dc-btn:hover { background: #d2e3fc; }
`;
