import { Eye, Star } from "lucide-react";
import { BrandBadge, statusTone } from "../brand/BrandBadge";

function avatarBg(category) {
  const map = {
    Grocery: "linear-gradient(135deg,#ae2012,#2d241e)",
    Dairy: "linear-gradient(135deg,#2196f3,#2196f3)",
    Bakery: "linear-gradient(135deg,#e9c46a,#a67a22)",
    "Meat & Fish": "linear-gradient(135deg,#d32f2f,#8b150e)",
    "Fruits & Vegetables": "linear-gradient(135deg,#0c831f,#0a671a)",
    Pharmacy: "linear-gradient(135deg,#4a5d23,#4a5d23)",
    "General Store": "linear-gradient(135deg,#7d6b5d,#4a3f35)",
  };
  return map[category] || "linear-gradient(135deg,#a68b66,#7d6b5d)";
}

export default function VendorCard({ vendor, onView }) {
  return (
    <div className="rounded-3xl border-2 border-secondary-900 bg-background-section p-4 shadow-[5px_5px_0px_var(--color-secondary-900)]">
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-secondary-900 text-sm font-black text-white"
          style={{ background: avatarBg(vendor.category) }}
        >
          {vendor.name.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-secondary-900">{vendor.name}</p>
          <p className="truncate text-[11px] font-semibold text-secondary-500">
            👤 {vendor.ownerName} · {vendor.id}
          </p>
        </div>
        <BrandBadge tone={statusTone(vendor.status)}>{vendor.status}</BrandBadge>
      </div>

      <div className="mt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-secondary-600">
        <span>📞 {vendor.phone}</span>
        <span>📍 {vendor.area}</span>
        <span className="rounded-full bg-secondary-100 px-2 py-0.5 text-primary-600">
          {vendor.category}
        </span>
      </div>

      <div className="my-3 h-px bg-secondary-100" />

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Orders", value: vendor.totalOrders, cls: "text-secondary-900" },
          {
            label: "Rating",
            value: vendor.rating > 0 ? vendor.rating.toFixed(1) : "—",
            cls: "text-accent-600",
            star: vendor.rating > 0,
          },
          { label: "Commission", value: `${vendor.commission}%`, cls: "text-mehndi-700" },
          { label: "Revenue", value: vendor.revenue, cls: "text-secondary-900" },
          {
            label: "KYC",
            value: vendor.kyc === "Verified" ? "✓ Verified" : "⏳ Pending",
            cls: vendor.kyc === "Verified" ? "text-fresh-600" : "text-accent-600",
          },
          { label: "This Week", value: `+${vendor.ordersThisWeek}`, cls: "text-fresh-600" },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-[9px] font-black uppercase tracking-widest text-secondary-400">
              {item.label}
            </p>
            <p className={`inline-flex items-center gap-1 text-xs font-bold ${item.cls}`}>
              {item.star && <Star className="h-3 w-3 fill-accent-400 text-accent-400" />}
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={() => onView(vendor)}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-secondary-900 bg-secondary-50 px-4 py-2.5 text-xs font-black text-primary-600 transition-colors hover:bg-accent-400"
      >
        <Eye className="h-4 w-4" /> View Full Details →
      </button>
    </div>
  );
}
