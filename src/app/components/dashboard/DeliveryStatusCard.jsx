// src/components/dashboard/DeliveryStatusCard.jsx
import { useNavigate } from "react-router-dom";
import { DELIVERY_BOYS } from "../../data/dashboardData";
import StatusBadge from "../ui/StatusBadge";
import { PhoneIcon, BikeIcon, LocationIcon } from "./icons/DashIcons";

/**
 * DeliveryStatusCard
 * Shows all delivery boys — name, status, orders today, vehicle, area.
 */
export default function DeliveryStatusCard() {
  const navigate = useNavigate();

  const available = DELIVERY_BOYS.filter((d) => d.status === "Available").length;
  const busy      = DELIVERY_BOYS.filter((d) => d.status === "Busy").length;
  const offline   = DELIVERY_BOYS.filter((d) => d.status === "Offline").length;

  return (
    <>
      <style>{css}</style>
      <div className="dsc-card">
        {/* Header */}
        <div className="dsc-header">
          <div>
            <div className="dsc-title">Delivery Team</div>
            <div className="dsc-sub">Live status of delivery boys</div>
          </div>
          <button className="dsc-viewall" onClick={() => navigate("/delivery")}>
            View All →
          </button>
        </div>

        {/* Summary chips */}
        <div className="dsc-chips">
          <div className="dsc-chip dsc-chip-green">
            <span className="dsc-chip-num">{available}</span>
            <span className="dsc-chip-lbl">Available</span>
          </div>
          <div className="dsc-chip dsc-chip-yellow">
            <span className="dsc-chip-num">{busy}</span>
            <span className="dsc-chip-lbl">Busy</span>
          </div>
          <div className="dsc-chip dsc-chip-gray">
            <span className="dsc-chip-num">{offline}</span>
            <span className="dsc-chip-lbl">Offline</span>
          </div>
        </div>

        {/* Delivery boys list */}
        <div className="dsc-list">
          {DELIVERY_BOYS.map((d) => (
            <div key={d.id} className="dsc-row">
              {/* Avatar */}
              <div
                className="dsc-avatar"
                style={{
                  background:
                    d.status === "Available" ? "#d3ebd8" :
                    d.status === "Busy"      ? "#faedcc" : "#f5ebe0",
                  color:
                    d.status === "Available" ? "#0c831f" :
                    d.status === "Busy"      ? "#e9c46a" : "#a68b66",
                }}
              >
                {d.name.charAt(0)}
              </div>

              {/* Main info */}
              <div className="dsc-info">
                <div className="dsc-name">{d.name}</div>
                <div className="dsc-meta-row">
                  <span className="dsc-meta"><PhoneIcon />{d.phone}</span>
                  <span className="dsc-meta"><BikeIcon />{d.vehicle}</span>
                  <span className="dsc-meta"><LocationIcon />{d.area}</span>
                </div>
              </div>

              {/* Right: status + orders */}
              <div className="dsc-right">
                <StatusBadge status={d.status} size="sm" />
                <span className="dsc-orders">{d.ordersToday} orders</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const css = `
  .dsc-card {
    background: #fff;
    border-radius: 16px;
    padding: 1.3rem;
    border: 1px solid #e9d8bf;
    box-shadow: 0 1px 4px rgba(45, 36, 30,0.05);
    height: 100%;
  }
  .dsc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 14px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .dsc-title {
    font-family: 'Sora', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #2d241e;
  }
  .dsc-sub { font-size: 0.73rem; color: #a68b66; margin-top: 2px; }
  .dsc-viewall {
    background: none;
    border: none;
    color: #ae2012;
    font-size: 0.82rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    padding: 0;
    white-space: nowrap;
  }
  .dsc-chips {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
  }
  .dsc-chip {
    flex: 1;
    border-radius: 10px;
    padding: 0.55rem 0.7rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    border: 1px solid transparent;
  }
  .dsc-chip-green { background: #eaf6ed; border-color: #d3ebd8; }
  .dsc-chip-yellow { background: #fdf6e4; border-color: #faedcc; }
  .dsc-chip-gray { background: #fdfbf7; border-color: #e9d8bf; }
  .dsc-chip-num {
    font-family: 'Sora', sans-serif;
    font-size: 1.25rem;
    font-weight: 800;
    line-height: 1;
    color: #2d241e;
  }
  .dsc-chip-lbl {
    font-size: 0.65rem;
    font-weight: 600;
    color: #7d6b5d;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .dsc-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .dsc-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.7rem 0;
    border-bottom: 1px solid #f5ebe0;
  }
  .dsc-row:last-child { border-bottom: none; }
  .dsc-avatar {
    width: 36px; height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    font-weight: 800;
    font-family: 'Sora', sans-serif;
    flex-shrink: 0;
  }
  .dsc-info { flex: 1; min-width: 0; }
  .dsc-name {
    font-size: 0.85rem;
    font-weight: 700;
    color: #2d241e;
    margin-bottom: 3px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dsc-meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .dsc-meta {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 0.68rem;
    color: #a68b66;
    white-space: nowrap;
  }
  .dsc-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
  }
  .dsc-orders {
    font-size: 0.7rem;
    color: #7d6b5d;
    font-weight: 600;
    white-space: nowrap;
  }
  @media (max-width: 480px) {
    .dsc-card { padding: 1rem; }
    .dsc-meta { font-size: 0.63rem; }
  }
`;
