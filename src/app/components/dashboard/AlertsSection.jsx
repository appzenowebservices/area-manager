import { useRouter } from "next/navigation";
import { ORDERS } from "../../data/ordersData";
import { BrandCard } from "../brand/BrandCard";
import { ChevronRightIcon, AlertIcon } from "./icons/DashIcons";

function buildAlerts(orders) {
  const alerts = [];

  const pendingUnassigned = orders.filter(
    (order) => order.status === "Pending" && !order.vendor.id,
  );
  if (pendingUnassigned.length > 0) {
    alerts.push({
      id: "vendor-unassigned",
      type: "warning",
      title: `${pendingUnassigned.length} order${pendingUnassigned.length > 1 ? "s" : ""} without vendor`,
      desc: pendingUnassigned.map((order) => order.id).join(", "),
      action: "Assign Now",
      link: "/orders",
    });
  }

  const processingUndelivered = orders.filter(
    (order) => order.status === "Processing" && !order.delivery.id,
  );
  if (processingUndelivered.length > 0) {
    alerts.push({
      id: "delivery-unassigned",
      type: "warning",
      title: `${processingUndelivered.length} order${processingUndelivered.length > 1 ? "s" : ""} need delivery boy`,
      desc: processingUndelivered.map((order) => order.id).join(", "),
      action: "Assign Now",
      link: "/orders",
    });
  }

  const cashPending = orders.filter(
    (order) => order.payment === "Cash" && order.paymentStatus === "Pending",
  );
  if (cashPending.length > 0) {
    alerts.push({
      id: "cash-pending",
      type: "info",
      title: `${cashPending.length} cash payment${cashPending.length > 1 ? "s" : ""} pending`,
      desc: `Total: ₹${cashPending
        .reduce((sum, order) => sum + order.finalAmount, 0)
        .toLocaleString("en-IN")}`,
      action: "View Orders",
      link: "/orders",
    });
  }

  const cancelled = orders.filter((order) => order.status === "Cancelled");
  if (cancelled.length > 0) {
    alerts.push({
      id: "cancelled",
      type: "danger",
      title: `${cancelled.length} cancelled order${cancelled.length > 1 ? "s" : ""}`,
      desc: cancelled.map((order) => order.id).join(", "),
      action: "Review",
      link: "/orders",
    });
  }

  return alerts;
}

const TYPE_STYLES = {
  warning: {
    item: "bg-accent-50 border-accent-200",
    dot: "bg-accent-400",
    badge: "bg-accent-100 text-accent-700",
  },
  info: {
    item: "bg-primary-50 border-primary-200",
    dot: "bg-primary-600",
    badge: "bg-primary-100 text-primary-700",
  },
  danger: {
    item: "bg-primary-50 border-primary-200",
    dot: "bg-primary-700",
    badge: "bg-primary-100 text-primary-800",
  },
};

export default function AlertsSection() {
  const router = useRouter();
  const alerts = buildAlerts(ORDERS);

  if (alerts.length === 0) {
    return (
      <BrandCard className="flex items-center gap-3">
        <span className="text-3xl">✅</span>
        <div>
          <p className="font-display text-base font-black text-secondary-900">
            All clear!
          </p>
          <p className="text-sm font-semibold text-secondary-500">
            No pending alerts right now.
          </p>
        </div>
      </BrandCard>
    );
  }

  return (
    <BrandCard>
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <span className="text-primary-600">
            <AlertIcon />
          </span>
          <h2 className="font-display text-xl font-black text-secondary-900">
            Alerts
          </h2>
          <span className="rounded-full border-2 border-primary-200 bg-primary-50 px-2 py-0.5 text-[10px] font-black text-primary-700">
            {alerts.length}
          </span>
        </div>
        <p className="mt-0.5 text-sm font-semibold text-secondary-500">
          Requires your attention
        </p>
      </div>

      <div className="space-y-2.5">
        {alerts.map((alert) => {
          const tone = TYPE_STYLES[alert.type];
          return (
            <div
              key={alert.id}
              className={`flex flex-wrap items-center gap-3 rounded-2xl border-2 px-3.5 py-3 ${tone.item}`}
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${tone.dot}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-secondary-900">
                  {alert.title}
                </p>
                <p className="truncate text-xs font-semibold text-secondary-500">
                  {alert.desc}
                </p>
              </div>
              <button
                onClick={() => router.push(alert.link)}
                className={`inline-flex shrink-0 items-center gap-1 rounded-full border-2 border-secondary-900 px-3 py-1.5 text-[11px] font-black transition-colors hover:bg-accent-400 ${tone.badge}`}
              >
                {alert.action} <ChevronRightIcon />
              </button>
            </div>
          );
        })}
      </div>
    </BrandCard>
  );
}
