import { useRouter } from "next/navigation";
// import { ORDERS } from "../../data/ordersData";
import { ChevronRightIcon, AlertIcon } from "./icons/DashIcons";
import { ORDERS } from "../../data/ordersData";

/**
 * AlertsSection
 * File: src/components/dashboard/AlertsSection.jsx
 *
 * Derives alerts from ORDERS — same source as Orders page.
 * Clicking an alert navigates to /orders.
 */

function buildAlerts(orders) {
  const alerts = [];

  const pendingUnassigned = orders.filter(
    o => o.status === "Pending" && !o.vendor.id
  );
  if (pendingUnassigned.length > 0) {
    alerts.push({
      id: "vendor-unassigned",
      type: "warning",
      title: `${pendingUnassigned.length} order${pendingUnassigned.length > 1 ? "s" : ""} without vendor`,
      desc: pendingUnassigned.map(o => o.id).join(", "),
      action: "Assign Now",
      link: "/orders",
    });
  }

  const processingUndelivered = orders.filter(
    o => o.status === "Processing" && !o.delivery.id
  );
  if (processingUndelivered.length > 0) {
    alerts.push({
      id: "delivery-unassigned",
      type: "warning",
      title: `${processingUndelivered.length} order${processingUndelivered.length > 1 ? "s" : ""} need delivery boy`,
      desc: processingUndelivered.map(o => o.id).join(", "),
      action: "Assign Now",
      link: "/orders",
    });
  }

  const cashPending = orders.filter(
    o => o.payment === "Cash" && o.paymentStatus === "Pending"
  );
  if (cashPending.length > 0) {
    alerts.push({
      id: "cash-pending",
      type: "info",
      title: `${cashPending.length} cash payment${cashPending.length > 1 ? "s" : ""} pending`,
      desc: `Total: ₹${cashPending.reduce((s, o) => s + o.finalAmount, 0).toLocaleString("en-IN")}`,
      action: "View Orders",
      link: "/orders",
    });
  }

  const cancelled = orders.filter(o => o.status === "Cancelled");
  if (cancelled.length > 0) {
    alerts.push({
      id: "cancelled",
      type: "danger",
      title: `${cancelled.length} cancelled order${cancelled.length > 1 ? "s" : ""}`,
      desc: cancelled.map(o => o.id).join(", "),
      action: "Review",
      link: "/orders",
    });
  }

  return alerts;
}

const TYPE_STYLES = {
  warning: { bg: "#fffbeb", border: "#fde68a", dot: "#f59e0b", badge: "#fef3c7", badgeText: "#d97706" },
  info:    { bg: "#eff6ff", border: "#bfdbfe", dot: "#1a73e8", badge: "#dbeafe", badgeText: "#1d4ed8" },
  danger:  { bg: "#fff1f2", border: "#fecdd3", dot: "#ef4444", badge: "#fee2e2", badgeText: "#b91c1c" },
};

export default function AlertsSection() {
  const navigate = useRouter();
  const alerts = buildAlerts(ORDERS);

  if (alerts.length === 0) {
    return (
      <div style={styles.emptyCard}>
        <span style={{ fontSize: "1.8rem" }}>✅</span>
        <div>
          <p style={styles.emptyTitle}>All clear!</p>
          <p style={styles.emptySub}>No pending alerts right now.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{css}</style>
      <div className="as-card">
        <div className="as-header">
          <div className="as-title-row">
            <AlertIcon />
            <span className="as-title">Alerts</span>
            <span className="as-count">{alerts.length}</span>
          </div>
          <span className="as-sub">Requires your attention</span>
        </div>

        <div className="as-list">
          {alerts.map((alert) => {
            const t = TYPE_STYLES[alert.type];
            return (
              <div
                key={alert.id}
                className="as-item"
                style={{ background: t.bg, borderColor: t.border }}
              >
                <span className="as-dot" style={{ background: t.dot }} />
                <div className="as-content">
                  <p className="as-item-title">{alert.title}</p>
                  <p className="as-item-desc">{alert.desc}</p>
                </div>
                <button
                  className="as-action"
                  style={{ background: t.badge, color: t.badgeText }}
                  onClick={() => navigate.push(alert.link)}
                >
                  {alert.action} <ChevronRightIcon />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

const styles = {
  emptyCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: "1.5rem 1.3rem",
    display: "flex",
    alignItems: "center",
    gap: 14,
    boxShadow: "0 1px 4px rgba(15,23,42,0.05)",
  },
  emptyTitle: { fontWeight: 700, color: "#0f172a", fontSize: "0.9rem" },
  emptySub:   { color: "#94a3b8", fontSize: "0.78rem", marginTop: 2 },
};

const css = `
  .as-card {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 1.2rem 1.3rem;
    box-shadow: 0 1px 4px rgba(15,23,42,0.05);
    animation: scIn 0.45s 0.2s cubic-bezier(0.22,1,0.36,1) both;
  }
  .as-header { margin-bottom: 1rem; }
  .as-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #0f172a;
    margin-bottom: 2px;
  }
  .as-title {
    font-family: 'Sora', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
  }
  .as-count {
    background: #fee2e2;
    color: #ef4444;
    font-size: 0.7rem;
    font-weight: 800;
    padding: 1px 7px;
    border-radius: 99px;
  }
  .as-sub { font-size: 0.73rem; color: #94a3b8; }
  .as-list { display: flex; flex-direction: column; gap: 8px; }
  .as-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.75rem 0.9rem;
    border-radius: 12px;
    border: 1px solid;
  }
  .as-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .as-content { flex: 1; min-width: 0; }
  .as-item-title {
    font-size: 0.83rem;
    font-weight: 700;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .as-item-desc {
    font-size: 0.72rem;
    color: #64748b;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .as-action {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 0.32rem 0.65rem;
    border: none;
    border-radius: 8px;
    font-size: 0.73rem;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    white-space: nowrap;
    flex-shrink: 0;
    transition: opacity 0.15s;
  }
  .as-action:hover { opacity: 0.8; }
  @media (max-width: 480px) {
    .as-item { flex-wrap: wrap; }
    .as-action { width: 100%; justify-content: center; }
  }
`;
