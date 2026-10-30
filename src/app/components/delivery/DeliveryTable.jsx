import { Eye, Star } from "lucide-react";
import { BrandBadge } from "../brand/BrandBadge";

const statusTone = (status) => {
  const value = String(status).toLowerCase();
  if (value === "available") return "fresh";
  if (value === "busy") return "accent";
  if (value === "inactive") return "primary";
  return "neutral";
};

export default function DeliveryTable({ partners, onView }) {
  return (
    <div className="overflow-hidden rounded-3xl border-2 border-secondary-900 bg-background-section shadow-[6px_6px_0px_var(--color-secondary-900)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse text-sm">
          <thead>
            <tr className="bg-secondary-900 text-left text-[10px] font-black uppercase tracking-[0.12em] text-accent-300">
              {[
                "Partner",
                "Contact",
                "Area",
                "Vehicle",
                "Status",
                "Rating",
                "Total Deliveries",
                "Active Orders",
                "Revenue",
                "Action",
              ].map((heading) => (
                <th key={heading} className="whitespace-nowrap px-4 py-3">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-100">
            {partners.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-14 text-center">
                  <span className="text-4xl">🚴</span>
                  <p className="mt-2 text-sm font-semibold text-secondary-500">
                    No delivery partners found
                  </p>
                </td>
              </tr>
            ) : (
              partners.map((partner) => {
                const stats = partner.stats ?? {
                  delivered: partner.totalDeliveries ?? 0,
                  pending: 0,
                  revenue: 0,
                };
                return (
                  <tr key={partner.id} className="transition-colors hover:bg-secondary-50">
                    <td className="whitespace-nowrap px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-secondary-900 bg-secondary-900 text-xs font-black text-accent-300">
                          <span className="absolute inset-0 grid place-items-center">
                            {partner.avatar}
                          </span>
                          {partner.image ? (
                            <img
                              src={partner.image}
                              alt=""
                              className="relative h-full w-full object-cover"
                              onError={(event) => {
                                event.currentTarget.style.display = "none";
                              }}
                            />
                          ) : null}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-secondary-900">{partner.name}</p>
                          <p className="text-[10px] font-semibold text-secondary-400">{partner.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <p className="text-xs font-bold text-secondary-800">📞 {partner.phone}</p>
                      <p className="text-[10px] font-semibold text-secondary-400">{partner.area}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="rounded-full bg-secondary-100 px-2.5 py-1 text-[11px] font-bold text-secondary-700">
                        📍 {partner.area}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <p className="text-xs font-bold text-secondary-800">{partner.vehicle}</p>
                      {partner.vehicleNo !== "N/A" && (
                        <p className="text-[10px] font-semibold text-secondary-400">{partner.vehicleNo}</p>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <BrandBadge tone={statusTone(partner.status)}>
                        {partner.status}
                      </BrandBadge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-secondary-900">
                        <Star className="h-3 w-3 fill-accent-400 text-accent-400" />
                        {partner.rating}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="font-display text-sm font-black text-secondary-900">
                        {partner.totalDeliveries}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`rounded-full border-2 px-2.5 py-1 text-[11px] font-black ${
                          stats.pending > 0
                            ? "border-accent-300 bg-accent-100 text-accent-700"
                            : "border-secondary-200 bg-secondary-100 text-secondary-600"
                        }`}
                      >
                        {stats.pending}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-display text-sm font-black text-fresh-600">
                      ₹{stats.revenue.toLocaleString("en-IN")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        onClick={() => onView(partner)}
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
