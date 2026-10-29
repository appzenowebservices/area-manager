// src/data/reportsData.js
import { ORDERS }  from "./ordersData";
import { VENDORS } from "./vendorsData";

// ─── Time Period Filter ───────────────────────────────────────────────────────
export const PERIODS = [
  { key: "daily",      label: "Today"       },
  { key: "weekly",     label: "This Week"   },
  { key: "monthly",    label: "This Month"  },
  { key: "halfyearly", label: "6 Months"    },
  { key: "yearly",     label: "This Year"   },
];

function parseDate(str) {
  // Handles "27 Mar 2025" format
  if (!str) return null;
  const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
  const [d, m, y] = str.split(" ");
  return new Date(Number(y), months[m], Number(d));
}

export function filterByPeriod(orders, period) {
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return orders.filter(o => {
    const d = parseDate(o.date);
    if (!d) return false;
    if (period === "daily")      return d >= today;
    if (period === "weekly")     { const w = new Date(today); w.setDate(today.getDate() - 7);  return d >= w; }
    if (period === "monthly")    { const m = new Date(today); m.setMonth(today.getMonth() - 1); return d >= m; }
    if (period === "halfyearly") { const h = new Date(today); h.setMonth(today.getMonth() - 6); return d >= h; }
    if (period === "yearly")     { const y = new Date(today); y.setFullYear(today.getFullYear() - 1); return d >= y; }
    return true;
  });
}

// ─── Orders Report ────────────────────────────────────────────────────────────
export function buildOrdersReport(period, orders = ORDERS) {
  const filtered = filterByPeriod(orders, period);
  const total      = filtered.length;
  const delivered  = filtered.filter(o => o.status === "Delivered").length;
  const pending    = filtered.filter(o => o.status === "Pending").length;
  const processing = filtered.filter(o => o.status === "Processing").length;
  const cancelled  = filtered.filter(o => o.status === "Cancelled").length;

  // Status breakdown for donut chart
  const statusBreakdown = [
    { label: "Delivered",  value: delivered,  color: "#0c831f" },
    { label: "Processing", value: processing, color: "#ae2012" },
    { label: "Pending",    value: pending,    color: "#e9c46a" },
    { label: "Cancelled",  value: cancelled,  color: "#d32f2f" },
  ].filter(s => s.value > 0);

  // Area breakdown
  const areaMap = {};
  filtered.forEach(o => {
    if (!areaMap[o.area]) areaMap[o.area] = { area: o.area, orders: 0, revenue: 0 };
    areaMap[o.area].orders++;
    if (o.status !== "Cancelled") areaMap[o.area].revenue += o.finalAmount;
  });
  const areaBreakdown = Object.values(areaMap).sort((a,b) => b.orders - a.orders);

  // Trend (last N days depending on period)
  const trend = buildTrend(filtered, period);

  return { total, delivered, pending, processing, cancelled, statusBreakdown, areaBreakdown, trend, filtered };
}

// ─── Revenue Report ───────────────────────────────────────────────────────────
export function buildRevenueReport(period, orders = ORDERS) {
  const filtered   = filterByPeriod(orders, period).filter(o => o.status !== "Cancelled");
  const total      = filtered.reduce((s, o) => s + o.finalAmount, 0);
  const avgOrder   = filtered.length ? Math.round(total / filtered.length) : 0;
  const maxOrder   = filtered.length ? Math.max(...filtered.map(o => o.finalAmount)) : 0;
  const totalDiscount = filtered.reduce((s, o) => s + (o.discount || 0), 0);

  // By vendor
  const vendorMap = {};
  filtered.forEach(o => {
    const vn = o.vendor?.name || "Unassigned";
    if (!vendorMap[vn]) vendorMap[vn] = { name: vn, orders: 0, revenue: 0 };
    vendorMap[vn].orders++;
    vendorMap[vn].revenue += o.finalAmount;
  });
  const byVendor = Object.values(vendorMap).sort((a,b) => b.revenue - a.revenue);

  // By area
  const areaMap = {};
  filtered.forEach(o => {
    if (!areaMap[o.area]) areaMap[o.area] = { area: o.area, orders: 0, revenue: 0 };
    areaMap[o.area].orders++;
    areaMap[o.area].revenue += o.finalAmount;
  });
  const byArea = Object.values(areaMap).sort((a,b) => b.revenue - a.revenue);

  // Payment method breakdown
  const pmMap = {};
  filtered.forEach(o => {
    pmMap[o.payment] = (pmMap[o.payment] || 0) + o.finalAmount;
  });
  const byPayment = Object.entries(pmMap).map(([method, amt]) => ({ method, amount: amt })).sort((a,b) => b.amount - a.amount);

  const trend = buildTrend(filtered, period, "revenue");

  return { total, avgOrder, maxOrder, totalDiscount, byVendor, byArea, byPayment, trend, count: filtered.length };
}

// ─── Vendor Performance ───────────────────────────────────────────────────────
export function buildVendorReport(period, orders = ORDERS, vendorsList = VENDORS) {
  const filtered = filterByPeriod(orders, period);

  const vendorMap = {};
  filtered.forEach(o => {
    const vn = o.vendor?.name || "Unassigned";
    const vc = o.vendor?.id   || "";
    if (!vendorMap[vn]) {
      const vInfo = vendorsList.find(v => v.name === vn);
      vendorMap[vn] = {
        name: vn, id: vc, orders: 0, revenue: 0,
        delivered: 0, cancelled: 0,
        commission: vInfo?.commission || 10,
        rating: vInfo?.rating || 0,
        category: vInfo?.category || "—",
        area: vInfo?.area || "—",
      };
    }
    vendorMap[vn].orders++;
    if (o.status !== "Cancelled") vendorMap[vn].revenue  += o.finalAmount;
    if (o.status === "Delivered") vendorMap[vn].delivered++;
    if (o.status === "Cancelled") vendorMap[vn].cancelled++;
  });

  const vendors = Object.values(vendorMap)
    .map(v => ({
      ...v,
      successRate: v.orders ? Math.round((v.delivered / v.orders) * 100) : 0,
      myCommission: Math.round((v.revenue * v.commission) / 100),
    }))
    .sort((a,b) => b.orders - a.orders);

  return { vendors, total: vendors.length };
}

// ─── Delivery Performance ─────────────────────────────────────────────────────
export function buildDeliveryReport(period, orders = ORDERS) {
  const filtered = filterByPeriod(orders, period);

  const boyMap = {};
  filtered.forEach(o => {
    const dn = o.delivery?.name || "Unassigned";
    if (!boyMap[dn]) boyMap[dn] = { name: dn, orders: 0, delivered: 0, cancelled: 0, areas: new Set() };
    boyMap[dn].orders++;
    boyMap[dn].areas.add(o.area);
    if (o.status === "Delivered") boyMap[dn].delivered++;
    if (o.status === "Cancelled") boyMap[dn].cancelled++;
  });

  const boys = Object.values(boyMap)
    .map(b => ({
      ...b,
      areas: [...b.areas].join(", "),
      successRate: b.orders ? Math.round((b.delivered / b.orders) * 100) : 0,
    }))
    .sort((a,b) => b.orders - a.orders);

  const totalDelivered = filtered.filter(o => o.status === "Delivered").length;
  const unassigned     = filtered.filter(o => !o.delivery?.id).length;

  return { boys, totalDelivered, unassigned, totalOrders: filtered.length };
}

// ─── Trend builder ────────────────────────────────────────────────────────────
function buildTrend(orders, period, metric = "orders") {
  const now   = new Date();
  const days  = period === "daily" ? 1 : period === "weekly" ? 7 : period === "monthly" ? 30 : period === "halfyearly" ? 26 : 12;
  const isWeeks = period === "halfyearly";
  const isMonths= period === "yearly";
  const points  = isMonths ? 12 : isWeeks ? 26 : Math.min(days, 14);

  const result = [];
  for (let i = points - 1; i >= 0; i--) {
    let label, start, end;
    if (isMonths) {
      start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      end   = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      label = start.toLocaleDateString("en-IN", { month: "short" });
    } else if (isWeeks) {
      end   = new Date(now); end.setDate(now.getDate() - i * 7);
      start = new Date(end); start.setDate(end.getDate() - 7);
      label = `W${points - i}`;
    } else {
      start = new Date(now); start.setDate(now.getDate() - i);
      end   = new Date(start); end.setDate(start.getDate() + 1);
      label = start.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    }

    const slice = orders.filter(o => {
      const d = parseDate(o.date);
      return d && d >= start && d <= end;
    });

    const value = metric === "revenue"
      ? slice.reduce((s,o) => s + o.finalAmount, 0)
      : slice.length;

    result.push({ label, value });
  }
  return result;
}

// ─── CSV Export ───────────────────────────────────────────────────────────────
export function exportCSV(data, filename) {
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(h => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(","));
  const csv  = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

