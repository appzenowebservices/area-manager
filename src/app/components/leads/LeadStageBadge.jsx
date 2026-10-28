"use client";

const STAGE_STYLES = {
  New: "bg-secondary-100 text-primary-600 border-secondary-200",
  Contacted: "bg-mehndi-50 text-mehndi-700 border-mehndi-200",
  "Docs Pending": "bg-accent-50 text-accent-700 border-accent-200",
  Approved: "bg-fresh-50 text-fresh-700 border-fresh-200",
  Rejected: "bg-primary-50 text-primary-800 border-primary-200",
};

const DOT_STYLES = {
  New: "bg-primary-600",
  Contacted: "bg-mehndi-600",
  "Docs Pending": "bg-accent-400",
  Approved: "bg-fresh-600",
  Rejected: "bg-primary-700",
};

export default function LeadStageBadge({ stage, size = "md" }) {
  const tone =
    STAGE_STYLES[stage] ??
    "bg-secondary-100 text-secondary-700 border-secondary-200";
  const dot = DOT_STYLES[stage] ?? "bg-secondary-500";

  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border-2 font-black uppercase tracking-wider ${tone} ${
        size === "sm"
          ? "px-2 py-0.5 text-[9px]"
          : "px-2.5 py-1 text-[10px]"
      }`}
    >
      <span
        className={`rounded-full ${dot} ${
          size === "sm" ? "h-1 w-1" : "h-1.5 w-1.5"
        }`}
      />
      {stage}
    </span>
  );
}
