// src/components/dashboard/RecentOrdersTable.jsx
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ORDERS } from "../../data/ordersData";
import StatusBadge from "../ui/StatusBadge";
import OrderDrawer from "../orders/OrderDrawer";
import { EyeIcon, PhoneIcon, LocationIcon } from "./icons/DashIcons";

const FILTERS = ["All", "Pending", "Processing", "Delivered", "Cancelled"];
const PAGE_SIZE_OPTIONS = [20, 40, 60];

// Light background colors per status
const STATUS_ROW_COLORS = {
  Pending:    { bg: "#fdf6e4", border: "#faedcc" },
  Processing: { bg: "#eaf6ed", border: "#e9d8bf" },
  Delivered:  { bg: "#eaf6ed", border: "#d3ebd8" },
  Cancelled:  { bg: "#fbebe9", border: "#f6d4ce" },
};

export default function RecentOrdersTable() {
  const [filter,   setFilter]   = useState("All");
  const [orders,   setOrders]   = useState(ORDERS);
  const [selected, setSelected] = useState(null);
  const [page,     setPage]     = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const navigate = useRouter();

  // Reset to page 1 on filter change
  const handleFilterChange = (f) => { setFilter(f); setPage(1); };
  const handlePageSize = (ps) => { setPageSize(Number(ps)); setPage(1); };

  const filtered = useMemo(
    () => filter === "All" ? orders : orders.filter(o => o.status === filter),
    [filter, orders]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((page - 1) * pageSize, page * pageSize);

  const handleUpdate = (updated) => {
    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
    setSelected(updated);
  };

  // Build page numbers to show (max 5 visible)
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [page - 2, page - 1, page, page + 1, page + 2];
  }, [page, totalPages]);

  return (
    <>
      <style>{css}</style>
      <div className="rot-card">

        {/* Header */}
        <div className="rot-header">
          <div>
            <div className="rot-title">Recent Orders</div>
            <div className="rot-sub">Latest activity — click View to manage</div>
          </div>
          <div className="rot-header-right">
            {/* Per-page selector */}
            <div className="rot-pagesize-wrap">
              <span className="rot-pagesize-label">Show</span>
              <select
                className="rot-pagesize-select"
                value={pageSize}
                onChange={e => handlePageSize(e.target.value)}
              >
                {PAGE_SIZE_OPTIONS.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <span className="rot-pagesize-label">per page</span>
            </div>
            <button className="rot-viewall" onClick={() => navigate("/orders")}>
              View All →
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div className="rot-filters">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`rot-filter${filter === f ? " rot-filter-active" : ""}`}
              onClick={() => handleFilterChange(f)}
            >
              {f}
              {f !== "All" && (
                <span className="rot-filter-count">
                  {orders.filter(o => o.status === f).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Color legend */}
        <div className="rot-legend">
          {Object.entries(STATUS_ROW_COLORS).map(([status, color]) => (
            <div key={status} className="rot-legend-item">
              <span className="rot-legend-dot" style={{ background: color.border }} />
              {status}
            </div>
          ))}
        </div>

        {/* Desktop Table */}
        <div className="rot-table-wrap">
          <table className="rot-table">
            <thead>
              <tr>
                {["Order ID","Customer","Area","Vendor","Delivery","Amount","Status","Time","Action"].map(h => (
                  <th key={h} className="rot-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.map(o => {
                const rowColor = STATUS_ROW_COLORS[o.status] || {};
                return (
                  <tr
                    key={o.id}
                    className="rot-tr"
                    style={{ "--row-bg": rowColor.bg || "#fff", "--row-border": rowColor.border || "#f5ebe0" }}
                  >
                    <td className="rot-td"><span className="rot-order-id">{o.id}</span></td>
                    <td className="rot-td">
                      <div className="rot-customer">{o.customer.name}</div>
                      <div className="rot-meta"><PhoneIcon /> {o.customer.phone}</div>
                    </td>
                    <td className="rot-td"><div className="rot-meta rot-area"><LocationIcon /> {o.area}</div></td>
                    <td className="rot-td"><span className={o.vendor.id ? "rot-vendor" : "rot-unassigned"}>{o.vendor.name}</span></td>
                    <td className="rot-td"><span className={o.delivery.id ? "rot-vendor" : "rot-unassigned"}>{o.delivery.name}</span></td>
                    <td className="rot-td"><span className="rot-amount">₹{o.finalAmount.toLocaleString()}</span></td>
                    <td className="rot-td"><StatusBadge status={o.status} /></td>
                    <td className="rot-td rot-time">{o.time}</td>
                    <td className="rot-td">
                      <button className="rot-action-btn" onClick={() => setSelected(o)}>
                        <EyeIcon /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
              {paginated.length === 0 && (
                <tr><td colSpan={9} className="rot-empty-row">No {filter} orders</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="rot-mobile-list">
          {paginated.map(o => {
            const rowColor = STATUS_ROW_COLORS[o.status] || {};
            return (
              <div key={o.id} className="rot-mobile-card" style={{ background: rowColor.bg || "#fdfbf7", borderColor: rowColor.border || "#f5ebe0" }}>
                <div className="rot-mc-row1">
                  <span className="rot-order-id">{o.id}</span>
                  <StatusBadge status={o.status} size="sm" />
                </div>
                <div className="rot-mc-name">{o.customer.name}</div>
                <div className="rot-mc-details">
                  <span className="rot-meta"><PhoneIcon />{o.customer.phone}</span>
                  <span className="rot-meta"><LocationIcon />{o.area}</span>
                </div>
                <div className="rot-mc-bottom">
                  <div className="rot-mc-info"><span className="rot-mc-label">Vendor</span><span className={o.vendor.id ? "rot-vendor" : "rot-unassigned"}>{o.vendor.name}</span></div>
                  <div className="rot-mc-info"><span className="rot-mc-label">Delivery</span><span className={o.delivery.id ? "rot-vendor" : "rot-unassigned"}>{o.delivery.name}</span></div>
                  <div className="rot-mc-info"><span className="rot-mc-label">Amount</span><span className="rot-amount">₹{o.finalAmount.toLocaleString()}</span></div>
                </div>
                <div className="rot-mc-footer">
                  <span className="rot-time-small">{o.time}</span>
                  <button className="rot-action-btn" onClick={() => setSelected(o)}><EyeIcon /> View</button>
                </div>
              </div>
            );
          })}
          {paginated.length === 0 && <div className="rot-empty-mobile">No {filter} orders</div>}
        </div>

        {/* Footer: count + pagination */}
        <div className="rot-footer">
          <span className="rot-footer-count">
            Showing <strong>{Math.min((page - 1) * pageSize + 1, filtered.length)}–{Math.min(page * pageSize, filtered.length)}</strong> of <strong>{filtered.length}</strong> orders
          </span>

          {totalPages > 1 && (
            <div className="rot-pagination">
              {/* Prev */}
              <button
                className="rot-pg-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >‹</button>

              {/* First page if not visible */}
              {pageNumbers[0] > 1 && (
                <>
                  <button className="rot-pg-btn" onClick={() => setPage(1)}>1</button>
                  {pageNumbers[0] > 2 && <span className="rot-pg-ellipsis">…</span>}
                </>
              )}

              {pageNumbers.map(n => (
                <button
                  key={n}
                  className={`rot-pg-btn${page === n ? " rot-pg-active" : ""}`}
                  onClick={() => setPage(n)}
                >{n}</button>
              ))}

              {/* Last page if not visible */}
              {pageNumbers[pageNumbers.length - 1] < totalPages && (
                <>
                  {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="rot-pg-ellipsis">…</span>}
                  <button className="rot-pg-btn" onClick={() => setPage(totalPages)}>{totalPages}</button>
                </>
              )}

              {/* Next */}
              <button
                className="rot-pg-btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >›</button>
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      <OrderDrawer
        order={selected}
        onClose={() => setSelected(null)}
        onUpdate={handleUpdate}
      />
    </>
  );
}

const css = `
  .rot-card { background: #fff; border-radius: 16px; padding: 1.3rem; border: 1px solid #e9d8bf; box-shadow: 0 1px 4px rgba(45, 36, 30,0.05); }

  /* Header */
  .rot-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; flex-wrap: wrap; gap: 8px; }
  .rot-title { font-family: 'Sora', sans-serif; font-size: 0.95rem; font-weight: 700; color: #2d241e; }
  .rot-sub { font-size: 0.73rem; color: #a68b66; margin-top: 2px; }
  .rot-header-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
  .rot-viewall { background: none; border: none; color: #ae2012; font-size: 0.82rem; font-weight: 700; cursor: pointer; font-family: inherit; padding: 0; white-space: nowrap; }

  /* Per-page selector */
  .rot-pagesize-wrap { display: flex; align-items: center; gap: 6px; }
  .rot-pagesize-label { font-size: 0.76rem; color: #7d6b5d; font-weight: 500; white-space: nowrap; }
  .rot-pagesize-select { border: 1.5px solid #e9d8bf; border-radius: 7px; padding: 0.25rem 0.5rem; font-size: 0.78rem; font-family: inherit; color: #2d241e; font-weight: 600; background: #fdfbf7; cursor: pointer; outline: none; }
  .rot-pagesize-select:focus { border-color: #ae2012; }

  /* Filters */
  .rot-filters { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
  .rot-filter { display: inline-flex; align-items: center; gap: 5px; padding: 0.32rem 0.8rem; border: 1.5px solid #e9d8bf; border-radius: 8px; background: transparent; color: #7d6b5d; font-size: 0.76rem; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; white-space: nowrap; }
  .rot-filter-active { background: #fdfbf7; border-color: #e9d8bf; color: #ae2012; }
  .rot-filter-count { background: #e9d8bf; color: #7d6b5d; border-radius: 99px; padding: 0 5px; font-size: 0.65rem; font-weight: 700; }
  .rot-filter-active .rot-filter-count { background: #ae2012; color: #fff; }

  /* Legend */
  .rot-legend { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 12px; }
  .rot-legend-item { display: flex; align-items: center; gap: 5px; font-size: 0.72rem; color: #7d6b5d; font-weight: 500; }
  .rot-legend-dot { width: 9px; height: 9px; border-radius: 3px; flex-shrink: 0; }

  /* Table */
  .rot-table-wrap { overflow-x: auto; border-radius: 10px; border: 1px solid #f5ebe0; }
  .rot-table { width: 100%; border-collapse: collapse; font-size: 0.84rem; min-width: 750px; }
  .rot-th { text-align: left; padding: 0.6rem 0.85rem; color: #a68b66; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; background: #fdfbf7; border-bottom: 1px solid #f5ebe0; white-space: nowrap; }

  /* Colored rows */
  .rot-tr { transition: filter 0.12s; background: var(--row-bg, #fff); }
  .rot-tr:hover { filter: brightness(0.97); }
  .rot-td { padding: 0.72rem 0.85rem; color: #4a3f35; border-bottom: 1px solid var(--row-border, #fdfbf7); vertical-align: middle; white-space: nowrap; font-size: 0.84rem; background: transparent; }
  .rot-tr:last-child .rot-td { border-bottom: none; }

  .rot-order-id { font-family: 'Sora', sans-serif; font-weight: 700; color: #ae2012; font-size: 0.82rem; }
  .rot-customer { font-weight: 600; color: #2d241e; font-size: 0.84rem; }
  .rot-meta { display: inline-flex; align-items: center; gap: 4px; color: #a68b66; font-size: 0.72rem; margin-top: 2px; }
  .rot-area { color: #7d6b5d; }
  .rot-vendor { font-size: 0.82rem; color: #4a3f35; font-weight: 500; }
  .rot-unassigned { color: #e9c46a; font-weight: 600; font-size: 0.8rem; }
  .rot-amount { font-weight: 700; color: #2d241e; font-size: 0.88rem; }
  .rot-time { color: #a68b66; font-size: 0.75rem; }
  .rot-action-btn { display: inline-flex; align-items: center; gap: 5px; padding: 0.32rem 0.75rem; background: #fdfbf7; color: #ae2012; border: none; border-radius: 7px; font-size: 0.76rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: background 0.15s; white-space: nowrap; }
  .rot-action-btn:hover { background: #f5ebe0; }
  .rot-empty-row { text-align: center; padding: 2rem; color: #a68b66; font-size: 0.85rem; }

  /* Footer + Pagination */
  .rot-footer { margin-top: 12px; padding-top: 10px; border-top: 1px solid #f5ebe0; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
  .rot-footer-count { font-size: 0.78rem; color: #a68b66; }
  .rot-pagination { display: flex; align-items: center; gap: 4px; }
  .rot-pg-btn { min-width: 30px; height: 30px; padding: 0 6px; border: 1.5px solid #e9d8bf; border-radius: 7px; background: #fff; color: #5d4037; font-size: 0.78rem; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.15s; display: inline-flex; align-items: center; justify-content: center; }
  .rot-pg-btn:hover:not(:disabled) { background: #fdfbf7; border-color: #e9d8bf; color: #ae2012; }
  .rot-pg-btn:disabled { opacity: 0.35; cursor: not-allowed; }
  .rot-pg-active { background: #ae2012 !important; border-color: #ae2012 !important; color: #fff !important; }
  .rot-pg-ellipsis { font-size: 0.82rem; color: #a68b66; padding: 0 2px; }

  /* Mobile cards */
  .rot-mobile-list { display: none; }
  .rot-mobile-card { border: 1.5px solid #f5ebe0; border-radius: 12px; padding: 0.9rem; margin-bottom: 8px; }
  .rot-mc-row1 { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
  .rot-mc-name { font-weight: 700; color: #2d241e; font-size: 0.9rem; margin-bottom: 4px; }
  .rot-mc-details { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 8px; }
  .rot-mc-bottom { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 10px; padding: 0.6rem 0; border-top: 1px solid rgba(0,0,0,0.06); border-bottom: 1px solid rgba(0,0,0,0.06); }
  .rot-mc-info { display: flex; flex-direction: column; gap: 2px; }
  .rot-mc-label { font-size: 0.66rem; color: #a68b66; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
  .rot-mc-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 2px; }
  .rot-time-small { font-size: 0.72rem; color: #a68b66; }
  .rot-empty-mobile { text-align: center; padding: 2rem; color: #a68b66; font-size: 0.85rem; }

  @media (max-width: 700px) {
    .rot-table-wrap { display: none; }
    .rot-mobile-list { display: block; }
  }
  @media (max-width: 480px) {
    .rot-card { padding: 1rem; }
    .rot-filter { font-size: 0.7rem; padding: 0.28rem 0.6rem; }
    .rot-header-right { width: 100%; justify-content: space-between; }
  }
`;
