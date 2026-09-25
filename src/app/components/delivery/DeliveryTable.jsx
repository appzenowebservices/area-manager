import DeliveryStatusBadge from "./DeliveryStatusBadge";
import { getDeliveryStats } from "../../data/deliveryData";

/**
 * DeliveryTable
 * File: src/components/delivery/DeliveryTable.jsx
 *
 * Props:
 *   partners  array
 *   onView    fn(partner)
 */

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export default function DeliveryTable({ partners, onView }) {
  return (
    <>
      <style>{css}</style>
      <div className="dt-wrap">
        <table className="dt-table">
          <thead>
            <tr>
              {["Partner", "Contact", "Area", "Vehicle", "Status",
                "Rating", "Total Deliveries", "Active Orders", "Revenue", "Action"
              ].map(h => (
                <th key={h} className="dt-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {partners.length === 0 ? (
              <tr>
                <td colSpan={10} className="dt-empty">
                  <span style={{ fontSize: "2rem" }}>🚴</span>
                  <p>No delivery partners found</p>
                </td>
              </tr>
            ) : (
              partners.map(p => {
                const stats = getDeliveryStats(p.id);
                return (
                  <tr key={p.id} className="dt-tr">
                    {/* Partner */}
                    <td className="dt-td">
                      <div className="dt-partner">
                        <div className="dt-avatar">{p.avatar}</div>
                        <div>
                          <div className="dt-name">{p.name}</div>
                          <div className="dt-id">{p.id}</div>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="dt-td">
                      <div className="dt-phone">📞 {p.phone}</div>
                      <div className="dt-area-small">{p.area}</div>
                    </td>

                    {/* Area */}
                    <td className="dt-td">
                      <span className="dt-area-badge">📍 {p.area}</span>
                    </td>

                    {/* Vehicle */}
                    <td className="dt-td">
                      <div className="dt-vehicle">{p.vehicle}</div>
                      {p.vehicleNo !== "N/A" && (
                        <div className="dt-vno">{p.vehicleNo}</div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="dt-td">
                      <DeliveryStatusBadge status={p.status} />
                    </td>

                    {/* Rating */}
                    <td className="dt-td">
                      <div className="dt-rating">
                        <StarIcon />
                        <span>{p.rating}</span>
                      </div>
                    </td>

                    {/* Total Deliveries (all time) */}
                    <td className="dt-td">
                      <span className="dt-count">{p.totalDeliveries}</span>
                    </td>

                    {/* Active Orders (from ordersData) */}
                    <td className="dt-td">
                      <span className={`dt-active ${stats.pending > 0 ? "dt-active-has" : ""}`}>
                        {stats.pending}
                      </span>
                    </td>

                    {/* Revenue */}
                    <td className="dt-td">
                      <span className="dt-revenue">
                        ₹{stats.revenue.toLocaleString("en-IN")}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="dt-td">
                      <button className="dt-view-btn" onClick={() => onView(p)}>
                        👁 View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

const css = `
  .dt-wrap {
    overflow-x: auto;
    border-radius: 14px;
    border: 1px solid #e2e8f0;
  }
  .dt-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.83rem;
    min-width: 980px;
  }
  .dt-th {
    text-align: left;
    padding: 0.65rem 0.9rem;
    background: #f8faff;
    color: #94a3b8;
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-bottom: 1px solid #e2e8f0;
    white-space: nowrap;
  }
  .dt-tr { transition: background 0.12s; }
  .dt-tr:hover .dt-td { background: #f8faff; }
  .dt-td {
    padding: 0.75rem 0.9rem;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: middle;
    white-space: nowrap;
    background: #fff;
    transition: background 0.12s;
  }
  .dt-tr:last-child .dt-td { border-bottom: none; }

  .dt-partner { display: flex; align-items: center; gap: 10px; }
  .dt-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1a73e8, #0d47a1);
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 700;
    flex-shrink: 0;
  }
  .dt-name { font-weight: 700; color: #0f172a; font-size: 0.85rem; }
  .dt-id   { font-size: 0.68rem; color: #94a3b8; margin-top: 1px; }

  .dt-phone      { font-size: 0.8rem; color: #334155; font-weight: 500; }
  .dt-area-small { font-size: 0.68rem; color: #94a3b8; margin-top: 2px; }
  .dt-area-badge { font-size: 0.78rem; color: #475569; }

  .dt-vehicle { font-size: 0.82rem; color: #334155; font-weight: 600; }
  .dt-vno     { font-size: 0.68rem; color: #94a3b8; margin-top: 2px; }

  .dt-rating {
    display: flex; align-items: center; gap: 4px;
    font-weight: 700; color: #0f172a; font-size: 0.85rem;
  }

  .dt-count {
    font-family: 'Sora', sans-serif;
    font-weight: 700; color: #334155;
  }

  .dt-active {
    font-weight: 700;
    color: #94a3b8;
    font-size: 0.85rem;
  }
  .dt-active-has {
    color: #1a73e8;
    background: #e8f0fe;
    padding: 2px 10px;
    border-radius: 99px;
  }

  .dt-revenue {
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    color: #10b981;
    font-size: 0.85rem;
  }

  .dt-view-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 0.35rem 0.85rem;
    background: #e8f0fe;
    color: #1a73e8;
    border: none;
    border-radius: 8px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;
    white-space: nowrap;
  }
  .dt-view-btn:hover { background: #d2e3fc; }

  .dt-empty {
    text-align: center;
    padding: 3.5rem 1rem;
    color: #94a3b8;
  }
  .dt-empty p { margin-top: 8px; font-size: 0.88rem; }
`;
