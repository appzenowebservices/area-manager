"use client";

import dynamic from "next/dynamic";
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
  X,
} from "lucide-react";
import { BrandBadge } from "../brand/BrandBadge";
import { api } from "~/trpc/react";

const VendorLocationMap = dynamic(() => import("./VendorLocationMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[200px] place-items-center rounded-2xl border-2 border-dashed border-secondary-200 text-xs font-semibold text-secondary-500">
      Loading store location…
    </div>
  ),
});

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "business", label: "Business", icon: Store },
  { id: "store", label: "Store", icon: Store },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "documents", label: "Documents", icon: FileText },
];

const statusTone = (status) => {
  if (status === "Active") return "fresh";
  if (status === "Inactive") return "primary";
  if (status === "Pending KYC") return "accent";
  return "neutral";
};

const formatMoney = (value) => `₹${Number(value ?? 0).toLocaleString("en-IN")}`;

const docLabel = (value) =>
  String(value ?? "document")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

function BentoCard({ title, action, className = "", children }) {
  return (
    <section
      className={`rounded-3xl border-2 border-secondary-900 bg-background-section p-4 shadow-[4px_4px_0px_var(--color-secondary-900)] sm:p-5 ${className}`}
    >
      {title && (
        <div className="mb-3 flex items-center justify-between gap-2 border-b border-secondary-100 pb-2">
          <h3 className="font-display text-[10px] font-black uppercase tracking-[0.15em] text-secondary-900">
            {title}
          </h3>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function Field({ label, children, full = false }) {
  return (
    <div
      className={`rounded-xl border border-secondary-100 bg-secondary-50/70 px-3 py-2 ${
        full ? "sm:col-span-2" : ""
      }`}
    >
      <p className="text-[9px] font-black uppercase tracking-widest text-secondary-500">
        {label}
      </p>
      <p className="mt-0.5 break-words text-xs font-bold text-secondary-900">
        {children || "—"}
      </p>
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

function InventoryCard({ item }) {
  const image = Array.isArray(item.images) ? item.images[0] : null;
  const price =
    item.discountPrice && item.discountPrice > 0 ? item.discountPrice : item.price;
  const stock = item.stock ?? 0;
  const lowStock = stock <= 5;

  return (
    <div className="flex h-full flex-col rounded-3xl border-2 border-secondary-900 bg-background-section p-3 shadow-[4px_4px_0px_var(--color-secondary-900)]">
      <div className="relative mb-3 h-28 overflow-hidden rounded-2xl border border-secondary-200 bg-secondary-100">
        {image ? (
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center">
            <Package className="h-7 w-7 text-secondary-300" />
          </div>
        )}
        <span className="absolute right-2 top-2">
          <BrandBadge tone="fresh">Managed</BrandBadge>
        </span>
      </div>
      <p className="truncate text-xs font-black text-secondary-900" title={item.name}>
        {item.name}
      </p>
      <p className="mt-0.5 truncate text-[10px] font-semibold text-secondary-500">
        {item.categoryName ?? "Uncategorized"}
      </p>
      <div className="mt-auto flex items-end justify-between gap-2 pt-3">
        <p className="font-display text-base font-black text-fresh-700">
          {formatMoney(price)}
        </p>
        <span
          className={`rounded-full border-2 px-2 py-0.5 text-[9px] font-black ${
            lowStock
              ? "border-accent-300 bg-accent-100 text-accent-700"
              : "border-secondary-200 bg-secondary-100 text-secondary-600"
          }`}
        >
          Stock {stock}
        </span>
      </div>
      {item.approvalStatus && item.approvalStatus !== "approved" ? (
        <BadgeCheck className="mt-2 h-3.5 w-3.5 text-accent-600" />
      ) : null}
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
  const inventory = data?.inventory ?? [];
  const store = data?.store ?? null;
  const kycFields = Object.entries(vendor.documents ?? {});
  const hasLocation = detail.lat != null && detail.lng != null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  const tabContent = {
    overview: (
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-6">
        <BentoCard title="Owner details" className="xl:col-span-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Field label="Name">{detail.ownerName}</Field>
            <Field label="Phone">
              {detail.phone ? (
                <span className="inline-flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {detail.phone}
                </span>
              ) : (
                "—"
              )}
            </Field>
            <Field label="Email">
              {detail.email ? (
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3 w-3" /> {detail.email}
                </span>
              ) : (
                "—"
              )}
            </Field>
            <Field label="Area">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {detail.area}
              </span>
            </Field>
            <Field label="Address" full>
              {detail.address}
            </Field>
          </div>

          <div className="mt-3">
            {hasLocation ? (
              <>
                <VendorLocationMap
                  lat={Number(detail.lat)}
                  lng={Number(detail.lng)}
                  label={detail.name}
                />
                <a
                  href={`https://www.openstreetmap.org/?mlat=${detail.lat}&mlon=${detail.lng}#map=17/${detail.lat}/${detail.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-primary-600 hover:underline"
                >
                  <MapPin className="h-3 w-3" /> Open store location in maps ↗
                </a>
              </>
            ) : (
              <p className="rounded-2xl border-2 border-dashed border-secondary-200 px-3 py-5 text-center text-[11px] font-semibold text-secondary-500">
                No map coordinates saved for this store.
              </p>
            )}
          </div>
        </BentoCard>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:col-span-2 xl:grid-cols-1">
          <BentoCard title="Account snapshot">
            <div className="space-y-2">
              <Field label="Category">{detail.category}</Field>
              <Field label="Commission">{detail.commission}%</Field>
              <Field label="KYC">
                <BrandBadge tone={detail.kyc === "Verified" ? "fresh" : "accent"}>
                  <BadgeCheck className="h-3 w-3" /> {detail.kyc}
                </BrandBadge>
              </Field>
              <Field label="Joined">{detail.joinDate}</Field>
              <Field label="Rating">
                {detail.rating > 0 ? (
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3 w-3 fill-accent-400 text-accent-400" />
                    {detail.rating.toFixed(1)}
                  </span>
                ) : (
                  "—"
                )}
              </Field>
            </div>
          </BentoCard>

          <BentoCard title="Performance">
            <div className="grid grid-cols-2 gap-2">
              <Field label="Orders">{detail.totalOrders}</Field>
              <Field label="This week">{detail.ordersThisWeek}</Field>
              <Field label="Revenue" full>
                {detail.revenue}
              </Field>
            </div>
          </BentoCard>

          <BentoCard title="Documents">
            {documents.length ? (
              <p className="text-xs font-bold text-secondary-700">
                {documents.length} uploaded ·{" "}
                {documents.filter((document) => document.verified).length} verified
              </p>
            ) : kycFields.length ? (
              <div className="flex flex-wrap gap-1.5">
                {kycFields.map(([key, ok]) => (
                  <span
                    key={key}
                    className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${
                      ok
                        ? "border-fresh-200 bg-fresh-50 text-fresh-700"
                        : "border-primary-200 bg-primary-50 text-primary-700"
                    }`}
                  >
                    {ok ? "✓" : "✗"} {docLabel(key)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-secondary-500">No documents uploaded.</p>
            )}
          </BentoCard>
        </div>
      </div>
    ),

    orders: (
      <BentoCard className="p-0 overflow-hidden" title="Order history">
        <div className="overflow-x-auto">
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
                      <BrandBadge
                        tone={
                          order.status === "Cancelled"
                            ? "primary"
                            : order.status === "Delivered"
                              ? "fresh"
                              : "accent"
                        }
                      >
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
      </BentoCard>
    ),

    business: (
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-6">
        <BentoCard title="Business details" className="xl:col-span-3">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Field label="Category">{detail.category}</Field>
            <Field label="Commission">{detail.commission}%</Field>
            <Field label="This week">{detail.ordersThisWeek} orders</Field>
            <Field label="Total orders">{detail.totalOrders}</Field>
            <Field label="Revenue" full>
              {detail.revenue}
            </Field>
            <Field label="KYC status" full>
              {detail.kyc}
            </Field>
          </div>
        </BentoCard>
        <BentoCard title="Order snapshot" className="xl:col-span-3">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Delivered">
              {orders.filter((order) => order.status === "Delivered").length}
            </Field>
            <Field label="Processing">
              {orders.filter((order) => order.status === "Processing").length}
            </Field>
            <Field label="Pending">
              {orders.filter((order) => order.status === "Pending").length}
            </Field>
            <Field label="Cancelled">
              {orders.filter((order) => order.status === "Cancelled").length}
            </Field>
          </div>
        </BentoCard>
      </div>
    ),

    store: (
      <div className="grid grid-cols-1 gap-3 xl:grid-cols-6">
        <BentoCard className="overflow-hidden p-0 xl:col-span-6">
          <div className="relative h-40 bg-secondary-100 sm:h-48">
            {store?.images?.topImg || store?.images?.middleImg || store?.images?.latImg ? (
              <img
                src={
                  store.images.topImg || store.images.middleImg || store.images.latImg
                }
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center">
                <Store className="h-12 w-12 text-secondary-300" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-secondary-950/85 to-transparent p-4">
              <div>
                <p className="font-display text-lg font-black text-white">
                  {store?.name || "Store"}
                </p>
                <p className="text-[11px] font-semibold text-secondary-200">
                  {store?.mobile || "—"}
                </p>
              </div>
              <BrandBadge tone={store?.status?.isOpen === true ? "fresh" : "primary"}>
                {store?.status?.isOpen === true ? "Open" : "Closed"}
              </BrandBadge>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-secondary-100 border-t-2 border-secondary-900">
            {[
              { label: "Profile", value: `${store?.profileCompletion ?? 0}%` },
              { label: "Inventory", value: store?.inventoryCount ?? inventory.length },
              { label: "Orders", value: store?.orderCount ?? orders.length },
            ].map((item) => (
              <div key={item.label} className="px-3 py-3 text-center">
                <p className="font-display text-lg font-black text-secondary-900">
                  {item.value}
                </p>
                <p className="text-[9px] font-black uppercase tracking-widest text-secondary-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </BentoCard>

        <BentoCard title="Location & hours" className="xl:col-span-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Field label="Address" full>
              {[
                store?.address?.street,
                store?.address?.locality,
                store?.address?.city,
                store?.address?.state,
                store?.address?.pincode,
              ]
                .filter(Boolean)
                .join(", ")}
            </Field>
            <Field label="Hours">
              {store?.operatingHours
                ? `${store.operatingHours.open} – ${store.operatingHours.close}`
                : "—"}
            </Field>
            <Field label="Rating">
              {store?.ratings?.average
                ? `${Number(store.ratings.average).toFixed(1)} / 5 (${
                    store.ratings.total_reviews ?? 0
                  })`
                : "—"}
            </Field>
            <Field label="KYC">{store?.kyc?.verified ? "Verified" : "Pending"}</Field>
          </div>
        </BentoCard>

        <BentoCard title="Modules" className="xl:col-span-2">
          {store?.modules?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {store.modules.map((module) => (
                <span
                  key={module.id}
                  className="inline-flex items-center gap-1 rounded-full border border-secondary-200 bg-secondary-50 px-2.5 py-1 text-[9px] font-bold text-secondary-700"
                >
                  <Package className="h-3 w-3 text-primary-600" />
                  {module.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-secondary-500">No modules assigned.</p>
          )}
        </BentoCard>
      </div>
    ),

    inventory: (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border-2 border-secondary-900 bg-background-section px-3.5 py-2.5 shadow-[3px_3px_0px_var(--color-secondary-900)]">
          <p className="text-[10px] font-black uppercase tracking-widest text-secondary-600">
            Vendor-managed inventory
          </p>
          <span className="rounded-full border border-secondary-200 bg-secondary-100 px-2.5 py-1 text-[10px] font-black text-secondary-700">
            {inventory.length} items
          </span>
        </div>

        {inventory.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {inventory.map((item) => (
              <InventoryCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <BentoCard>
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <Store className="h-9 w-9 text-secondary-300" />
              <p className="text-xs font-bold text-secondary-700">
                No items stocked by this vendor yet
              </p>
              <p className="text-[11px] text-secondary-500">
                Stock added from the vendor app will appear here.
              </p>
            </div>
          </BentoCard>
        )}
      </div>
    ),

    documents: (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {documents.length ? (
          documents.map((document) => (
            <BentoCard key={document.id} className="p-3">
              <a
                href={document.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3"
              >
                <span className="flex items-center gap-2 text-xs font-bold text-secondary-900">
                  <FileText className="h-4 w-4 text-primary-600" />
                  {docLabel(document.type)}
                </span>
                {document.verified ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-fresh-600">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-accent-600">
                    <Clock className="h-3.5 w-3.5" /> Pending
                  </span>
                )}
              </a>
            </BentoCard>
          ))
        ) : kycFields.length ? (
          kycFields.map(([key, ok]) => (
            <BentoCard key={key} className="p-3">
              <div
                className={`flex items-center justify-between text-xs font-bold ${
                  ok ? "text-fresh-700" : "text-primary-700"
                }`}
              >
                <span>{docLabel(key)}</span>
                <span>{ok ? "✓ Uploaded" : "✗ Missing"}</span>
              </div>
            </BentoCard>
          ))
        ) : (
          <BentoCard className="sm:col-span-2">
            <p className="py-8 text-center text-xs text-secondary-500">
              No documents uploaded.
            </p>
          </BentoCard>
        )}
      </div>
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
        className={`ml-auto flex h-full w-full max-w-[1040px] flex-col overflow-hidden border-l-2 border-secondary-900 bg-background shadow-2xl transition-transform duration-300 ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
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

        <div className="grid shrink-0 grid-cols-2 gap-2.5 border-b-2 border-secondary-100 bg-background p-4 sm:grid-cols-4">
          <Stat label="Total orders" value={detail.totalOrders} icon={ShoppingBag} />
          <Stat label="Revenue" value={detail.revenue} icon={IndianRupee} tone="text-fresh-600" />
          <Stat
            label="Rating"
            value={detail.rating > 0 ? detail.rating.toFixed(1) : "—"}
            icon={Star}
            tone="text-accent-600"
          />
          <Stat
            label="Commission"
            value={`${detail.commission}%`}
            icon={Package}
            tone="text-mehndi-700"
          />
        </div>

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
                  {tab.id === "inventory" && (
                    <span
                      className={`ml-auto rounded-full px-1.5 py-0.5 text-[9px] ${
                        active ? "bg-white/20 text-white" : "bg-secondary-100 text-secondary-600"
                      }`}
                    >
                      {inventory.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5">
            {isLoading ? (
              <div className="grid min-h-[240px] place-items-center rounded-3xl border-2 border-dashed border-secondary-200 text-xs font-semibold text-secondary-500">
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
