'use client';
import { useState, useMemo } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import WithdrawalModal from "../components/earnings/WithdrawalModal";
import {
  buildOrderEarnings, buildEarningsSummary,
  PAYOUT_HISTORY, getCurrentMonthPayouts, MAX_PAYOUTS_PER_MONTH,
} from "../data/earningsData";

export default function EarningsPage() {
  const [payouts, setPayouts] = useState(PAYOUT_HISTORY);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("orders"); // "orders" | "vendors" | "payouts"
  const [orderFilter, setOrderFilter] = useState("All");
  const [successMsg, setSuccessMsg] = useState("");

  const orderEarnings = useMemo(() => buildOrderEarnings(), []);
  const summary = useMemo(() => buildEarningsSummary(orderEarnings), [orderEarnings]);

  const usedThisMonth = useMemo(() => 
    getCurrentMonthPayouts().filter(p => p.status === "Paid" || p.status === "Pending").length, 
    [payouts]
  );
  
  const canWithdraw = summary.availableBalance >= 100 && usedThisMonth < MAX_PAYOUTS_PER_MONTH;

  const filteredOrders = useMemo(() => {
    if (orderFilter === "All") return orderEarnings;
    return orderEarnings.filter(e => e.vendorName === orderFilter);
  }, [orderEarnings, orderFilter]);

  const vendorNames = useMemo(() => ["All", ...new Set(orderEarnings.map(e => e.vendorName))], [orderEarnings]);

  const handleWithdraw = (amount) => {
    const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const monthLabel = new Date().toLocaleDateString("en-IN", { month: "short", year: "numeric" });
    const newPayout = {
      id: `PAY-${String(payouts.length + 1).padStart(3, "0")}`,
      month: monthLabel,
      requestDate: today,
      settledDate: null,
      amount,
      status: "Pending",
      txnId: null,
      payoutNo: usedThisMonth + 1,
    };
    setPayouts(prev => [newPayout, ...prev]);
    setShowModal(false);
    setSuccessMsg(`Withdrawal of ₹${amount.toLocaleString()} requested! Settlement in 2 business days.`);
    setTimeout(() => setSuccessMsg(""), 5000);
  };

  const maxVendorEarned = Math.max(...summary.vendorBreakdown.map(v => v.earned));

  return (
    <PageWrapper>
      {/* Header */}
      <div className="flex flex-wrap justify-between items-start gap-3 mb-5">
        <div>
          <h1 className="font-['Sora'] text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-none">Earnings</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">Your commission-based income overview</p>
        </div>
        <button
          className={`inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-bold shadow-[0_4px_14px_rgba(12, 131, 31,0.35)] transition-all whitespace-nowrap ${
            !canWithdraw ? "bg-slate-400 shadow-none cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={() => canWithdraw && setShowModal(true)}
          title={!canWithdraw
            ? usedThisMonth >= MAX_PAYOUTS_PER_MONTH
              ? "Monthly withdrawal limit reached (2/2)"
              : "Minimum ₹100 balance required"
            : "Request withdrawal"}
        >
          💸 Request Withdrawal
          {usedThisMonth > 0 && (
            <span className="bg-white/25 px-2 py-0.5 rounded-full text-[0.7rem] ml-1">{usedThisMonth}/{MAX_PAYOUTS_PER_MONTH}</span>
          )}
        </button>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="bg-emerald-100 border border-emerald-300 rounded-xl p-3.5 text-sm font-semibold text-emerald-800 mb-4">
          ✅ {successMsg}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <KpiCard
          label="Available Balance"
          value={`₹${summary.availableBalance.toLocaleString()}`}
          sub="Ready to withdraw"
          color="text-blue-600" bg="bg-blue-50"
          icon="💰" highlight
        />
        <KpiCard
          label="This Month"
          value={`₹${summary.thisMonthEarnings.toLocaleString()}`}
          sub="Commission earned"
          color="text-emerald-600" bg="bg-emerald-50"
          icon="📅"
        />
        <KpiCard
          label="This Week"
          value={`₹${summary.thisWeekEarnings.toLocaleString()}`}
          sub="Last 7 days"
          color="text-violet-600" bg="bg-violet-50"
          icon="📊"
        />
        <KpiCard
          label="Lifetime Earnings"
          value={`₹${summary.totalLifetime.toLocaleString()}`}
          sub={`${summary.orderCount} orders`}
          color="text-amber-600" bg="bg-amber-50"
          icon="🏆"
        />
        <KpiCard
          label="Total Paid Out"
          value={`₹${summary.totalPaidOut.toLocaleString()}`}
          sub="Settled to bank"
          color="text-slate-500" bg="bg-slate-100"
          icon="✅"
        />
        <KpiCard
          label="Pending Payout"
          value={`₹${summary.pendingPayout.toLocaleString()}`}
          sub="In process"
          color="text-amber-500" bg="bg-amber-50"
          icon="⏳"
        />
      </div>

      {/* Withdrawal limit bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 mb-4 flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-slate-900">Monthly Withdrawal Limit</span>
          <span className="text-[0.72rem] text-slate-400">Resets on 1st of every month</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="flex gap-2">
            {Array.from({ length: MAX_PAYOUTS_PER_MONTH }).map((_, i) => (
              <div 
                key={i} 
                className={`w-7 h-7 rounded-full border-2 ${
                  i < usedThisMonth ? "bg-blue-600 border-blue-600" : "bg-slate-50 border-slate-200"
                }`} 
              />
            ))}
          </div>
          <span className="text-sm font-bold text-slate-500 whitespace-nowrap">{usedThisMonth}/{MAX_PAYOUTS_PER_MONTH} used</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {[
          { key: "orders",  label: `📦 Order Earnings (${orderEarnings.length})` },
          { key: "vendors", label: `🏪 Vendor Breakdown (${summary.vendorBreakdown.length})` },
          { key: "payouts", label: `💳 Payout History (${payouts.length})` },
        ].map(t => (
          <button 
            key={t.key} 
            className={`px-4 py-2 border-[1.5px] rounded-xl text-[0.82rem] font-semibold transition-all whitespace-nowrap ${
              activeTab === t.key 
                ? "bg-blue-50 border-blue-600 text-blue-600" 
                : "bg-white border-slate-200 text-slate-500 hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50/50"
            }`} 
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {/* ── Tab: Order Earnings ── */}
        {activeTab === "orders" && (
          <div>
            <div className="flex flex-wrap items-center gap-2.5 p-3.5 border-b border-slate-100">
              <span className="text-[0.78rem] text-slate-500 font-semibold">Filter by vendor:</span>
              <select 
                className="h-9 px-2 border-[1.5px] border-slate-200 rounded-lg bg-slate-50 text-[0.82rem] outline-none focus:border-blue-600" 
                value={orderFilter} 
                onChange={e => setOrderFilter(e.target.value)}
              >
                {vendorNames.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
              <span className="ml-auto text-[0.8rem] text-slate-500">
                Total shown: <strong className="text-blue-600 font-bold">₹{filteredOrders.reduce((s,e) => s+e.earned, 0).toLocaleString()}</strong>
              </span>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-[0.83rem] min-width-[820px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {["Order ID","Date","Customer","Area","Vendor","Order Amt","Comm %","Earned","Status"].map(h => (
                      <th key={h} className="px-3.5 py-2.5 text-slate-400 text-[0.68rem] font-bold uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(e => (
                    <tr key={e.orderId} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                      <td className="px-3.5 py-3 font-['Sora'] font-bold text-blue-600 text-[0.8rem]">{e.orderId}</td>
                      <td className="px-3.5 py-3">
                        <div className="font-semibold text-slate-700 text-[0.8rem]">{e.date}</div>
                        <div className="text-[0.68rem] text-slate-400 leading-none">{e.time}</div>
                      </td>
                      <td className="px-3.5 py-3 text-slate-700 font-medium">{e.customer}</td>
                      <td className="px-3.5 py-3 text-slate-500 text-[0.78rem]">📍 {e.area}</td>
                      <td className="px-3.5 py-3 text-slate-700 font-medium">{e.vendorName}</td>
                      <td className="px-3.5 py-3 font-bold text-slate-900">₹{e.orderAmt.toLocaleString()}</td>
                      <td className="px-3.5 py-3">
                        <span className="bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full text-[0.72rem] font-bold">
                          {e.commPct}%
                        </span>
                      </td>
                      <td className="px-3.5 py-3 font-['Sora'] font-extrabold text-emerald-500 text-[0.9rem]">₹{e.earned.toLocaleString()}</td>
                      <td className="px-3.5 py-3"><StatusPill status={e.status} /></td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr><td colSpan={9} className="text-center py-8 text-slate-400 text-[0.85rem]">No orders found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden flex flex-col gap-2 p-3 bg-slate-50/30">
              {filteredOrders.map(e => (
                <div key={e.orderId} className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-['Sora'] font-bold text-blue-600 text-[0.8rem]">{e.orderId}</span>
                    <StatusPill status={e.status} />
                  </div>
                  <div className="text-[0.82rem] font-semibold text-slate-700 mb-0.5">
                    {e.customer} <span className="text-slate-300 px-1">·</span> <span className="text-slate-400 font-normal italic text-[0.75rem]">📍 {e.area}</span>
                  </div>
                  <div className="text-[0.74rem] text-slate-500 mb-2">🏪 {e.vendorName}</div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-2 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[0.62rem] text-slate-400 font-bold uppercase tracking-wider">Order Amt</span>
                      <span className="text-xs font-bold text-slate-900 leading-tight">₹{e.orderAmt.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.62rem] text-slate-400 font-bold uppercase tracking-wider">Commission</span>
                      <span className="text-xs font-bold text-violet-600 leading-tight">{e.commPct}%</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.62rem] text-slate-400 font-bold uppercase tracking-wider">You Earned</span>
                      <span className="text-xs font-extrabold text-emerald-500 leading-tight">₹{e.earned.toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.62rem] text-slate-400 font-bold uppercase tracking-wider">Date</span>
                      <span className="text-[0.68rem] text-slate-500 leading-tight">{e.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab: Vendor Breakdown ── */}
        {activeTab === "vendors" && (
          <div className="flex flex-col">
            {summary.vendorBreakdown.map((v, i) => {
              const pct = Math.round((v.earned / maxVendorEarned) * 100);
              return (
                <div key={v.vendorName} className="flex items-center gap-3.5 p-4 border-b border-slate-100 last:border-0 transition-colors hover:bg-slate-50/50">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[0.72rem] font-extrabold font-['Sora'] flex-shrink-0">
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900 text-[0.88rem] truncate mr-2">{v.vendorName}</span>
                      <span className="text-[0.72rem] text-slate-400 whitespace-nowrap">{v.orders} orders</span>
                    </div>
                    <div className="flex gap-2.5 mb-1.5 flex-wrap">
                      <span className="text-[0.72rem] font-bold text-violet-500 bg-violet-50 px-2 rounded-full">{v.commPct}% comm</span>
                      <span className="text-[0.72rem] text-slate-500">Order total: ₹{v.orderAmt.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-[5px] bg-blue-50 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-700 ease-out" 
                        style={{ width:`${pct}%`, background: rankColor(i) }} 
                      />
                    </div>
                  </div>
                  <div className="font-['Sora'] font-extrabold text-emerald-500 text-base flex-shrink-0 min-w-[80px] text-right">
                    ₹{v.earned.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Tab: Payout History ── */}
        {activeTab === "payouts" && (
          <div className="flex flex-col min-h-[300px]">
            {payouts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2.5 p-12 text-slate-400">
                <span className="text-4xl">💳</span>
                <p className="text-sm font-medium">No payout history yet</p>
              </div>
            ) : (
              <div className="flex flex-col">
                {payouts.map(p => (
                  <div key={p.id} className="flex items-center justify-between gap-3.5 p-4 border-b border-slate-100 last:border-0 transition-colors hover:bg-slate-50/50">
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${
                        p.status === "Paid" ? "bg-emerald-100" : "bg-amber-100"
                      }`}>
                        {p.status === "Paid" ? "✅" : "⏳"}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-[0.85rem] flex items-center flex-wrap gap-2 leading-none mb-1">
                          {p.month} — Withdrawal #{p.payoutNo}
                          <span className={`px-2 py-0.5 rounded-full text-[0.68rem] font-bold ${
                            p.status === "Paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-700"
                          }`}>
                            {p.status}
                          </span>
                        </div>
                        <div className="text-[0.72rem] text-slate-400 truncate font-medium">
                          Requested: {p.requestDate}
                          {p.settledDate && ` · Settled: ${p.settledDate}`}
                          {p.txnId && ` · TXN: ${p.txnId}`}
                        </div>
                      </div>
                    </div>
                    <div className="font-['Sora'] font-extrabold text-slate-900 text-base flex-shrink-0">
                      ₹{p.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Withdrawal Modal */}
      {showModal && (
        <WithdrawalModal
          available={summary.availableBalance}
          usedThisMonth={usedThisMonth}
          onConfirm={handleWithdraw}
          onClose={() => setShowModal(false)}
        />
      )}
    </PageWrapper>
  );
}

/* ── Sub-components ── */
function KpiCard({ label, value, sub, color, bg, icon, highlight }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-1.5 shadow-sm transition-shadow hover:shadow-md ${
      highlight ? "border-blue-200 bg-gradient-to-br from-[#eaf6ed] to-[#fdfbf7]" : ""
    }`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-[0.68rem] font-extrabold text-slate-400 uppercase tracking-widest">{label}</span>
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${bg} ${color}`}>{icon}</span>
      </div>
      <div className={`font-['Sora'] text-lg md:text-2xl font-extrabold tracking-tight leading-none ${color}`}>{value}</div>
      <div className="text-[0.7rem] text-slate-400 font-medium leading-tight">{sub}</div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    Delivered:  { bg:"bg-emerald-100", color:"text-emerald-800" },
    Processing: { bg:"bg-blue-100", color:"text-blue-700" },
    Pending:    { bg:"bg-amber-100", color:"text-amber-700" },
  };
  const s = map[status] || { bg:"bg-slate-100", color:"text-slate-600" };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[0.68rem] font-extrabold whitespace-nowrap ${s.bg} ${s.color}`}>
      {status}
    </span>
  );
}

function rankColor(i) {
  const colors = ["#ae2012","#4a5d23","#0c831f","#e9c46a","#d32f2f","#7d6b5d"];
  return colors[i] || "#a68b66";
}