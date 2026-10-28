"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import useAuthStore from "../../hooks/authStore";
import InputField from "../../components/ui/InputField";
import Button from "../../components/ui/Button";
import {
  fetchLoginStage,
  requestPasswordInvite,
  STAGE_MESSAGES,
} from "../auth/authClient";

/* --- Icons --- */
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
  const { loginError, clearError } = useAuthStore();

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingReset, setSendingReset] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const showError = (message: string) => {
    useAuthStore.setState({ loginError: message });
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!email || !email.includes("@")) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    clearError();
    setNotice("");
    if (!validate()) return;

    setLoading(true);
    try {
      // State-first: the e-mail alone tells us which stage the manager is at,
      // so we can show the right prompt before attempting a password check.
      const state = await fetchLoginStage(email.trim());

      if (
        state === "email_not_verified" ||
        state === "not_approved" ||
        state === "inactive"
      ) {
        showError(STAGE_MESSAGES[state]);
        return;
      }
      if (state === "password_not_set") {
        const message = await requestPasswordInvite(email.trim());
        setNotice(message);
        return;
      }

      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (!result || result.error) {
        showError("Invalid email or password.");
        return;
      }

      useAuthStore.setState({
        user: {
          id: "",
          name: email.split("@")[0],
          email,
          role: "area_manager",
        },
        isAuthenticated: true,
        loginError: null,
      });
      router.push(callbackUrl);
      router.refresh();
    } catch {
      showError("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /** Self-service password reset: emails the set-password link when eligible. */
  const handleForgotPassword = async () => {
    clearError();
    setNotice("");
    if (!email || !email.includes("@")) {
      setErrors({ email: "Enter your registered email above, then tap “Forgot password?”." });
      return;
    }
    setErrors({});
    setSendingReset(true);
    try {
      setNotice(await requestPasswordInvite(email.trim()));
    } finally {
      setSendingReset(false);
    }
  };

  return (
    <main style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "1rem" }}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <p style={styles.eyebrow}>Area Manager Portal</p>
          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Sign in to manage your area's operations.</p>
        </div>

        {/* Error banner */}
        {loginError && (
          <div style={styles.errorBanner}>
            <span>⚠️</span> {loginError}
          </div>
        )}

        {/* Info / success notice */}
        {notice && <div style={styles.noticeBox}>{notice}</div>}

        {/* Inputs */}
        <div style={styles.section}>
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
        </div>

        <div style={styles.section}>
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
        </div>

        {/* Remember / forgot */}
        <div style={styles.rememberRow}>
          <label style={styles.checkLabel}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              style={{ accentColor: "#ae2012", width: 15, height: 15 }}
            />
            Remember me
          </label>
          <button
            type="button"
            style={styles.forgotBtn}
            onClick={handleForgotPassword}
            disabled={sendingReset}
          >
            {sendingReset ? "Sending…" : "Forgot password?"}
          </button>
        </div>

        {/* Submit */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
          onClick={handleSubmit}
          style={{ borderRadius: 12, marginTop: 4, boxShadow: "0 6px 20px rgba(12, 131, 31,0.38)" }}
        >
          {loading ? "Verifying..." : "Sign In"}
        </Button>

        <p style={styles.footer}>Protected · Apni Desi Dukaan · 2026</p>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    width: "100%",
    maxWidth: 420,
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  header: { marginBottom: "2rem" },
  eyebrow: {
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "#ae2012",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    marginBottom: "0.4rem",
  },
  title: {
    fontSize: "1.9rem",
    fontWeight: 700,
    color: "#2d241e",
    letterSpacing: "-0.02em",
    lineHeight: 1.15,
  },
  subtitle: { marginTop: "0.45rem", fontSize: "0.88rem", color: "#7d6b5d" },
  section: { marginBottom: "1.1rem" },
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#fbebe9",
    border: "1px solid #f6d4ce",
    borderRadius: 10,
    padding: "0.65rem 1rem",
    fontSize: "0.84rem",
    color: "#b71c1c",
    marginBottom: "1rem",
  },
  noticeBox: {
    background: "#eaf6ed",
    border: "1px solid #b8e0c2",
    borderRadius: 10,
    padding: "0.65rem 1rem",
    fontSize: "0.82rem",
    color: "#0a671a",
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
    color: "#5d4037",
    cursor: "pointer",
  },
  forgotBtn: {
    background: "none",
    border: "none",
    fontSize: "0.84rem",
    color: "#ae2012",
    fontWeight: 600,
    cursor: "pointer",
    padding: 0,
  },
  footer: { textAlign: "center", marginTop: "2rem", fontSize: "0.78rem", color: "#a68b66" },
};
