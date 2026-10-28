"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ClipboardList,
  Download,
  Search,
  Trash2,
  X,
} from "lucide-react";
import PageWrapper from "../components/layout/PageWrapper";
import { PageHeader } from "../components/brand/PageHeader";
import { BrandStatStrip } from "../components/brand/BrandStatStrip";
import { BrandCard } from "../components/brand/BrandCard";
import { getLogs, clearLogs } from "../../store/activityStore";
import { buildDailyDigest, formatDigestEmail } from "../../store/sessionStore";

const CATEGORIES = ["All", "auth", "orders", "vendors", "leads", "earnings", "navigation", "reports"];
const SEVERITIES = ["All", "info", "warning", "critical"];

const CAT_STYLES = {
  auth: "bg-primary-50 text-primary-700",
  orders: "bg-secondary-100 text-primary-600",
  vendors: "bg-fresh-50 text-fresh-700",
  leads: "bg-mehndi-50 text-mehndi-700",
  earnings: "bg-accent-50 text-accent-700",
  navigation: "bg-secondary-100 text-secondary-700",
  reports: "bg-fresh-50 text-fresh-700",
};

const SEV_STYLES = {
  info: "bg-fresh-50 text-fresh-700",
  warning: "bg-accent-50 text-accent-700",
  critical: "bg-primary-50 text-primary-800",
};

export default function ActivityLogPage() {
  const [logs, setLogs] = useState(getLogs());
  const [category, setCategory] = useState("All");
  const [severity, setSeverity] = useState("All");
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("today");
  const [showClear, setShowClear] = useState(false);

  const filtered = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const week = new Date(today);
    week.setDate(today.getDate() - 7);
    const month = new Date(today);
    month.setMonth(today.getMonth() - 1);

    return logs.filter((log) => {
      const date = new Date(log.timestamp);
      const matchDate =
        dateFilter === "all"
          ? true
          : dateFilter === "today"
            ? date >= today
            : dateFilter === "week"
              ? date >= week
              : date >= month;

      const query = search.toLowerCase();
      const matchSearch =
        !search ||
        log.action.toLowerCase().includes(query) ||
        log.detail.toLowerCase().includes(query) ||
        log.type.toLowerCase().includes(query);

      const matchCategory = category === "All" || log.category === category;
      const matchSeverity = severity === "All" || log.severity === severity;

      return matchDate && matchSearch && matchCategory && matchSeverity;
    });
  }, [logs, category, severity, search, dateFilter]);

  const handleClear = () => {
    clearLogs();
    setLogs([]);
    setShowClear(false);
  };

  const handleExportCSV = () => {
    const rows = filtered.map((log) => ({
      Timestamp: new Date(log.timestamp).toLocaleString("en-IN"),
      Type: log.type,
      Category: log.category,
      Action: log.action,
      Detail: log.detail,
      User: log.user,
      Page: log.page,
      Severity: log.severity,
    }));
    const headers = Object.keys(rows[0] || {});
    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => `"${String(row[header] || "").replace(/"/g, '""')}"`)
          .join(","),
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "activity-log.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyDigest = () => {
    const digest = buildDailyDigest();
    navigator.clipboard.writeText(formatDigestEmail(digest));
  };

  const warnings = logs.filter((log) => log.severity === "warning").length;
  const criticals = logs.filter((log) => log.severity === "critical").length;
  const todayCount = logs.filter(
    (log) => new Date(log.timestamp).toDateString() === new Date().toDateString(),
  ).length;

  const dateTabs = [
    ["today", "Today"],
    ["week", "This Week"],
    ["month", "This Month"],
    ["all", "All Time"],
  ];

  return (
    <PageWrapper>
      <PageHeader
        kicker="Audit Trail"
        title="Activity Log"
        subtitle="Complete audit trail of all Area Manager actions"
        actions={
          <>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-fresh-800 bg-fresh-600 px-4 py-2.5 text-xs font-display font-black text-white transition-colors hover:bg-fresh-700"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button
              onClick={handleCopyDigest}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-secondary-900 bg-background-section px-4 py-2.5 text-xs font-display font-black text-secondary-900 transition-colors hover:bg-accent-400"
            >
              <ClipboardList className="h-4 w-4" /> Copy Digest
            </button>
            <button
              onClick={() => setShowClear(true)}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-primary-800 bg-primary-600 px-4 py-2.5 text-xs font-display font-black text-white transition-colors hover:bg-primary-700"
            >
              <Trash2 className="h-4 w-4" /> Clear Logs
            </button>
          </>
        }
      />

      <BrandStatStrip
        items={[
          { label: "Total Logs", value: logs.length, tone: "primary" },
          { label: "Today", value: todayCount, tone: "fresh" },
          { label: "Warnings", value: warnings, tone: "accent" },
          { label: "Critical", value: criticals, tone: "danger" },
        ]}
      />

      <BrandCard className="p-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-52 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
            <input
              placeholder="Search action, detail, type…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-11 w-full rounded-2xl border-2 border-secondary-200 bg-secondary-50 pl-10 pr-9 text-sm font-semibold text-secondary-900 outline-none focus:border-primary-600 focus:bg-background-section"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-primary-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex gap-1 rounded-2xl border-2 border-secondary-200 bg-secondary-50 p-1">
            {dateTabs.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setDateFilter(key)}
                className={`rounded-xl px-3 py-1.5 text-xs font-black transition-colors ${
                  dateFilter === key
                    ? "bg-secondary-900 text-accent-300"
                    : "text-secondary-600 hover:bg-background-section"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <select
            className="h-11 rounded-2xl border-2 border-secondary-200 bg-secondary-50 px-3 text-sm font-bold text-secondary-800 outline-none focus:border-primary-600"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {value === "All" ? "All Categories" : value}
              </option>
            ))}
          </select>

          <select
            className="h-11 rounded-2xl border-2 border-secondary-200 bg-secondary-50 px-3 text-sm font-bold text-secondary-800 outline-none focus:border-primary-600"
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
          >
            {SEVERITIES.map((value) => (
              <option key={value} value={value}>
                {value === "All" ? "All Severity" : value}
              </option>
            ))}
          </select>

          <span className="text-xs font-bold text-secondary-600">
            Showing <strong className="text-primary-600">{filtered.length}</strong> of{" "}
            {logs.length}
          </span>
        </div>
      </BrandCard>

      <div className="overflow-hidden rounded-3xl border-2 border-secondary-900 bg-background-section shadow-[6px_6px_0px_var(--color-secondary-900)]">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-16 text-center text-secondary-500">
            <span className="text-4xl">📋</span>
            <p className="text-sm font-semibold">No activity logs found for selected filters</p>
            <p className="text-xs font-medium">
              Start using the app — actions will be logged here automatically
            </p>
          </div>
        ) : (
          <div className="divide-y divide-secondary-100">
            {filtered.map((log) => (
              <div
                key={log.id}
                className={`flex flex-col gap-3 px-4 py-3.5 transition-colors hover:bg-secondary-50 md:flex-row md:items-start ${
                  log.severity !== "info" ? "bg-accent-50/50" : ""
                }`}
              >
                <div className="flex shrink-0 flex-row items-center gap-2 md:w-36 md:flex-col md:items-start">
                  <p className="whitespace-nowrap text-[11px] font-bold text-secondary-500">
                    {new Date(log.timestamp).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                  <div className="flex flex-row gap-1 md:flex-col">
                    <span
                      className={`w-fit rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                        CAT_STYLES[log.category] ?? "bg-secondary-100 text-secondary-700"
                      }`}
                    >
                      {log.category}
                    </span>
                    <span
                      className={`w-fit rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                        SEV_STYLES[log.severity] ?? "bg-secondary-100 text-secondary-700"
                      }`}
                    >
                      {log.severity}
                    </span>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-secondary-900">{log.action}</p>
                  {log.detail && (
                    <p className="mt-0.5 text-xs font-semibold text-secondary-500">
                      {log.detail}
                    </p>
                  )}
                  <p className="mt-1 text-[10px] font-semibold text-secondary-400">
                    📄 {log.page} · 👤 {log.user}
                  </p>
                </div>

                <span className="w-fit shrink-0 rounded-lg bg-secondary-100 px-2 py-1 text-[10px] font-bold text-secondary-500">
                  {log.type.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showClear && (
        <div className="fixed inset-0 z-[1300] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-secondary-950/60 backdrop-blur-sm"
            onClick={() => setShowClear(false)}
          />
          <div className="relative w-full max-w-sm rounded-3xl border-2 border-secondary-900 bg-background-section p-6 shadow-[8px_8px_0px_var(--color-primary-600)]">
            <div className="flex flex-col items-center gap-2 text-center">
              <AlertTriangle className="h-10 w-10 text-primary-600" />
              <h3 className="font-display text-lg font-black text-secondary-900">
                Clear All Logs?
              </h3>
              <p className="text-sm font-semibold text-secondary-500">
                This will permanently delete all {logs.length} activity records. This
                cannot be undone.
              </p>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowClear(false)}
                className="flex-1 rounded-2xl border-2 border-secondary-300 bg-background-section py-2.5 text-sm font-display font-bold text-secondary-900 hover:bg-secondary-100"
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                className="flex-1 rounded-2xl border-2 border-primary-800 bg-primary-600 py-2.5 text-sm font-display font-bold text-white hover:bg-primary-700"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
