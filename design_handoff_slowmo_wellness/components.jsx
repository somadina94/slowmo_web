/* ---------- Shared components + icons for Slow Mo ---------- */

const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

/* ---------------- ICONS (inline SVG, hand-picked) ---------------- */
const Icon = {
  Leaf: (p) => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19.8 2c1 5 .5 10.8-2.8 14.6a8 8 0 0 1-6 3.3z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>),
  Smile: (p) => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>),
  Sprout: (p) => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>),
  Moon: (p) => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>),
  Sparkle: (p) => (<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...p}><path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5z"/></svg>),
  Heart: (p) => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>),
  ArrowRight: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>),
  Check: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>),
  Package: (p) => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M16.5 9.4l-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>),
  Phone: (p) => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>),
  User: (p) => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>),
  Home: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
  Cart: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>),
  Chart: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>),
  Truck: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>),
  Box: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>),
  Users: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>),
  Settings: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>),
  Search: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
  Plus: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
  Calendar: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>),
  Cash: (p) => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>),
  Card: (p) => (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>),
  Bell: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>),
  Download: (p) => (<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>),
  MoreH: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>),
  Filter: (p) => (<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>),
  Star: (p) => (<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
};

/* ---------------- ROUTER (hash-based) ---------------- */
const RouterCtx = createContext({ path: "/", navigate: () => {} });
function useRoute() { return useContext(RouterCtx); }

function RouterProvider({ children }) {
  const [path, setPath] = useState(() => (location.hash.replace("#", "") || "/"));
  useEffect(() => {
    const onHash = () => setPath(location.hash.replace("#", "") || "/");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const navigate = (to) => {
    location.hash = to;
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  return <RouterCtx.Provider value={{ path, navigate }}>{children}</RouterCtx.Provider>;
}

/* ---------------- SPARKLES scatter ---------------- */
function Sparkles({ items = [] }) {
  return (
    <>
      {items.map((it, i) => (
        <span key={i} className="sparkle" style={{ top: it.top, left: it.left, fontSize: it.size || 14, animationDelay: `${i * 0.4}s`, color: it.color || undefined }}>
          <Icon.Sparkle />
        </span>
      ))}
    </>
  );
}

/* ---------------- NAV ---------------- */
function Nav() {
  const { navigate, path } = useRoute();
  const [menu, setMenu] = useState(false);
  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#/" className="nav-logo" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
          <MoonMark /> slow mo<sup>™</sup>
        </a>
        <div className="nav-links">
          <a href="#product" onClick={(e) => { e.preventDefault(); navigate("/"); setTimeout(() => document.getElementById("product")?.scrollIntoView({ behavior: "smooth" }), 100); }} className="nav-link">The product</a>
          <a href="#science" onClick={(e) => { e.preventDefault(); navigate("/"); setTimeout(() => document.getElementById("science")?.scrollIntoView({ behavior: "smooth" }), 100); }} className="nav-link">Science</a>
          <a href="#how" onClick={(e) => { e.preventDefault(); navigate("/"); setTimeout(() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" }), 100); }} className="nav-link">How it works</a>
          <a href="#faq" onClick={(e) => { e.preventDefault(); navigate("/"); setTimeout(() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" }), 100); }} className="nav-link">FAQ</a>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => navigate("/preorder")}>
          Preorder — ₹3,390 <Icon.ArrowRight />
        </button>
      </div>
    </nav>
  );
}

function MoonMark({ size = 32 }) {
  // Sleeping sloth on a lavender cloud — pulled straight from the pouch character
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* cloud/pillow */}
      <ellipse cx="20" cy="28" rx="16" ry="7" fill="#C9B8E8"/>
      <ellipse cx="12" cy="26" rx="5" ry="4" fill="#C9B8E8"/>
      <ellipse cx="28" cy="26" rx="5" ry="4" fill="#C9B8E8"/>
      {/* sloth body */}
      <ellipse cx="20" cy="22" rx="9" ry="8" fill="#8A5A3B"/>
      {/* face */}
      <ellipse cx="20" cy="22" rx="6.5" ry="5.5" fill="#E8D5B7"/>
      {/* nightcap */}
      <path d="M13 17 Q 20 8 27 17 Q 20 18 13 17 Z" fill="#3E2A6E"/>
      <circle cx="27" cy="12" r="2" fill="#C9B8E8"/>
      {/* eyes (closed - little arcs) */}
      <path d="M16.5 22 Q 17.5 23 18.5 22" stroke="#0F3B2E" strokeWidth="1" strokeLinecap="round" fill="none"/>
      <path d="M21.5 22 Q 22.5 23 23.5 22" stroke="#0F3B2E" strokeWidth="1" strokeLinecap="round" fill="none"/>
      {/* nose + smile */}
      <ellipse cx="20" cy="24" rx="0.7" ry="0.5" fill="#0F3B2E"/>
      <path d="M18.8 25.5 Q 20 26.5 21.2 25.5" stroke="#0F3B2E" strokeWidth="0.8" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

function AyushBadge({ variant = "light" }) {
  const bg = variant === "dark" ? "rgba(246,242,232,0.08)" : "var(--white)";
  const border = variant === "dark" ? "rgba(246,242,232,0.15)" : "var(--line)";
  const text = variant === "dark" ? "var(--cream)" : "var(--forest)";
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 10,
      padding: "8px 14px 8px 8px",
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: 999,
      fontSize: 12,
      fontWeight: 500,
      color: text,
      lineHeight: 1.2,
    }}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="15" fill="#F0C64A"/>
        <circle cx="16" cy="16" r="15" stroke="#1a7a4f" strokeWidth="1.5" fill="none"/>
        {/* stylized leaf */}
        <path d="M16 8 Q 22 12 22 18 Q 22 22 16 24 Q 10 22 10 18 Q 10 12 16 8 Z" fill="#1a7a4f"/>
        <path d="M16 8 L 16 24" stroke="#F0C64A" strokeWidth="1"/>
      </svg>
      <div style={{ display: "grid", gap: 1 }}>
        <span style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.6, fontWeight: 600 }}>Certified by</span>
        <span style={{ fontWeight: 700, fontSize: 12 }}>Ministry of AYUSH</span>
      </div>
    </div>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  const { navigate } = useRoute();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo" style={{ color: "var(--cream)", fontSize: 32 }}>
              <MoonMark /> slow mo<sup>™</sup>
            </div>
            <p>Plant wisdom for a slower, brighter you. Ayurvedic proprietary medicine. Prescription use only.</p>
            <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
              <div className="tag" style={{ background: "rgba(246,242,232,0.1)", color: "var(--cream)" }}>Made in India</div>
              <div className="tag" style={{ background: "rgba(246,242,232,0.1)", color: "var(--cream)" }}>Ayush licensed</div>
            </div>
          </div>
          <div>
            <h5>Shop</h5>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/preorder"); }}>Preorder</a></li>
              <li><a href="#">Bundles</a></li>
              <li><a href="#">Track order</a></li>
              <li><a href="#">Refill program</a></li>
            </ul>
          </div>
          <div>
            <h5>Company</h5>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Science</a></li>
              <li><a href="#">Journal</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>
          <div>
            <h5>Support</h5>
            <ul>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Consult a doctor</a></li>
              <li><a href="#">Contact</a></li>
              <li><a href="#">hello@slowmo.co</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Slow Mo Wellness Pvt Ltd. All rights reserved.</span>
          <span>Ayurvedic proprietary medicine · License #AYUSH-KA-24-0912 · Prescription required</span>
        </div>
      </div>
    </footer>
  );
}

/* export */
Object.assign(window, {
  Icon, RouterProvider, useRoute, Nav, Footer, Sparkles, MoonMark, AyushBadge,
});
