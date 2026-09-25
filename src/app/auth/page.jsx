'use client'
import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import BrandPanel from "../components/auth/BrandPanel";
import LoginForm from "../components/auth/LoginForm";
import useAuthStore from "../hooks/authStore";
import { useRouter } from "next/navigation";

/**
 * LoginPage
 * File: src/pages/auth/LoginPage.jsx
 *
 * Public page. If already logged in → redirect to /dashboard.
 * Layout: BrandPanel (left) + LoginForm (right).
 * Responsive: stacks vertically on mobile.
 */
export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // Already logged in? Skip login.
  useEffect(() => {
    if (isAuthenticated) router.push("/dashboard", { replace: true });
  }, [isAuthenticated, router]);

  return (
    <>
      <style>{pageStyles}</style>
      <main className="login-page">
        {/* Left: brand panel (hidden on mobile, shown as top bar) */}
        <div className="login-brand">
          <BrandPanel />
        </div>

        {/* Right: form panel */}
        <div className="login-form-panel">
          <LoginForm />
        </div>
      </main>
    </>
  );
}

const pageStyles = `
  @keyframes panelIn {
    from { transform: translateX(-50px); opacity: 0; }
    to   { transform: translateX(0);     opacity: 1; }
  }
  @keyframes fadeUp {
    from { transform: translateY(28px); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  @keyframes popIn {
    from { transform: scale(0.5); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%,60%  { transform: translateX(-6px); }
    40%,80%  { transform: translateX(6px); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .login-page {
    display: flex;
    min-height: 100vh;
    background: #f0f5ff;
  }

  /* Left brand panel */
  .login-brand {
    width: 45%;
    flex-shrink: 0;
  }

  /* Right form panel */
  .login-form-panel {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 2.5rem;
    background: #f8faff;
    animation: fadeUp 0.6s 0.2s cubic-bezier(0.22,1,0.36,1) both;
  }

  /* ── Tablet ── */
  @media (max-width: 900px) {
    .login-brand { width: 40%; }
  }

  /* ── Mobile ── */
  @media (max-width: 650px) {
    .login-page { flex-direction: column; }

    .login-brand {
      width: 100%;
      /* Show as compact top banner on mobile */
    }

    .login-form-panel {
      padding: 2rem 1.25rem 3rem;
      align-items: flex-start;
    }
  }
`;
