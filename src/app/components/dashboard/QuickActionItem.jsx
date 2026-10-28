const TONES = {
  primary: "bg-primary-50",
  fresh: "bg-fresh-50",
  accent: "bg-accent-50",
  mehndi: "bg-mehndi-50",
  danger: "bg-primary-50",
  neutral: "bg-secondary-50",
};

export default function QuickActionItem({
  emoji,
  label,
  desc,
  tone = "neutral",
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-2xl border-2 border-secondary-900 bg-background-section p-3 text-left shadow-[3px_3px_0px_var(--color-secondary-900)] transition-all hover:-translate-y-0.5 hover:bg-accent-50 active:translate-y-0 active:shadow-none"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-secondary-900 text-base ${TONES[tone]}`}
      >
        {emoji}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-black text-secondary-900">
          {label}
        </span>
        <span className="block truncate text-[10px] font-semibold text-secondary-500">
          {desc}
        </span>
      </span>
    </button>
  );
}
