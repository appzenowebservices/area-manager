import { useState } from "react";

/**
 * InputField — Reusable UI Component
 * File: src/components/ui/InputField.jsx
 *
 * Props:
 *  label       string
 *  type        string  (text | password | tel | email)
 *  value       string
 *  onChange    fn
 *  placeholder string
 *  icon        ReactNode
 *  error       string
 *  suffix      ReactNode  (e.g. Send OTP button)
 *  maxLength   number
 *  disabled    boolean
 */
export default function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  error,
  suffix = null,
  maxLength = undefined,
  disabled = false,
  autoComplete,
}) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const inputType = type === "password" ? (showPass ? "text" : "password") : type;

  return (
    <div style={styles.group}>
      {label && <label style={styles.label}>{label}</label>}

      <div
        style={{
          ...styles.inputWrap,
          ...(focused ? styles.focused : {}),
          ...(error ? styles.errored : {}),
        }}
      >
        {icon && <span style={styles.iconLeft}>{icon}</span>}

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          autoComplete={autoComplete}
          style={{
            ...styles.input,
            paddingLeft: icon ? "2.6rem" : "0.9rem",
            paddingRight: type === "password" ? "2.8rem" : "0.9rem",
          }}
        />

        {type === "password" && (
          <button
            type="button"
            style={styles.eyeBtn}
            onClick={() => setShowPass((p) => !p)}
            tabIndex={-1}
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            {showPass ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}

        {suffix && <div style={styles.suffix}>{suffix}</div>}
      </div>

      {error && <p style={styles.errorMsg}>{error}</p>}
    </div>
  );
}

/* ── Inline SVG icons ── */
const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const styles = {
  group: { display: "flex", flexDirection: "column", gap: 6 },
  label: {
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#4a3f35",
    letterSpacing: "0.02em",
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    background: "#fff",
    border: "1.5px solid #f5ebe0",
    borderRadius: 10,
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  focused: {
    borderColor: "#ae2012",
    boxShadow: "0 0 0 3px rgba(12, 131, 31,0.12)",
  },
  errored: {
    borderColor: "#d32f2f",
    boxShadow: "0 0 0 3px rgba(239,68,68,0.1)",
  },
  input: {
    flex: 1,
    height: 46,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "0.9rem",
    color: "#2d241e",
    fontFamily: "inherit",
  },
  iconLeft: {
    position: "absolute",
    left: 13,
    color: "#a68b66",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
  },
  eyeBtn: {
    position: "absolute",
    right: 12,
    background: "none",
    border: "none",
    color: "#a68b66",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: 4,
    transition: "color 0.15s",
  },
  suffix: {
    paddingRight: 6,
    display: "flex",
    alignItems: "center",
  },
  errorMsg: {
    fontSize: "0.78rem",
    color: "#d32f2f",
    marginTop: 2,
  },
};
