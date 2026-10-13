import { ArrowUpIcon, ArrowDownIcon } from "./icons/DashIcons";

/**
 * StatCard
 * File: src/components/dashboard/StatCard.jsx
 *
 * Props:
 *   label      string
 *   value      string | number
 *   icon       ReactNode
 *   iconBg     string   (css color)
 *   iconColor  string
 *   trend      number   (percent, positive = up, negative = down)
 *   trendLabel string   (e.g. "vs yesterday")
 *   prefix     string   (e.g. "₹")
 *   delay      number   (animation delay in ms)
 */
export default function StatCard({
  label,
  value,
  icon,
  iconBg = "#fdfbf7",
  iconColor = "#ae2012",
  trend,
  trendLabel = "vs last week",
  prefix = "",
  delay = 0,
}) {
  const isUp   = trend > 0;
  const isDown = trend < 0;

  return (
    <>
      <style>{css}</style>
      <div
        className="sc-card"
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Top row: label + icon */}
        <div className="sc-top">
          <span className="sc-label">{label}</span>
          <span
            className="sc-icon-wrap"
            style={{ background: iconBg, color: iconColor }}
          >
            {icon}
          </span>
        </div>

        {/* Value */}
        <div className="sc-value">
          {prefix && <span className="sc-prefix">{prefix}</span>}
          {typeof value === "number" ? value.toLocaleString("en-IN") : value}
        </div>

        {/* Trend */}
        {trend !== undefined && (
          <div className="sc-trend-row">
            <span
              className="sc-trend"
              style={{
                color: isUp ? "#0c831f" : isDown ? "#d32f2f" : "#a68b66",
                background: isUp ? "#d3ebd8" : isDown ? "#fbebe9" : "#f5ebe0",
              }}
            >
              {isUp   && <ArrowUpIcon />}
              {isDown && <ArrowDownIcon />}
              {Math.abs(trend)}%
            </span>
            <span className="sc-trend-label">{trendLabel}</span>
          </div>
        )}
      </div>
    </>
  );
}

const css = `
  .sc-card {
    background: #fff;
    border: 1px solid #e9d8bf;
    border-radius: 16px;
    padding: 1.2rem 1.3rem;
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-shadow: 0 1px 4px rgba(45, 36, 30,0.05);
    animation: scIn 0.45s cubic-bezier(0.22,1,0.36,1) both;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .sc-card:hover {
    box-shadow: 0 6px 20px rgba(12, 131, 31,0.1);
    transform: translateY(-2px);
  }
  @keyframes scIn {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sc-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .sc-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: #7d6b5d;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .sc-icon-wrap {
    width: 40px; height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .sc-value {
    font-family: 'Sora', sans-serif;
    font-size: clamp(1.5rem, 3vw, 1.9rem);
    font-weight: 800;
    color: #2d241e;
    letter-spacing: -0.02em;
    line-height: 1;
    display: flex;
    align-items: baseline;
    gap: 3px;
  }
  .sc-prefix {
    font-size: 1.1rem;
    font-weight: 600;
    color: #5d4037;
  }
  .sc-trend-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .sc-trend {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 2px 8px;
    border-radius: 99px;
    font-size: 0.75rem;
    font-weight: 700;
  }
  .sc-trend-label {
    font-size: 0.73rem;
    color: #a68b66;
  }
`;
