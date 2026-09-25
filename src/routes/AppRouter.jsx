import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute  from "./ProtectedRoute";
import AppLayout       from "../components/layout/AppLayout";
import LoginPage           from "../pages/auth/LoginPage";
import ActivityLogPage     from "../pages/settings/ActivityLogPage";
import DashboardPage   from "../pages/dashboard/DashboardPage";
import OrdersPage      from "../pages/orders/OrdersPage";
import VendorsPage     from "../pages/vendors/VendorsPage";
import DeliveryPage     from "../pages/delivery/DeliveryPage";
import VendorLeadsPage    from "../pages/leads/VendorLeadsPage";
import DeliveryLeadsPage  from "../pages/leads/DeliveryLeadsPage";
import EarningsPage       from "../pages/earnings/EarningsPage";
import ReportsPage        from "../pages/reports/ReportsPage";
import ComplaintsPage     from "../pages/complaints/ComplaintsPage";
import SettingsPage       from "../pages/settings/SettingsPage";


/**
 * AppRouter
 * File: src/routes/AppRouter.jsx
 *
 * Add new pages here as they are built:
 *  1. import YourPage from "../pages/your/YourPage"
 *  2. <Route path="/your-path" element={<YourPage />} />
 */

const ComingSoon = ({ name }) => (
  <div style={{
    display:"flex", flexDirection:"column",
    alignItems:"center", justifyContent:"center",
    height:"60vh", gap:12,
    fontFamily:"'Plus Jakarta Sans',sans-serif",
  }}>
    <div style={{
      width:56, height:56, borderRadius:16,
      background:"#e8f0fe",
      display:"flex", alignItems:"center",
      justifyContent:"center", fontSize:"1.5rem",
    }}>🚧</div>
    <h2 style={{ fontSize:"1.1rem", fontWeight:700, color:"#0f172a" }}>
      {name} — Coming Soon
    </h2>
    <p style={{ fontSize:"0.85rem", color:"#94a3b8" }}>
      This page is under construction.
    </p>
  </div>
);

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/"      element={<Navigate to="/dashboard" replace />} />

        {/* Protected — all inside AppLayout shell */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>

            {/* ✅ Built */}
            <Route path="/dashboard"   element={<DashboardPage />} />
            <Route path="/orders"      element={<OrdersPage />} />
            <Route path="/orders/:id"  element={<OrdersPage />} />
            <Route path="/vendors"     element={<VendorsPage />} />
            <Route path="/vendors/new" element={<ComingSoon name="Add Vendor" />} />
            <Route path="/vendors/:id" element={<ComingSoon name="Edit Vendor" />} />
            <Route path="/delivery"    element={<DeliveryPage />} />
            <Route path="/leads"       element={<ComingSoon name="Leads" />} />
            <Route path="/leads/vendors"  element={<VendorLeadsPage />} />
            <Route path="/leads/delivery" element={<DeliveryLeadsPage />} />
            <Route path="/earnings"    element={<EarningsPage />} />
            <Route path="/reports"     element={<ReportsPage />} />
            <Route path="/complaints"  element={<ComplaintsPage />} />
            <Route path="/settings"    element={<SettingsPage />} />
            <Route path="/activity-log" element={<ActivityLogPage />} />

          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
