/* ---------- Slow Mo Preorder / Checkout Flow ---------- */
const { useState: useStateP } = React;

/* pack pricing (per your spec: 10 / 15 / 30 pack) */
const PACKS = {
  10: { qty: 10, price: 3390, mrp: 3890, label: "Starter",  desc: "10-day trial course" },
  15: { qty: 15, price: 4990, mrp: 5790, label: "Ritual",   desc: "15-day balanced course" },
  30: { qty: 30, price: 8990, mrp: 11390, label: "Restore", desc: "30-day full course · Best value" },
};

const WELLNESS_PROGRAMS = [
  { key: "sleep30",    name: "Sleep 30",     desc: "A 30-day guided sleep reset — daily audio, sleep journal, weekly check-in.",   dur: "30 days", icon: "🌙" },
  { key: "deep-rest",  name: "Deep Rest",    desc: "Focus on unwinding the nervous system — breathwork, evening yoga, doctor calls.", dur: "60 days", icon: "🌿" },
  { key: "slow-year",  name: "Slow Year",    desc: "Year-long companion — quarterly consults, seasonal protocols, community access.", dur: "12 months", icon: "✧" },
];

function Preorder() {
  const { path, navigate } = useRoute();
  const [order, setOrder] = useStateP(() => {
    const defaults = {
      qty: 10,
      program: null, programSkipped: false,
      consultDate: null, consultSlot: null, consultName: "", consultPhone: "", consultEmail: "", consultReason: "",
      rxUploaded: false, rxFileName: "",
      name: "", phone: "", email: "", address: "", city: "", pincode: "", state: "Karnataka",
      payment: "cod",
    };
    try { return { ...defaults, ...(JSON.parse(localStorage.getItem("slowmo_order") || "null") || {}) }; }
    catch { return defaults; }
  });
  const update = (patch) => {
    const next = { ...order, ...patch };
    setOrder(next);
    localStorage.setItem("slowmo_order", JSON.stringify(next));
  };

  const step =
    path === "/preorder" ? 1 :
    path === "/program"  ? 2 :
    path === "/consult"  ? 3 :
    path === "/address"  ? 4 :
    path === "/confirmation" ? 5 : 1;

  return (
    <>
      <Nav />
      <div className="checkout-shell">
        <div className="container">
          {step < 5 && <ProgressBar step={step} />}
          {step === 1 && <StepProduct order={order} update={update} />}
          {step === 2 && <StepProgram order={order} update={update} />}
          {step === 3 && <StepConsult order={order} update={update} />}
          {step === 4 && <StepAddress order={order} update={update} />}
          {step === 5 && <StepConfirmation order={order} />}
        </div>
      </div>
      <Footer />
    </>
  );
}

function ProgressBar({ step }) {
  const steps = [
    { n: 1, label: "Product" },
    { n: 2, label: "Program" },
    { n: 3, label: "Consult" },
    { n: 4, label: "Address & Pay" },
  ];
  return (
    <div className="checkout-progress">
      {steps.map((s, i) => (
        <React.Fragment key={s.n}>
          <div className={`cp-step ${step === s.n ? "active" : step > s.n ? "done" : ""}`}>
            <div className="cp-step-num">{step > s.n ? <Icon.Check /> : s.n}</div>
            <span>{s.label}</span>
          </div>
          {i < steps.length - 1 && <div className="cp-line" />}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ---------------- STEP 1: PRODUCT (10 / 15 / 30 pack) ---------------- */
function StepProduct({ order, update }) {
  const { navigate } = useRoute();
  const packs = Object.values(PACKS);
  return (
    <div className="checkout-grid">
      <div className="checkout-main">
        <div className="eyebrow">Preorder · Ships Oct 2026</div>
        <h2 style={{ marginTop: 12, marginBottom: 16 }}>Slow Mo<br/><em style={{ color: "var(--purple)", fontStyle: "italic", fontWeight: 400 }}>wellness gummies.</em></h2>
        <p style={{ color: "var(--ink-2)", marginBottom: 24 }}>
          Mixed-berry gummies · 3.5mg Vijaya extract each · Ayurvedic proprietary medicine, prescription use only.
        </p>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
          <div className="tag tag-forest">Ayurvedic</div>
          <div className="tag">Non-habit</div>
          <div className="tag tag-berry">Mixed berry</div>
          <div className="tag tag-sun">Prescription</div>
        </div>

        <h4 style={{ marginBottom: 8 }}>Choose your course</h4>
        <div className="qty-select">
          {packs.map(p => {
            const save = p.mrp - p.price;
            return (
              <div key={p.qty} className={`qty-option ${order.qty === p.qty ? "selected" : ""}`} onClick={() => update({ qty: p.qty })}>
                <div className="qty">{p.qty} pack</div>
                <div className="qty-label">{p.desc}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 6, color: "var(--forest)" }}>₹{p.price.toLocaleString("en-IN")}</div>
                {save > 0 && <div className="qty-save">Save ₹{save.toLocaleString("en-IN")}</div>}
              </div>
            );
          })}
        </div>

        <div style={{ background: "var(--lavender-soft)", padding: 20, borderRadius: 16, display: "flex", gap: 16, marginTop: 24 }}>
          <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: "50%", background: "var(--purple)", color: "var(--cream)", display: "grid", placeItems: "center" }}>
            <Icon.Phone />
          </div>
          <div style={{ fontSize: 14 }}>
            <strong style={{ color: "var(--purple)" }}>Free doctor consult included.</strong> A 15-min call with our Ayurvedic physician to confirm your prescription — or upload your own if you already have one.
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg"
          style={{ marginTop: 32, width: "100%", justifyContent: "center" }}
          onClick={() => navigate("/program")}
        >
          Continue to wellness program <Icon.ArrowRight />
        </button>
      </div>

      <OrderSummary order={order} />
    </div>
  );
}

/* ---------------- STEP 2: WELLNESS PROGRAM (skippable) ---------------- */
function StepProgram({ order, update }) {
  const { navigate } = useRoute();
  return (
    <div className="checkout-grid">
      <div className="checkout-main">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
          <div className="eyebrow">Step 2 of 4</div>
          <div style={{ padding: "3px 10px", background: "var(--sun)", color: "var(--purple-deep)", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: "0.04em" }}>Skippable</div>
        </div>
        <h2 style={{ marginTop: 12, marginBottom: 8 }}>Pick a wellness program.</h2>
        <p style={{ color: "var(--ink-2)", marginBottom: 32 }}>
          A structured plan alongside your gummies. Guided by our physicians. Optional — you can skip this step if you'd rather not.
        </p>

        <div style={{ display: "grid", gap: 12 }}>
          {WELLNESS_PROGRAMS.map(p => (
            <div
              key={p.key}
              onClick={() => update({ program: p.key, programSkipped: false })}
              style={{
                padding: 24,
                border: `1.5px solid ${order.program === p.key ? "var(--purple)" : "var(--line)"}`,
                borderRadius: 20,
                background: order.program === p.key ? "var(--lavender-soft)" : "var(--white)",
                cursor: "pointer",
                display: "grid",
                gridTemplateColumns: "56px 1fr auto",
                gap: 20,
                alignItems: "center",
                transition: "all 0.15s",
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 16, background: order.program === p.key ? "var(--purple)" : "var(--cream-2)", display: "grid", placeItems: "center", fontSize: 26 }}>
                {p.icon}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 600, color: "var(--forest)" }}>{p.name}</span>
                  <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{p.dur}</span>
                </div>
                <div style={{ fontSize: 14, color: "var(--ink-2)", marginTop: 4 }}>{p.desc}</div>
              </div>
              <div style={{
                width: 24, height: 24, borderRadius: "50%",
                border: `1.5px solid ${order.program === p.key ? "var(--purple)" : "var(--ink-3)"}`,
                background: order.program === p.key ? "var(--purple)" : "transparent",
                display: "grid", placeItems: "center", color: "white",
              }}>
                {order.program === p.key && <Icon.Check style={{ width: 14, height: 14 }} />}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 40, flexWrap: "wrap" }}>
          <button
            className="btn btn-primary btn-lg"
            style={{ flex: 1, minWidth: 200, justifyContent: "center" }}
            onClick={() => navigate("/consult")}
            disabled={!order.program}
          >
            Continue <Icon.ArrowRight />
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => { update({ program: null, programSkipped: true }); navigate("/consult"); }}
          >
            Skip program →
          </button>
        </div>
        <p style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 16 }}>
          You can always add or change your program later from your account.
        </p>
      </div>

      <OrderSummary order={order} />
    </div>
  );
}

/* ---------------- STEP 3: CONSULT BOOKING (not skippable, Rx upload option) ---------------- */
function StepConsult({ order, update }) {
  const { navigate } = useRoute();

  const [mode, setMode] = useStateP(order.rxUploaded ? "rx" : "book"); // "book" | "rx"
  const canProceed = mode === "book"
    ? (order.consultName && order.consultPhone && order.consultEmail)
    : order.rxUploaded;

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (f) update({ rxUploaded: true, rxFileName: f.name });
  };

  return (
    <div className="checkout-grid">
      <div className="checkout-main">
        <div className="eyebrow">Step 3 of 4 · Required</div>
        <h2 style={{ marginTop: 12, marginBottom: 8 }}>Talk to a specialist —<br/><em style={{ color: "var(--purple)", fontStyle: "italic", fontWeight: 400 }}>or upload a prescription.</em></h2>
        <p style={{ color: "var(--ink-2)", marginBottom: 24 }}>
          Vijaya extract is a prescription-only Ayurvedic medicine. Either book a consult with our physician or share an existing Rx — one of these is required to dispatch your order.
        </p>

        {/* Mode tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: 4, background: "var(--cream-2)", borderRadius: 14, marginBottom: 28 }}>
          <button
            onClick={() => setMode("book")}
            style={{
              padding: "12px 16px", borderRadius: 10,
              background: mode === "book" ? "var(--white)" : "transparent",
              color: mode === "book" ? "var(--forest)" : "var(--ink-3)",
              fontWeight: 600, fontSize: 14,
              boxShadow: mode === "book" ? "var(--shadow-soft)" : "none",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <Icon.Phone /> Book a consult
          </button>
          <button
            onClick={() => setMode("rx")}
            style={{
              padding: "12px 16px", borderRadius: 10,
              background: mode === "rx" ? "var(--white)" : "transparent",
              color: mode === "rx" ? "var(--forest)" : "var(--ink-3)",
              fontWeight: 600, fontSize: 14,
              boxShadow: mode === "rx" ? "var(--shadow-soft)" : "none",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <Icon.Download style={{ transform: "rotate(180deg)" }} /> Upload prescription
          </button>
        </div>

        {mode === "book" ? (
          <>
            <div style={{ padding: 20, background: "var(--lavender-soft)", borderRadius: 16, marginBottom: 28, display: "flex", gap: 16 }}>
              <div style={{ flexShrink: 0, width: 48, height: 48, borderRadius: "50%", background: "var(--purple)", color: "var(--cream)", display: "grid", placeItems: "center", fontFamily: "var(--font-rounded)", fontWeight: 700 }}>M</div>
              <div style={{ flex: 1, fontSize: 14, color: "var(--purple-deep)" }}>
                <strong style={{ fontSize: 15 }}>Dr. Meera Iyer, BAMS</strong>
                <div style={{ marginTop: 4, opacity: 0.75 }}>Ayurvedic sleep specialist · 12 years · Registered #KA-AYU-2014</div>
                <div style={{ marginTop: 6 }}>Our team will call within <strong>24 hours</strong> on your preferred number to schedule a 15-min consult.</div>
              </div>
            </div>

            <h4 style={{ marginBottom: 12 }}>Your details</h4>
            <div className="field-row">
              <div className="field">
                <label>Full name</label>
                <input type="text" placeholder="Priya Sharma" value={order.consultName} onChange={(e) => update({ consultName: e.target.value })} />
              </div>
              <div className="field">
                <label>Phone (WhatsApp preferred)</label>
                <input type="tel" placeholder="+91 98765 43210" value={order.consultPhone} onChange={(e) => update({ consultPhone: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label>Email</label>
              <input type="email" placeholder="you@email.com" value={order.consultEmail} onChange={(e) => update({ consultEmail: e.target.value })} />
            </div>
            <div className="field">
              <label>What's the main sleep issue you'd like to address? <span style={{ opacity: 0.5 }}>(optional)</span></label>
              <textarea rows="3" placeholder="e.g. Trouble falling asleep, wake up at 3AM, racing thoughts…" value={order.consultReason} onChange={(e) => update({ consultReason: e.target.value })} />
            </div>

            <h4 style={{ marginTop: 24, marginBottom: 12 }}>Preferred time to call <span style={{ fontSize: 12, fontWeight: 500, color: "var(--ink-3)" }}>(optional)</span></h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {["Morning (9AM–12PM)", "Afternoon (12–5PM)", "Evening (5–9PM)"].map(w => (
                <button
                  key={w}
                  className={`slot ${order.consultSlot === w ? "selected" : ""}`}
                  onClick={() => update({ consultSlot: w })}
                >{w}</button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div style={{ padding: 20, background: "var(--cream-2)", borderRadius: 16, marginBottom: 24, fontSize: 14, color: "var(--ink-2)" }}>
              Already have a prescription for Vijaya extract or a similar Ayurvedic sleep aid? Upload it and our physician will verify — no consult needed.
            </div>

            <label style={{
              display: "block", padding: "48px 24px", border: `2px dashed ${order.rxUploaded ? "var(--forest)" : "var(--line)"}`,
              borderRadius: 20, background: order.rxUploaded ? "rgba(26, 122, 79, 0.06)" : "var(--white)",
              textAlign: "center", cursor: "pointer", transition: "all 0.15s",
            }}>
              <input type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={onFile} />
              {order.rxUploaded ? (
                <>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#1a7a4f", color: "var(--cream)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
                    <Icon.Check />
                  </div>
                  <div style={{ fontWeight: 600, color: "var(--forest)" }}>Prescription uploaded</div>
                  <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 6, fontFamily: "var(--font-mono)" }}>{order.rxFileName}</div>
                  <div style={{ fontSize: 12, color: "var(--purple)", marginTop: 12, textDecoration: "underline" }}>Replace file</div>
                </>
              ) : (
                <>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--lavender-soft)", color: "var(--purple)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                  <div style={{ fontWeight: 600, color: "var(--forest)" }}>Drag and drop, or click to upload</div>
                  <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 6 }}>PDF, JPG or PNG · up to 10 MB</div>
                </>
              )}
            </label>

            <div style={{ marginTop: 16, padding: 14, background: "rgba(240, 198, 74, 0.15)", borderRadius: 12, fontSize: 12, color: "#8a6b1a", display: "flex", gap: 10 }}>
              <span style={{ fontSize: 16 }}>⚠</span>
              <span>Prescriptions are verified by our physician within 24 hrs. If we can't verify, we'll offer you a free consult instead — no charge.</span>
            </div>
          </>
        )}

        <button
          className="btn btn-primary btn-lg"
          style={{ marginTop: 32, width: "100%", justifyContent: "center", opacity: canProceed ? 1 : 0.5, cursor: canProceed ? "pointer" : "not-allowed" }}
          onClick={() => canProceed && navigate("/address")}
        >
          Continue <Icon.ArrowRight />
        </button>
        <p style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 12, textAlign: "center" }}>
          Consult or prescription is required — we can't ship without it (regulatory).
        </p>
      </div>

      <OrderSummary order={order} />
    </div>
  );
}

/* ---------------- STEP 4: ADDRESS + PAY ---------------- */
function StepAddress({ order, update }) {
  const { navigate } = useRoute();
  const canSubmit = order.name && order.phone && order.address && order.city && order.pincode;
  const submit = () => {
    if (!canSubmit) return;
    const id = "SM-" + Date.now().toString().slice(-6).toUpperCase();
    update({ orderId: id, placedAt: new Date().toISOString() });
    navigate("/confirmation");
  };
  const p = PACKS[order.qty] || PACKS[10];
  return (
    <div className="checkout-grid">
      <div className="checkout-main">
        <div className="eyebrow">Step 4 of 4</div>
        <h2 style={{ marginTop: 12, marginBottom: 24 }}>Where should we send it?</h2>

        <div className="field-row">
          <div className="field">
            <label>Full name</label>
            <input type="text" placeholder="Priya Sharma" value={order.name} onChange={(e) => update({ name: e.target.value })} />
          </div>
          <div className="field">
            <label>Phone</label>
            <input type="tel" placeholder="+91 98765 43210" value={order.phone} onChange={(e) => update({ phone: e.target.value })} />
          </div>
        </div>

        <div className="field">
          <label>Email <span style={{ opacity: 0.5 }}>(for order updates)</span></label>
          <input type="email" placeholder="you@email.com" value={order.email} onChange={(e) => update({ email: e.target.value })} />
        </div>

        <div className="field">
          <label>Address</label>
          <textarea rows="3" placeholder="Flat 402, Green Meadows, 12th Main, Indiranagar" value={order.address} onChange={(e) => update({ address: e.target.value })} />
        </div>

        <div className="field-row">
          <div className="field">
            <label>City</label>
            <input type="text" placeholder="Bengaluru" value={order.city} onChange={(e) => update({ city: e.target.value })} />
          </div>
          <div className="field">
            <label>PIN code</label>
            <input type="text" placeholder="560038" value={order.pincode} onChange={(e) => update({ pincode: e.target.value })} />
          </div>
        </div>

        <div className="field">
          <label>State</label>
          <select value={order.state} onChange={(e) => update({ state: e.target.value })}>
            {["Karnataka","Maharashtra","Delhi","Tamil Nadu","Telangana","Kerala","West Bengal","Uttar Pradesh","Gujarat","Rajasthan"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        <h4 style={{ margin: "32px 0 16px" }}>Payment method</h4>
        <div className={`pay-option ${order.payment === "cod" ? "selected" : ""}`} onClick={() => update({ payment: "cod" })}>
          <div className="pay-radio"></div>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--sun)", display: "grid", placeItems: "center", color: "var(--forest)" }}><Icon.Cash /></div>
          <div className="pay-body">
            <div className="pay-title">Cash on Delivery</div>
            <div className="pay-sub">Pay when your pouch arrives. Available across India.</div>
          </div>
          <div className="pay-badge">Recommended</div>
        </div>
        <div className={`pay-option ${order.payment === "prepaid" ? "selected" : ""}`} onClick={() => update({ payment: "prepaid" })} style={{ opacity: 0.6 }}>
          <div className="pay-radio"></div>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--lavender-soft)", display: "grid", placeItems: "center", color: "var(--purple)" }}><Icon.Card /></div>
          <div className="pay-body">
            <div className="pay-title">UPI / Card / NetBanking</div>
            <div className="pay-sub">Coming soon — we'll email you once payment gateway is live.</div>
          </div>
        </div>

        <button
          className="btn btn-primary btn-lg"
          style={{ marginTop: 32, width: "100%", justifyContent: "center", opacity: canSubmit ? 1 : 0.5, cursor: canSubmit ? "pointer" : "not-allowed" }}
          onClick={submit}
        >
          Confirm preorder — ₹{p.price.toLocaleString("en-IN")} <Icon.ArrowRight />
        </button>
        <p style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 16, textAlign: "center" }}>
          By placing this order you confirm you are 21+ and agree to our wellness program terms.
        </p>
      </div>

      <OrderSummary order={order} />
    </div>
  );
}

/* ---------------- STEP 5: CONFIRMATION ---------------- */
function StepConfirmation({ order }) {
  const { navigate } = useRoute();
  const id = order.orderId || "SM-XXXXXX";
  const program = WELLNESS_PROGRAMS.find(p => p.key === order.program);
  const timeline = [
    { title: "Preorder placed", desc: "We've locked in your launch price and slot.", when: "Just now", state: "done" },
    order.rxUploaded
      ? { title: "Prescription received", desc: `${order.rxFileName} — verification in progress`, when: "Within 24 hrs", state: "now" }
      : { title: "Consult scheduled", desc: `We'll call ${order.consultPhone || "you"} to book your consult`, when: order.consultSlot || "Within 24 hrs", state: "now" },
    { title: "Prescription issued", desc: "Digital Rx signed by our physician", when: order.rxUploaded ? "After verification" : "After consult", state: "pending" },
    program
      ? { title: `${program.name} program starts`, desc: program.desc, when: "On delivery", state: "pending" }
      : null,
    { title: "Dispatch", desc: "Free delivery, discreet packaging, COD", when: "Oct 2026", state: "pending" },
  ].filter(Boolean);
  return (
    <div className="confirmation">
      <div className="confetti-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </div>
      <div className="eyebrow">Order confirmed</div>
      <h2 style={{ marginTop: 12, marginBottom: 8 }}>Your slow days start here.</h2>
      <p style={{ color: "var(--ink-2)", fontSize: 17 }}>Thanks {order.name?.split(" ")[0] || "friend"}. We'll call you at {order.phone || "your number"} within 24 hours.</p>
      <div className="order-id">ORDER {id}</div>

      <div className="timeline">
        {timeline.map((t, i) => (
          <div key={i} className="timeline-item">
            <div className={`tl-dot ${t.state}`}>
              {t.state === "done" ? <Icon.Check /> : t.state === "now" ? <span>●</span> : <span>{i + 1}</span>}
            </div>
            <div>
              <div className="tl-title">{t.title}</div>
              <div className="tl-desc">{t.desc}</div>
            </div>
            <div className="tl-time">{t.when}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
        <button className="btn btn-outline" onClick={() => navigate("/")}>Back to home</button>
      </div>
    </div>
  );
}

/* ---------------- ORDER SUMMARY (side panel) ---------------- */
function OrderSummary({ order }) {
  const p = PACKS[order.qty] || PACKS[10];
  const program = WELLNESS_PROGRAMS.find(pr => pr.key === order.program);
  const save = p.mrp - p.price;
  return (
    <aside className="checkout-side">
      <div className="eyebrow">Order summary</div>
      <div className="order-item" style={{ marginTop: 16 }}>
        <div className="order-thumb"><img src="assets/slowmo-pouch.png" alt="pouch" /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>Slow Mo Gummies</div>
          <div style={{ fontSize: 12, color: "var(--ink-3)", margin: "2px 0" }}>{p.qty}-pack · Mixed berry</div>
          <div style={{ fontSize: 13, marginTop: 4 }}><strong>₹{p.price.toLocaleString("en-IN")}</strong></div>
        </div>
      </div>

      {program && (
        <div style={{ padding: 14, background: "var(--white)", borderRadius: 12, marginBottom: 16, display: "flex", gap: 12, alignItems: "center", border: "1px solid var(--line)" }}>
          <div style={{ fontSize: 22 }}>{program.icon}</div>
          <div style={{ flex: 1, fontSize: 13 }}>
            <div style={{ fontWeight: 600, color: "var(--forest)" }}>{program.name}</div>
            <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{program.dur} program</div>
          </div>
          <div style={{ color: "#1a7a4f", fontWeight: 600, fontSize: 12 }}>Free</div>
        </div>
      )}

      <div className="order-totals">
        <div className="order-total-row"><span>Subtotal</span><span>₹{p.mrp.toLocaleString("en-IN")}</span></div>
        {save > 0 && <div className="order-total-row" style={{ color: "var(--berry)" }}><span>Preorder discount</span><span>−₹{save.toLocaleString("en-IN")}</span></div>}
        <div className="order-total-row"><span>Delivery</span><span style={{ color: "#1a7a4f", fontWeight: 600 }}>Free</span></div>
        <div className="order-total-row"><span>Doctor consult</span><span style={{ color: "#1a7a4f", fontWeight: 600 }}>Included</span></div>
        <div className="order-total-row grand"><span>Total</span><span>₹{p.price.toLocaleString("en-IN")}</span></div>
      </div>
      <div style={{ marginTop: 24, padding: 16, background: "var(--white)", borderRadius: 12, fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5 }}>
        <strong style={{ color: "var(--forest)", display: "block", marginBottom: 4 }}>📦 Dispatch schedule</strong>
        Ships from Oct 2026 after consult & prescription. You'll get SMS + email updates at every step.
      </div>
    </aside>
  );
}

Object.assign(window, { Preorder });
