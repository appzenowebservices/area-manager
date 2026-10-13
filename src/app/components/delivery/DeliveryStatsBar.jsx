import { DELIVERY_PARTNERS, getDeliveryStats } from "../../data/deliveryData";

/**
 * DeliveryStatsBar
 * File: src/components/delivery/DeliveryStatsBar.jsx
 *
 * Computes KPIs live from deliveryData + ordersData.
 */
export default function DeliveryStatsBar() {
  const total     = DELIVERY_PARTNERS.length;
  const available = DELIVERY_PARTNERS.filter(p => p.status === "Available").length;
  const busy      = DELIVERY_PARTNERS.filter(p => p.status === "Busy").length;
  const inactive  = DELIVERY_PARTNERS.filter(p => p.status === "Inactive").length;

  const totalDeliveries = DELIVERY_PARTNERS.reduce((s, p) => {
    return s + getDeliveryStats(p.id).delivered;
  }, 0);

  const CHIPS = [
    { label: "Total Partners", val: total,          color: "#ae2012", bg: "#fdfbf7" },
    { label: "Available",      val: available,       color: "#0c831f", bg: "#d3ebd8" },
    { label: "Busy",           val: busy,            color: "#ae2012", bg: "#f5ebe0" },
    { label: "Inactive",       val: inactive,        color: "#7d6b5d", bg: "#f5ebe0" },
    { label: "Orders Delivered", val: totalDeliveries, color: "#4a5d23", bg: "#f5ebe0" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="dsb-wrap">
        {CHIPS.map(c => (
          <div key={c.label} className="dsb-chip" style={{ background: c.bg }}>
            <span className="dsb-val" style={{ color: c.color }}>{c.val}</span>
            <span className="dsb-label">{c.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}

const css = `
  .dsb-wrap {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 1.1rem;
  }
  .dsb-chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 0.55rem 1rem;
    border-radius: 12px;
    flex: 1;
    min-width: 80px;
  }
  .dsb-val {
    font-family: 'Sora', sans-serif;
    font-size: 1.2rem;
    font-weight: 800;
    line-height: 1;
  }
  .dsb-label {
    font-size: 0.67rem;
    color: #7d6b5d;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }
  @media (max-width: 480px) {
    .dsb-chip { min-width: 60px; padding: 0.45rem 0.6rem; }
    .dsb-val  { font-size: 1rem; }
  }
`;
