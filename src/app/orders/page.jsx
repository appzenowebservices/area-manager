'use client'
import { useState, useMemo } from "react";
import PageWrapper     from "../components/layout/PageWrapper";
import OrderFilters    from "../components/orders/OrderFilters";
import OrdersTable     from "../components/orders/OrdersTable";
import OrderCard       from "../components/orders/OrderCard";
import OrderDrawer     from "../components/orders/OrderDrawer";
import { ORDERS } from "../data/ordersData";
// import { ORDERS }      from "../data/ordersData";

export default function OrdersPage() {
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo,   setDateTo]   = useState("");
  const [area,     setArea]     = useState("All");

  // Drawer state
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Local orders state so updates from drawer persist
  const [orders, setOrders] = useState(ORDERS);

  const areas = useMemo(() => [...new Set(orders.map(o => o.area))].sort(), [orders]);

  const filtered = useMemo(() => {
    return orders.filter(o => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        o.id.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q);
      const matchStatus = status === "All" || o.status === status;
      const matchArea   = area   === "All" || o.area   === area;
      return matchSearch && matchStatus && matchArea;
    });
  }, [search, status, area, orders]);

  const handleReset = () => {
    setSearch(""); setStatus("All"); setDateFrom(""); setDateTo(""); setArea("All");
  };

  // When drawer updates an order (assign / status change)
  const handleOrderUpdate = (updated) => {
    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
    setSelectedOrder(updated);
  };

  const counts = {
    Pending:    orders.filter(o => o.status === "Pending").length,
    Processing: orders.filter(o => o.status === "Processing").length,
    Delivered:  orders.filter(o => o.status === "Delivered").length,
    Cancelled:  orders.filter(o => o.status === "Cancelled").length,
  };
  const totalRevenue = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((s, o) => s + o.finalAmount, 0);

  return (
    <PageWrapper>
      <style>{css}</style>

      {/* Header */}
      <div className="op-header">
        <div>
          <h1 className="op-title">Orders</h1>
          <p className="op-sub">Track and manage all customer orders</p>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="op-summary">
        {[
          { label: "Total",      val: orders.length,           color: "#ae2012", bg: "#fdfbf7" },
          { label: "Pending",    val: counts.Pending,          color: "#e9c46a", bg: "#faedcc" },
          { label: "Processing", val: counts.Processing,       color: "#ae2012", bg: "#f5ebe0" },
          { label: "Delivered",  val: counts.Delivered,        color: "#0c831f", bg: "#d3ebd8" },
          { label: "Cancelled",  val: counts.Cancelled,        color: "#d32f2f", bg: "#fbebe9" },
          { label: "Revenue",    val: `₹${totalRevenue.toLocaleString()}`, color: "#0c831f", bg: "#d3ebd8" },
        ].map(s => (
          <div key={s.label} className="op-sum-chip" style={{ background: s.bg }}>
            <span className="op-sum-val" style={{ color: s.color }}>{s.val}</span>
            <span className="op-sum-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <OrderFilters
        search={search}     onSearch={setSearch}
        status={status}     onStatus={setStatus}
        dateFrom={dateFrom} onDateFrom={setDateFrom}
        dateTo={dateTo}     onDateTo={setDateTo}
        area={area}         onArea={setArea}
        areas={areas}
        total={filtered.length}
        onReset={handleReset}
      />

      {/* Desktop Table */}
      <div className="op-desktop">
        <OrdersTable orders={filtered} onView={setSelectedOrder} />
      </div>

      {/* Mobile Cards */}
      <div className="op-mobile">
        {filtered.length === 0 ? (
          <div className="op-empty">
            <span style={{ fontSize: "2.5rem" }}>📭</span>
            <p>No orders found</p>
          </div>
        ) : (
          <div className="op-card-list">
            {filtered.map(order => (
              <OrderCard key={order.id} order={order} onView={setSelectedOrder} />
            ))}
          </div>
        )}
      </div>

      {/* Drawer */}
      <OrderDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdate={handleOrderUpdate}
      />
    </PageWrapper>
  );
}

const css = `
  .op-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 10px; }
  .op-title { font-family: 'Sora', sans-serif; font-size: clamp(1.2rem, 3vw, 1.5rem); font-weight: 800; color: #2d241e; letter-spacing: -0.02em; margin: 0; }
  .op-sub { font-size: 0.82rem; color: #a68b66; margin-top: 3px; }
  .op-summary { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 1.25rem; }
  .op-sum-chip { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 0.55rem 1rem; border-radius: 12px; min-width: 80px; flex: 1; }
  .op-sum-val { font-family: 'Sora', sans-serif; font-size: 1.15rem; font-weight: 800; line-height: 1; }
  .op-sum-label { font-size: 0.68rem; color: #7d6b5d; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap; }
  .op-desktop { display: block; }
  .op-mobile  { display: none; }
  .op-card-list { display: flex; flex-direction: column; gap: 10px; }
  .op-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; padding: 4rem 1rem; color: #a68b66; font-size: 0.88rem; }
  @media (max-width: 768px) {
    .op-desktop { display: none; }
    .op-mobile  { display: block; }
    .op-sum-chip { min-width: 60px; padding: 0.45rem 0.6rem; }
    .op-sum-val  { font-size: 0.95rem; }
  }
  @media (max-width: 480px) {
    .op-summary { gap: 6px; }
    .op-sum-chip { min-width: 50px; }
  }
`;
