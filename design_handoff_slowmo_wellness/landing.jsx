/* ---------- Slow Mo Landing Page ---------- */
const { useState: useStateL, useEffect: useEffectL } = React;

function Landing({ tone = "playful" }) {
  const { navigate } = useRoute();
  return (
    <>
      <Nav />
      <Hero tone={tone} />
      <TrustBar />
      <Benefits tone={tone} />
      <HowItWorks tone={tone} />
      <Ingredients tone={tone} />
      <SleepQuiz />
      <Testimonials />
      <FAQ tone={tone} />
      <Footer />
    </>
  );
}

/* ---------------- HERO ---------------- */
function Hero({ tone }) {
  const { navigate } = useRoute();
  const heading = tone === "clinical"
    ? <>Clinically prepared <span className="accent">Vijaya extract</span> for restorative sleep.</>
    : <>Take one, <span className="accent">take it slow.</span></>;
  const sub = tone === "clinical"
    ? "An Ayurvedic proprietary medicine, prescribed by our in-house physicians. 30-gummy course, mixed berry, non-habit forming."
    : "Slow nights, brighter days. A daily gummy of Ayurvedic Vijaya extract to help you unwind, sleep deeper, and wake up feeling like yourself again.";
  return (
    <section className="hero" id="product">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow" style={{ marginBottom: 24 }}>✧ Preorders open · Ships from Oct 2026</div>
            <h1 className="display">{heading}</h1>
            <p className="hero-sub">{sub}</p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => navigate("/preorder")}>
                Preorder now <Icon.ArrowRight />
              </button>
              <div className="hero-price">
                <span className="label">Launch price</span>
                <span className="strike">₹3,890</span>
                <span className="now">₹3,390</span>
              </div>
            </div>
            <div style={{ marginTop: 32 }}>
              <AyushBadge />
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 16, fontSize: 13, color: "var(--ink-3)", flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon.Check /> Cash on delivery</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon.Check /> Doctor consult included</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon.Check /> Free delivery</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-blob"></div>
            <Sparkles items={[
              { top: "8%", left: "4%", size: 18 },
              { top: "20%", left: "88%", size: 14 },
              { top: "62%", left: "94%", size: 20 },
              { top: "80%", left: "6%", size: 16 },
              { top: "40%", left: "-2%", size: 12 },
            ]} />
            <img className="hero-pouch" src="assets/slowmo-pouch.png" alt="Slow Mo pouch" />
            <div className="hero-badge-float" style={{ top: "12%", right: "-2%" }}>
              <span style={{ fontSize: 18 }}>🌙</span> Slower nights
            </div>
            <div className="hero-badge-float" style={{ bottom: "16%", left: "-4%" }}>
              <span style={{ fontSize: 18 }}>☀️</span> Brighter days
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TRUST BAR ---------------- */
function TrustBar() {
  const items = [
    { icon: <Icon.Leaf />, label: "Ayurvedic formulation" },
    { icon: <Icon.Smile />, label: "Non-habit forming" },
    { icon: <Icon.Sprout />, label: "Natural ingredients" },
    { icon: <Icon.Moon />, label: "Prescribed wellness" },
  ];
  return (
    <section className="trust-bar">
      <div className="container">
        <div className="trust-inner">
          {items.map((it, i) => (
            <div key={i} className="trust-item">
              <div className="trust-item-icon">{it.icon}</div>
              <span>{it.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- BENEFITS ---------------- */
function Benefits({ tone }) {
  const items = [
    {
      icon: <BenefitIllus type="calm" />,
      title: "Calm mind",
      desc: tone === "clinical"
        ? "Vijaya cannabinoids interact with CB1 receptors to reduce over-arousal and quiet the racing-thoughts loop."
        : "The kind of quiet where your shoulders finally come down and to-do lists lose their volume.",
    },
    {
      icon: <BenefitIllus type="sleep" />,
      title: "Deep sleep",
      desc: tone === "clinical"
        ? "Improves sleep latency and non-REM sleep duration without next-day sedation, per pilot data."
        : "Fall asleep like a stone. Wake up like a sunrise. No 3AM stares at the ceiling.",
    },
    {
      icon: <BenefitIllus type="balance" />,
      title: "Balanced you",
      desc: tone === "clinical"
        ? "Traditional Ayurvedic use for vata pacification, supporting nervous-system homeostasis over a 30-day course."
        : "The version of you that says yes to the walk, no to the fifth coffee, and means both.",
    },
  ];
  return (
    <section className="section" id="benefits">
      <div className="container">
        <div className="section-header">
          <div className="eyebrow">Why Slow Mo</div>
          <h2 style={{ marginTop: 12 }}>Good sleep is a <em style={{ color: "var(--purple)", fontStyle: "italic", fontWeight: 400 }}>superpower</em>.</h2>
        </div>
        <div className="benefits-grid">
          {items.map((b, i) => (
            <div key={i} className="benefit-card">
              <div className="benefit-icon">{b.icon}</div>
              <h3>{b.title}</h3>
              <p>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitIllus({ type }) {
  if (type === "calm") return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M11 15c1 1.5 2 2 5 2s4-.5 5-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
  if (type === "sleep") return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M25 18a9 9 0 1 1-11-11 7 7 0 0 0 11 11z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <circle cx="10" cy="8" r="1" fill="currentColor"/>
      <circle cx="6" cy="14" r="0.8" fill="currentColor"/>
    </svg>
  );
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <path d="M16 4v24M8 12h16M8 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

/* ---------------- HOW IT WORKS ---------------- */
function HowItWorks({ tone }) {
  const steps = [
    { n: "01", title: "Talk to a sleep specialist", desc: "A 15-min consult with our Ayurvedic physician to understand your sleep pattern." },
    { n: "02", title: "Get a wellness program", desc: "Tailored to your needs. Optional — skip it if you'd rather not.", tag: "Skippable" },
    { n: "03", title: "Get your prescription", desc: "Digital Rx signed by our physician. Dosage and duration set for you." },
    { n: "04", title: "Wellness at your doorstep", desc: "COD, free delivery, discreet packaging. Right to your door." },
  ];
  return (
    <section className="section section-purple" id="how">
      <div className="container">
        <div className="section-header">
          <div className="eyebrow">How it works</div>
          <h2 style={{ marginTop: 12 }}>Because sleep isn't a supplement — <br/>it's a prescription.</h2>
          <p>Four steps from preorder to your first slow night.</p>
        </div>
        <div className="steps steps-4">
          {steps.map((s, i) => (
            <div key={i} className="step">
              <div className="step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {s.tag && <div style={{ display: "inline-block", marginTop: 10, padding: "3px 10px", background: "var(--sun)", color: "var(--purple-deep)", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: "0.04em" }}>{s.tag}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- INGREDIENTS ---------------- */
function Ingredients({ tone }) {
  return (
    <section className="section" id="science">
      <div className="container">
        <div className="ing-grid">
          <div>
            <div className="eyebrow">The plant</div>
            <h2 style={{ marginTop: 12 }}>Vijaya extract.<br/><em style={{ color: "var(--purple)", fontStyle: "italic", fontWeight: 400 }}>Ancient tech.</em></h2>
            <p style={{ marginTop: 24, fontSize: 17, color: "var(--ink-2)" }}>
              Used in Ayurveda for 3,000 years for insomnia, anxiety, and pain. We cold-extract from small-batch, single-origin plants grown in the foothills of Himachal — never isolate, never synthetic.
            </p>
            <div className="ing-stats">
              <div className="ing-stat">
                <div className="ing-stat-num">3.5mg</div>
                <div className="ing-stat-label">Standardised Vijaya extract per gummy</div>
              </div>
              <div className="ing-stat">
                <div className="ing-stat-num">30</div>
                <div className="ing-stat-label">Day course. One gummy nightly, 45 min before bed.</div>
              </div>
              <div className="ing-stat">
                <div className="ing-stat-num">0</div>
                <div className="ing-stat-label">Sugar. Artificial flavour. Melatonin. Habit.</div>
              </div>
            </div>
          </div>
          <div className="ing-visual">
            <Sparkles items={[
              { top: "12%", left: "18%", size: 14 },
              { top: "72%", left: "82%", size: 18 },
              { top: "22%", left: "78%", size: 12 },
            ]} />
            <IngIllus />
          </div>
        </div>
      </div>
    </section>
  );
}

function IngIllus() {
  // Hemp plant botanical diagram — palmate compound leaves + stem, no flower
  const leaflet = (rot, len = 90, w = 22, cx = 200, cy = 200, color = "#1B5240") => (
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
      <path
        d={`M 0 0 Q ${-w} ${-len*0.35} ${-w*0.5} ${-len*0.75} Q 0 ${-len} ${w*0.5} ${-len*0.75} Q ${w} ${-len*0.35} 0 0 Z`}
        fill={color}
      />
      {/* central vein */}
      <line x1="0" y1="0" x2="0" y2={-len + 4} stroke="#0a2a20" strokeWidth="0.8" opacity="0.5"/>
      {/* serrations - little tick marks */}
      {[0.2, 0.4, 0.6, 0.8].map(t => (
        <React.Fragment key={t}>
          <path d={`M ${-w*0.5*Math.sin(Math.PI*t)} ${-len*t} l -2 -3`} stroke="#0a2a20" strokeWidth="0.6" opacity="0.4" fill="none"/>
          <path d={`M ${w*0.5*Math.sin(Math.PI*t)} ${-len*t} l 2 -3`} stroke="#0a2a20" strokeWidth="0.6" opacity="0.4" fill="none"/>
        </React.Fragment>
      ))}
    </g>
  );
  return (
    <svg viewBox="0 0 400 400" width="82%" style={{ maxWidth: 440 }}>
      <defs>
        <linearGradient id="stemGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a7859"/>
          <stop offset="100%" stopColor="#8A5A3B"/>
        </linearGradient>
      </defs>

      {/* Main stem */}
      <path d="M 200 350 Q 198 280 200 210 Q 202 150 200 80" stroke="url(#stemGrad)" strokeWidth="5" strokeLinecap="round" fill="none"/>

      {/* Lower pair of side leaves (compound, 5 leaflets each) — LEFT */}
      <g transform="translate(200 280)">
        <line x1="0" y1="0" x2="-45" y2="20" stroke="#4a7859" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      {/* left lower compound leaf, center at (155, 300) */}
      {leaflet(-90 - 40, 55, 14, 155, 300, "#1B5240")}
      {leaflet(-90 - 20, 65, 16, 155, 300, "#0F3B2E")}
      {leaflet(-90,      75, 18, 155, 300, "#1B5240")}
      {leaflet(-90 + 20, 65, 16, 155, 300, "#0F3B2E")}
      {leaflet(-90 + 40, 55, 14, 155, 300, "#1B5240")}

      {/* right lower compound leaf */}
      <g transform="translate(200 280)">
        <line x1="0" y1="0" x2="45" y2="20" stroke="#4a7859" strokeWidth="2.5" strokeLinecap="round"/>
      </g>
      {leaflet(-90 - 40, 55, 14, 245, 300, "#0F3B2E")}
      {leaflet(-90 - 20, 65, 16, 245, 300, "#1B5240")}
      {leaflet(-90,      75, 18, 245, 300, "#0F3B2E")}
      {leaflet(-90 + 20, 65, 16, 245, 300, "#1B5240")}
      {leaflet(-90 + 40, 55, 14, 245, 300, "#0F3B2E")}

      {/* middle pair — larger */}
      <g transform="translate(200 210)">
        <line x1="0" y1="0" x2="-55" y2="10" stroke="#4a7859" strokeWidth="3" strokeLinecap="round"/>
        <line x1="0" y1="0" x2="55" y2="10" stroke="#4a7859" strokeWidth="3" strokeLinecap="round"/>
      </g>
      {/* left middle — 7 leaflets */}
      {leaflet(-90 - 60, 55, 14, 140, 220, "#1B5240")}
      {leaflet(-90 - 40, 75, 18, 140, 220, "#0F3B2E")}
      {leaflet(-90 - 20, 95, 22, 140, 220, "#1B5240")}
      {leaflet(-90,      110, 24, 140, 220, "#0F3B2E")}
      {leaflet(-90 + 20, 95, 22, 140, 220, "#1B5240")}
      {leaflet(-90 + 40, 75, 18, 140, 220, "#0F3B2E")}
      {leaflet(-90 + 60, 55, 14, 140, 220, "#1B5240")}
      {/* right middle */}
      {leaflet(-90 - 60, 55, 14, 260, 220, "#0F3B2E")}
      {leaflet(-90 - 40, 75, 18, 260, 220, "#1B5240")}
      {leaflet(-90 - 20, 95, 22, 260, 220, "#0F3B2E")}
      {leaflet(-90,      110, 24, 260, 220, "#1B5240")}
      {leaflet(-90 + 20, 95, 22, 260, 220, "#0F3B2E")}
      {leaflet(-90 + 40, 75, 18, 260, 220, "#1B5240")}
      {leaflet(-90 + 60, 55, 14, 260, 220, "#0F3B2E")}

      {/* top compound leaf — pointing up */}
      {leaflet(-90 - 55, 50, 12, 200, 100, "#1B5240")}
      {leaflet(-90 - 35, 70, 16, 200, 100, "#0F3B2E")}
      {leaflet(-90 - 15, 90, 20, 200, 100, "#1B5240")}
      {leaflet(-90 + 5,  90, 20, 200, 100, "#0F3B2E")}
      {leaflet(-90 + 25, 70, 16, 200, 100, "#1B5240")}
      {leaflet(-90 + 45, 50, 12, 200, 100, "#0F3B2E")}

      {/* botanical label ticks */}
      <line x1="90" y1="220" x2="60" y2="220" stroke="#0F3B2E" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5"/>
      <text x="20" y="217" fontSize="9" fill="#0F3B2E" opacity="0.6" fontFamily="var(--font-mono)">FIG. 01</text>
      <text x="20" y="228" fontSize="8" fill="#0F3B2E" opacity="0.5" fontFamily="var(--font-mono)">Palmate leaf</text>

      <line x1="310" y1="290" x2="345" y2="290" stroke="#0F3B2E" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5"/>
      <text x="345" y="287" fontSize="9" fill="#0F3B2E" opacity="0.6" fontFamily="var(--font-mono)">Vijaya</text>
      <text x="345" y="298" fontSize="7" fill="#0F3B2E" opacity="0.5" fontFamily="var(--font-mono)">C. sativa</text>
    </svg>
  );
}

/* ---------------- SLEEP QUIZ ---------------- */
function SleepQuiz() {
  const questions = [
    { q: "When do you struggle most?", opts: ["Falling asleep", "Staying asleep", "Waking up refreshed", "Racing thoughts at night"] },
    { q: "How often does it happen?", opts: ["A few nights a week", "Most nights", "Every night", "It comes and goes"] },
    { q: "What have you tried?", opts: ["Melatonin", "Ashwagandha / chamomile", "Meditation apps", "Nothing yet"] },
  ];
  const [step, setStep] = useStateL(0);
  const [answers, setAnswers] = useStateL([[], [], []]);
  const done = step >= questions.length;
  const { navigate } = useRoute();

  const toggle = (i) => {
    const next = answers.map(a => [...a]);
    const cur = next[step];
    const idx = cur.indexOf(i);
    if (idx === -1) cur.push(i); else cur.splice(idx, 1);
    setAnswers(next);
  };

  return (
    <section className="section section-cream">
      <div className="container">
        <div className="section-header">
          <div className="eyebrow">Sleep assessment</div>
          <h2 style={{ marginTop: 12 }}>Two minutes. <em style={{ color: "var(--purple)", fontStyle: "italic", fontWeight: 400 }}>Better nights.</em></h2>
          <p>Answer three questions. We'll tell you if Slow Mo is a fit — and what our doctor might suggest.</p>
        </div>
        <div className="quiz-card">
          {!done ? (
            <>
              <div className="quiz-progress">
                {questions.map((_, i) => (
                  <div key={i} className={`quiz-dot ${i <= step ? "active" : ""}`} />
                ))}
              </div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>Question {step + 1} of {questions.length} · <span style={{ color: "var(--ink-3)", letterSpacing: 0, textTransform: "none", fontWeight: 500 }}>Select all that apply</span></div>
              <div className="quiz-q">{questions[step].q}</div>
              <div className="quiz-options">
                {questions[step].opts.map((opt, i) => {
                  const selected = answers[step].includes(i);
                  return (
                    <button
                      key={i}
                      className={`quiz-option ${selected ? "selected" : ""}`}
                      onClick={() => toggle(i)}
                    >
                      <div className="quiz-option-bullet quiz-option-box">
                        {selected && <Icon.Check style={{ width: 12, height: 12, color: "white" }} />}
                      </div>
                      {opt}
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, gap: 12 }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setStep(Math.max(0, step - 1))}
                  style={{ visibility: step === 0 ? "hidden" : "visible" }}
                >
                  ← Back
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setStep(step + 1)}
                  disabled={answers[step].length === 0}
                  style={{ opacity: answers[step].length === 0 ? 0.4 : 1 }}
                >
                  {step === questions.length - 1 ? "See results" : "Next"} <Icon.ArrowRight />
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--lavender-soft)", display: "grid", placeItems: "center", margin: "0 auto 24px", color: "var(--purple)" }}>
                <Icon.Check />
              </div>
              <h3>Slow Mo looks like a fit.</h3>
              <p style={{ marginTop: 12, color: "var(--ink-2)" }}>Based on your answers, our physician will likely recommend a 30-day course. Book your free consult when you preorder.</p>
              <button className="btn btn-primary btn-lg" style={{ marginTop: 24 }} onClick={() => navigate("/preorder")}>
                Preorder & book consult <Icon.ArrowRight />
              </button>
              <div><button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => { setStep(0); setAnswers([[], [], []]); }}>Retake</button></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ---------------- TESTIMONIALS + WAITLIST ---------------- */
function Testimonials() {
  const testis = [
    { quote: "I stopped counting my 3AM ceiling tiles. That's the whole review.", name: "Ananya R.", role: "Product designer, Bengaluru", i: "A" },
    { quote: "My Oura score jumped 14 points in three weeks. My wife noticed before I did.", name: "Vikram S.", role: "Founder, Mumbai", i: "V" },
    { quote: "The consult made the difference. Felt like actual medicine, not a wellness meme.", name: "Priya M.", role: "Radiologist, Delhi", i: "P" },
  ];
  return (
    <section className="section section-forest">
      <div className="container">
        <div className="section-header">
          <div className="eyebrow" style={{ color: "var(--sun)" }}>Early access</div>
          <div className="wait-counter">
            <span className="wait-num">2,847</span>
            <span className="wait-label">people already pre-ordered</span>
          </div>
          <p style={{ color: "rgba(246,242,232,0.75)" }}>From our closed beta with 300 early sleepers, Aug–Sep 2026.</p>
        </div>
        <div className="testi-grid">
          {testis.map((t, i) => (
            <div key={i} className="testi-card">
              <div style={{ display: "flex", gap: 2, marginBottom: 16, color: "var(--sun)" }}>
                {[0,1,2,3,4].map(s => <Icon.Star key={s} />)}
              </div>
              <blockquote>"{t.quote}"</blockquote>
              <div className="testi-meta">
                <div className="testi-avatar">{t.i}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ({ tone }) {
  const { navigate } = useRoute();
  const items = [
    { q: "Is Vijaya extract legal in India?", a: "Yes. Vijaya (cannabis sativa) leaves and extracts are permitted for medicinal use under the Ayurvedic pharmacopoeia and the NDPS Act. Slow Mo is manufactured in a licensed AYUSH facility and is dispensed only against a prescription issued by our physicians." },
    { q: "Why do I need a consult?", a: "Because sleep is contextual. The consult (15 minutes, free with preorder) lets our physician confirm dosage and rule out interactions. You can skip it — but we recommend it for your first course." },
    { q: "Will it get me high?", a: "No. Vijaya extract is standardised for therapeutic effect, not psychoactivity. It's non-habit forming and does not cause next-day sedation at recommended dose." },
    { q: "When will my order ship?", a: "Preorders placed now begin dispatch in October 2026, after your consult and prescription. Delivery is COD, free across India, in discreet packaging." },
    { q: "Can I get a refund?", a: "Yes — full refund within 7 days if unopened. Once the course is opened, we don't refund partial packs (regulatory reasons) but we will replace defective units, no questions." },
    { q: "Is it prescription-required?", a: "Yes. Slow Mo is an Ayurvedic proprietary medicine, dispensed strictly against a valid prescription. Every order includes one; you don't need to arrange this separately." },
  ];
  const [open, setOpen] = useStateL(0);
  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-header">
          <div className="eyebrow">Straight answers</div>
          <h2 style={{ marginTop: 12 }}>The questions everyone asks.</h2>
        </div>
        <div className="faq-list">
          {items.map((it, i) => (
            <div key={i} className={`faq-item ${open === i ? "open" : ""}`}>
              <div className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{it.q}</span>
                <span className="faq-plus">+</span>
              </div>
              <div className="faq-a">{it.a}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 56 }}>
          <p style={{ color: "var(--ink-3)", marginBottom: 16 }}>Still have questions?</p>
          <button className="btn btn-outline" onClick={() => navigate("/preorder")}>
            Preorder & talk to a doctor <Icon.ArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Landing });
