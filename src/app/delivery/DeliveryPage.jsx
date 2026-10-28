"use client";

import { useMemo, useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import { PageHeader } from "../components/brand/PageHeader";
import { BrandStatStrip } from "../components/brand/BrandStatStrip";
import DeliveryFilters from "../components/delivery/DeliveryFilters";
import DeliveryTable from "../components/delivery/DeliveryTable";
import DeliveryCard from "../components/delivery/DeliveryCard";
import DeliveryDrawer from "../components/delivery/DeliveryDrawer";
import { DELIVERY_PARTNERS, getDeliveryStats } from "../data/deliveryData";

export default function DeliveryPage() {
  const [partners, setPartners] = useState(DELIVERY_PARTNERS);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [area, setArea] = useState("All");
  const [selected, setSelected] = useState(null);

  const areas = useMemo(
    () => [...new Set(partners.map((partner) => partner.area))].sort(),
    [partners],
  );

  const filtered = useMemo(
    () =>
      partners.filter((partner) => {
        const query = search.toLowerCase();
        const matchSearch =
          !search ||
          partner.name.toLowerCase().includes(query) ||
          partner.phone.includes(query) ||
          partner.area.toLowerCase().includes(query) ||
          partner.id.toLowerCase().includes(query);
        const matchStatus = status === "All" || partner.status === status;
        const matchArea = area === "All" || partner.area === area;
        return matchSearch && matchStatus && matchArea;
      }),
    [search, status, area, partners],
  );

  const handleReset = () => {
    setSearch("");
    setStatus("All");
    setArea("All");
  };

  const handleStatusChange = (updated) => {
    setPartners((prev) =>
      prev.map((partner) => (partner.id === updated.id ? updated : partner)),
    );
    setSelected(updated);
  };

  const totalDeliveries = partners.reduce(
    (sum, partner) => sum + getDeliveryStats(partner.id).delivered,
    0,
  );

  return (
    <PageWrapper>
      <PageHeader
        kicker="Fleet Ops"
        title="Delivery Partners"
        subtitle="Every rider operating in your area, their load and live status"
        actions={
          <span className="rounded-2xl border-2 border-secondary-950 bg-accent-400 px-4 py-2 text-xs font-display font-black uppercase tracking-widest text-secondary-900">
            {partners.length} partners
          </span>
        }
      />

      <BrandStatStrip
        items={[
          { label: "Total Partners", value: partners.length, tone: "primary" },
          {
            label: "Available",
            value: partners.filter((partner) => partner.status === "Available").length,
            tone: "fresh",
          },
          {
            label: "Busy",
            value: partners.filter((partner) => partner.status === "Busy").length,
            tone: "accent",
          },
          {
            label: "Inactive",
            value: partners.filter((partner) => partner.status === "Inactive").length,
            tone: "neutral",
          },
          { label: "Orders Delivered", value: totalDeliveries, tone: "mehndi" },
        ]}
      />

      <DeliveryFilters
        search={search}
        onSearch={setSearch}
        status={status}
        onStatus={setStatus}
        area={area}
        onArea={setArea}
        areas={areas}
        total={filtered.length}
        onReset={handleReset}
      />

      <div className="hidden md:block">
        <DeliveryTable partners={filtered} onView={setSelected} />
      </div>

      <div className="md:hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-secondary-300 px-4 py-14 text-secondary-500">
            <span className="text-4xl">🚴</span>
            <p className="text-sm font-semibold">No delivery partners found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((partner) => (
              <DeliveryCard key={partner.id} partner={partner} onView={setSelected} />
            ))}
          </div>
        )}
      </div>

      <DeliveryDrawer
        partner={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
      />
    </PageWrapper>
  );
}


