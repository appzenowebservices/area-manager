// src/components/orders/OrderCard.jsx
import OrderStatusBadge from "./OrderStatusBadge";

/**
 * OrderCard — Mobile card for a single order
 * Props:  order, onView fn(order)
 */
export default function OrderCard({ order, onView }) {
  return (
    <>
      <style>{css}</style>
      <div className="oc-card">
        <div className="oc-top">
          <span className="oc-id">{order.id}</span>
          <OrderStatusBadge status={order.status} size="sm" />
        </div>
        <div className="oc-customer">{order.customer.name}</div>
        <div className="oc-meta-row">
          <span className="oc-meta">📞 {order.customer.phone}</span>
          <span className="oc-meta">📍 {order.area}</span>
        </div>
        <div className="oc-meta-row" style={{ marginTop: 2 }}>
          <span className="oc-meta">🕐 {order.date}, {order.time}</span>
          <span className="oc-meta">📦 {order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
        </div>
        <div className="oc-divider" />
        <div className="oc-info-grid">
          <div className="oc-info-item"><span className="oc-info-label">Amount</span><span className="oc-info-val oc-amount">₹{order.finalAmount.toLocaleString()}</span></div>
          <div className="oc-info-item"><span className="oc-info-label">Payment</span><span className="oc-info-val">{order.payment}</span></div>
          <div className="oc-info-item"><span className="oc-info-label">Pay Status</span><OrderStatusBadge status={order.paymentStatus} type="payment" size="sm" /></div>
          <div className="oc-info-item"><span className="oc-info-label">Vendor</span><span className={`oc-info-val ${order.vendor.id ? "" : "oc-unassigned"}`}>{order.vendor.name}</span></div>
          <div className="oc-info-item"><span className="oc-info-label">Delivery Boy</span><span className={`oc-info-val ${order.delivery.id ? "" : "oc-unassigned"}`}>{order.delivery.name}</span></div>
          {order.discount > 0 && <div className="oc-info-item"><span className="oc-info-label">Discount</span><span className="oc-info-val" style={{ color: "#0c831f", fontWeight: 700 }}>-₹{order.discount}</span></div>}
        </div>
        {order.notes && <div className="oc-notes">📝 {order.notes}</div>}
        <button className="oc-btn" onClick={() => onView(order)}>View Full Details →</button>
      </div>
    </>
  );
}

const css = `
  .oc-card { background: #fff; border-radius: 14px; border: 1px solid #e9d8bf; padding: 1rem 1.1rem; box-shadow: 0 1px 4px rgba(45, 36, 30,0.04); transition: box-shadow 0.18s; }
  .oc-card:hover { box-shadow: 0 4px 16px rgba(45, 36, 30,0.08); }
  .oc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .oc-id { font-family: 'Sora', sans-serif; font-size: 0.85rem; font-weight: 700; color: #ae2012; }
  .oc-customer { font-size: 0.95rem; font-weight: 700; color: #2d241e; margin-bottom: 4px; }
  .oc-meta-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 2px; }
  .oc-meta { font-size: 0.75rem; color: #7d6b5d; }
  .oc-divider { height: 1px; background: #f5ebe0; margin: 10px 0; }
  .oc-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px 12px; margin-bottom: 10px; }
  .oc-info-item { display: flex; flex-direction: column; gap: 2px; }
  .oc-info-label { font-size: 0.62rem; color: #a68b66; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
  .oc-info-val { font-size: 0.82rem; color: #4a3f35; font-weight: 600; }
  .oc-amount { font-family: 'Sora', sans-serif; font-weight: 800; color: #2d241e; font-size: 0.9rem; }
  .oc-unassigned { color: #e9c46a !important; }
  .oc-notes { background: #fdf6e4; border: 1px solid #faedcc; border-radius: 8px; padding: 0.45rem 0.75rem; font-size: 0.76rem; color: #8a6420; margin-bottom: 10px; }
  .oc-btn { width: 100%; padding: 0.6rem; background: #fdfbf7; color: #ae2012; border: none; border-radius: 9px; font-size: 0.83rem; font-weight: 700; font-family: inherit; cursor: pointer; transition: background 0.15s; }
  .oc-btn:hover { background: #f5ebe0; }
  @media (max-width: 380px) { .oc-info-grid { grid-template-columns: repeat(2, 1fr); } }
`;
