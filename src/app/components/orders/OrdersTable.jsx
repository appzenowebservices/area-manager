// src/components/orders/OrdersTable.jsx
import OrderStatusBadge from "./OrderStatusBadge";

/**
 * OrdersTable — Desktop table view
 * Props:
 *   orders   array
 *   onView   fn(order)   ← opens drawer
 */
export default function OrdersTable({ orders, onView }) {
  return (
    <>
      <style>{css}</style>
      <div className="ot-wrap">
        <table className="ot-table">
          <thead>
            <tr>
              {["Order ID","Date & Time","Customer","Area","Items","Amount","Payment","Status","Vendor","Delivery","Action"].map(h => (
                <th key={h} className="ot-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={11} className="ot-empty">
                  <span style={{ fontSize: "2rem" }}>📭</span>
                  <p>No orders found for selected filters</p>
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="ot-tr">
                  <td className="ot-td"><span className="ot-id">{order.id}</span></td>
                  <td className="ot-td">
                    <div className="ot-date">{order.date}</div>
                    <div className="ot-time-small">{order.time}</div>
                  </td>
                  <td className="ot-td">
                    <div className="ot-customer">{order.customer.name}</div>
                    <div className="ot-phone">📞 {order.customer.phone}</div>
                  </td>
                  <td className="ot-td"><span className="ot-area">📍 {order.area}</span></td>
                  <td className="ot-td">
                    <span className="ot-items-count">{order.items.length} item{order.items.length > 1 ? "s" : ""}</span>
                  </td>
                  <td className="ot-td">
                    <div className="ot-amount">₹{order.finalAmount.toLocaleString()}</div>
                    {order.discount > 0 && <div className="ot-discount">-₹{order.discount} off</div>}
                  </td>
                  <td className="ot-td">
                    <div className="ot-pay-method">{order.payment}</div>
                    <OrderStatusBadge status={order.paymentStatus} type="payment" size="sm" />
                  </td>
                  <td className="ot-td"><OrderStatusBadge status={order.status} /></td>
                  <td className="ot-td">
                    <span className={order.vendor.id ? "ot-assigned" : "ot-unassigned"}>{order.vendor.name}</span>
                  </td>
                  <td className="ot-td">
                    <span className={order.delivery.id ? "ot-assigned" : "ot-unassigned"}>{order.delivery.name}</span>
                  </td>
                  <td className="ot-td">
                    <button className="ot-view-btn" onClick={() => onView(order)}>👁 View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

const css = `
  .ot-wrap { overflow-x: auto; border-radius: 14px; border: 1px solid #e9d8bf; }
  .ot-table { width: 100%; border-collapse: collapse; font-size: 0.83rem; min-width: 1050px; }
  .ot-th { text-align: left; padding: 0.65rem 0.9rem; background: #fdfbf7; color: #a68b66; font-size: 0.69rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #e9d8bf; white-space: nowrap; }
  .ot-th:first-child { border-radius: 14px 0 0 0; }
  .ot-th:last-child  { border-radius: 0 14px 0 0; }
  .ot-tr { transition: background 0.12s; }
  .ot-tr:hover .ot-td { background: #fdfbf7; }
  .ot-td { padding: 0.75rem 0.9rem; border-bottom: 1px solid #f5ebe0; vertical-align: middle; white-space: nowrap; background: #fff; transition: background 0.12s; }
  .ot-tr:last-child .ot-td { border-bottom: none; }
  .ot-id { font-family: 'Sora', sans-serif; font-weight: 700; color: #ae2012; font-size: 0.82rem; }
  .ot-date { font-weight: 600; color: #4a3f35; font-size: 0.82rem; }
  .ot-time-small { font-size: 0.7rem; color: #a68b66; margin-top: 2px; }
  .ot-customer { font-weight: 700; color: #2d241e; }
  .ot-phone { font-size: 0.72rem; color: #a68b66; margin-top: 2px; }
  .ot-area { font-size: 0.78rem; color: #7d6b5d; }
  .ot-items-count { background: #fdfbf7; color: #ae2012; padding: 2px 8px; border-radius: 99px; font-size: 0.73rem; font-weight: 700; }
  .ot-amount { font-weight: 800; color: #2d241e; font-size: 0.92rem; font-family: 'Sora', sans-serif; }
  .ot-discount { font-size: 0.68rem; color: #0c831f; font-weight: 600; margin-top: 2px; }
  .ot-pay-method { font-size: 0.75rem; color: #7d6b5d; font-weight: 600; margin-bottom: 3px; }
  .ot-assigned { color: #4a3f35; font-size: 0.82rem; font-weight: 500; }
  .ot-unassigned { color: #e9c46a; font-weight: 700; font-size: 0.8rem; }
  .ot-view-btn { display: inline-flex; align-items: center; gap: 5px; padding: 0.35rem 0.85rem; background: #fdfbf7; color: #ae2012; border: none; border-radius: 8px; font-size: 0.78rem; font-weight: 700; cursor: pointer; font-family: inherit; transition: background 0.15s; white-space: nowrap; }
  .ot-view-btn:hover { background: #f5ebe0; }
  .ot-empty { text-align: center; padding: 3rem 1rem; color: #a68b66; }
  .ot-empty p { margin-top: 8px; font-size: 0.88rem; }
`;
