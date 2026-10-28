"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, ShieldAlert, X } from "lucide-react";

export function LogoutDialog({
  open,
  busy = false,
  onClose,
  onConfirm,
}: {
  open: boolean;
  busy?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  // Esc closes; body scroll is locked while the dialog is open.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, busy, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-secondary-950/70 backdrop-blur-sm"
            onClick={() => !busy && onClose()}
            aria-hidden="true"
          />

          {/* Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-dialog-title"
            className="relative w-full max-w-sm overflow-hidden bg-background-section border-2 border-secondary-900 rounded-3xl shadow-[10px_10px_0px_var(--color-primary-600)]"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Header strip */}
            <div className="relative bg-secondary-900 px-6 py-5 overflow-hidden">
              <div className="absolute -top-12 -right-10 w-32 h-32 bg-primary-600/25 rounded-full blur-2xl" />

              <div className="relative z-10 flex items-center gap-3">
                <span className="w-11 h-11 shrink-0 rounded-2xl bg-accent-400 border-2 border-secondary-950 flex items-center justify-center">
                  <ShieldAlert size={20} className="text-secondary-900" />
                </span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-300">
                    Session
                  </p>
                  <h2
                    id="logout-dialog-title"
                    className="font-display text-xl font-black text-secondary-50 leading-tight"
                  >
                    Logout?
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                aria-label="Close"
                className="absolute top-3 right-3 z-10 p-1.5 rounded-xl text-secondary-300 hover:text-secondary-50 hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-sm font-semibold text-secondary-900 leading-relaxed">
                Console band karna hai? Aapko dobara login karna padega.
              </p>
              <p className="text-xs font-medium text-secondary-text mt-1.5">
                Aapka data safe rahega — orders, vendors aur settings waise hi rahenge.
              </p>

              <div className="mt-5 flex items-center gap-2 bg-accent-50 border-2 border-accent-200 rounded-2xl px-3 py-2.5">
                <span className="w-2 h-2 rounded-full bg-fresh-500 animate-pulse shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent-800">
                  Aap abhi logged in hain
                </span>
              </div>

              {/* Actions */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={busy}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-secondary-300 bg-background-section text-secondary-900 font-display font-bold text-sm hover:bg-secondary-100 active:scale-[0.98] transition-all disabled:opacity-60"
                >
                  Stay
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={busy}
                  className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-primary-700 bg-primary-600 text-white font-display font-bold text-sm shadow-lg shadow-primary-600/25 hover:bg-primary-700 active:scale-[0.98] transition-all disabled:opacity-70"
                >
                  {busy ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <LogOut size={15} />
                  )}
                  {busy ? "Logging out…" : "Logout"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
