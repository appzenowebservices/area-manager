// src/data/earningsData.js
import { ORDERS } from "./ordersData";
import { VENDORS } from "./vendorsData";

// ── Commission rate per vendor (id → %) ──
const vendorCommissionMap = {};
VENDORS.forEach(v => { vendorCommissionMap[v.name] = v.commission; });

// Fallback commission if vendor not found
const DEFAULT_COMMISSION = 10;

// ── Build per-order earnings from ORDERS ──
export function buildOrderEarnings() {
  return ORDERS
    .filter(o => o.status !== "Cancelled")
    .map(o => {
      const commPct = vendorCommissionMap[o.vendor?.name] ?? DEFAULT_COMMISSION;
      const earned  = Math.round((o.finalAmount * commPct) / 100);
      return {
        orderId:    o.id,
        date:       o.date,
        time:       o.time,
        customer:   o.customer.name,
        area:       o.area,
        vendorName: o.vendor?.name || "Unassigned",
        commPct,
        orderAmt:   o.finalAmount,
        earned,
        status:     o.status,
      };
    });
}

// ── Payout history (mock — in real app from backend) ──
export const PAYOUT_HISTORY = [
  {
    id: "PAY-001",
    month: "Feb 2025",
    requestDate: "14 Feb 2025",
    settledDate: "16 Feb 2025",
    amount: 3240,
    status: "Paid",
    txnId: "TXN8823441",
    payoutNo: 1,
  },
  {
    id: "PAY-002",
    month: "Feb 2025",
    requestDate: "26 Feb 2025",
    settledDate: "28 Feb 2025",
    amount: 2980,
    status: "Paid",
    txnId: "TXN8834562",
    payoutNo: 2,
  },
  {
    id: "PAY-003",
    month: "Mar 2025",
    requestDate: "12 Mar 2025",
    settledDate: "14 Mar 2025",
    amount: 4120,
    status: "Paid",
    txnId: "TXN8901234",
    payoutNo: 1,
  },
  {
    id: "PAY-004",
    month: "Mar 2025",
    requestDate: "27 Mar 2025",
    settledDate: null,
    amount: 3650,
    status: "Pending",
    txnId: null,
    payoutNo: 2,
  },
];

// ── Current month withdrawal count ──
export function getCurrentMonthPayouts() {
  const now   = new Date();
  const label = now.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  return PAYOUT_HISTORY.filter(p => p.month === label);
}

export const MAX_PAYOUTS_PER_MONTH = 2;

// ── Summary stats ──
export function buildEarningsSummary(orderEarnings) {
  const now       = new Date();
  const thisMonth = now.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const thisWeekStart = new Date(now); thisWeekStart.setDate(now.getDate() - now.getDay());

  const parseDate = (d) => {
    if (!d) return null;
    const [day, mon, yr] = d.split(" ");
    return new Date(`${mon} ${day} ${yr}`);
  };

  const totalLifetime  = orderEarnings.reduce((s, e) => s + e.earned, 0);
  const totalPaidOut   = PAYOUT_HISTORY.filter(p => p.status === "Paid").reduce((s, p) => s + p.amount, 0);
  const pendingPayout  = PAYOUT_HISTORY.filter(p => p.status === "Pending").reduce((s, p) => s + p.amount, 0);
  const availableBalance = totalLifetime - totalPaidOut - pendingPayout;

  // This month earnings
  const thisMonthEarnings = orderEarnings
    .filter(e => {
      const d = parseDate(e.date);
      return d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, e) => s + e.earned, 0);

  // This week earnings
  const thisWeekEarnings = orderEarnings
    .filter(e => {
      const d = parseDate(e.date);
      return d && d >= thisWeekStart;
    })
    .reduce((s, e) => s + e.earned, 0);

  // Per vendor breakdown
  const vendorMap = {};
  orderEarnings.forEach(e => {
    if (!vendorMap[e.vendorName]) {
      vendorMap[e.vendorName] = { vendorName: e.vendorName, commPct: e.commPct, orders: 0, orderAmt: 0, earned: 0 };
    }
    vendorMap[e.vendorName].orders++;
    vendorMap[e.vendorName].orderAmt += e.orderAmt;
    vendorMap[e.vendorName].earned   += e.earned;
  });
  const vendorBreakdown = Object.values(vendorMap).sort((a, b) => b.earned - a.earned);

  return {
    totalLifetime,
    totalPaidOut,
    pendingPayout,
    availableBalance,
    thisMonthEarnings,
    thisWeekEarnings,
    vendorBreakdown,
    orderCount: orderEarnings.length,
  };
}
