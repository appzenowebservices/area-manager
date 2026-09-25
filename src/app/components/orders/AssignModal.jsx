'use client'
import { useState } from "react";
import { VENDORS ,DELIVERY_BOYS} from "../../data/ordersData";
// import { VENDORS, DELIVERY_BOYS } from "../../data/ordersData";

/**
 * AssignModal
 * File: src/components/orders/AssignModal.jsx
 *
 * Props:
 *   type       "vendor" | "delivery"
 *   currentId  string   — currently assigned id
 *   onConfirm  fn(person)
 *   onClose    fn
 */
export default function AssignModal({ type, currentId, onConfirm, onClose }) {
  const list = type === "vendor" ? VENDORS : DELIVERY_BOYS;
  const title = type === "vendor" ? "Assign Vendor" : "Assign Delivery Boy";

  const [selectedId, setSelectedId] = useState(currentId || "");

  const handleConfirm = () => {
    const person = list.find((p) => p.id === selectedId);
    if (person) onConfirm(person);
  };

  return (
    <>
      <style>{css}</style>
      {/* Backdrop */}
      <div className="am-backdrop" onClick={onClose} />

      {/* Modal */}
      <div className="am-modal">
        <div className="am-header">
          <h3 className="am-title">{title}</h3>
          <button className="am-close" onClick={onClose}>✕</button>
        </div>

        <div className="am-body">
          {list.map((person) => (
            <label key={person.id} className={`am-option${selectedId === person.id ? " am-selected" : ""}`}>
              <input
                type="radio"
                name="assign"
                value={person.id}
                checked={selectedId === person.id}
                onChange={() => setSelectedId(person.id)}
                style={{ display: "none" }}
              />
              <div className="am-avatar">{person.name.charAt(0)}</div>
              <div className="am-info">
                <div className="am-name">{person.name}</div>
                <div className="am-phone">📞 {person.phone}</div>
              </div>
              {selectedId === person.id && <span className="am-check">✓</span>}
            </label>
          ))}
        </div>

        <div className="am-footer">
          <button className="am-cancel" onClick={onClose}>Cancel</button>
          <button
            className="am-confirm"
            onClick={handleConfirm}
            disabled={!selectedId}
          >
            Confirm Assignment
          </button>
        </div>
      </div>
    </>
  );
}

const css = `
  .am-backdrop {
    position: fixed; inset: 0;
    background: rgba(15,23,42,0.5);
    z-index: 1300;
    backdrop-filter: blur(2px);
  }
  .am-modal {
    position: fixed;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1301;
    width: min(420px, 95vw);
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 20px 60px rgba(15,23,42,0.2);
    overflow: hidden;
    animation: modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes modalIn {
    from { transform: translate(-50%, -48%) scale(0.93); opacity: 0; }
    to   { transform: translate(-50%, -50%) scale(1);    opacity: 1; }
  }
  .am-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 1.1rem 1.3rem;
    border-bottom: 1px solid #f1f5f9;
  }
  .am-title {
    font-family: 'Sora', sans-serif;
    font-size: 1rem; font-weight: 700; color: #0f172a; margin: 0;
  }
  .am-close {
    width: 30px; height: 30px;
    background: #f0f5ff; border: none; border-radius: 8px;
    color: #64748b; cursor: pointer; font-size: 0.85rem;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.15s;
  }
  .am-close:hover { background: #fee2e2; color: #ef4444; }
  .am-body {
    padding: 0.75rem 1.1rem;
    display: flex; flex-direction: column; gap: 6px;
    max-height: 320px; overflow-y: auto;
  }
  .am-option {
    display: flex; align-items: center; gap: 12px;
    padding: 0.75rem 0.9rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .am-option:hover { background: #f8faff; border-color: #bfdbfe; }
  .am-selected { background: #e8f0fe; border-color: #1a73e8; }
  .am-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, #1a73e8, #0d47a1);
    color: #fff; font-size: 0.9rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .am-info { flex: 1; }
  .am-name { font-size: 0.88rem; font-weight: 600; color: #0f172a; }
  .am-phone { font-size: 0.73rem; color: #94a3b8; margin-top: 2px; }
  .am-check {
    width: 22px; height: 22px; border-radius: 50%;
    background: #1a73e8; color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 800; flex-shrink: 0;
  }
  .am-footer {
    display: flex; gap: 10px;
    padding: 1rem 1.1rem;
    border-top: 1px solid #f1f5f9;
  }
  .am-cancel {
    flex: 1; padding: 0.7rem;
    background: #f0f5ff; border: none; border-radius: 10px;
    color: #475569; font-size: 0.88rem; font-weight: 600;
    font-family: inherit; cursor: pointer;
  }
  .am-confirm {
    flex: 2; padding: 0.7rem;
    background: #1a73e8; border: none; border-radius: 10px;
    color: #fff; font-size: 0.88rem; font-weight: 700;
    font-family: inherit; cursor: pointer;
    transition: background 0.15s;
    box-shadow: 0 4px 12px rgba(26,115,232,0.35);
  }
  .am-confirm:disabled { background: #c5d8fd; cursor: not-allowed; box-shadow: none; }
  .am-confirm:hover:not(:disabled) { background: #1557b0; }
`;
