"use client";

// src/pages/reports/ReportsPage.jsx
import { useState, useMemo, useRef } from "react";
import PageWrapper    from "../components/layout/PageWrapper";
import { PageHeader } from "../components/brand/PageHeader";
import { BarChart, LineChart, DonutChart } from "../components/reports/ReportCharts";
import {
  PERIODS, buildOrdersReport, buildRevenueReport,
  buildVendorReport, buildDeliveryReport, exportCSV,
} from "../data/reportsData";

// ─── Section tabs ─────────────────────────────────────────────────────────────
const SECTIONS = [
  { key: "orders",   label: "📦 Orders"   },
  { key: "revenue",  label: "💰 Revenue"  },
  { key: "vendors",  label: "🏪 Vendors"  },
  { key: "delivery", label: "🚴 Delivery" },
];

export default function ReportsPage() {
  const [period,  setPeriod]  = useState("monthly");
  const [section, setSection] = useState("orders");
  const printRef = useRef(null);

  const ordersReport   = useMemo(() => buildOrdersReport(period),   [period]);
  const revenueReport  = useMemo(() => buildRevenueReport(period),  [period]);
  const vendorReport   = useMemo(() => buildVendorReport(period),   [period]);
  const deliveryReport = useMemo(() => buildDeliveryReport(period), [period]);

  const periodLabel = PERIODS.find(p => p.key === period)?.label || "";

  // ── CSV export per section ──
  const handleCSV = () => {
    if (section === "orders") {
      exportCSV(ordersReport.filtered.map(o => ({
        "Order ID": o.id, "Date": o.date, "Customer": o.customer.name,
        "Area": o.area, "Vendor": o.vendor?.name || "—",
        "Amount": o.finalAmount, "Status": o.status,
      })), `orders-${period}.csv`);
    } else if (section === "revenue") {
      exportCSV(revenueReport.byVendor.map(v => ({
        "Vendor": v.name, "Orders": v.orders, "Revenue": v.revenue,
      })), `revenue-${period}.csv`);
    } else if (section === "vendors") {
      exportCSV(vendorReport.vendors.map(v => ({
        "Vendor": v.name, "Category": v.category, "Area": v.area,
        "Orders": v.orders, "Delivered": v.delivered, "Cancelled": v.cancelled,
        "Success Rate": `${v.successRate}%`, "Revenue": v.revenue,
        "My Commission": v.myCommission, "Rating": v.rating,
      })), `vendors-${period}.csv`);
    } else {
      exportCSV(deliveryReport.boys.map(b => ({
        "Name": b.name, "Orders": b.orders, "Delivered": b.delivered,
        "Cancelled": b.cancelled, "Success Rate": `${b.successRate}%`, "Areas": b.areas,
      })), `delivery-${period}.csv`);
    }
  };

  // ── PDF export ──
  const handlePDF = () => {
    window.print();
  };

  return (
    <PageWrapper>
      <style>{css}</style>

      {/* ── Header ── */}
      <PageHeader
        kicker="Analytics"
        title="Reports"
        subtitle={`Performance analytics — ${periodLabel}`}
        actions={
          <>
            <button
              className="inline-flex items-center gap-2 bg-background-section text-secondary-900 border-2 border-secondary-900 rounded-2xl px-4 py-2.5 text-xs font-display font-black hover:bg-accent-400 transition-colors"
              onClick={handleCSV}
            >
              ⬇ CSV
            </button>
            <button
              className="inline-flex items-center gap-2 bg-accent-400 text-secondary-900 border-2 border-secondary-950 rounded-2xl px-4 py-2.5 text-xs font-display font-black hover:bg-accent-300 transition-colors"
              onClick={handlePDF}
            >
              🖨 PDF
            </button>
          </>
        }
      />

      {/* ── Period Selector ── */}
      <div className="rp-period-row">
        {PERIODS.map(p => (
          <button
            key={p.key}
            className={`rp-period-btn ${period === p.key ? "rp-period-active" : ""}`}
            onClick={() => setPeriod(p.key)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* ── Section Tabs ── */}
      <div className="rp-tabs">
        {SECTIONS.map(s => (
          <button
            key={s.key}
            className={`rp-tab ${section === s.key ? "rp-tab-active" : ""}`}
            onClick={() => setSection(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ══ ORDERS SECTION ══ */}
      {section === "orders" && (
        <div className="rp-content" ref={printRef}>
          {/* KPIs */}
          <div className="rp-kpi-row">
            <Kpi label="Total Orders"  value={ordersReport.total}      color="#ae2012" />
            <Kpi label="Delivered"     value={ordersReport.delivered}  color="#0c831f" />
            <Kpi label="Processing"    value={ordersReport.processing} color="#ae2012" />
            <Kpi label="Pending"       value={ordersReport.pending}    color="#e9c46a" />
            <Kpi label="Cancelled"     value={ordersReport.cancelled}  color="#d32f2f" />
          </div>

          <div className="rp-charts-grid">
            <ChartCard title="📊 Orders Trend" subtitle="Count over time">
              <BarChart data={ordersReport.trend} color="#ae2012" />
            </ChartCard>
            <ChartCard title="🍩 Status Breakdown" subtitle="Distribution">
              <DonutChart data={ordersReport.statusBreakdown} />
            </ChartCard>
          </div>

          <ChartCard title="📍 Orders by Area" subtitle="Top areas">
            <div className="rp-table-wrap">
              <table className="rp-table">
                <thead><tr>
                  <th className="rp-th">Area</th>
                  <th className="rp-th">Orders</th>
                  <th className="rp-th">Revenue</th>
                  <th className="rp-th">Share</th>
                </tr></thead>
                <tbody>
                  {ordersReport.areaBreakdown.map(a => (
                    <tr key={a.area} className="rp-tr">
                      <td className="rp-td">📍 {a.area}</td>
                      <td className="rp-td"><strong>{a.orders}</strong></td>
                      <td className="rp-td">₹{a.revenue.toLocaleString()}</td>
                      <td className="rp-td">
                        <ProgressBar pct={Math.round((a.orders / (ordersReport.total || 1)) * 100)} color="#ae2012" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      )}

      {/* ══ REVENUE SECTION ══ */}
      {section === "revenue" && (
        <div className="rp-content">
          <div className="rp-kpi-row">
            <Kpi label="Total Revenue"  value={`₹${revenueReport.total.toLocaleString()}`}    color="#0c831f" />
            <Kpi label="Avg Order"      value={`₹${revenueReport.avgOrder.toLocaleString()}`} color="#ae2012" />
            <Kpi label="Highest Order"  value={`₹${revenueReport.maxOrder.toLocaleString()}`} color="#4a5d23" />
            <Kpi label="Total Discount" value={`₹${revenueReport.totalDiscount.toLocaleString()}`} color="#e9c46a" />
            <Kpi label="Orders"         value={revenueReport.count}                           color="#7d6b5d" />
          </div>

          <div className="rp-charts-grid">
            <ChartCard title="📈 Revenue Trend" subtitle="Over time">
              <LineChart data={revenueReport.trend} color="#0c831f" valuePrefix="₹" />
            </ChartCard>
            <ChartCard title="💳 By Payment Method" subtitle="">
              <DonutChart data={revenueReport.byPayment.map((p,i) => ({
                label: p.method, value: p.amount,
                color: ["#ae2012","#0c831f","#e9c46a","#4a5d23"][i] || "#a68b66"
              }))} />
            </ChartCard>
          </div>

          <div className="rp-charts-grid">
            <ChartCard title="🏪 Revenue by Vendor" subtitle="Top vendors">
              <div className="rp-table-wrap">
                <table className="rp-table">
                  <thead><tr>
                    <th className="rp-th">#</th>
                    <th className="rp-th">Vendor</th>
                    <th className="rp-th">Orders</th>
                    <th className="rp-th">Revenue</th>
                    <th className="rp-th">Share</th>
                  </tr></thead>
                  <tbody>
                    {revenueReport.byVendor.map((v, i) => (
                      <tr key={v.name} className="rp-tr">
                        <td className="rp-td"><RankBadge n={i+1} /></td>
                        <td className="rp-td"><strong>{v.name}</strong></td>
                        <td className="rp-td">{v.orders}</td>
                        <td className="rp-td" style={{ color:"#0c831f", fontWeight:700 }}>₹{v.revenue.toLocaleString()}</td>
                        <td className="rp-td">
                          <ProgressBar pct={Math.round((v.revenue / (revenueReport.total || 1)) * 100)} color="#0c831f" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>

            <ChartCard title="📍 Revenue by Area" subtitle="">
              <div className="rp-table-wrap">
                <table className="rp-table">
                  <thead><tr>
                    <th className="rp-th">Area</th>
                    <th className="rp-th">Orders</th>
                    <th className="rp-th">Revenue</th>
                  </tr></thead>
                  <tbody>
                    {revenueReport.byArea.map(a => (
                      <tr key={a.area} className="rp-tr">
                        <td className="rp-td">📍 {a.area}</td>
                        <td className="rp-td">{a.orders}</td>
                        <td className="rp-td" style={{ fontWeight:700 }}>₹{a.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartCard>
          </div>
        </div>
      )}

      {/* ══ VENDORS SECTION ══ */}
      {section === "vendors" && (
        <div className="rp-content">
          <div className="rp-kpi-row">
            <Kpi label="Active Vendors"  value={vendorReport.total}                                                       color="#ae2012" />
            <Kpi label="Total Orders"    value={vendorReport.vendors.reduce((s,v) => s+v.orders, 0)}                     color="#0c831f" />
            <Kpi label="Total Revenue"   value={`₹${vendorReport.vendors.reduce((s,v) => s+v.revenue, 0).toLocaleString()}`} color="#4a5d23" />
            <Kpi label="My Commission"   value={`₹${vendorReport.vendors.reduce((s,v) => s+v.myCommission, 0).toLocaleString()}`} color="#e9c46a" />
          </div>

          <ChartCard title="📊 Orders by Vendor" subtitle="">
            <BarChart data={vendorReport.vendors.slice(0,10).map(v => ({ label: v.name.split(" ")[0], value: v.orders }))} color="#ae2012" />
          </ChartCard>

          <ChartCard title="🏆 Vendor Performance Table" subtitle={`${vendorReport.total} vendors`}>
            <div className="rp-table-wrap">
              <table className="rp-table">
                <thead><tr>
                  <th className="rp-th">#</th>
                  <th className="rp-th">Vendor</th>
                  <th className="rp-th">Category</th>
                  <th className="rp-th">Area</th>
                  <th className="rp-th">Orders</th>
                  <th className="rp-th">Delivered</th>
                  <th className="rp-th">Cancelled</th>
                  <th className="rp-th">Success %</th>
                  <th className="rp-th">Revenue</th>
                  <th className="rp-th">My Comm.</th>
                  <th className="rp-th">Rating</th>
                </tr></thead>
                <tbody>
                  {vendorReport.vendors.map((v, i) => (
                    <tr key={v.name} className="rp-tr">
                      <td className="rp-td"><RankBadge n={i+1} /></td>
                      <td className="rp-td"><strong>{v.name}</strong></td>
                      <td className="rp-td"><span className="rp-cat">{v.category}</span></td>
                      <td className="rp-td">📍 {v.area}</td>
                      <td className="rp-td"><strong>{v.orders}</strong></td>
                      <td className="rp-td" style={{ color:"#0c831f", fontWeight:600 }}>{v.delivered}</td>
                      <td className="rp-td" style={{ color:"#d32f2f" }}>{v.cancelled}</td>
                      <td className="rp-td">
                        <span className={`rp-rate ${v.successRate >= 80 ? "rp-rate-good" : v.successRate >= 50 ? "rp-rate-ok" : "rp-rate-bad"}`}>
                          {v.successRate}%
                        </span>
                      </td>
                      <td className="rp-td" style={{ fontWeight:700 }}>₹{v.revenue.toLocaleString()}</td>
                      <td className="rp-td" style={{ color:"#4a5d23", fontWeight:700 }}>₹{v.myCommission.toLocaleString()}</td>
                      <td className="rp-td">{v.rating > 0 ? `⭐ ${v.rating}` : "—"}</td>
                    </tr>
                  ))}
                  {!vendorReport.vendors.length && (
                    <tr><td colSpan={11} className="rp-empty">No vendor data for this period</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      )}

      {/* ══ DELIVERY SECTION ══ */}
      {section === "delivery" && (
        <div className="rp-content">
          <div className="rp-kpi-row">
            <Kpi label="Total Orders"   value={deliveryReport.totalOrders}   color="#ae2012" />
            <Kpi label="Delivered"      value={deliveryReport.totalDelivered} color="#0c831f" />
            <Kpi label="Unassigned"     value={deliveryReport.unassigned}    color="#e9c46a" />
            <Kpi label="Delivery Boys"  value={deliveryReport.boys.filter(b => b.name !== "Unassigned").length} color="#4a5d23" />
          </div>

          <ChartCard title="📊 Orders by Delivery Boy" subtitle="">
            <BarChart
              data={deliveryReport.boys.filter(b => b.name !== "Unassigned").slice(0,10)
                .map(b => ({ label: b.name.split(" ")[0], value: b.orders }))}
              color="#4a5d23"
            />
          </ChartCard>

          <ChartCard title="🚴 Delivery Performance Table" subtitle="">
            <div className="rp-table-wrap">
              <table className="rp-table">
                <thead><tr>
                  <th className="rp-th">#</th>
                  <th className="rp-th">Delivery Boy</th>
                  <th className="rp-th">Orders</th>
                  <th className="rp-th">Delivered</th>
                  <th className="rp-th">Cancelled</th>
                  <th className="rp-th">Success %</th>
                  <th className="rp-th">Areas Covered</th>
                </tr></thead>
                <tbody>
                  {deliveryReport.boys.map((b, i) => (
                    <tr key={b.name} className="rp-tr">
                      <td className="rp-td"><RankBadge n={i+1} /></td>
                      <td className="rp-td"><strong>{b.name}</strong></td>
                      <td className="rp-td"><strong>{b.orders}</strong></td>
                      <td className="rp-td" style={{ color:"#0c831f", fontWeight:600 }}>{b.delivered}</td>
                      <td className="rp-td" style={{ color:"#d32f2f" }}>{b.cancelled}</td>
                      <td className="rp-td">
                        <span className={`rp-rate ${b.successRate >= 80 ? "rp-rate-good" : b.successRate >= 50 ? "rp-rate-ok" : "rp-rate-bad"}`}>
                          {b.successRate}%
                        </span>
                      </td>
                      <td className="rp-td" style={{ fontSize:"0.78rem", color:"#7d6b5d" }}>{b.areas}</td>
                    </tr>
                  ))}
                  {!deliveryReport.boys.length && (
                    <tr><td colSpan={7} className="rp-empty">No delivery data for this period</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      )}
    </PageWrapper>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Kpi({ label, value, color }) {
  return (
    <div className="rp-kpi">
      <div className="rp-kpi-val" style={{ color }}>{value}</div>
      <div className="rp-kpi-label">{label}</div>
    </div>
  );
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="rp-card">
      <div className="rp-card-header">
        <span className="rp-card-title">{title}</span>
        {subtitle && <span className="rp-card-sub">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

function ProgressBar({ pct, color }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
      <div style={{ flex:1, height:6, background:"#fdfbf7", borderRadius:99, overflow:"hidden", minWidth:60 }}>
        <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:99, transition:"width 0.5s" }} />
      </div>
      <span style={{ fontSize:"0.72rem", color:"#a68b66", fontWeight:600, whiteSpace:"nowrap" }}>{pct}%</span>
    </div>
  );
}

function RankBadge({ n }) {
  const colors = ["#ae2012","#4a5d23","#0c831f","#e9c46a"];
  const bgs    = ["#fdfbf7","#f5ebe0","#d3ebd8","#faedcc"];
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", justifyContent:"center",
      width:22, height:22, borderRadius:6,
      background: bgs[n-1] || "#f5ebe0",
      color: colors[n-1] || "#7d6b5d",
      fontSize:"0.72rem", fontWeight:800,
    }}>#{n}</span>
  );
}

const css = `
  /* Header */
  .rp-header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.2rem; flex-wrap:wrap; gap:12px; }
  .rp-title { font-family:'Poppins',sans-serif; font-size:clamp(1.2rem,3vw,1.5rem); font-weight:800; color:#2d241e; letter-spacing:-0.02em; margin:0; }
  .rp-sub { font-size:0.82rem; color:#a68b66; margin-top:3px; }
  .rp-actions { display:flex; gap:8px; }
  .rp-export-btn { display:inline-flex; align-items:center; gap:6px; padding:0.55rem 1.1rem; border:none; border-radius:10px; font-size:0.84rem; font-weight:700; font-family:inherit; cursor:pointer; transition:opacity 0.15s; }
  .rp-export-btn:hover { opacity:0.85; }
  .rp-csv { background:#d3ebd8; color:#0a671a; }
  .rp-pdf { background:#fdfbf7; color:#ae2012; }

  /* Period selector */
  .rp-period-row { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:1rem; }
  .rp-period-btn { padding:0.45rem 1rem; border:1.5px solid #e9d8bf; border-radius:99px; background:#fff; color:#7d6b5d; font-size:0.8rem; font-weight:600; font-family:inherit; cursor:pointer; transition:all 0.15s; white-space:nowrap; }
  .rp-period-btn:hover { border-color:#ae2012; color:#ae2012; }
  .rp-period-active { background:#ae2012; border-color:#ae2012; color:#fff; }

  /* Section tabs */
  .rp-tabs { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:1.1rem; }
  .rp-tab { padding:0.5rem 1.1rem; border:1.5px solid #e9d8bf; border-radius:10px; background:#fff; color:#7d6b5d; font-size:0.83rem; font-weight:600; font-family:inherit; cursor:pointer; transition:all 0.15s; white-space:nowrap; }
  .rp-tab:hover { border-color:#e9d8bf; color:#ae2012; background:#eaf6ed; }
  .rp-tab-active { background:#fdfbf7; border-color:#ae2012; color:#ae2012; }

  /* Content */
  .rp-content { display:flex; flex-direction:column; gap:14px; }

  /* KPI row */
  .rp-kpi-row { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:10px; }
  .rp-kpi { background:#fff; border:2px solid #2d241e; border-radius:20px; padding:1rem 1.1rem; display:flex; flex-direction:column; gap:4px; box-shadow:4px 4px 0px #2d241e; }
  .rp-kpi-val { font-family:'Poppins',sans-serif; font-size:clamp(1.1rem,2.5vw,1.5rem); font-weight:800; letter-spacing:-0.02em; line-height:1; }
  .rp-kpi-label { font-size:0.7rem; font-weight:600; color:#a68b66; text-transform:uppercase; letter-spacing:0.05em; }

  /* Charts grid */
  .rp-charts-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:14px; }

  /* Card */
  .rp-card { background:#fff; border:2px solid #2d241e; border-radius:24px; padding:1.1rem 1.2rem; box-shadow:6px 6px 0px #2d241e; }
  .rp-card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:6px; }
  .rp-card-title { font-family:'Poppins',sans-serif; font-size:0.88rem; font-weight:700; color:#2d241e; }
  .rp-card-sub { font-size:0.72rem; color:#a68b66; }

  /* Table */
  .rp-table-wrap { overflow-x:auto; }
  .rp-table { width:100%; border-collapse:collapse; font-size:0.82rem; min-width:400px; }
  .rp-th { text-align:left; padding:0.55rem 0.8rem; background:#fdfbf7; color:#a68b66; font-size:0.67rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; border-bottom:1px solid #f5ebe0; white-space:nowrap; }
  .rp-tr:hover .rp-td { background:#fdfbf7; }
  .rp-td { padding:0.65rem 0.8rem; border-bottom:1px solid #fdfbf7; vertical-align:middle; white-space:nowrap; background:#fff; transition:background 0.1s; font-size:0.82rem; color:#4a3f35; }
  .rp-tr:last-child .rp-td { border-bottom:none; }
  .rp-empty { text-align:center; padding:2rem; color:#a68b66; font-size:0.82rem; }
  .rp-cat { background:#fdfbf7; color:#ae2012; padding:2px 8px; border-radius:99px; font-size:0.7rem; font-weight:700; }
  .rp-rate { padding:2px 8px; border-radius:99px; font-size:0.72rem; font-weight:700; }
  .rp-rate-good { background:#d3ebd8; color:#0a671a; }
  .rp-rate-ok   { background:#faedcc; color:#a67a22; }
  .rp-rate-bad  { background:#fbebe9; color:#8b150e; }

  /* Print */
  @media print {
    .rp-header, .rp-period-row, .rp-tabs, .rp-actions { display:none !important; }
    .rp-content { gap:20px; }
    .rp-card { page-break-inside:avoid; box-shadow:none; border:1px solid #ddd; }
  }

  @media (max-width:900px) {
    .rp-kpi-row { grid-template-columns:repeat(3,1fr); }
    .rp-charts-grid { grid-template-columns:1fr; }
  }
  @media (max-width:600px) {
    .rp-kpi-row { grid-template-columns:repeat(2,1fr); }
    .rp-period-btn { font-size:0.74rem; padding:0.38rem 0.8rem; }
  }
`;




