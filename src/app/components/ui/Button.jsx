/**
 * Button — Reusable UI Component
 * File: src/components/ui/Button.jsx
 *
 * Props:
 *  variant   "primary" | "secondary" | "ghost" | "danger"
 *  size      "sm" | "md" | "lg"
 *  loading   boolean
 *  disabled  boolean
 *  fullWidth boolean
 *  onClick   fn
 *  type      "button" | "submit"
 *  children  ReactNode
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = "button",
  style: extraStyle = {},
}) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: "none",
    borderRadius: 10,
    fontFamily: "inherit",
    fontWeight: 600,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    transition: "all 0.18s ease",
    width: fullWidth ? "100%" : "auto",
    whiteSpace: "nowrap",
    letterSpacing: "0.01em",
  };

  const sizes = {
    sm: { padding: "0.45rem 0.9rem", fontSize: "0.8rem" },
    md: { padding: "0.7rem 1.25rem", fontSize: "0.9rem" },
    lg: { padding: "0.85rem 1.6rem", fontSize: "1rem"  },
  };

  const variants = {
    primary: {
      background: "#ae2012",
      color: "#fff",
      boxShadow: "0 4px 14px rgba(12, 131, 31,0.35)",
    },
    secondary: {
      background: "#fdfbf7",
      color: "#ae2012",
    },
    ghost: {
      background: "transparent",
      color: "#5d4037",
      border: "1.5px solid #f5ebe0",
    },
    danger: {
      background: "#d32f2f",
      color: "#fff",
      boxShadow: "0 4px 14px rgba(239,68,68,0.3)",
    },
  };

  const combined = { ...base, ...sizes[size], ...variants[variant], ...extraStyle };

  return (
    <button type={type} style={combined} onClick={!disabled && !loading ? onClick : undefined} disabled={disabled || loading}>
      {loading && <Spinner />}
      {children}
    </button>
  );
}

const Spinner = () => (
  <svg
    width="16" height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    style={{ animation: "spin 0.7s linear infinite" }}
  >
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);
