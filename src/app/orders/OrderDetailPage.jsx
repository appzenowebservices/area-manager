// src/pages/orders/OrderDetailPage.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper";
import OrderStatusBadge from "../components/orders/OrderStatusBadge";
import AssignModal      from "../components/orders/AssignModal";
import { ORDERS, ORDER_STATUSES } from "../data/ordersData";

/**
 * OrderDetailPage
 * File: src/pages/orders/OrderDetailPage.jsx
 *
 * Full detail view:
 *  - Customer info
 *  - Items list
 *  - Payment summary
 *  - Vendor + Delivery assignment
 *  - Status change
 */
export default function OrderDetailPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  // Local state — in real app this would come from API / store
  const base = ORDERS.find(o => o.id === id);
  const [order, setOrder] = useState(base || null);
  const [modal, setModal] = useState(null); // "vendor" | "delivery" | null

  if (!order) {
    return (
      <PageWrapper>
        <div style={{ textAlign: "center", padding: "4rem", color: "#a68b66" }}>
          <div style={{ fontSize: "3rem" }}>🔍</div>
          <p style={{ marginTop: 12, fontWeight: 600 }}>Order not found: {id}</p>
          <button onClick={() => navigate("/orders")} style={backBtnStyle}>
            ← Back to Orders
          </button>
        </div>
      </PageWrapper>
    );
  }

  const handleAssign = (type, person) => {
    setOrder(prev => ({
      ...prev,
      [type]: { id: person.id, name: person.name, phone: person.phone },
    }));
    setModal(null);
  };

  const handleStatusChange = (newStatus) => {
    setOrder(prev => ({ ...prev, status: newStatus }));
  };

  const subtotal = order.items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <PageWrapper>
      <style>{css}</style>

      {/* ── Back + Title ── */}
      <div className="od-topbar">
        <button className="od-back" onClick={() => navigate("/orders")}>
          ← Back
        </button>
        <div className="od-heading">
          <h1 className="od-title">{order.id}</h1>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="od-meta-time">
          📅 {order.date} &nbsp;·&nbsp; 🕐 {order.time}
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="od-grid">

        {/* ── LEFT COLUMN ── */}
        <div className="od-left">

          {/* Customer Card */}
          <Section title="👤 Customer Info">
            <InfoRow label="Name"    value={order.customer.name} />
            <InfoRow label="Phone"   value={`📞 ${order.customer.phone}`} />
            <InfoRow label="Address" value={`📍 ${order.customer.address}`} fullWidth />
            <InfoRow label="Area"    value={order.area} />
            {order.notes && <InfoRow label="Note" value={`📝 ${order.notes}`} fullWidth highlight />}
          </Section>

          {/* Items Card */}
          <Section title={`📦 Order Items (${order.items.length})`}>
            <div className="od-items-table-wrap">
              <table className="od-items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, i) => (
                    <tr key={i}>
                      <td>{item.name}</td>
                      <td>×{item.qty}</td>
                      <td>₹{item.price}</td>
                      <td className="od-item-total">₹{(item.qty * item.price).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bill summary */}
            <div className="od-bill">
              <BillRow label="Subtotal"         val={`₹${subtotal.toLocaleString()}`} />
              {order.discount > 0 && <BillRow label="Discount" val={`-₹${order.discount}`} accent="#0c831f" />}
              {order.deliveryCharge > 0 && <BillRow label="Delivery" val={`₹${order.deliveryCharge}`} />}
              <BillRow label="Total" val={`₹${order.finalAmount.toLocaleString()}`} bold />
            </div>
          </Section>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="od-right">

          {/* Payment Card */}
          <Section title="💳 Payment">
            <InfoRow label="Method"  value={order.payment} />
            <InfoRow label="Status"  value={<OrderStatusBadge status={order.paymentStatus} type="payment" size="sm" />} />
            <InfoRow label="Amount"  value={`₹${order.finalAmount.toLocaleString()}`} bold />
          </Section>

          {/* Vendor Card */}
          <Section title="🏪 Vendor">
            {order.vendor.id ? (
              <>
                <InfoRow label="Name"  value={order.vendor.name} />
                <InfoRow label="Phone" value={`📞 ${order.vendor.phone}`} />
              </>
            ) : (
              <p className="od-unassigned-text">No vendor assigned yet.</p>
            )}
            {order.status !== "Delivered" && order.status !== "Cancelled" && (
              <button
                className="od-assign-btn od-assign-vendor"
                onClick={() => setModal("vendor")}
              >
                {order.vendor.id ? "🔄 Reassign Vendor" : "➕ Assign Vendor"}
              </button>
            )}
          </Section>

          {/* Delivery Card */}
          <Section title="🚴 Delivery Boy">
            {order.delivery.id ? (
              <>
                <InfoRow label="Name"  value={order.delivery.name} />
                <InfoRow label="Phone" value={`📞 ${order.delivery.phone}`} />
              </>
            ) : (
              <p className="od-unassigned-text">No delivery boy assigned yet.</p>
            )}
            {order.status !== "Delivered" && order.status !== "Cancelled" && (
              <button
                className="od-assign-btn od-assign-delivery"
                onClick={() => setModal("delivery")}
              >
                {order.delivery.id ? "🔄 Reassign Delivery Boy" : "➕ Assign Delivery Boy"}
              </button>
            )}
          </Section>

          {/* Status Change Card */}
          <Section title="🔄 Change Status">
            <div className="od-status-btns">
              {ORDER_STATUSES.filter(s => s !== "All").map(s => (
                <button
                  key={s}
                  className={`od-status-btn${order.status === s ? " od-status-btn-active" : ""}`}
                  style={order.status === s ? getActiveStyle(s) : {}}
                  onClick={() => handleStatusChange(s)}
                >
                  {statusEmoji(s)} {s}
                </button>
              ))}
            </div>
          </Section>

        </div>
      </div>

      {/* ── Assign Modals ── */}
      {modal === "vendor" && (
        <AssignModal
          type="vendor"
          currentId={order.vendor.id}
          onConfirm={p => handleAssign("vendor", p)}
          onClose={() => setModal(null)}
        />
      )}
      {modal === "delivery" && (
        <AssignModal
          type="delivery"
          currentId={order.delivery.id}
          onConfirm={p => handleAssign("delivery", p)}
          onClose={() => setModal(null)}
        />
      )}
    </PageWrapper>
  );
}

/* ── Sub-components ── */
function Section({ title, children }) {
  return (
    <div className="od-section">
      <div className="od-section-title">{title}</div>
      {children}
    </div>
  );
}

function InfoRow({ label, value, fullWidth, bold, highlight }) {
  return (
    <div className={`od-info-row${fullWidth ? " od-full" : ""}${highlight ? " od-highlight" : ""}`}>
      <span className="od-info-label">{label}</span>
      <span className={`od-info-val${bold ? " od-bold" : ""}`}>{value}</span>
    </div>
  );
}

function BillRow({ label, val, bold, accent }) {
  return (
    <div className={`od-bill-row${bold ? " od-bill-total" : ""}`}>
      <span>{label}</span>
      <span style={accent ? { color: accent, fontWeight: 700 } : {}}>{val}</span>
    </div>
  );
}

function statusEmoji(s) {
  return { Pending: "⏳", Processing: "🔄", Delivered: "✅", Cancelled: "❌" }[s] || "";
}

function getActiveStyle(s) {
  const map = {
    Pending:    { background: "#faedcc", color: "#e9c46a", borderColor: "#faedcc" },
    Processing: { background: "#f5ebe0", color: "#ae2012", borderColor: "#e9d8bf" },
    Delivered:  { background: "#d3ebd8", color: "#0c831f", borderColor: "#93d3a0" },
    Cancelled:  { background: "#fbebe9", color: "#d32f2f", borderColor: "#f6d4ce" },
  };
  return map[s] || {};
}

const backBtnStyle = {
  marginTop: 16,
  padding: "0.6rem 1.4rem",
  background: "#ae2012",
  color: "#fff",
  border: "none",
  borderRadius: 10,
  fontWeight: 700,
  fontSize: "0.88rem",
  cursor: "pointer",
  fontFamily: "inherit",
};

const css = `
  .od-topbar {
    margin-bottom: 1.5rem;
  }
  .od-back {
    background: none;
    border: none;
    color: #ae2012;
    font-size: 0.85rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    padding: 0;
    margin-bottom: 10px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .od-heading {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }
  .od-title {
    font-family: 'Sora', sans-serif;
    font-size: clamp(1.3rem, 3vw, 1.7rem);
    font-weight: 800;
    color: #2d241e;
    letter-spacing: -0.02em;
    margin: 0;
  }
  .od-meta-time {
    font-size: 0.8rem;
    color: #a68b66;
    margin-top: 5px;
  }

  /* Grid */
  .od-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 16px;
    align-items: start;
  }
  .od-left, .od-right {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* Section card */
  .od-section {
    background: #fff;
    border-radius: 16px;
    border: 1px solid #e9d8bf;
    padding: 1.2rem 1.3rem;
    box-shadow: 0 1px 4px rgba(45, 36, 30,0.04);
  }
  .od-section-title {
    font-family: 'Sora', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    color: #2d241e;
    margin-bottom: 14px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f5ebe0;
  }

  /* Info rows */
  .od-info-row {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    padding: 0.45rem 0;
    border-bottom: 1px solid #fdfbf7;
  }
  .od-info-row:last-of-type { border-bottom: none; }
  .od-full { flex-direction: column; gap: 3px; }
  .od-highlight {
    background: #fdf6e4;
    border-radius: 8px;
    padding: 0.45rem 0.7rem;
    border: 1px solid #faedcc;
    border-bottom: 1px solid #faedcc !important;
  }
  .od-info-label {
    font-size: 0.72rem;
    color: #a68b66;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex-shrink: 0;
    padding-top: 2px;
  }
  .od-info-val {
    font-size: 0.85rem;
    color: #4a3f35;
    font-weight: 500;
    text-align: right;
  }
  .od-full .od-info-val { text-align: left; }
  .od-bold { font-weight: 800; color: #2d241e; font-size: 0.95rem; }

  /* Items table */
  .od-items-table-wrap {
    overflow-x: auto;
    border-radius: 10px;
    border: 1px solid #f5ebe0;
    margin-bottom: 14px;
  }
  .od-items-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.84rem;
    min-width: 340px;
  }
  .od-items-table th {
    background: #fdfbf7;
    padding: 0.55rem 0.85rem;
    text-align: left;
    font-size: 0.68rem;
    font-weight: 700;
    color: #a68b66;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    border-bottom: 1px solid #e9d8bf;
  }
  .od-items-table td {
    padding: 0.65rem 0.85rem;
    border-bottom: 1px solid #f5ebe0;
    color: #4a3f35;
  }
  .od-items-table tr:last-child td { border-bottom: none; }
  .od-item-total { font-weight: 700; color: #2d241e; }

  /* Bill */
  .od-bill {
    border-top: 1px solid #f5ebe0;
    padding-top: 10px;
  }
  .od-bill-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.83rem;
    color: #7d6b5d;
    padding: 3px 0;
  }
  .od-bill-total {
    font-size: 0.95rem;
    font-weight: 800;
    color: #2d241e;
    border-top: 1px dashed #e9d8bf;
    padding-top: 8px;
    margin-top: 4px;
  }

  /* Unassigned */
  .od-unassigned-text {
    font-size: 0.82rem;
    color: #e9c46a;
    font-weight: 600;
    margin-bottom: 10px;
  }

  /* Assign buttons */
  .od-assign-btn {
    width: 100%;
    padding: 0.65rem;
    border-radius: 10px;
    border: none;
    font-size: 0.85rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    margin-top: 10px;
    transition: opacity 0.15s;
  }
  .od-assign-btn:hover { opacity: 0.88; }
  .od-assign-vendor   { background: #fdfbf7; color: #ae2012; }
  .od-assign-delivery { background: #d3ebd8; color: #0c831f; }

  /* Status change */
  .od-status-btns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .od-status-btn {
    padding: 0.6rem 0.5rem;
    border: 1.5px solid #e9d8bf;
    border-radius: 10px;
    background: #fff;
    color: #7d6b5d;
    font-size: 0.8rem;
    font-weight: 600;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .od-status-btn:hover:not(.od-status-btn-active) {
    background: #fdfbf7;
    border-color: #e9d8bf;
  }

  /* Responsive */
  @media (max-width: 900px) {
    .od-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 480px) {
    .od-status-btns { grid-template-columns: 1fr 1fr; }
    .od-section { padding: 1rem; }
  }
`;


