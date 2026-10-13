// src/components/dashboard/TopVendorsCard.jsx
import { useNavigate } from "react-router-dom";
import { TOP_VENDORS } from "../../data/dashboardData";
import { StarIcon } from "./icons/DashIcons";
import StatusBadge from "../ui/StatusBadge";

const RANK_COLORS = ["#ae2012", "#4a5d23", "#0c831f", "#e9c46a"];
const RANK_BG     = ["#fdfbf7", "#f5ebe0", "#d3ebd8", "#faedcc"];

/**
 * TopVendorsCard
 * Leaderboard of top vendors by orders, with progress bar, rating and category.
 */
export default function TopVendorsCard() {
  const navigate = useNavigate();
  const maxOrders = TOP_VENDORS[0].orders;

  return (
    <>
      <style>{css}</style>
      <div className="tvc-card">
        {/* Header */}
        <div className="tvc-header">
          <div>
            <div className="tvc-title">Top Vendors</div>
            <div className="tvc-sub">By orders this week</div>
          </div>
          <button className="tvc-viewall" onClick={() => navigate("/vendors")}>
            View All →
          </button>
        </div>

        {/* Vendor rows */}
        <div className="tvc-list">
          {TOP_VENDORS.map((v, i) => {
            const pct = Math.round((v.orders / maxOrders) * 100);
            return (
              <div key={v.id} className="tvc-row">
                {/* Rank badge */}
                <div
                  className="tvc-rank"
                  style={{ background: RANK_BG[i], color: RANK_COLORS[i] }}
                >
                  #{i + 1}
                </div>

                {/* Main info */}
                <div className="tvc-info">
                  <div className="tvc-row-top">
                    <span className="tvc-name">{v.name}</span>
                    <StatusBadge status={v.status} size="sm" />
                  </div>

                  <div className="tvc-meta-row">
                    <span className="tvc-cat-badge">{v.category}</span>
                    <span className="tvc-area">📍 {v.area}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="tvc-bar-row">
                    <div className="tvc-bar-bg">
                      <div
                        className="tvc-bar-fill"
                        style={{
                          width: `${pct}%`,
                          background: RANK_COLORS[i],
                        }}
                      />
                    </div>
                    <span className="tvc-orders-count">{v.orders} orders</span>
                  </div>
                </div>

                {/* Right: Revenue + Rating */}
                <div className="tvc-right">
                  <span className="tvc-revenue">{v.revenue}</span>
                  <div className="tvc-rating">
                    <StarIcon />
                    <span>{v.rating}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

const css = `
  .tvc-card {
    background: #fff;
    border-radius: 16px;
    padding: 1.3rem;
    border: 1px solid #e9d8bf;
    box-shadow: 0 1px 4px rgba(45, 36, 30,0.05);
    height: 100%;
  }
  .tvc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .tvc-title {
    font-family: 'Sora', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #2d241e;
  }
  .tvc-sub { font-size: 0.73rem; color: #a68b66; margin-top: 2px; }
  .tvc-viewall {
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
  .tvc-list {
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .tvc-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f5ebe0;
  }
  .tvc-row:last-child { border-bottom: none; }
  .tvc-rank {
    width: 32px; height: 32px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 800;
    flex-shrink: 0;
    font-family: 'Sora', sans-serif;
  }
  .tvc-info { flex: 1; min-width: 0; }
  .tvc-row-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    margin-bottom: 3px;
  }
  .tvc-name {
    font-size: 0.86rem;
    font-weight: 700;
    color: #2d241e;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tvc-meta-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
    flex-wrap: wrap;
  }
  .tvc-cat-badge {
    background: #fdfbf7;
    color: #ae2012;
    border-radius: 99px;
    padding: 1px 8px;
    font-size: 0.68rem;
    font-weight: 700;
    white-space: nowrap;
  }
  .tvc-area {
    font-size: 0.7rem;
    color: #a68b66;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tvc-bar-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .tvc-bar-bg {
    flex: 1;
    height: 5px;
    border-radius: 99px;
    background: #fdfbf7;
    overflow: hidden;
  }
  .tvc-bar-fill {
    height: 100%;
    border-radius: 99px;
    transition: width 0.7s cubic-bezier(0.34,1.56,0.64,1);
  }
  .tvc-orders-count {
    font-size: 0.72rem;
    color: #7d6b5d;
    font-weight: 600;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .tvc-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
    min-width: 60px;
  }
  .tvc-revenue {
    font-size: 0.82rem;
    font-weight: 700;
    color: #2d241e;
    white-space: nowrap;
  }
  .tvc-rating {
    display: flex;
    align-items: center;
    gap: 3px;
    font-size: 0.75rem;
    font-weight: 700;
    color: #2d241e;
  }
  @media (max-width: 480px) {
    .tvc-card { padding: 1rem; }
    .tvc-right { min-width: 50px; }
    .tvc-revenue { font-size: 0.75rem; }
  }
`;
