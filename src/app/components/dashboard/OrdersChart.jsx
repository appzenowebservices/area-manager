import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Area, AreaChart, Legend,
} from "recharts";
import { ORDERS } from "../../data/ordersData";

/**
 * OrdersChart
 * File: src/components/dashboard/OrdersChart.jsx
 *
 * Shows orders trend over last 7 days.
 * Data derived from ordersData.js — same source as Orders page.
 */

/* ── Build chart data from ORDERS ── */
function buildChartData() {
  // Generate last 7 days labels
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      fullDate: d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    });
  }

  // Map ORDERS to day counts (use dummy spread since data is static)
  // In production: filter by actual date. Here we distribute realistically.
  const spread = [2, 3, 1, 4, 3, 5, ORDERS.length - 18 > 0 ? ORDERS.length - 18 : 2];

  return days.map((d, i) => ({
    day: d.label,
    Orders:   spread[i],
    Revenue:  spread[i] * 420,
    Delivered: Math.max(0, spread[i] - 1),
    Pending:  Math.min(1, spread[i]),
  }));
}

const chartData = buildChartData();

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #e9d8bf",
      borderRadius: 12,
      padding: "0.75rem 1rem",
      boxShadow: "0 8px 24px rgba(45, 36, 30,0.12)",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      minWidth: 160,
    }}>
      <p style={{ fontSize: "0.78rem", color: "#a68b66", fontWeight: 600, marginBottom: 6 }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: 16, fontSize: "0.82rem", marginBottom: 3 }}>
          <span style={{ color: p.color, fontWeight: 600 }}>{p.name}</span>
          <span style={{ fontWeight: 700, color: "#2d241e" }}>
            {p.name === "Revenue" ? `₹${p.value.toLocaleString("en-IN")}` : p.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function OrdersChart() {
  return (
    <>
      <style>{css}</style>
      <div className="oc-card">
        {/* Header */}
        <div className="oc-header">
          <div>
            <div className="oc-title">Orders Trend</div>
            <div className="oc-sub">Last 7 days activity</div>
          </div>
          <div className="oc-legend">
            <span className="oc-dot" style={{ background: "#ae2012" }} /> Orders
            <span className="oc-dot" style={{ background: "#0c831f", marginLeft: 12 }} /> Delivered
          </div>
        </div>

        {/* Chart */}
        <div className="oc-chart-wrap">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#ae2012" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#ae2012" stopOpacity={0.01} />
                </linearGradient>
                <linearGradient id="gradDelivered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#0c831f" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0c831f" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5ebe0" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#a68b66", fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#a68b66", fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="Orders"
                stroke="#ae2012"
                strokeWidth={2.5}
                fill="url(#gradOrders)"
                dot={{ r: 3, fill: "#ae2012", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#ae2012" }}
              />
              <Area
                type="monotone"
                dataKey="Delivered"
                stroke="#0c831f"
                strokeWidth={2.5}
                fill="url(#gradDelivered)"
                dot={{ r: 3, fill: "#0c831f", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#0c831f" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bottom summary row */}
        <div className="oc-summary">
          {[
            { label: "Total Orders", value: chartData.reduce((s, d) => s + d.Orders, 0), color: "#ae2012" },
            { label: "Delivered",    value: chartData.reduce((s, d) => s + d.Delivered, 0), color: "#0c831f" },
            { label: "Est. Revenue", value: `₹${chartData.reduce((s, d) => s + d.Revenue, 0).toLocaleString("en-IN")}`, color: "#e9c46a" },
          ].map(s => (
            <div key={s.label} className="oc-sum-item">
              <div className="oc-sum-val" style={{ color: s.color }}>{s.value}</div>
              <div className="oc-sum-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const css = `
  .oc-card {
    background: #fff;
    border: 1px solid #e9d8bf;
    border-radius: 16px;
    padding: 1.3rem;
    box-shadow: 0 1px 4px rgba(45, 36, 30,0.05);
    animation: scIn 0.45s 0.1s cubic-bezier(0.22,1,0.36,1) both;
  }
  .oc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.1rem;
    flex-wrap: wrap;
    gap: 8px;
  }
  .oc-title {
    font-family: 'Sora', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #2d241e;
  }
  .oc-sub {
    font-size: 0.73rem;
    color: #a68b66;
    margin-top: 2px;
  }
  .oc-legend {
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    color: #7d6b5d;
    font-weight: 600;
    gap: 6px;
    flex-wrap: wrap;
  }
  .oc-dot {
    display: inline-block;
    width: 8px; height: 8px;
    border-radius: 50%;
  }
  .oc-chart-wrap {
    margin: 0 -0.3rem;
  }
  .oc-summary {
    display: flex;
    gap: 1.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #f5ebe0;
    flex-wrap: wrap;
  }
  .oc-sum-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .oc-sum-val {
    font-family: 'Sora', sans-serif;
    font-size: 1.1rem;
    font-weight: 800;
  }
  .oc-sum-label {
    font-size: 0.7rem;
    color: #a68b66;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  @media (max-width: 480px) {
    .oc-card { padding: 1rem; }
    .oc-summary { gap: 1rem; }
  }
`;
