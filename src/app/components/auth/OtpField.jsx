import { useState, useEffect } from "react";
import InputField from "../ui/InputField";
import Button from "../ui/Button";

/**
 * OtpField
 * File: src/components/auth/OtpField.jsx
 *
 * OTP input with Send / Resend timer.
 */

const HashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/>
    <line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/>
  </svg>
);

const RESEND_SECONDS = 30;

export default function OtpField({ phone, value, onChange, error }) {
  const [sent, setSent] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const handleSend = () => {
    if (!phone || phone.length < 10) return;
    setSent(true);
    setTimer(RESEND_SECONDS);
    // TODO: call API → POST /auth/send-otp { phone }
  };

  const sendBtn = (
    <Button
      variant="secondary"
      size="sm"
      onClick={handleSend}
      disabled={timer > 0 || !phone || phone.length < 10}
      style={{ borderRadius: 7, fontSize: "0.78rem", padding: "0.38rem 0.8rem" }}
    >
      {timer > 0 ? `${timer}s` : sent ? "Resend" : "Send OTP"}
    </Button>
  );

  return (
    <div>
      <InputField
        label="One-Time Password"
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Enter 6-digit OTP"
        icon={<HashIcon />}
        maxLength={6}
        suffix={sendBtn}
        error={error}
      />
      {sent && (
        <p style={{ fontSize: "0.78rem", color: "#0c831f", marginTop: 6 }}>
          ✓ OTP sent to +91 {phone}
        </p>
      )}
    </div>
  );
}
