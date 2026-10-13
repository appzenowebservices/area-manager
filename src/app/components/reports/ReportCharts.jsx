// src/components/reports/ReportCharts.jsx

// ─── Bar Chart ────────────────────────────────────────────────────────────────
export function BarChart({ data, color = "#ae2012", label = "Orders", valuePrefix = "" }) {
  if (!data?.length) return <Empty />;
  const max    = Math.max(...data.map(d => d.value), 1);
  const BAR_W  = Math.max(20, Math.min(40, Math.floor(520 / data.length) - 10));
  const GAP    = Math.max(6, Math.floor(520 / data.length) - BAR_W);
  const CHART_H = 140;
  const W = data.length * (BAR_W + GAP);

  return (
    <div style={{ overflowX: "auto", paddingBottom: 4 }}>
      <svg width={W + 40} height={CHART_H + 50} viewBox={`0 0 ${W + 40} ${CHART_H + 50}`} style={{ display:"block", minWidth: W + 40 }}>
        {data.map((d, i) => {
          const barH = max > 0 ? Math.max(4, Math.round((d.value / max) * CHART_H)) : 4;
          const x    = 20 + i * (BAR_W + GAP);
          const y    = CHART_H - barH;
          return (
            <g key={i}>
              {/* Track */}
              <rect x={x} y={0} width={BAR_W} height={CHART_H} rx={6} fill="#fdfbf7" />
              {/* Bar */}
              <rect x={x} y={y} width={BAR_W} height={barH} rx={6} fill={color} opacity={d.value === max ? 1 : 0.7} />
              {/* Value on top */}
              {d.value > 0 && (
                <text x={x + BAR_W / 2} y={y - 5} textAnchor="middle" fill={color} fontSize="9" fontWeight="700">
                  {valuePrefix}{d.value > 999 ? `${(d.value/1000).toFixed(1)}k` : d.value}
                </text>
              )}
              {/* Label */}
              <text x={x + BAR_W / 2} y={CHART_H + 16} textAnchor="middle" fill="#a68b66" fontSize="9.5" fontWeight="500">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── Line Chart ───────────────────────────────────────────────────────────────
export function LineChart({ data, color = "#0c831f", valuePrefix = "" }) {
  if (!data?.length || data.length < 2) return <Empty />;
  const W = 520, H = 130, PAD = 20;
  const max = Math.max(...data.map(d => d.value), 1);
  const min = 0;

  const pts = data.map((d, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: H - PAD - ((d.value - min) / (max - min || 1)) * (H - PAD * 2),
  }));

  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = linePath + ` L${pts[pts.length-1].x},${H} L${pts[0].x},${H} Z`;
  const gradId   = `lg-${color.replace(/[^a-z0-9]/gi,"")}`;

  return (
    <div style={{ overflowX: "auto" }}>
      <svg width="100%" viewBox={`0 0 ${W} ${H + 30}`} style={{ display:"block", minWidth: 300 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0"   />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0,0.25,0.5,0.75,1].map((f,i) => (
          <line key={i} x1={PAD} y1={PAD + f*(H-PAD*2)} x2={W-PAD} y2={PAD + f*(H-PAD*2)} stroke="#f5ebe0" strokeWidth="1" />
        ))}
        <path d={areaPath} fill={`url(#${gradId})`} />
        <path d={linePath} stroke={color} strokeWidth="2.5" fill="none" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3.5" fill={color} />
            <text x={p.x} y={H + 20} textAnchor="middle" fill="#a68b66" fontSize="9.5" fontWeight="500">
              {data[i].label}
            </text>
          </g>
        ))}
        {/* Last value label */}
        <text x={pts[pts.length-1].x} y={pts[pts.length-1].y - 8} textAnchor="middle" fill={color} fontSize="9" fontWeight="700">
          {valuePrefix}{data[data.length-1].value > 999 ? `${(data[data.length-1].value/1000).toFixed(1)}k` : data[data.length-1].value}
        </text>
      </svg>
    </div>
  );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────
export function DonutChart({ data }) {
  if (!data?.length) return <Empty />;
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <Empty />;

  const R = 70, r = 44, cx = 90, cy = 90;
  let startAngle = -Math.PI / 2;

  const slices = data.map(d => {
    const angle = (d.value / total) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(startAngle);
    const y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(startAngle + angle);
    const y2 = cy + R * Math.sin(startAngle + angle);
    const ix1 = cx + r * Math.cos(startAngle);
    const iy1 = cy + r * Math.sin(startAngle);
    const ix2 = cx + r * Math.cos(startAngle + angle);
    const iy2 = cy + r * Math.sin(startAngle + angle);
    const large = angle > Math.PI ? 1 : 0;
    const path = `M${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R} 0 ${large} 1 ${x2.toFixed(2)},${y2.toFixed(2)} L${ix2.toFixed(2)},${iy2.toFixed(2)} A${r},${r} 0 ${large} 0 ${ix1.toFixed(2)},${iy1.toFixed(2)} Z`;
    const pct  = Math.round((d.value / total) * 100);
    startAngle += angle;
    return { ...d, path, pct };
  });

  return (
    <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
      <svg width="180" height="180" viewBox="0 0 180 180" style={{ flexShrink:0 }}>
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} />)}
        <text x={cx} y={cy - 8}  textAnchor="middle" fill="#2d241e" fontSize="20" fontWeight="800" fontFamily="'Sora',sans-serif">{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="#a68b66" fontSize="10" fontWeight="600">Total</text>
      </svg>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ width:10, height:10, borderRadius:"50%", background:s.color, flexShrink:0 }} />
            <span style={{ fontSize:"0.8rem", color:"#4a3f35", fontWeight:600 }}>{s.label}</span>
            <span style={{ fontSize:"0.8rem", color:"#a68b66", marginLeft:"auto", paddingLeft:8 }}>{s.value} ({s.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Empty() {
  return <div style={{ textAlign:"center", padding:"1.5rem", color:"#a68b66", fontSize:"0.82rem" }}>No data for this period</div>;
}
