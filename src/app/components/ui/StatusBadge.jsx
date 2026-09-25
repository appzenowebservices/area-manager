/**
 * StatusBadge — Generic reusable badge
 * File: src/components/ui/StatusBadge.jsx
 *
 * Wraps OrderStatusBadge for use across dashboard/other components.
 * Props: status, size
 */
import OrderStatusBadge from "../orders/OrderStatusBadge";

export default function StatusBadge({ status, size = "md" }) {
  return <OrderStatusBadge status={status} size={size} />;
}
