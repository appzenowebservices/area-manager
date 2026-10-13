// src/components/dashboard/AlertsPanel.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ALERTS } from "../../data/dashboardData";

/**
 * AlertsPanel
 * Shows all active system alerts with action buttons.
 * Alerts can be dismissed individually.
 */
export default function AlertsPanel() {
  const [dismissed, setDismissed] = useState([]);
  const navigate = useNavigate();

  const visible = ALERTS.filter((a) => !dismissed.includes(a.id));

  return (
    <>
      <style>{css}</style>
      <div className="ap-card">
        {/* Header */}
        <div className="ap-header">
          <div>
            <div className="ap-title">Alerts & Actions</div>
            <div className="ap-sub">Items requiring your attention</div>
          </div>
          {dismissed.length > 0 && (
            <button className="ap-restore" onClick={() => setDismissed([])}>
              Restore ({dismissed.length})
            </button>
          )}
        </div>

        {/* Alerts list */}
        <div className="ap-list">
          {visible.length === 0 ? (
            <div className="ap-empty">
              <span style={{ fontSize: "2rem" }}>🎉</span>
              <p>All clear! No pending alerts.</p>
            </div>
          ) : (
            visible.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                onAction={() => navigate(alert.actionRoute)}
                onDismiss={() => setDismissed((d) => [...d, alert.id])}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}

/* ── AlertItem ── */
function AlertItem({ alert, onAction, onDismiss }) {
  return (
    <div
      className="ap-item"
      style={{
        background: alert.bg,
        borderColor: alert.border,
      }}
    >
      <div className="ap-item-top">
        <span className="ap-emoji">{alert.emoji}</span>
        <div className="ap-item-body">
          <div className="ap-item-title" style={{ color: alert.color }}>
            {alert.title}
          </div>
          <div className="ap-item-desc">{alert.desc}</div>
        </div>
        <button
          className="ap-dismiss"
          onClick={onDismiss}
          title="Dismiss"
          aria-label="Dismiss alert"
        >
          ×
        </button>
      </div>
      <button
        className="ap-action-btn"
        style={{ color: alert.color, borderColor: alert.border }}
        onClick={onAction}
      >
        {alert.action} →
      </button>
    </div>
  );
}

const css = `
  .ap-card {
    background: #fff;
    border-radius: 16px;
    padding: 1.3rem;
    border: 1px solid #e9d8bf;
    box-shadow: 0 1px 4px rgba(45, 36, 30,0.05);
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .ap-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 14px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .ap-title {
    font-family: 'Sora', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #2d241e;
  }
  .ap-sub {
    font-size: 0.73rem;
    color: #a68b66;
    margin-top: 2px;
  }
  .ap-restore {
    background: none;
    border: 1px solid #f5ebe0;
    border-radius: 7px;
    color: #ae2012;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.6rem;
    cursor: pointer;
    font-family: inherit;
  }
  .ap-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    overflow-y: auto;
  }
  .ap-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 2rem 0;
    color: #a68b66;
    font-size: 0.85rem;
    font-weight: 500;
  }
  .ap-item {
    border-radius: 12px;
    border: 1px solid;
    padding: 0.85rem 0.95rem;
  }
  .ap-item-top {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    margin-bottom: 10px;
  }
  .ap-emoji {
    font-size: 1.05rem;
    line-height: 1.3;
    flex-shrink: 0;
  }
  .ap-item-body {
    flex: 1;
    min-width: 0;
  }
  .ap-item-title {
    font-size: 0.82rem;
    font-weight: 700;
    line-height: 1.3;
  }
  .ap-item-desc {
    font-size: 0.74rem;
    color: #7d6b5d;
    margin-top: 2px;
    line-height: 1.4;
  }
  .ap-dismiss {
    background: none;
    border: none;
    color: #a68b66;
    font-size: 1.1rem;
    cursor: pointer;
    padding: 0 2px;
    line-height: 1;
    flex-shrink: 0;
    transition: color 0.15s;
  }
  .ap-dismiss:hover { color: #5d4037; }
  .ap-action-btn {
    border: 1.5px solid;
    border-radius: 8px;
    padding: 0.3rem 0.8rem;
    background: transparent;
    font-size: 0.74rem;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;
    white-space: nowrap;
  }
  .ap-action-btn:hover {
    background: rgba(0,0,0,0.04);
  }
  @media (max-width: 480px) {
    .ap-card { padding: 1rem; }
  }
`;
