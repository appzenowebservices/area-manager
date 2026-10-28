import { Eye } from "lucide-react";
import LeadStageBadge from "./LeadStageBadge";

export default function LeadsTable({ leads, onView, type }) {
  const isVendor = type === "vendor";

  return (
    <div className="overflow-hidden rounded-3xl border-2 border-secondary-900 bg-background-section shadow-[6px_6px_0px_var(--color-secondary-900)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] border-collapse text-sm">
          <thead>
            <tr className="bg-secondary-900 text-left text-[10px] font-black uppercase tracking-[0.12em] text-accent-300">
              {(isVendor
                ? [
                    "Applicant",
                    "Phone",
                    "Area",
                    "Category",
                    "Experience",
                    "Commission",
                    "Documents",
                    "Stage",
                    "Applied",
                    "Action",
                  ]
                : [
                    "Applicant",
                    "Phone",
                    "Area",
                    "Vehicle",
                    "Age",
                    "Experience",
                    "Documents",
                    "Stage",
                    "Applied",
                    "Action",
                  ]
              ).map((heading) => (
                <th key={heading} className="whitespace-nowrap px-4 py-3">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-100">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-14 text-center">
                  <span className="text-4xl">📋</span>
                  <p className="mt-2 text-sm font-semibold text-secondary-500">
                    No leads found
                  </p>
                </td>
              </tr>
            ) : (
              leads.map((lead) => {
                const docCount = Object.values(lead.documents).filter(Boolean).length;
                const docTotal = Object.keys(lead.documents).length;
                return (
                  <tr key={lead.id} className="transition-colors hover:bg-secondary-50">
                    <td className="whitespace-nowrap px-4 py-3">
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
                        <div>
                          <p className="text-sm font-bold text-secondary-900">{lead.name}</p>
                          <p className="text-[10px] font-semibold text-secondary-400">{lead.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-secondary-600">
                      📞 {lead.phone}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-secondary-600">
                      📍 {lead.area}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded-full bg-secondary-100 px-2.5 py-1 text-[11px] font-bold text-primary-600">
                        {isVendor ? lead.category : lead.vehicle}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-secondary-700">
                      {isVendor ? lead.experience : `${lead.age} yrs`}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {isVendor ? (
                        <span className="rounded-full bg-secondary-100 px-2.5 py-1 text-[11px] font-bold text-mehndi-700">
                          {lead.commission}%
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-secondary-700">
                          {lead.experience}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`text-[11px] font-black ${
                            docCount === docTotal
                              ? "text-fresh-600"
                              : docCount > 0
                                ? "text-accent-600"
                                : "text-primary-700"
                          }`}
                        >
                          {docCount}/{docTotal}
                        </span>
                        <div className="flex gap-1">
                          {Object.values(lead.documents).map((ok, index) => (
                            <span
                              key={index}
                              className={`h-1.5 w-1.5 rounded-full ${
                                ok ? "bg-fresh-600" : "bg-secondary-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <LeadStageBadge stage={lead.stage} size="sm" />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-secondary-500">
                      {lead.appliedDate}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        onClick={() => onView(lead)}
                        className="inline-flex items-center gap-1 rounded-full border-2 border-secondary-900 bg-background-section px-3 py-1.5 text-[11px] font-black text-primary-600 transition-colors hover:bg-accent-400"
                      >
                        <Eye className="h-3.5 w-3.5" /> View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
