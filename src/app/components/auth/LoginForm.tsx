"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useAuthStore from "../../hooks/authStore";
import MethodToggle from "../../components/auth/MethodToggle";
import OtpField from "../../components/auth/OtpField";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";

/* --- Icons --- */
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 7l10 7 10-7" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginError, clearError } = useAuthStore();

  // Next.js equivalent of location.state?.from
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [method, setMethod] = useState("password");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* -- Cleanup errors on unmount -- */
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (method === "password") {
      if (!email || !email.includes("@")) e.email = "Enter a valid email address.";
      if (!password) e.password = "Password is required.";
    }
    if (method === "otp") {
      if (!phone || phone.length < 10) e.phone = "Enter a valid 10-digit mobile number.";
      if (otp.length < 6) e.otp = "Enter the 6-digit OTP.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    clearError();
    if (!validate()) return;

    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));

      if (method === "password") {
        const success = await login(email, password);
        if (success) {
          router.push(callbackUrl);
          router.refresh(); // Refresh to update server components with new auth state
        }
      }

      if (method === "otp") {
        // OTP Demo Mode
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMethodChange = (m: string) => {
    setMethod(m);
    setErrors({});
    clearError();
  };

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '1rem' }}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <p style={styles.eyebrow}>Area Manager Portal</p>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Sign in to manage your area's operations.</p>
        </div>

        {/* Method Toggle */}
        <div style={styles.section}>
          <MethodToggle method={method} onChange={handleMethodChange} />
        </div>

        {/* Error Banner */}
        {loginError && (
          <div style={styles.errorBanner}>
            <span>⚠</span> {loginError}
          </div>
        )}

        {/* Inputs */}
        <div style={styles.section}>
          {method === "password" ? (
            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              placeholder="yourname@add.com"
              icon={<MailIcon />}
              error={errors.email}
              autoComplete="email"
            />
          ) : (
            <InputField
              label="Mobile Number"
              type="tel"
              value={phone}
              onChange={(e: any) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile number"
              icon={<PhoneIcon />}
              error={errors.phone}
              autoComplete="tel"
            />
          )}
        </div>

        <div style={styles.section}>
          {method === "password" ? (
            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              placeholder="Enter your password"
              icon={<LockIcon />}
              error={errors.password}
              autoComplete="current-password"
            />
          ) : (
            <OtpField
              phone={phone}
              value={otp}
              onChange={(e: any) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              error={errors.otp}
            />
          )}
        </div>

        {/* Demo Hint */}
        {method === "password" && (
          <div style={styles.hintBox}>
            💡 Demo — Email: <b>rajesh@add.com</b> &nbsp;|&nbsp; Password: <b>admin123</b>
          </div>
        )}

        {/* Remember me row */}
        <div style={styles.rememberRow}>
          <label style={styles.checkLabel}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ accentColor: "#1a73e8", width: 15, height: 15 }}
            />
            Remember me
          </label>
          {method === "password" && (
            <button type="button" style={styles.forgotBtn}>
              Forgot password?
            </button>
          )}
        </div>

        {/* Submit */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          onClick={handleSubmit}
          style={{ borderRadius: 12, marginTop: 4, boxShadow: "0 6px 20px rgba(26,115,232,0.38)" }}
        >
          {loading
            ? "Verifying..."
            : method === "password"
              ? "Sign In"
              : "Verify OTP"}
        </Button>

        <p style={styles.footer}>
          Protected · Apni Desi Dukaan © 2025
        </p>
      </div>
    </main>
  );
}

// Styles preserved from your original code
const styles: Record<string, React.CSSProperties> = {
  card: {
    width: "100%",
    maxWidth: 420,
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  header: {
    marginBottom: "2rem",
  },
  eyebrow: {
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "#1a73e8",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    marginBottom: "0.4rem",
  },
  title: {
    fontSize: "1.9rem",
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.02em",
    lineHeight: 1.15,
  },
  subtitle: {
    marginTop: "0.45rem",
    fontSize: "0.88rem",
    color: "#64748b",
  },
  section: {
    marginBottom: "1.1rem",
  },
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#fee2e2",
    border: "1px solid #fecaca",
    borderRadius: 10,
    padding: "0.65rem 1rem",
    fontSize: "0.84rem",
    color: "#dc2626",
    marginBottom: "1rem",
  },
  hintBox: {
    background: "#f0f7ff",
    border: "1px solid #bfdbfe",
    borderRadius: 8,
    padding: "0.55rem 0.9rem",
    fontSize: "0.78rem",
    color: "#1e40af",
    marginBottom: "1rem",
  },
  rememberRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: 7,
    fontSize: "0.84rem",
    color: "#475569",
    cursor: "pointer",
  },
  forgotBtn: {
    background: "none",
    border: "none",
    fontSize: "0.84rem",
    color: "#1a73e8",
    fontWeight: 600,
    cursor: "pointer",
    padding: 0,
  },
  footer: {
    marginTop: "1.5rem",
    textAlign: "center",
    fontSize: "0.73rem",
    color: "#94a3b8",
  },
};