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
  Pending:    { bg: "#faedcc", color: "#a67a22", dot: "#e9c46a" },
  Processing: { bg: "#f5ebe0", color: "#ae2012", dot: "#ae2012" },
  Delivered:  { bg: "#d3ebd8", color: "#0a671a", dot: "#0c831f" },
  Cancelled:  { bg: "#fbebe9", color: "#8b150e", dot: "#d32f2f" },
  default:    { bg: "#f5ebe0", color: "#5d4037", dot: "#a68b66" },
};

const paymentMap = {
  Paid:    { bg: "#d3ebd8", color: "#0a671a", dot: "#0c831f" },
  Pending: { bg: "#faedcc", color: "#a67a22", dot: "#e9c46a" },
  Failed:  { bg: "#fbebe9", color: "#8b150e", dot: "#d32f2f" },
  default: { bg: "#f5ebe0", color: "#5d4037", dot: "#a68b66" },
};
