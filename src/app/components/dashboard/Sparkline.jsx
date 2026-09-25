// src/components/dashboard/Sparkline.jsx

/**
 * Sparkline
 * Pure-SVG mini trend chart used inside StatCard.
 *
 * Props:
 *   data   number[]   — array of values to plot
 *   color  string     — stroke colour
 *   width  number     — default 80
 *   height number     — default 34
 */
export default function Sparkline({ data, color, width = 80, height = 34 }) {
  if (!data || data.length < 2) return null;

  const W = width, H = height;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 3;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (W - pad * 2) + pad;
    const y = H - pad - ((v - min) / range) * (H - pad * 2);
    return [x, y];
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");

  // Area fill path: line + close bottom
  const areaPath =
    linePath +
    ` L${points[points.length - 1][0]},${H} L${points[0][0]},${H} Z`;

  const gradId = `spk-${color.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area */}
      <path d={areaPath} fill={`url(#${gradId})`} />
      {/* Line */}
      <path
        d={linePath}
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Endpoint dot */}
      <circle
        cx={points[points.length - 1][0]}
        cy={points[points.length - 1][1]}
        r="3"
        fill={color}
      />
    </svg>
  );
}
