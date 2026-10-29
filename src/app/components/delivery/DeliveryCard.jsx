import { Eye, Star } from "lucide-react";
import { BrandBadge } from "../brand/BrandBadge";

const statusTone = (status) => {
  const value = String(status).toLowerCase();
  if (value === "available") return "fresh";
  if (value === "busy") return "accent";
  if (value === "inactive") return "primary";
  return "neutral";
};

export default function DeliveryCard({ partner, onView }) {
  const stats = partner.stats ?? {
    delivered: partner.totalDeliveries ?? 0,
    pending: 0,
    revenue: 0,
  };

  return (
    <div className="rounded-3xl border-2 border-secondary-900 bg-background-section p-4 shadow-[5px_5px_0px_var(--color-secondary-900)]">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-secondary-900 bg-secondary-900 text-xs font-black text-accent-300">
            {partner.avatar}
          </div>
          <div>
            <p className="text-sm font-bold text-secondary-900">{partner.name}</p>
            <p className="text-[10px] font-semibold text-secondary-400">
              {partner.id} · {partner.area}
            </p>
          </div>
        </div>
        <BrandBadge tone={statusTone(partner.status)}>{partner.status}</BrandBadge>
      </div>

      <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-semibold text-secondary-500">
        <span>📞 {partner.phone}</span>
        <span>🚗 {partner.vehicle}</span>
        <span className="inline-flex items-center gap-1">
          <Star className="h-3 w-3 fill-accent-400 text-accent-400" /> {partner.rating}
        </span>
      </div>

      <div className="my-3 h-px bg-secondary-100" />

      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Total", value: partner.totalDeliveries, cls: "text-secondary-900" },
          { label: "Active", value: stats.pending, cls: "text-primary-600" },
          { label: "Delivered", value: stats.delivered, cls: "text-fresh-600" },
          { label: "Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, cls: "text-fresh-600" },
        ].map((item) => (
          <div key={item.label}>
            <p className={`font-display text-sm font-black ${item.cls}`}>{item.value}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-secondary-400">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => onView(partner)}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-secondary-900 bg-secondary-50 px-4 py-2.5 text-xs font-black text-primary-600 transition-colors hover:bg-accent-400"
      >
        <Eye className="h-4 w-4" /> View Full Profile →
      </button>
    </div>
  );
}
