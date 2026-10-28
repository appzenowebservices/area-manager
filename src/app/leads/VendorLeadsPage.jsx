"use client";

import { useMemo, useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import { PageHeader } from "../components/brand/PageHeader";
import { BrandCard } from "../components/brand/BrandCard";
import LeadsTable from "../components/leads/LeadsTable";
import LeadCard from "../components/leads/LeadCard";
import LeadDrawer from "../components/leads/LeadDrawer";
import LeadStageBadge from "../components/leads/LeadStageBadge";
import { LEAD_STAGES, VENDOR_LEADS } from "../data/leadsData";
import { VENDORS } from "../data/vendorsData";

export default function VendorLeadsPage() {
  const [leads, setLeads] = useState(VENDOR_LEADS);
  const [selected, setSelected] = useState(null);
  const [stage, setStage] = useState("All");
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("All");

  const areas = useMemo(
    () => ["All", ...new Set(leads.map((lead) => lead.area))],
    [leads],
  );

  const filtered = useMemo(
    () =>
      leads.filter((lead) => {
        const query = search.toLowerCase();
        const matchSearch =
          !search ||
          lead.name.toLowerCase().includes(query) ||
          lead.phone.includes(query) ||
          lead.ownerName?.toLowerCase().includes(query);
        const matchStage = stage === "All" || lead.stage === stage;
        const matchArea = area === "All" || lead.area === area;
        return matchSearch && matchStage && matchArea;
      }),
    [leads, search, stage, area],
  );

  const handleUpdate = (updated) => {
    setLeads((prev) => prev.map((lead) => (lead.id === updated.id ? updated : lead)));
    setSelected(updated);
  };

  const handleApprove = (lead) => {
    const newVendor = {
      id: `V-${String(VENDORS.length + 1).padStart(3, "0")}`,
      name: lead.name,
      ownerName: lead.ownerName,
      phone: lead.phone,
      altPhone: lead.altPhone || "",
      email: lead.email || "",
      area: lead.area,
      address: lead.address,
      category: lead.category,
      status: "Active",
      rating: 0,
      totalOrders: 0,
      ordersThisWeek: 0,
      commission: lead.commission,
      joinDate: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      kyc: "Pending",
      documents: lead.documents,
      revenue: "₹0",
      avgDeliveryTime: "—",
      notes: `Onboarded via lead ${lead.id}`,
    };
    VENDORS.unshift(newVendor);
  };

  const counts = useMemo(() => {
    const result = {};
    LEAD_STAGES.forEach((value) => {
      result[value] =
        value === "All"
          ? leads.length
          : leads.filter((lead) => lead.stage === value).length;
    });
    return result;
  }, [leads]);

  return (
    <PageWrapper>
      <PageHeader
        kicker="Growth Pipeline"
        title="Vendor Leads"
        subtitle={`${leads.length} vendor applications from the public registration form`}
        actions={
          <a
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-secondary-950 bg-accent-400 px-4 py-2.5 text-xs font-display font-black text-secondary-900 transition-colors hover:bg-accent-300"
            href="/register/vendor"
            target="_blank"
            rel="noopener noreferrer"
          >
            🔗 Public Form ↗
          </a>
        }
      />

      <div className="flex flex-wrap gap-2.5">
        {LEAD_STAGES.filter((value) => value !== "All").map((value) => {
          const active = stage === value;
          return (
            <button
              key={value}
              onClick={() => setStage(active ? "All" : value)}
              className={`flex min-w-20 flex-1 flex-col items-center gap-1.5 rounded-2xl border-2 px-3 py-2.5 transition-all ${
                active
                  ? "border-secondary-900 bg-accent-50 shadow-[3px_3px_0px_var(--color-secondary-900)]"
                  : "border-secondary-200 bg-background-section hover:border-secondary-400"
              }`}
            >
              <span className="font-display text-2xl font-black text-secondary-900">
                {counts[value]}
              </span>
              <LeadStageBadge stage={value} size="sm" />
            </button>
          );
        })}
      </div>

      <BrandCard className="p-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-52 flex-1">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400">
              🔍
            </span>
            <input
              className="h-11 w-full rounded-2xl border-2 border-secondary-200 bg-secondary-50 pl-10 pr-9 text-sm font-semibold text-secondary-900 outline-none focus:border-primary-600 focus:bg-background-section"
              placeholder="Search name, phone…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            className="h-11 rounded-2xl border-2 border-secondary-200 bg-secondary-50 px-3 text-sm font-bold text-secondary-800 outline-none focus:border-primary-600"
            value={stage}
            onChange={(event) => setStage(event.target.value)}
          >
            {LEAD_STAGES.map((value) => (
              <option key={value} value={value}>
                {value === "All" ? "All Stages" : value}
                {value !== "All" ? ` (${counts[value]})` : ""}
              </option>
            ))}
          </select>

          <select
            className="h-11 rounded-2xl border-2 border-secondary-200 bg-secondary-50 px-3 text-sm font-bold text-secondary-800 outline-none focus:border-primary-600"
            value={area}
            onChange={(event) => setArea(event.target.value)}
          >
            {areas.map((value) => (
              <option key={value} value={value}>
                {value === "All" ? "All Areas" : value}
              </option>
            ))}
          </select>

          <span className="text-xs font-bold text-secondary-600">
            Showing <strong className="text-primary-600">{filtered.length}</strong> lead
            {filtered.length !== 1 ? "s" : ""}
          </span>

          {(search || stage !== "All" || area !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setStage("All");
                setArea("All");
              }}
              className="text-xs font-black text-primary-600 hover:underline"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </BrandCard>

      <div className="hidden md:block">
        <LeadsTable leads={filtered} onView={setSelected} type="vendor" />
      </div>

      <div className="md:hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-secondary-300 px-4 py-14 text-secondary-500">
            <span className="text-4xl">📋</span>
            <p className="text-sm font-semibold">No leads found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onView={setSelected} />
            ))}
          </div>
        )}
      </div>

      <LeadDrawer
        lead={selected}
        onClose={() => setSelected(null)}
        onUpdate={handleUpdate}
        onApprove={handleApprove}
      />
    </PageWrapper>
  );
}


