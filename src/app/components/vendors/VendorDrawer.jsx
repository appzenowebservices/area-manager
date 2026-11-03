"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  FileText,
  IndianRupee,
  LayoutDashboard,
  Mail,
  MapPin,
  Package,
  Phone,
  ShoppingBag,
  Star,
  Store,
  User,
  X,
} from "lucide-react";
import { BrandBadge } from "../brand/BrandBadge";
import { api } from "~/trpc/react";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "business", label: "Business", icon: Store },
  { id: "store", label: "Store", icon: Store },
  { id: "documents", label: "Documents", icon: FileText },
];

const statusTone = (status) => {
  if (status === "Active") return "fresh";
  if (status === "Inactive") return "primary";
  if (status === "Pending KYC") return "accent";
  return "neutral";
};

const formatMoney = (value) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN")}`;

const docLabel = (value) =>
  String(value ?? "document")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-secondary-100 py-2 text-xs last:border-0">
      <span className="shrink-0 pt-0.5 text-[9px] font-black uppercase tracking-wider text-secondary-500">
        {label}
      </span>
      <span className="min-w-0 break-words text-right font-semibold text-secondary-800">
        {children || "—"}
      </span>
    </div>
  );
}

function Stat({ label, value, icon: Icon, tone = "text-primary-600" }) {
  return (
    <div className="rounded-2xl border-2 border-secondary-900 bg-background-section px-3.5 py-3 shadow-[4px_4px_0px_var(--color-secondary-900)]">
      <div className="flex items-center justify-between gap-2">
        <p className={`font-display text-xl font-black leading-none ${tone}`}>
          {value}
        </p>
        <Icon className={`h-4 w-4 ${tone}`} />
      </div>
      <p className="mt-1 text-[9px] font-black uppercase tracking-[0.14em] text-secondary-600">
        {label}
      </p>
    </div>
  );
}

export default function VendorDrawer({ vendor: initialVendor, onClose }) {
  const [vendor, setVendor] = useState(null);
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (initialVendor) {
      setVendor(initialVendor);
      setActiveTab("overview");
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      const timer = setTimeout(() => setVendor(null), 250);
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [initialVendor]);

  const { data, isLoading } = api.areaManagerData.vendors.byId.useQuery(
    { id: initialVendor?.id ?? "" },
    { enabled: Boolean(initialVendor?.id) },
  );

  if (!vendor) return null;

  const detail = data?.vendor ?? vendor;
  const orders = data?.orders ?? [];
  const documents = data?.documents ?? [];
  const store = data?.store ?? null;
  const kycFields = Object.entries(vendor.documents ?? {});

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const tabContent = {
    overview: (
      <div className="space-y-4">
        <section className="rounded-2xl border border-secondary-200 bg-background-section p-4">
          <h3 className="mb-2 border-b border-secondary-100 pb-2 font-display text-[11px] font-black uppercase tracking-widest text-secondary-900">
            Owner details
          </h3>
          <Row label="Name">{detail.ownerName}</Row>
          <Row label="Phone">{detail.phone ? `📞 ${detail.phone}` : "—"}</Row>
          <Row label="Email">{detail.email || "—"}</Row>
          <Row label="Area">📍 {detail.area}</Row>
          <Row label="Address">{detail.address}</Row>
        </section>
        <section className="rounded-2xl border border-secondary-200 bg-background-section p-4">
          <h3 className="mb-2 border-b border-secondary-100 pb-2 font-display text-[11px] font-black uppercase tracking-widest text-secondary-900">
            Account
          </h3>
          <Row label="Category">{detail.category}</Row>
          <Row label="Commission">{detail.commission}%</Row>
          <Row label="KYC">{detail.kyc}</Row>
          <Row label="Joined">{detail.joinDate}</Row>
          <Row label="Rating">
            {detail.rating > 0 ? (
              <span className="inline-flex items-center gap-1">
                <Star className="h-3 w-3 fill-accent-400 text-accent-400" />
                {detail.rating.toFixed(1)}
              </span>
            ) : (
              "—"
            )}
          </Row>
        </section>
      </div>
    ),
    orders: (
      <div className="overflow-hidden rounded-2xl border-2 border-secondary-900">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="bg-secondary-900 text-left text-[9px] font-black uppercase tracking-[0.12em] text-accent-300">
              {["Order", "Customer", "Amount", "Status", "Date"].map((heading) => (
                <th key={heading} className="px-3 py-2.5">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-xs text-secondary-500">
                  No orders recorded for this vendor.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-secondary-50">
                  <td className="whitespace-nowrap px-3 py-2.5 text-[11px] font-black text-primary-600">
                    {order.id}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-xs font-bold text-secondary-800">
                    {order.customer.name}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 font-display text-xs font-black text-secondary-900">
                    {formatMoney(order.finalAmount)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5">
                    <BrandBadge tone={order.status === "Cancelled" ? "primary" : order.status === "Delivered" ? "fresh" : "accent"}>
                      {order.status}
                    </BrandBadge>
                  </td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-[10px] font-semibold text-secondary-500">
                    {order.date}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    ),
    business: (
      <section className="rounded-2xl border border-secondary-200 bg-background-section p-4">
        <h3 className="mb-2 border-b border-secondary-100 pb-2 font-display text-[11px] font-black uppercase tracking-widest text-secondary-900">
          Business details
        </h3>
        <Row label="Business category">{detail.category}</Row>
        <Row label="Commission">{detail.commission}%</Row>
        <Row label="This week">{detail.ordersThisWeek} orders</Row>
        <Row label="Total orders">{detail.totalOrders}</Row>
        <Row label="Revenue">{detail.revenue}</Row>
        <Row label="KYC status">{detail.kyc}</Row>
        <Row label="Store">{store?.name || "—"}</Row>
      </section>
    ),
    store: (
      <section className="rounded-2xl border border-secondary-200 bg-background-section p-4">
        <h3 className="mb-2 border-b border-secondary-100 pb-2 font-display text-[11px] font-black uppercase tracking-widest text-secondary-900">
          Store
        </h3>
        {store ? (
          <>
            <Row label="Name">{store.name}</Row>
            <Row label="Mobile">{store.mobile}</Row>
            <Row label="Address">
              {[
                store.address?.street,
                store.address?.locality,
                store.address?.city,
                store.address?.pincode,
              ]
                .filter(Boolean)
                .join(", ")}
            </Row>
            <Row label="Rating">
              {store.ratings?.average
                ? `${store.ratings.average} / 5 (${store.ratings.total_reviews ?? 0})`
                : "—"}
            </Row>
            <Row label="Hours">
              {store.operatingHours
                ? `${store.operatingHours.open} – ${store.operatingHours.close}`
                : "—"}
            </Row>
            <Row label="Open">
              {store.status?.isOpen === true ? "Open" : "Closed"}
            </Row>
          </>
        ) : (
          <p className="text-xs text-secondary-500">No store record linked.</p>
        )}
      </section>
    ),
    documents: (
      <section className="rounded-2xl border border-secondary-200 bg-background-section p-4">
        <h3 className="mb-3 border-b border-secondary-100 pb-2 font-display text-[11px] font-black uppercase tracking-widest text-secondary-900">
          Documents
        </h3>
        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((document) => (
              <a
                key={document.id}
                href={document.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 rounded-xl border-2 border-secondary-200 bg-secondary-50 px-3 py-2.5 transition-colors hover:border-secondary-900"
              >
                <span className="flex items-center gap-2 text-xs font-bold text-secondary-900">
                  <FileText className="h-4 w-4 text-primary-600" />
                  {docLabel(document.type)}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest">
                  {document.verified ? (
                    <span className="text-fresh-600">
                      <CheckCircle2 className="inline h-3.5 w-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="text-accent-600">
                      <Clock className="inline h-3.5 w-3.5" /> Pending
                    </span>
                  )}
                </span>
              </a>
            ))}
          </div>
        ) : kycFields.length ? (
          <div className="grid grid-cols-2 gap-2">
            {kycFields.map(([key, ok]) => (
              <div
                key={key}
                className={`rounded-xl border-2 px-3 py-2 text-xs font-bold ${
                  ok
                    ? "border-fresh-200 bg-fresh-50 text-fresh-700"
                    : "border-primary-200 bg-primary-50 text-primary-700"
                }`}
              >
                {ok ? "✓" : "✗"} {docLabel(key)}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-secondary-500">No documents uploaded.</p>
        )}
      </section>
    ),
  };

  return (
    <div
      className={`fixed inset-0 z-[2000] bg-secondary-950/45 backdrop-blur-[2px] transition-opacity ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Vendor details ${detail.name}`}
        onClick={(event) => event.stopPropagation()}
        className={`ml-auto flex h-full w-full max-w-[980px] flex-col overflow-hidden border-l-2 border-secondary-900 bg-background shadow-2xl transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <header className="flex shrink-0 items-start justify-between gap-4 border-b-2 border-secondary-900 bg-background-section px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border-2 border-secondary-900 bg-primary-600 font-display text-lg font-black text-white">
              {detail.name?.charAt(0)?.toUpperCase() || "V"}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate font-display text-lg font-black text-secondary-900">
                  {detail.name}
                </h2>
                <BrandBadge tone={statusTone(detail.status)}>{detail.status}</BrandBadge>
                <BrandBadge tone={detail.kyc === "Verified" ? "fresh" : "accent"}>
                  <BadgeCheck className="h-3 w-3" /> {detail.kyc}
                </BrandBadge>
              </div>
              <p className="mt-0.5 truncate text-[11px] font-semibold text-secondary-500">
                {detail.id} · {detail.category} · Joined {detail.joinDate}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close vendor details"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 border-secondary-200 bg-background text-secondary-500 transition-colors hover:border-primary-300 hover:text-primary-600"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* Stats */}
        <div className="grid shrink-0 grid-cols-2 gap-2.5 border-b-2 border-secondary-100 bg-background p-4 sm:grid-cols-4">
          <Stat label="Total orders" value={detail.totalOrders} icon={ShoppingBag} />
          <Stat label="Revenue" value={detail.revenue} icon={IndianRupee} tone="text-fresh-600" />
          <Stat
            label="Rating"
            value={detail.rating > 0 ? detail.rating.toFixed(1) : "—"}
            icon={Star}
            tone="text-accent-600"
          />
          <Stat label="Commission" value={`${detail.commission}%`} icon={Package} tone="text-mehndi-700" />
        </div>

        {/* Tab shell */}
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <nav className="flex shrink-0 gap-2 overflow-x-auto border-b-2 border-secondary-100 bg-secondary-50 p-3 lg:w-56 lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r-2 lg:p-4">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl border-2 px-3 py-2.5 text-xs font-black transition-all lg:w-full ${
                    active
                      ? "border-secondary-900 bg-primary-600 text-white shadow-[3px_3px_0px_var(--color-accent-400)]"
                      : "border-transparent bg-background-section text-secondary-600 hover:border-secondary-300"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {tab.label}
                  {tab.id === "orders" && (
                    <span
                      className={`ml-auto rounded-full px-1.5 py-0.5 text-[9px] ${
                        active ? "bg-white/20 text-white" : "bg-secondary-100 text-secondary-600"
                      }`}
                    >
                      {orders.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5">
            {isLoading ? (
              <div className="grid min-h-[240px] place-items-center rounded-2xl border-2 border-dashed border-secondary-200 text-xs font-semibold text-secondary-500">
                Loading vendor details…
              </div>
            ) : (
              tabContent[activeTab]
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
