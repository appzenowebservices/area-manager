import StatCard from "./StatCard";
import { ORDERS } from "../../data/ordersData";
import { OrderIcon, RevenueIcon, VendorIcon, PendingIcon, DeliveryIcon, AlertIcon } from "./icons/DashIcons";

/**
 * StatsGrid
 * File: src/components/dashboard/StatsGrid.jsx
 *
 * Computes all KPIs from ORDERS (single source of truth).
 * Renders a responsive grid of StatCards.
 */
export default function StatsGrid() {
  // ── Compute from live data ──
  const total      = ORDERS.length;
  const pending    = ORDERS.filter(o => o.status === "Pending").length;
  const processing = ORDERS.filter(o => o.status === "Processing").length;
  const delivered  = ORDERS.filter(o => o.status === "Delivered").length;
  const cancelled  = ORDERS.filter(o => o.status === "Cancelled").length;

  const revenue = ORDERS
    .filter(o => o.status !== "Cancelled")
    .reduce((s, o) => s + o.finalAmount, 0);

  const unassignedVendor   = ORDERS.filter(o => !o.vendor.id && o.status === "Pending").length;
  const unassignedDelivery = ORDERS.filter(o => !o.delivery.id && o.status === "Processing").length;

  const CARDS = [
    {
      label:      "Total Orders",
      value:      total,
      icon:       <OrderIcon />,
      iconBg:     "#e8f0fe",
      iconColor:  "#1a73e8",
      trend:      12,
      trendLabel: "vs last week",
      delay:      0,
    },
    {
      label:      "Revenue",
      value:      revenue,
      prefix:     "₹",
      icon:       <RevenueIcon />,
      iconBg:     "#d1fae5",
      iconColor:  "#10b981",
      trend:      8,
      trendLabel: "vs last week",
      delay:      80,
    },
    {
      label:      "Pending Orders",
      value:      pending,
      icon:       <PendingIcon />,
      iconBg:     "#fef3c7",
      iconColor:  "#f59e0b",
      trend:      -5,
      trendLabel: "vs yesterday",
      delay:      160,
    },
    {
      label:      "Delivered",
      value:      delivered,
      icon:       <DeliveryIcon />,
      iconBg:     "#d1fae5",
      iconColor:  "#10b981",
      trend:      18,
      trendLabel: "vs last week",
      delay:      240,
    },
    {
      label:      "Processing",
      value:      processing,
      icon:       <OrderIcon />,
      iconBg:     "#dbeafe",
      iconColor:  "#1a73e8",
      trend:      3,
      trendLabel: "vs yesterday",
      delay:      320,
    },
    {
      label:      "Cancelled",
      value:      cancelled,
      icon:       <AlertIcon />,
      iconBg:     "#fee2e2",
      iconColor:  "#ef4444",
      trend:      -2,
      trendLabel: "vs last week",
      delay:      400,
    },
    {
      label:      "Vendor Unassigned",
      value:      unassignedVendor,
      icon:       <VendorIcon />,
      iconBg:     "#fef3c7",
      iconColor:  "#f59e0b",
      delay:      480,
    },
    {
      label:      "Delivery Unassigned",
      value:      unassignedDelivery,
      icon:       <DeliveryIcon />,
      iconBg:     "#fef3c7",
      iconColor:  "#f59e0b",
      delay:      560,
    },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="sg-grid">
        {CARDS.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </>
  );
}

const css = `
  .sg-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 1.4rem; width: 100%; box-sizing: border-box;
  }
  @media (max-width: 1100px) {
    .sg-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  }
  @media (max-width: 520px) {
    .sg-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  }
`;
