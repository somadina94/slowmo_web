import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AyushBadge } from "../components/AyushBadge";
import { Footer } from "../components/Footer";
import { Icon } from "../components/icons";
import { Nav } from "../components/Nav";
import { Sparkles } from "../components/Sparkles";
import { emptyAnswers, QUIZ_QUESTIONS, quizDone, toggleAnswer } from "../lib/quiz";

export function LandingPage() {
  return (
    <>
      <Nav />
      <Hero />
      <TrustBar />
      <Benefits />
      <HowItWorks />
      <Ingredients />
      <SleepQuiz />
      <Testimonials />
      <FAQ />
      <Footer />
    </>
  );
}

export function Hero() {
  const navigate = useNavigate();
  return (
    <section className="hero" id="product">
      <div className="container">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow" style={{ marginBottom: 24 }}>
              ✧ Preorders open · Ships from Oct 2026
            </div>
            <h1 className="display">
              Take one, <span className="accent">take it slow.</span>
            </h1>
            <p className="hero-sub">
              Slow nights, brighter days. A daily gummy of Ayurvedic Vijaya extract to help you unwind, sleep deeper,
              and wake up feeling like yourself again.
            </p>
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
            <div className="mt-8">
              <AyushBadge />
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-[13px] text-[color:var(--ink-3)]">
              <span className="inline-flex items-center gap-1.5">
                <Icon.Check /> Cash on delivery
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon.Check /> Doctor consult included
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Icon.Check /> Free delivery
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-blob" />
            <Sparkles
              items={[
                { top: "8%", left: "4%", size: 18 },
                { top: "20%", left: "88%", size: 14 },
                { top: "62%", left: "94%", size: 20 },
              ]}
            />
            <img className="hero-pouch" src="/assets/slowmo-pouch.png" alt="Slow Mo pouch" />
            <div className="hero-badge-float" style={{ top: "12%", right: "-2%" }}>
              🌙 Slower nights
            </div>
            <div className="hero-badge-float" style={{ bottom: "16%", left: "-4%" }}>
              ☀️ Brighter days
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustBar() {
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
          {items.map((item) => (
            <div key={item.label} className="trust-item">
              <div className="trust-item-icon">{item.icon}</div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Benefits() {
  const items = [
    {
      title: "Calm mind",
      desc: "The kind of quiet where your shoulders finally come down and to-do lists lose their volume.",
    },
    { title: "Deep sleep", desc: "Fall asleep like a stone. Wake up like a sunrise. No 3AM stares at the ceiling." },
    {
      title: "Balanced you",
      desc: "The version of you that says yes to the walk, no to the fifth coffee, and means both.",
    },
  ];
  return (
    <section className="section" id="benefits">
      <div className="container">
        <div className="section-header">
          <div className="eyebrow">Why Slow Mo</div>
          <h2 className="mt-3">
            Good sleep is a <em style={{ color: "var(--purple)", fontStyle: "italic", fontWeight: 400 }}>superpower</em>
            .
          </h2>
        </div>
        <div className="benefits-grid">
          {items.map((item) => (
            <div key={item.title} className="benefit-card">
              <div className="benefit-icon">
                <Icon.Moon />
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Talk to a sleep specialist",
      desc: "A 15-min consult with our Ayurvedic physician to understand your sleep pattern.",
    },
    {
      n: "02",
      title: "Get a wellness program",
      desc: "Tailored to your needs. Optional — skip it if you'd rather not.",
      tag: "Skippable",
    },
    {
      n: "03",
      title: "Get your prescription",
      desc: "Digital Rx signed by our physician. Dosage and duration set for you.",
    },
    {
      n: "04",
      title: "Wellness at your doorstep",
      desc: "COD, free delivery, discreet packaging. Right to your door.",
    },
  ];
  return (
    <section className="section section-purple" id="how">
      <div className="container">
        <div className="section-header">
          <div className="eyebrow">How it works</div>
          <h2 className="mt-3">Because sleep isn't a supplement — it's a prescription.</h2>
          <p>Four steps from preorder to your first slow night.</p>
        </div>
        <div className="steps steps-4">
          {steps.map((step) => (
            <div key={step.n} className="step">
              <div className="step-num">{step.n}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
              {step.tag && (
                <div className="mt-2.5 inline-block rounded-full bg-[color:var(--sun)] px-2.5 py-0.5 text-[11px] font-bold text-[color:var(--purple-deep)]">
                  {step.tag}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Ingredients() {
  return (
    <section className="section" id="science">
      <div className="container">
        <div className="ing-grid">
          <div>
            <div className="eyebrow">The plant</div>
            <h2 className="mt-3">
              Vijaya extract.
              <br />
              <em style={{ color: "var(--purple)", fontStyle: "italic", fontWeight: 400 }}>Ancient tech.</em>
            </h2>
            <p className="mt-6 text-[17px] text-[color:var(--ink-2)]">
              Used in Ayurveda for 3,000 years for insomnia, anxiety, and pain. We cold-extract from small-batch,
              single-origin plants grown in the foothills of Himachal — never isolate, never synthetic.
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
            <Sparkles items={[{ top: "12%", left: "18%" }]} />
            <svg viewBox="0 0 400 400" width="82%" className="max-w-[440px]">
              <path d="M 200 350 Q 198 280 200 80" stroke="#4a7859" strokeWidth="5" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SleepQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(emptyAnswers);
  const navigate = useNavigate();
  const done = quizDone(step);
  return (
    <section className="section section-cream">
      <div className="container">
        <div className="section-header">
          <div className="eyebrow">Sleep assessment</div>
          <h2 className="mt-3">
            Two minutes.{" "}
            <em style={{ color: "var(--purple)", fontStyle: "italic", fontWeight: 400 }}>Better nights.</em>
          </h2>
        </div>
        <div className="quiz-card">
          {!done ? (
            <>
              <div className="quiz-progress">
                {QUIZ_QUESTIONS.map((_, i) => (
                  <div key={i} className={`quiz-dot ${i <= step ? "active" : ""}`} />
                ))}
              </div>
              <div className="quiz-q">{QUIZ_QUESTIONS[step].q}</div>
              <div className="quiz-options">
                {QUIZ_QUESTIONS[step].opts.map((opt, i) => {
                  const selected = answers[step].includes(i);
                  return (
                    <button
                      key={opt}
                      className={`quiz-option ${selected ? "selected" : ""}`}
                      onClick={() => setAnswers(toggleAnswer(answers, step, i))}
                    >
                      <div className="quiz-option-bullet quiz-option-box">{selected && <Icon.Check />}</div>
                      {opt}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ visibility: step === 0 ? "hidden" : "visible" }}
                  onClick={() => setStep(step - 1)}
                >
                  ← Back
                </button>
                <button
                  className="btn btn-primary"
                  disabled={answers[step].length === 0}
                  onClick={() => setStep(step + 1)}
                >
                  {step === 2 ? "See results" : "Next"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <h3>Slow Mo looks like a fit.</h3>
              <button className="btn btn-primary btn-lg mt-6" onClick={() => navigate("/preorder")}>
                Preorder & book consult
              </button>
              <div>
                <button
                  className="btn btn-ghost btn-sm mt-3"
                  onClick={() => {
                    setStep(0);
                    setAnswers(emptyAnswers());
                  }}
                >
                  Retake
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const items = [
    {
      quote: "I stopped counting my 3AM ceiling tiles. That's the whole review.",
      name: "Ananya R.",
      role: "Product designer, Bengaluru",
      i: "A",
    },
    {
      quote: "My Oura score jumped 14 points in three weeks. My wife noticed before I did.",
      name: "Vikram S.",
      role: "Founder, Mumbai",
      i: "V",
    },
    {
      quote: "The consult made the difference. Felt like actual medicine, not a wellness meme.",
      name: "Priya M.",
      role: "Radiologist, Delhi",
      i: "P",
    },
  ];
  return (
    <section className="section section-forest">
      <div className="container">
        <div className="section-header">
          <div className="eyebrow" style={{ color: "var(--sun)" }}>
            Early access
          </div>
          <div className="wait-counter">
            <span className="wait-num">2,847</span>
            <span className="wait-label">people already pre-ordered</span>
          </div>
        </div>
        <div className="testi-grid">
          {items.map((item) => (
            <div key={item.name} className="testi-card">
              <div className="mb-4 flex gap-0.5 text-[color:var(--sun)]">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Icon.Star key={star} />
                ))}
              </div>
              <blockquote>"{item.quote}"</blockquote>
              <div className="testi-meta">
                <div className="testi-avatar">{item.i}</div>
                <div>
                  <div className="testi-name">{item.name}</div>
                  <div className="testi-role">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  const [open, setOpen] = useState(0);
  const navigate = useNavigate();
  const items = [
    {
      q: "Is Vijaya extract legal in India?",
      a: "Yes. Vijaya (cannabis sativa) leaves and extracts are permitted for medicinal use under the Ayurvedic pharmacopoeia and the NDPS Act.",
    },
    {
      q: "Why do I need a consult?",
      a: "Because sleep is contextual. The consult lets our physician confirm dosage and rule out interactions.",
    },
    { q: "Will it get me high?", a: "No. Vijaya extract is standardised for therapeutic effect, not psychoactivity." },
    {
      q: "When will my order ship?",
      a: "Preorders placed now begin dispatch in October 2026, after your consult and prescription.",
    },
    { q: "Can I get a refund?", a: "Yes — full refund within 7 days if unopened." },
    {
      q: "Is it prescription-required?",
      a: "Yes. Slow Mo is an Ayurvedic proprietary medicine, dispensed strictly against a valid prescription.",
    },
  ];
  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-header">
          <div className="eyebrow">Straight answers</div>
          <h2 className="mt-3">The questions everyone asks.</h2>
        </div>
        <div className="faq-list">
          {items.map((item, index) => (
            <div key={item.q} className={`faq-item ${open === index ? "open" : ""}`}>
              <div className="faq-q" onClick={() => setOpen(open === index ? -1 : index)}>
                <span>{item.q}</span>
                <span className="faq-plus">+</span>
              </div>
              <AnimatePresence>
                {open === index && (
                  <motion.div
                    className="faq-a"
                    style={{ maxHeight: 500, paddingTop: 16 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {item.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <button className="btn btn-outline" onClick={() => navigate("/preorder")}>
            Preorder & talk to a doctor
          </button>
        </div>
      </div>
    </section>
  );
}
