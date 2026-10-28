/**
 * PageWrapper
 *
 * Vendor-panel-compatible page shell: cream canvas, generous padding and a
 * consistent vertical rhythm. Every protected page renders inside this.
 */
export default function PageWrapper({ children, className = "" }) {
  return (
    <div
      className={`p-4 sm:p-6 space-y-6 bg-background min-h-full font-body ${className}`}
    >
      {children}
    </div>
  );
}
