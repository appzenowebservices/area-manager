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

export default function VendorsTable({ vendors, onView }) {
  return (
    <div className="overflow-hidden rounded-3xl border-2 border-secondary-900 bg-background-section shadow-[6px_6px_0px_var(--color-secondary-900)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-sm">
          <thead>
            <tr className="bg-secondary-900 text-left text-[10px] font-black uppercase tracking-[0.12em] text-accent-300">
              {[
                "Vendor",
                "Owner",
                "Area",
                "Category",
                "Orders",
                "Rating",
                "Commission",
                "KYC",
                "Status",
                "Action",
              ].map((heading) => (
                <th key={heading} className="whitespace-nowrap px-4 py-3">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-100">
            {vendors.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-14 text-center">
                  <span className="text-4xl">🏪</span>
                  <p className="mt-2 text-sm font-semibold text-secondary-500">
                    No vendors found for selected filters
                  </p>
                </td>
              </tr>
            ) : (
              vendors.map((vendor) => (
                <tr key={vendor.id} className="transition-colors hover:bg-secondary-50">
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-secondary-900 text-sm font-black text-white"
                        style={{ background: avatarBg(vendor.category) }}
                      >
                        {vendor.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-secondary-900">{vendor.name}</p>
                        <p className="text-[10px] font-semibold text-secondary-400">{vendor.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <p className="text-sm font-semibold text-secondary-800">{vendor.ownerName}</p>
                    <p className="text-[11px] font-semibold text-secondary-400">📞 {vendor.phone}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-secondary-600">
                    📍 {vendor.area}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="rounded-full bg-secondary-100 px-2.5 py-1 text-[11px] font-bold text-primary-600">
                      {vendor.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <p className="font-display text-sm font-black text-secondary-900">
                      {vendor.totalOrders}
                    </p>
                    <p className="text-[10px] font-semibold text-fresh-600">
                      +{vendor.ordersThisWeek} this week
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {vendor.rating > 0 ? (
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-secondary-900">
                        <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
                        {vendor.rating.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-sm font-semibold text-secondary-400">—</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span className="rounded-full bg-secondary-100 px-2.5 py-1 text-[11px] font-bold text-mehndi-700">
                      {vendor.commission}%
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <BrandBadge tone={vendor.kyc === "Verified" ? "fresh" : "accent"}>
                      {vendor.kyc === "Verified" ? "✓ Verified" : "⏳ Pending"}
                    </BrandBadge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <BrandBadge tone={statusTone(vendor.status)}>
                      {vendor.status}
                    </BrandBadge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <button
                      onClick={() => onView(vendor)}
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
