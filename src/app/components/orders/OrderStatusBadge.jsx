/**
 * OrderStatusBadge
 * File: src/components/orders/OrderStatusBadge.jsx
 *
 * Props:
 *   status  string
 *   type    "order" | "payment"
 *   size    "sm" | "md"
 */
export default function OrderStatusBadge({ status, type = "order", size = "md" }) {
  const cfg = type === "payment" ? paymentMap : orderMap;
  const { bg, color, dot } = cfg[status] || cfg["default"];

  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size === "sm" ? 4 : 5,
      padding: size === "sm" ? "2px 8px" : "3px 10px",
      borderRadius: 99,
      background: bg,
      color,
      fontSize: size === "sm" ? "0.68rem" : "0.75rem",
      fontWeight: 700,
      whiteSpace: "nowrap",
      letterSpacing: "0.02em",
    }}>
      <span style={{ width: size === "sm" ? 5 : 6, height: size === "sm" ? 5 : 6, borderRadius: "50%", background: dot, flexShrink: 0 }} />
      {status}
    </span>
  );
}

const orderMap = {
  Pending:    { bg: "#fef3c7", color: "#d97706", dot: "#f59e0b" },
  Processing: { bg: "#dbeafe", color: "#1d4ed8", dot: "#1a73e8" },
  Delivered:  { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
  Cancelled:  { bg: "#fee2e2", color: "#b91c1c", dot: "#ef4444" },
  default:    { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
};

const paymentMap = {
  Paid:    { bg: "#d1fae5", color: "#065f46", dot: "#10b981" },
  Pending: { bg: "#fef3c7", color: "#d97706", dot: "#f59e0b" },
  Failed:  { bg: "#fee2e2", color: "#b91c1c", dot: "#ef4444" },
  default: { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
};
