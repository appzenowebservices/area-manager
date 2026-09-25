/**
 * PageWrapper
 * File: src/components/layout/PageWrapper.jsx
 *
 * Wraps every page. Ensures content never overflows viewport.
 * Props: children
 */
export default function PageWrapper({ children }) {
  return (
    <>
      <style>{css}</style>
      <div className="pw-wrap">
        {children}
      </div>
    </>
  );
}

const css = `
  @keyframes pageIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .pw-wrap {
    padding: 1.5rem;
    animation: pageIn 0.25s ease both;
    min-height: calc(100vh - 65px);
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
    /* CRITICAL: NO transform here — transform creates a new stacking context
       which breaks position:fixed children (like OrderDrawer) */
  }
  @media (max-width: 600px) {
    .pw-wrap { padding: 1rem 0.85rem; }
  }
`;
