import { Eye } from "lucide-react";
import LeadStageBadge from "./LeadStageBadge";

export default function LeadCard({ lead, onView }) {
  const isVendor = lead.type === "vendor";
  const docCount = Object.values(lead.documents).filter(Boolean).length;
  const docTotal = Object.keys(lead.documents).length;

  return (
    <div className="rounded-3xl border-2 border-secondary-900 bg-background-section p-4 shadow-[5px_5px_0px_var(--color-secondary-900)]">
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-secondary-900 text-sm font-black text-white"
          style={{
            background: isVendor
              ? "linear-gradient(135deg,#ae2012,#2d241e)"
              : "linear-gradient(135deg,#0c831f,#0a671a)",
          }}
        >
          {lead.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-secondary-900">{lead.name}</p>
          <p className="truncate text-[11px] font-semibold text-secondary-500">
            {lead.id} · {isVendor ? lead.category : lead.vehicle}
          </p>
        </div>
        <LeadStageBadge stage={lead.stage} size="sm" />
      </div>

      <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-semibold text-secondary-500">
        <span>📞 {lead.phone}</span>
        <span>📍 {lead.area}</span>
        <span>📅 {lead.appliedDate}</span>
      </div>

      <div className="my-3 h-px bg-secondary-100" />

      <div className="grid grid-cols-2 gap-2">
        <Chip label="Experience" value={isVendor ? lead.experience : `${lead.age} yrs`} />
        <Chip
          label={isVendor ? "Commission" : "Experience"}
          value={isVendor ? `${lead.commission}%` : lead.experience}
          tone="text-mehndi-700"
        />
        <Chip
          label="Documents"
          value={`${docCount}/${docTotal}`}
          tone={
            docCount === docTotal
              ? "text-fresh-600"
              : docCount > 0
                ? "text-accent-600"
                : "text-primary-700"
          }
        />
        {lead.lastContactDate && (
          <Chip label="Last Contact" value={lead.lastContactDate} />
        )}
      </div>

      {lead.notes && (
        <p className="mt-3 rounded-xl border-2 border-secondary-100 bg-secondary-50 px-3 py-2 text-[11px] font-semibold text-secondary-700">
          💬 {lead.notes}
        </p>
      )}

      <button
        onClick={() => onView(lead)}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-secondary-900 bg-secondary-50 px-4 py-2.5 text-xs font-black text-primary-600 transition-colors hover:bg-accent-400"
      >
        <Eye className="h-4 w-4" /> View & Manage →
      </button>
    </div>
  );
}

function Chip({ label, value, tone = "text-secondary-700" }) {
  return (
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest text-secondary-400">
        {label}
      </p>
      <p className={`text-xs font-bold ${tone}`}>{value}</p>
    </div>
  );
}
