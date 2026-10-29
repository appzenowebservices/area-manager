"use client";

import { useEffect, useMemo, useState } from "react";
import PageWrapper from "../components/layout/PageWrapper";
import { PageHeader } from "../components/brand/PageHeader";
import { BrandStatStrip } from "../components/brand/BrandStatStrip";
import ComplaintsFilters from "../components/complaints/ComplaintsFilters";
import ComplaintsTable from "../components/complaints/ComplaintsTable";
import ComplaintCard from "../components/complaints/ComplaintCard";
import ComplaintDrawer from "../components/complaints/ComplaintDrawer";
import { api } from "~/trpc/react";

export default function ComplaintsPage() {
  const { data: apiComplaints, isLoading, error } = api.areaManagerData.complaints.list.useQuery();
  const setStatusMutation = api.areaManagerData.complaints.setStatus.useMutation();
  const utils = api.useUtils();
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("All");
  const [priority, setPriority] = useState("All");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (apiComplaints) setComplaints(apiComplaints);
  }, [apiComplaints]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return complaints.filter((complaint) => {
      const matchSearch =
        !search ||
        complaint.id.toLowerCase().includes(query) ||
        complaint.subject.toLowerCase().includes(query) ||
        complaint.type.toLowerCase().includes(query) ||
        complaint.reportedBy.name.toLowerCase().includes(query) ||
        complaint.area.toLowerCase().includes(query);
      const matchSource = source === "All" || complaint.source === source;
      const matchPriority = priority === "All" || complaint.priority === priority;
      const matchStatus = status === "All" || complaint.status === status;
      return matchSearch && matchSource && matchPriority && matchStatus;
    });
  }, [search, source, priority, status, complaints]);

  const handleReset = () => {
    setSearch("");
    setSource("All");
    setPriority("All");
    setStatus("All");
  };

  const handleUpdate = (updated) => {
    setComplaints((prev) =>
      prev.map((complaint) => (complaint.id === updated.id ? updated : complaint)),
    );
    setSelected(updated);

    if (updated?.status) {
      setStatusMutation.mutate(
        { id: updated.id, status: updated.status },
        { onSuccess: () => utils.areaManagerData.complaints.list.invalidate() },
      );
    }
  };

  const open = complaints.filter((complaint) => complaint.status === "Open").length;
  const inProgress = complaints.filter((complaint) => complaint.status === "In Progress").length;
  const resolved = complaints.filter((complaint) => complaint.status === "Resolved").length;
  const critical = complaints.filter((complaint) => complaint.priority === "Critical").length;

  return (
    <PageWrapper>
      <PageHeader
        kicker="Support Desk"
        title="Complaints"
        subtitle="Resolve customer, vendor and delivery-partner issues before they escalate"
        actions={
          <span className="rounded-2xl border-2 border-secondary-950 bg-accent-400 px-4 py-2 text-xs font-display font-black uppercase tracking-widest text-secondary-900">
            {complaints.length} total
          </span>
        }
      />

      <BrandStatStrip
        items={[
          { label: "Total", value: complaints.length, tone: "primary" },
          { label: "Open", value: open, tone: "danger" },
          { label: "In Progress", value: inProgress, tone: "accent" },
          { label: "Resolved", value: resolved, tone: "fresh" },
          { label: "Critical", value: critical, tone: "danger" },
          { label: "Escalated", value: complaints.filter((c) => c.status === "Escalated").length, tone: "danger" },
        ]}
      />

      <ComplaintsFilters
        search={search}
        onSearch={setSearch}
        source={source}
        onSource={setSource}
        priority={priority}
        onPriority={setPriority}
        status={status}
        onStatus={setStatus}
        total={filtered.length}
        onReset={handleReset}
      />

      <div className="hidden md:block">
        <ComplaintsTable complaints={filtered} onView={setSelected} />
      </div>

      <div className="md:hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-secondary-300 px-4 py-14 text-secondary-500">
            <span className="text-4xl">✅</span>
            <p className="text-sm font-semibold">No complaints found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onView={setSelected}
              />
            ))}
          </div>
        )}
      </div>

      <ComplaintDrawer
        complaint={selected}
        onClose={() => setSelected(null)}
        onUpdate={handleUpdate}
      />
    </PageWrapper>
  );
}


