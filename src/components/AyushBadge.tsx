export function AyushBadge({ variant = "light" }: { variant?: "light" | "dark" }) {
  const dark = variant === "dark";
  return (
    <div
      className="inline-flex items-center gap-2.5 rounded-full border px-3.5 py-2 text-xs font-medium"
      style={{
        background: dark ? "rgba(246,242,232,0.08)" : "var(--white)",
        borderColor: dark ? "rgba(246,242,232,0.15)" : "var(--line)",
        color: dark ? "var(--cream)" : "var(--forest)",
      }}
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" fill="#F0C64A" />
        <circle cx="16" cy="16" r="15" stroke="#1a7a4f" strokeWidth="1.5" fill="none" />
        <path d="M16 8 Q 22 12 22 18 Q 22 22 16 24 Q 10 22 10 18 Q 10 12 16 8 Z" fill="#1a7a4f" />
        <path d="M16 8 L 16 24" stroke="#F0C64A" strokeWidth="1" />
      </svg>
      <div className="grid gap-px">
        <span className="text-[9px] font-semibold uppercase tracking-[0.14em] opacity-60">Certified by</span>
        <span className="text-xs font-bold">Ministry of AYUSH</span>
      </div>
    </div>
  );
}
