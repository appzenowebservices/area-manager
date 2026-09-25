// src/routes/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import useAuthStore  from "../store/authStore";
import SessionGuard  from "../components/auth/SessionGuard";

/**
 * ProtectedRoute
 * - Checks auth
 * - Wraps outlet in SessionGuard (1hr timeout + activity tracking)
 */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SessionGuard>
      <Outlet />
    </SessionGuard>
  );
}
