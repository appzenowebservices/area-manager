import { useState, useMemo } from "react";
import PageWrapper         from "../../components/layout/PageWrapper";
import DeliveryStatsBar    from "../../components/delivery/DeliveryStatsBar";
import DeliveryFilters     from "../../components/delivery/DeliveryFilters";
import DeliveryTable       from "../../components/delivery/DeliveryTable";
import DeliveryCard        from "../../components/delivery/DeliveryCard";
import DeliveryDrawer      from "../../components/delivery/DeliveryDrawer";
import { DELIVERY_PARTNERS } from "../../data/deliveryData";

/**
 * DeliveryPage
 * File: src/pages/delivery/DeliveryPage.jsx
 *
 * Shows all delivery partners under this area manager.
 * Desktop: table | Mobile: cards
 * Click any partner → right-side DeliveryDrawer
 */
export default function DeliveryPage() {
  const [partners, setPartners] = useState(DELIVERY_PARTNERS);
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("All");
  const [area,     setArea]     = useState("All");
  const [selected, setSelected] = useState(null);

  const areas = useMemo(
    () => [...new Set(partners.map(p => p.area))].sort(),
    [partners]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return partners.filter(p => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);
      const matchStatus = status === "All" || p.status === status;
      const matchArea   = area   === "All" || p.area   === area;
      return matchSearch && matchStatus && matchArea;
    });
  }, [search, status, area, partners]);

  const handleReset = () => {
    setSearch(""); setStatus("All"); setArea("All");
  };

  // When status changes from drawer
  const handleStatusChange = (updated) => {
    setPartners(prev => prev.map(p => p.id === updated.id ? updated : p));
    setSelected(updated);
  };

  return (
    <PageWrapper>
      <style>{css}</style>

      {/* Header */}
      <div className="dp-header">
        <div>
          <h1 className="dp-title">Delivery Partners</h1>
          <p className="dp-sub">All delivery partners operating in your area</p>
        </div>
      </div>

      {/* Stats */}
      <DeliveryStatsBar />

      {/* Filters */}
      <DeliveryFilters
        search={search}   onSearch={setSearch}
        status={status}   onStatus={setStatus}
        area={area}       onArea={setArea}
        areas={areas}
        total={filtered.length}
        onReset={handleReset}
      />

      {/* Desktop Table */}
      <div className="dp-desktop">
        <DeliveryTable partners={filtered} onView={setSelected} />
      </div>

      {/* Mobile Cards */}
      <div className="dp-mobile">
        {filtered.length === 0 ? (
          <div className="dp-empty">
            <span style={{ fontSize: "2.5rem" }}>🚴</span>
            <p>No delivery partners found</p>
          </div>
        ) : (
          <div className="dp-card-list">
            {filtered.map(p => (
              <DeliveryCard key={p.id} partner={p} onView={setSelected} />
            ))}
          </div>
        )}
      </div>

      {/* Drawer */}
      <DeliveryDrawer
        partner={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
      />
    </PageWrapper>
  );
}

const css = `
  .dp-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.2rem;
    flex-wrap: wrap;
    gap: 10px;
  }
  .dp-title {
    font-family: 'Sora', sans-serif;
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    font-weight: 800;
    color: #2d241e;
    letter-spacing: -0.02em;
    margin: 0;
  }
  .dp-sub { font-size: 0.82rem; color: #a68b66; margin-top: 3px; }

  /* Desktop: table visible, cards hidden */
  .dp-desktop { display: block; }
  .dp-mobile  { display: none; }

  .dp-card-list { display: flex; flex-direction: column; gap: 10px; }
  .dp-empty {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 10px; padding: 4rem 1rem;
    color: #a68b66; font-size: 0.88rem;
  }

  /* Mobile: cards visible, table hidden */
  @media (max-width: 768px) {
    .dp-desktop { display: none; }
    .dp-mobile  { display: block; }
  }
`;
