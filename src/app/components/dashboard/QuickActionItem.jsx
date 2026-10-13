/**
 * QuickActionItem
 * File: src/components/dashboard/QuickActionItem.jsx
 *
 * Single action card button.
 * Props:
 *   emoji   string
 *   label   string
 *   desc    string
 *   bg      string  (icon bg color)
 *   color   string  (hover border + icon color)
 *   onClick fn
 */
export default function QuickActionItem({ emoji, label, desc, bg, color, onClick }) {
  return (
    <>
      <style>{css}</style>
      <button
        className="qai-btn"
        onClick={onClick}
        style={{ "--qai-hover-bg": bg, "--qai-color": color }}
      >
        <span className="qai-icon" style={{ background: bg }}>
          {emoji}
        </span>
        <span className="qai-text">
          <span className="qai-label">{label}</span>
          <span className="qai-desc">{desc}</span>
        </span>
      </button>
    </>
  );
}

const css = `
  .qai-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 0.7rem 0.8rem;
    background: #fdfbf7;
    border: 1.5px solid #e9d8bf;
    border-radius: 12px;
    cursor: pointer;
    font-family: inherit;
    text-align: left;
    transition: background 0.18s, border-color 0.18s, transform 0.15s, box-shadow 0.18s;
    min-width: 0;
    box-sizing: border-box;
  }
  .qai-btn:hover {
    background: var(--qai-hover-bg);
    border-color: var(--qai-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.07);
  }
  .qai-btn:active {
    transform: translateY(0);
  }
  .qai-icon {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    flex-shrink: 0;
  }
  .qai-text {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
    overflow: hidden;
  }
  .qai-label {
    font-size: 0.78rem;
    font-weight: 700;
    color: #2d241e;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
  .qai-desc {
    font-size: 0.67rem;
    color: #a68b66;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: block;
  }
`;
