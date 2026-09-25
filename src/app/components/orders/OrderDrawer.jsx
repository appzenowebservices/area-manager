'use client'
import { useState, useEffect, useRef } from "react";
import OrderStatusBadge from "./OrderStatusBadge";
import AssignModal      from "./AssignModal";
import { ORDER_STATUSES } from "../../data/ordersData";
// import { ORDER_STATUSES } from "../../data/ordersData";

/**
 * OrderDrawer — BUG FIX: null guard added before order.items
 * File: src/components/orders/OrderDrawer.jsx
 *
 * Slide-in panel from RIGHT showing full order detail.
 * Props:
 *   order      object | null
 *   onClose    fn
 *   onUpdate   fn(updatedOrder)
 */
export default function OrderDrawer({ order: initialOrder, onClose, onUpdate }) {
  const [order,   setOrder]   = useState(null);
  const [modal,   setModal]   = useState(null);   // "vendor" | "delivery"
  const [visible, setVisible] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (initialOrder) {
      setOrder(initialOrder);
      // Reset scroll to top when new order opens
      if (bodyRef.current) bodyRef.current.scrollTop = 0;
      requestAnimationFrame(() => setVisible(true));
      // Lock page scroll when drawer opens
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      const t = setTimeout(() => setOrder(null), 300);
      // Restore page scroll when drawer closes
      document.body.style.overflow = "";
      return () => clearTimeout(t);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [initialOrder]);

  // ── CRITICAL FIX: guard against null order ──
  if (!order) return null;

  const subtotal = order.items.reduce((s, i) => s + i.qty * i.price, 0);

  const handleAssign = (type, person) => {
    const updated = {
      ...order,
      [type]: { id: person.id, name: person.name, phone: person.phone },
    };
    setOrder(updated);
    onUpdate?.(updated);
    setModal(null);
  };

  const handleStatusChange = (newStatus) => {
    const updated = { ...order, status: newStatus };
    setOrder(updated);
    onUpdate?.(updated);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <>
      <style>{css}</style>

      {/* Backdrop */}
      <div
        className={`od-backdrop${visible ? " od-backdrop-in" : ""}`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className={`od-drawer${visible ? " od-drawer-in" : ""}`}>

        {/* ── Header ── */}
        <div className="od-dh">
          <div className="od-dh-left">
            <span className="od-dh-id">{order.id}</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <button className="od-close-btn" onClick={handleClose} aria-label="Close">✕</button>
        </div>
        <div className="od-dh-meta">
          📅 {order.date} &nbsp;·&nbsp; 🕐 {order.time}
        </div>

        {/* ── Scrollable body ── */}
        <div className="od-body" ref={bodyRef}>

          {/* Customer */}
          <DrawerSection title="👤 Customer">
            <Row label="Name"    val={order.customer.name} />
            <Row label="Phone"   val={`📞 ${order.customer.phone}`} />
            <Row label="Area"    val={`📍 ${order.area}`} />
            <Row label="Address" val={order.customer.address} full />
            {order.notes && (
              <div className="od-note">📝 {order.notes}</div>
            )}
          </DrawerSection>

          {/* Items */}
          <DrawerSection title={`📦 Items (${order.items.length})`}>
            <div className="od-items">
              {order.items.map((item, i) => (
                <div key={i} className="od-item-row">
                  <span className="od-item-name">{item.name}</span>
                  <span className="od-item-meta">×{item.qty} × ₹{item.price}</span>
                  <span className="od-item-total">₹{(item.qty * item.price).toLocaleString()}</span>
                </div>
              ))}
            </div>
            {/* Bill */}
            <div className="od-bill">
              <BillRow label="Subtotal" val={`₹${subtotal.toLocaleString()}`} />
              {order.discount > 0 && (
                <BillRow label="Discount" val={`-₹${order.discount}`} green />
              )}
              {order.deliveryCharge > 0 && (
                <BillRow label="Delivery" val={`+₹${order.deliveryCharge}`} />
              )}
              <BillRow label="Total" val={`₹${order.finalAmount.toLocaleString()}`} bold />
            </div>
          </DrawerSection>

          {/* Payment */}
          <DrawerSection title="💳 Payment">
            <Row label="Method" val={order.payment} />
            <Row label="Status" val={<OrderStatusBadge status={order.paymentStatus} type="payment" size="sm" />} />
          </DrawerSection>

          {/* Vendor */}
          <DrawerSection title="🏪 Vendor">
            {order.vendor.id ? (
              <>
                <Row label="Name"  val={order.vendor.name} />
                <Row label="Phone" val={`📞 ${order.vendor.phone}`} />
              </>
            ) : (
              <p className="od-unassigned">⚠️ No vendor assigned</p>
            )}
            {order.status !== "Delivered" && order.status !== "Cancelled" && (
              <button className="od-assign-btn od-btn-blue" onClick={() => setModal("vendor")}>
                {order.vendor.id ? "🔄 Reassign Vendor" : "➕ Assign Vendor"}
              </button>
            )}
          </DrawerSection>

          {/* Delivery */}
          <DrawerSection title="🚴 Delivery Boy">
            {order.delivery.id ? (
              <>
                <Row label="Name"  val={order.delivery.name} />
                <Row label="Phone" val={`📞 ${order.delivery.phone}`} />
              </>
            ) : (
              <p className="od-unassigned">⚠️ No delivery boy assigned</p>
            )}
            {order.status !== "Delivered" && order.status !== "Cancelled" && (
              <button className="od-assign-btn od-btn-green" onClick={() => setModal("delivery")}>
                {order.delivery.id ? "🔄 Reassign Delivery Boy" : "➕ Assign Delivery Boy"}
              </button>
            )}
          </DrawerSection>

          {/* Status Change */}
          <DrawerSection title="🔄 Change Status">
            <div className="od-status-grid">
              {ORDER_STATUSES.filter(s => s !== "All").map(s => (
                <button
                  key={s}
                  className={`od-status-btn${order.status === s ? " od-status-active" : ""}`}
                  style={order.status === s ? activeStyle(s) : {}}
                  onClick={() => handleStatusChange(s)}
                >
                  {statusEmoji(s)} {s}
                </button>
              ))}
            </div>
          </DrawerSection>

        </div>
      </div>

      {/* Assign Modals */}
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
    </>
  );
}

/* ── Sub-components ── */
function DrawerSection({ title, children }) {
  return (
    <div className="od-section">
      <div className="od-section-title">{title}</div>
      {children}
    </div>
  );
}
function Row({ label, val, full }) {
  return (
    <div className={`od-row${full ? " od-row-full" : ""}`}>
      <span className="od-row-label">{label}</span>
      <span className="od-row-val">{val}</span>
    </div>
  );
}
function BillRow({ label, val, bold, green }) {
  return (
    <div className={`od-bill-row${bold ? " od-bill-total" : ""}`}>
      <span>{label}</span>
      <span style={green ? { color: "#10b981", fontWeight: 700 } : {}}>{val}</span>
    </div>
  );
}
function statusEmoji(s) {
  return { Pending: "⏳", Processing: "🔄", Delivered: "✅", Cancelled: "❌" }[s] || "";
}
function activeStyle(s) {
  const m = {
    Pending:    { background: "#fef3c7", color: "#f59e0b", borderColor: "#fde68a" },
    Processing: { background: "#dbeafe", color: "#1a73e8", borderColor: "#bfdbfe" },
    Delivered:  { background: "#d1fae5", color: "#10b981", borderColor: "#6ee7b7" },
    Cancelled:  { background: "#fee2e2", color: "#ef4444", borderColor: "#fecaca" },
  };
  return m[s] || {};
}

const css = `
  .od-backdrop { position:fixed; inset:0; background:rgba(15,23,42,0); z-index:1200; transition:background 0.28s ease; pointer-events:none; }
  .od-backdrop-in { background:rgba(15,23,42,0.45); backdrop-filter:blur(2px); pointer-events:all; }

  /* Drawer: above navbar (z-index 1201 beats typical navbar 1000-1100) */
  .od-drawer {
    position: fixed;
    top: 0; right: 0;
    width: min(480px, 100vw);
    background: #f8faff;
    z-index: 1201;
    display: flex;
    flex-direction: column;
    height: 100dvh;
    max-height: 100dvh;
    overflow: hidden;
    box-shadow: -8px 0 40px rgba(15,23,42,0.15);
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.32,0.72,0,1);
    border-left: 1px solid #e2e8f0;
  }
  .od-drawer-in { transform: translateX(0); }

  /* Header: fixed, never scrolls */
  .od-dh { display:flex; justify-content:space-between; align-items:center; padding:1.1rem 1.3rem 0.6rem; background:#fff; border-bottom:1px solid #e2e8f0; flex-shrink:0; flex-grow:0; }
  .od-dh-left { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
  .od-dh-id { font-family:'Sora',sans-serif; font-size:1.05rem; font-weight:800; color:#1a73e8; letter-spacing:-0.01em; }
  .od-dh-meta { padding:0.4rem 1.3rem 0.75rem; font-size:0.76rem; color:#94a3b8; background:#fff; border-bottom:1px solid #f1f5f9; flex-shrink:0; flex-grow:0; }
  .od-close-btn { width:32px; height:32px; display:flex; align-items:center; justify-content:center; background:#f0f5ff; border:none; border-radius:8px; font-size:0.9rem; color:#64748b; cursor:pointer; transition:background 0.15s,color 0.15s; flex-shrink:0; }
  .od-close-btn:hover { background:#fee2e2; color:#ef4444; }

  /* Body: takes remaining height, scrolls internally */
  .od-body {
    flex: 1 1 0;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 10px;
    scroll-snap-type: none;
  }
  .od-body::-webkit-scrollbar { width: 4px; }
  .od-body::-webkit-scrollbar-track { background: transparent; }
  .od-body::-webkit-scrollbar-thumb { background: #bfdbfe; border-radius: 99px; }
  .od-body::-webkit-scrollbar-thumb:hover { background: #93c5fd; }

  .od-section { background:#fff; border-radius:14px; border:1px solid #e2e8f0; padding:1rem 1.1rem; box-shadow:0 1px 3px rgba(15,23,42,0.04); }
  .od-section-title { font-family:'Sora',sans-serif; font-size:0.82rem; font-weight:700; color:#0f172a; margin-bottom:10px; padding-bottom:8px; border-bottom:1px solid #f1f5f9; }
  .od-row { display:flex; justify-content:space-between; align-items:flex-start; gap:8px; padding:0.38rem 0; border-bottom:1px solid #f8faff; font-size:0.83rem; }
  .od-row:last-of-type { border-bottom:none; }
  .od-row-full { flex-direction:column; gap:2px; }
  .od-row-label { font-size:0.68rem; color:#94a3b8; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; flex-shrink:0; padding-top:2px; }
  .od-row-val { color:#334155; font-weight:500; text-align:right; font-size:0.83rem; }
  .od-row-full .od-row-val { text-align:left; font-size:0.8rem; color:#64748b; }
  .od-note { background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:0.4rem 0.7rem; font-size:0.75rem; color:#92400e; margin-top:6px; }
  .od-items { display:flex; flex-direction:column; margin-bottom:10px; }
  .od-item-row { display:flex; align-items:center; gap:8px; padding:0.5rem 0; border-bottom:1px solid #f1f5f9; font-size:0.82rem; }
  .od-item-row:last-child { border-bottom:none; }
  .od-item-name { flex:1; color:#334155; font-weight:500; }
  .od-item-meta { color:#94a3b8; font-size:0.74rem; white-space:nowrap; }
  .od-item-total { font-weight:700; color:#0f172a; white-space:nowrap; min-width:60px; text-align:right; }
  .od-bill { border-top:1px dashed #e2e8f0; padding-top:8px; display:flex; flex-direction:column; gap:4px; }
  .od-bill-row { display:flex; justify-content:space-between; font-size:0.8rem; color:#64748b; }
  .od-bill-total { font-size:0.92rem; font-weight:800; color:#0f172a; border-top:1px solid #e2e8f0; padding-top:6px; margin-top:2px; }
  .od-unassigned { font-size:0.8rem; color:#f59e0b; font-weight:600; margin-bottom:8px; }
  .od-assign-btn { width:100%; padding:0.6rem; border:none; border-radius:9px; font-size:0.82rem; font-weight:700; font-family:inherit; cursor:pointer; margin-top:8px; transition:opacity 0.15s; }
  .od-assign-btn:hover { opacity:0.85; }
  .od-btn-blue  { background:#e8f0fe; color:#1a73e8; }
  .od-btn-green { background:#d1fae5; color:#10b981; }
  .od-status-grid { display:grid; grid-template-columns:1fr 1fr; gap:7px; }
  .od-status-btn { padding:0.55rem; border:1.5px solid #e2e8f0; border-radius:9px; background:#fff; color:#64748b; font-size:0.78rem; font-weight:600; font-family:inherit; cursor:pointer; transition:all 0.15s; }
  .od-status-btn:hover:not(.od-status-active) { background:#f0f5ff; border-color:#bfdbfe; }
  @media (max-width: 520px) { .od-drawer { width:100vw; } }
`;
