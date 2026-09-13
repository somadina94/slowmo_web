/* ---------- App entry: router + tweaks ---------- */
const { useState: useStateApp, useEffect: useEffectApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "default",
  "hero": "left",
  "tone": "playful",
  "illus": "on",
  "cta": "pill"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply data-attrs on body so CSS variants kick in
  useEffectApp(() => {
    document.body.dataset.palette = t.palette;
    document.body.dataset.hero = t.hero;
    document.body.dataset.illus = t.illus;
    document.body.dataset.cta = t.cta;
  }, [t.palette, t.hero, t.illus, t.cta]);

  return (
    <RouterProvider>
      <Router tone={t.tone} />
      <TweaksPanel title="Tweaks">
        <TweakSection label="Palette">
          <PaletteSwatches
            value={t.palette}
            onChange={(v) => setTweak("palette", v)}
            options={[
              { key: "default",   name: "Default",   swatches: ["#F6F2E8", "#0F3B2E", "#3E2A6E", "#F0C64A"] },
              { key: "nocturnal", name: "Nocturnal", swatches: ["#14122A", "#E9DFF7", "#C9B8E8", "#F0C64A"] },
              { key: "minty",     name: "Minty",     swatches: ["#EFF8F2", "#1B5240", "#3E2A6E", "#F0C64A"] },
            ]}
          />
        </TweakSection>
        <TweakSection label="Landing">
          <TweakRadio label="Hero layout" value={t.hero} options={["left", "right", "centered"]} onChange={(v) => setTweak("hero", v)} />
          <TweakRadio label="Copy tone" value={t.tone} options={["playful", "clinical"]} onChange={(v) => setTweak("tone", v)} />
          <TweakRadio label="Illustrations" value={t.illus} options={["on", "off"]} onChange={(v) => setTweak("illus", v)} />
          <TweakRadio label="CTA style" value={t.cta} options={["pill", "outline", "block"]} onChange={(v) => setTweak("cta", v)} />
        </TweakSection>
        <TweakSuggestionBar suggestions={[
          "Try the nocturnal palette",
          "Show me hero centered with clinical copy",
          "What if the whole site was mint green?",
          "Add a compare-with-melatonin section",
          "Give me more testimonials",
        ]} />
      </TweaksPanel>
    </RouterProvider>
  );
}

function PaletteSwatches({ value, onChange, options }) {
  return (
    <div style={{ display: "grid", gap: 8, padding: "10px 14px" }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#e9e8ea", opacity: 0.7 }}>Color mood</label>
      <div style={{ display: "flex", gap: 10 }}>
        {options.map(opt => {
          const active = value === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onChange(opt.key)}
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 12,
                border: active ? "2px solid #C9B8E8" : "2px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                cursor: "pointer",
                display: "grid",
                gap: 6,
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", gap: 3, height: 32 }}>
                <div style={{ flex: 2, background: opt.swatches[0], borderRadius: 4 }}></div>
                <div style={{ display: "grid", flex: 1, gap: 3 }}>
                  {opt.swatches.slice(1, 4).map((c, j) => (
                    <div key={j} style={{ background: c, borderRadius: 3, flex: 1 }}></div>
                  ))}
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: "#e9e8ea" }}>{opt.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Router switch */
function Router({ tone }) {
  const { path } = useRoute();
  const isPreorder = ["/preorder", "/consult", "/address", "/confirmation"].includes(path);
  const isAdmin = path.startsWith("/admin");
  if (isAdmin) return <Admin />;
  if (isPreorder) return <Preorder />;
  return <Landing tone={tone} />;
}

/* Mount */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
