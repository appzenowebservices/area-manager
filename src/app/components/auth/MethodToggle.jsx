/**
 * MethodToggle
 * File: src/components/auth/MethodToggle.jsx
 *
 * Pill toggle to switch between Password and OTP login.
 */
export default function MethodToggle({ method, onChange }) {
  const options = [
    { value: "password", label: "Password" },
    { value: "otp",      label: "OTP"      },
  ];

  return (
    <div style={styles.wrap}>
      {options.map((opt) => (
        <button
          key={opt.value}
          style={{
            ...styles.btn,
            ...(method === opt.value ? styles.active : styles.inactive),
          }}
          onClick={() => onChange(opt.value)}
          type="button"
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    background: "#fdfbf7",
    borderRadius: 10,
    padding: 3,
    gap: 3,
  },
  btn: {
    flex: 1,
    padding: "0.52rem 1rem",
    border: "none",
    borderRadius: 8,
    fontSize: "0.85rem",
    fontWeight: 600,
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "all 0.22s ease",
    letterSpacing: "0.01em",
  },
  active: {
    background: "#fff",
    color: "#ae2012",
    boxShadow: "0 2px 8px rgba(12, 131, 31,0.15)",
  },
  inactive: {
    background: "transparent",
    color: "#a68b66",
  },
};
