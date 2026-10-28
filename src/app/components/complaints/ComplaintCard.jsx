import { Eye } from "lucide-react";
import ComplaintSourceBadge from "./ComplaintSourceBadge";
import ComplaintPriorityBadge from "./ComplaintPriorityBadge";
import ComplaintStatusBadge from "./ComplaintStatusBadge";

export default function ComplaintCard({ complaint, onView }) {
  return (
    <div className="rounded-3xl border-2 border-secondary-900 bg-background-section p-4 shadow-[5px_5px_0px_var(--color-secondary-900)]">
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-xs font-black text-primary-600">
          {complaint.id}
        </span>
        <ComplaintStatusBadge status={complaint.status} size="sm" />
      </div>

      <p className="mt-2 text-sm font-bold text-secondary-900">{complaint.subject}</p>

      <div className="mt-2 flex flex-wrap gap-2">
        <ComplaintSourceBadge source={complaint.source} size="sm" />
        <ComplaintPriorityBadge priority={complaint.priority} size="sm" />
      </div>

      <div className="my-3 h-px bg-secondary-100" />

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Type", value: complaint.type },
          { label: "Reported By", value: complaint.reportedBy.name },
          { label: "Area", value: `📍 ${complaint.area}` },
          { label: "Date", value: complaint.createdDate },
          { label: "Timeline", value: `🕐 ${complaint.timeline.length}` },
          { label: "Ref", value: complaint.reportedBy.ref },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-[9px] font-black uppercase tracking-widest text-secondary-400">
              {item.label}
            </p>
            <p className="truncate text-xs font-bold text-secondary-700">{item.value}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => onView(complaint)}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-secondary-900 bg-secondary-50 px-4 py-2.5 text-xs font-black text-primary-600 transition-colors hover:bg-accent-400"
      >
        <Eye className="h-4 w-4" /> View Full Details →
      </button>
    </div>
  );
}
