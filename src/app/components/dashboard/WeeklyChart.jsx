// src/components/dashboard/WeeklyChart.jsx
import { useState } from "react";
import { CHART_DATA } from "../../data/dashboardData";

/**
 * WeeklyChart
 * Interactive SVG bar chart — last 7 days Orders or Revenue.
 * Pure SVG, no external charting library needed.
 */
export default function WeeklyChart() {
  const [metric, setMetric] = useState("orders");
  const [hovered, setHovered] = useState(null);

  const values = CHART_DATA.map((d) =>
    metric === "orders" ? d.orders : d.revenue
  );
  const maxVal = Math.max(...values);
  const totalOrders = values.reduce((a, b) => a + b, 0);
  const avgVal = Math.round(totalOrders / values.length);

  // Summary chips data
  const summary = [
    {
      label: "Total",
      val: metric === "orders" ? totalOrders : `₹${(CHART_DATA.reduce((a,d)=>a+d.revenue,0)/1000).toFixed(0)}k`,
    },
    {
      label: "Avg/day",
      val: metric === "orders" ? avgVal : `₹${(avgVal/1000).toFixed(1)}k`,
    },
    {
      label: "Peak",
      val: metric === "orders" ? maxVal : `₹${(maxVal/1000).toFixed(1)}k`,
      peak: true,
    },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="wc-card">
        {/* Header */}
        <div className="wc-header">
          <div>
            <div className="wc-title">Weekly Overview</div>
            <div className="wc-sub">Last 7 days performance</div>
          </div>
          <div className="wc-toggle">
            {["orders", "revenue"].map((m) => (
              <button
                key={m}
                className={`wc-toggle-btn${metric === m ? " wc-toggle-active" : ""}`}
                onClick={() => setMetric(m)}
              >
                {m === "orders" ? "📦 Orders" : "₹ Revenue"}
              </button>
            ))}
          </div>
        </div>

        {/* Summary chips */}
        <div className="wc-chips">
          {summary.map((s) => (
            <div key={s.label} className={`wc-chip${s.peak ? " wc-chip-peak" : ""}`}>
              <span className="wc-chip-val">{s.val}</span>
              <span className="wc-chip-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="wc-chart-wrap">
          <BarChart
            data={CHART_DATA}
            metric={metric}
            maxVal={maxVal}
            hovered={hovered}
            onHover={setHovered}
          />
        </div>
      </div>
    </>
  );
}

/* ── BarChart (sub-component, stays in same file) ── */
function BarChart({ data, metric, maxVal, hovered, onHover }) {
  const BAR_W = 32;
  const GAP = 18;
  const CHART_H = 150;
  const TOTAL_W = data.length * (BAR_W + GAP) - GAP;

  return (
    <div style={{ overflowX: "auto", paddingBottom: 4 }}>
      <svg
        width={TOTAL_W + 40}
        height={CHART_H + 44}
        viewBox={`0 0 ${TOTAL_W + 40} ${CHART_H + 44}`}
        style={{ display: "block", minWidth: TOTAL_W + 40 }}
        role="img"
        aria-label={`Weekly ${metric} bar chart`}
      >
        {data.map((d, i) => {
          const val = metric === "orders" ? d.orders : d.revenue;
          const barH = Math.max(8, Math.round((val / maxVal) * CHART_H));
          const x = 20 + i * (BAR_W + GAP);
          const y = CHART_H - barH;
          const isHov = hovered === i;
          const isPeak = val === maxVal;

          return (
            <g
              key={d.day}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
              style={{ cursor: "pointer" }}
              role="listitem"
              aria-label={`${d.day}: ${metric === "orders" ? val + " orders" : "₹" + val}`}
            >
              {/* Track */}
              <rect
                x={x}
                y={0}
                width={BAR_W}
                height={CHART_H}
                rx={10}
                fill={isHov ? "#fdfbf7" : "#fdfbf7"}
              />
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={BAR_W}
                height={barH}
                rx={10}
                fill={isPeak ? "#2d241e" : isHov ? "#ae2012" : "#f5dfa6"}
                style={{ transition: "fill 0.18s" }}
              />
              {/* Tooltip */}
              {isHov && (
                <g>
                  <rect
                    x={x - 6}
                    y={y - 34}
                    width={BAR_W + 12}
                    height={26}
                    rx={7}
                    fill="#2d241e"
                  />
                  <text
                    x={x + BAR_W / 2}
                    y={y - 16}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize="10"
                    fontWeight="700"
                    fontFamily="'Sora', sans-serif"
                  >
                    {metric === "orders"
                      ? val
                      : `₹${(val / 1000).toFixed(1)}k`}
                  </text>
                </g>
              )}
              {/* Day label */}
              <text
                x={x + BAR_W / 2}
                y={CHART_H + 20}
                textAnchor="middle"
                fill={isPeak ? "#ae2012" : "#a68b66"}
                fontSize="11"
                fontWeight={isPeak ? "700" : "500"}
                fontFamily="'Plus Jakarta Sans', sans-serif"
              >
                {d.day}
              </text>
              {/* Peak marker */}
              {isPeak && (
                <text
                  x={x + BAR_W / 2}
                  y={CHART_H + 34}
                  textAnchor="middle"
                  fill="#ae2012"
                  fontSize="9"
                  fontWeight="700"
                >
                  PEAK
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const css = `
  .wc-card {
    background: #fff;
    border-radius: 16px;
    padding: 1.3rem;
    border: 1px solid #e9d8bf;
    box-shadow: 0 1px 4px rgba(45, 36, 30,0.05);
    height: 100%;
  }
  .wc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 14px;
  }
  .wc-title {
    font-family: 'Sora', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #2d241e;
  }
  .wc-sub {
    font-size: 0.73rem;
    color: #a68b66;
    margin-top: 2px;
  }
  .wc-toggle {
    display: flex;
    background: #fdfbf7;
    border-radius: 9px;
    padding: 3px;
    gap: 2px;
  }
  .wc-toggle-btn {
    padding: 0.32rem 0.85rem;
    border: none;
    border-radius: 7px;
    background: transparent;
    color: #7d6b5d;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
    white-space: nowrap;
  }
  .wc-toggle-active {
    background: #fff;
    color: #ae2012;
    box-shadow: 0 1px 4px rgba(45, 36, 30,0.1);
  }
  .wc-chips {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
  .wc-chip {
    flex: 1;
    min-width: 80px;
    background: #fdfbf7;
    border: 1px solid #e9d8bf;
    border-radius: 10px;
    padding: 0.55rem 0.85rem;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .wc-chip-peak {
    background: #eaf6ed;
    border-color: #e9d8bf;
  }
  .wc-chip-val {
    font-family: 'Sora', sans-serif;
    font-size: 1.05rem;
    font-weight: 800;
    color: #2d241e;
    letter-spacing: -0.02em;
  }
  .wc-chip-label {
    font-size: 0.7rem;
    color: #a68b66;
    font-weight: 500;
  }
  .wc-chart-wrap {
    overflow-x: auto;
  }
  @media (max-width: 480px) {
    .wc-toggle-btn { padding: 0.3rem 0.55rem; font-size: 0.72rem; }
    .wc-chip { padding: 0.45rem 0.65rem; }
    .wc-chip-val { font-size: 0.9rem; }
  }
`;
