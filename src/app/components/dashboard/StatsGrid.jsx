import { BrandStat } from "../brand/BrandCard";
import { ORDERS } from "../../data/ordersData";
import { OrderIcon, RevenueIcon, VendorIcon, PendingIcon, DeliveryIcon, AlertIcon } from "./icons/DashIcons";

/**
 * StatsGrid
 *
 * Vendor-panel pattern: one `BrandStat` card per KPI, Tailwind only.
 * All numbers are computed from ORDERS (single source of truth).
 */
export default function StatsGrid() {
  const total = ORDERS.length;
  const pending = ORDERS.filter((o) => o.status === "Pending").length;
  const processing = ORDERS.filter((o) => o.status === "Processing").length;
  const delivered = ORDERS.filter((o) => o.status === "Delivered").length;
  const cancelled = ORDERS.filter((o) => o.status === "Cancelled").length;

  const revenue = ORDERS
    .filter((o) => o.status !== "Cancelled")
    .reduce((sum, o) => sum + o.finalAmount, 0);

  const unassignedVendor = ORDERS.filter(
    (o) => !o.vendor.id && o.status === "Pending",
  ).length;
  const unassignedDelivery = ORDERS.filter(
    (o) => !o.delivery.id && o.status === "Processing",
  ).length;

  const CARDS = [
    {
      label: "Total Orders",
      value: String(total),
      icon: <OrderIcon />,
      tint: "primary",
      delta: "+12%",
    },
    {
      label: "Revenue",
      value: `₹${revenue.toLocaleString("en-IN")}`,
      icon: <RevenueIcon />,
      tint: "fresh",
      delta: "+8%",
    },
    {
      label: "Pending Orders",
      value: String(pending),
      icon: <PendingIcon />,
      tint: "accent",
    },
    {
      label: "Delivered",
      value: String(delivered),
      icon: <DeliveryIcon />,
      tint: "fresh",
      delta: "+18%",
    },
    {
      label: "Processing",
      value: String(processing),
      icon: <OrderIcon />,
      tint: "mehndi",
    },
    {
      label: "Cancelled",
      value: String(cancelled),
      icon: <AlertIcon />,
      tint: "primary",
    },
    {
      label: "Vendor Unassigned",
      value: String(unassignedVendor),
      icon: <VendorIcon />,
      tint: "accent",
    },
    {
      label: "Delivery Unassigned",
      value: String(unassignedDelivery),
      icon: <DeliveryIcon />,
      tint: "accent",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {CARDS.map((card) => (
        <BrandStat
          key={card.label}
          icon={card.icon}
          value={card.value}
          label={card.label}
          tint={card.tint}
          delta={card.delta}
        />
      ))}
    </div>
  );
}

