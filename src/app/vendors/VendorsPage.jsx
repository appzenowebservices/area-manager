"use client";

import { useEffect, useMemo, useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import { PageHeader } from "../components/brand/PageHeader";
import { BrandStatStrip } from "../components/brand/BrandStatStrip";
import VendorFilters from "../components/vendors/VendorFilters";
import VendorsTable from "../components/vendors/VendorsTable";
import VendorCard from "../components/vendors/VendorCard";
import VendorDrawer from "../components/vendors/VendorDrawer";
import AddVendorModal from "../components/vendors/AddVendorModal";
import { api } from "~/trpc/react";

export default function VendorsPage() {
  const { data: apiVendors, isLoading, error } = api.areaManagerData.vendors.list.useQuery();
  const setActive = api.areaManagerData.vendors.setActive.useMutation();
  const createVendor = api.areaManagerData.vendors.create.useMutation();
  const utils = api.useUtils();
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [area, setArea] = useState("All");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    if (apiVendors) setVendors(apiVendors);
  }, [apiVendors]);

  const filtered = useMemo(
    () =>
      vendors.filter((vendor) => {
        const query = search.toLowerCase();
        const matchSearch =
          !search ||
          vendor.name.toLowerCase().includes(query) ||
          vendor.ownerName.toLowerCase().includes(query) ||
          vendor.phone.includes(query) ||
          vendor.id.toLowerCase().includes(query);
        const matchStatus = status === "All" || vendor.status === status;
        const matchCategory = category === "All" || vendor.category === category;
        const matchArea = area === "All" || vendor.area === area;
        return matchSearch && matchStatus && matchCategory && matchArea;
      }),
    [search, status, category, area, vendors],
  );

  const handleReset = () => {
    setSearch("");
    setStatus("All");
    setCategory("All");
    setArea("All");
  };

  const handleUpdate = (updated) => {
    setVendors((prev) =>
      prev.map((vendor) => (vendor.id === updated.id ? updated : vendor)),
    );
    setSelected(updated);

    if (updated.status === "Active" || updated.status === "Inactive") {
      setActive.mutate(
        { id: updated.id, active: updated.status === "Active" },
        { onSuccess: () => utils.areaManagerData.vendors.list.invalidate() },
      );
    }
  };

  const handleAdd = (newVendor) => {
    createVendor.mutate(
      {
        name: newVendor.name,
        phone: newVendor.phone,
        email: newVendor.email || "",
        area: newVendor.area,
        address: newVendor.address || newVendor.area,
        category: newVendor.category,
      },
      {
        onSuccess: () => {
          setShowAdd(false);
          void utils.areaManagerData.vendors.list.invalidate();
        },
      },
    );
  };

  const total = vendors.length;
  const active = vendors.filter((vendor) => vendor.status === "Active").length;
  const inactive = vendors.filter((vendor) => vendor.status === "Inactive").length;
  const pendingKyc = vendors.filter((vendor) => vendor.status === "Pending KYC").length;
  const verified = vendors.filter((vendor) => vendor.kyc === "Verified").length;
  const totalRevenue = vendors
    .filter((vendor) => vendor.status === "Active")
    .reduce(
      (sum, vendor) => sum + (parseInt(vendor.revenue.replace(/[^0-9]/g, "")) || 0),
      0,
    );

  return (
    <PageWrapper>
      <PageHeader
        kicker="Vendor Network"
        title="Vendors"
        subtitle="Manage your area's vendor network, KYC and commissions"
        actions={
          <span className="rounded-2xl border-2 border-secondary-950 bg-accent-400 px-4 py-2 text-xs font-display font-black uppercase tracking-widest text-secondary-900">
            {total} vendors
          </span>
        }
      />

      <BrandStatStrip
        items={[
          { label: "Total Vendors", value: total, tone: "primary" },
          { label: "Active", value: active, tone: "fresh" },
          { label: "Inactive", value: inactive, tone: "danger" },
          { label: "Pending KYC", value: pendingKyc, tone: "accent" },
          { label: "KYC Verified", value: verified, tone: "fresh" },
          {
            label: "Est. Revenue",
            value: `₹${(totalRevenue / 1000).toFixed(0)}k`,
            tone: "mehndi",
          },
        ]}
      />

      <VendorFilters
        search={search}
        onSearch={setSearch}
        status={status}
        onStatus={setStatus}
        category={category}
        onCategory={setCategory}
        area={area}
        onArea={setArea}
        total={filtered.length}
        onReset={handleReset}
        onAdd={() => setShowAdd(true)}
      />

      <div className="hidden md:block">
        <VendorsTable vendors={filtered} onView={setSelected} />
      </div>

      <div className="md:hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-secondary-300 px-4 py-14 text-secondary-500">
            <span className="text-4xl">🏪</span>
            <p className="text-sm font-semibold">No vendors found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} onView={setSelected} />
            ))}
          </div>
        )}
      </div>

      <VendorDrawer
        vendor={selected}
        onClose={() => setSelected(null)}
        onUpdate={handleUpdate}
      />

      {showAdd && (
        <AddVendorModal onConfirm={handleAdd} onClose={() => setShowAdd(false)} />
      )}
    </PageWrapper>
  );
}



