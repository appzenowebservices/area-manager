import { Eye } from "lucide-react";
import ComplaintSourceBadge from "./ComplaintSourceBadge";
import ComplaintPriorityBadge from "./ComplaintPriorityBadge";
import ComplaintStatusBadge from "./ComplaintStatusBadge";

export default function ComplaintsTable({ complaints, onView }) {
  return (
    <div className="overflow-hidden rounded-3xl border-2 border-secondary-900 bg-background-section shadow-[6px_6px_0px_var(--color-secondary-900)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse text-sm">
          <thead>
            <tr className="bg-secondary-900 text-left text-[10px] font-black uppercase tracking-[0.12em] text-accent-300">
              {[
                "ID",
                "Source",
                "Type",
                "Subject",
                "Reported By",
                "Area",
                "Priority",
                "Status",
                "Date",
                "Timeline",
                "Action",
              ].map((heading) => (
                <th key={heading} className="whitespace-nowrap px-4 py-3">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-100">
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-14 text-center">
                  <span className="text-4xl">✅</span>
                  <p className="mt-2 text-sm font-semibold text-secondary-500">
                    No complaints found
                  </p>
                </td>
              </tr>
            ) : (
              complaints.map((complaint) => (
                <tr key={complaint.id} className="transition-colors hover:bg-secondary-50">
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="font-display text-xs font-black text-primary-600">
                      {complaint.id}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <ComplaintSourceBadge source={complaint.source} size="sm" />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-secondary-700">
                    {complaint.type}
                  </td>
                  <td className="max-w-52 px-4 py-3">
                    <p className="truncate text-xs font-bold text-secondary-900">
                      {complaint.subject}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <p className="text-xs font-bold text-secondary-800">
                      {complaint.reportedBy.name}
                    </p>
                    <p className="text-[10px] font-semibold text-secondary-400">
                      {complaint.reportedBy.ref}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-secondary-600">
                    📍 {complaint.area}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <ComplaintPriorityBadge priority={complaint.priority} size="sm" />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <ComplaintStatusBadge status={complaint.status} size="sm" />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <p className="text-xs font-bold text-secondary-800">
                      {complaint.createdDate}
                    </p>
                    <p className="text-[10px] font-semibold text-secondary-400">
                      {complaint.createdTime}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-secondary-600">
                    🕐 {complaint.timeline.length}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <button
                      onClick={() => onView(complaint)}
                      className="inline-flex items-center gap-1 rounded-full border-2 border-secondary-900 bg-background-section px-3 py-1.5 text-[11px] font-black text-primary-600 transition-colors hover:bg-accent-400"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
