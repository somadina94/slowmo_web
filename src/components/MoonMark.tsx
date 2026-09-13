export function MoonMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
      <ellipse cx="20" cy="28" rx="16" ry="7" fill="#C9B8E8" />
      <ellipse cx="12" cy="26" rx="5" ry="4" fill="#C9B8E8" />
      <ellipse cx="28" cy="26" rx="5" ry="4" fill="#C9B8E8" />
      <ellipse cx="20" cy="22" rx="9" ry="8" fill="#8A5A3B" />
      <ellipse cx="20" cy="22" rx="6.5" ry="5.5" fill="#E8D5B7" />
      <path d="M13 17 Q 20 8 27 17 Q 20 18 13 17 Z" fill="#3E2A6E" />
      <circle cx="27" cy="12" r="2" fill="#C9B8E8" />
      <path d="M16.5 22 Q 17.5 23 18.5 22" stroke="#0F3B2E" strokeWidth="1" fill="none" />
      <path d="M21.5 22 Q 22.5 23 23.5 22" stroke="#0F3B2E" strokeWidth="1" fill="none" />
      <ellipse cx="20" cy="24" rx="0.7" ry="0.5" fill="#0F3B2E" />
      <path d="M18.8 25.5 Q 20 26.5 21.2 25.5" stroke="#0F3B2E" strokeWidth="0.8" fill="none" />
    </svg>
  );
}
