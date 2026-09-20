import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AyushBadge } from "../components/AyushBadge";
import { Footer } from "../components/Footer";
import { Icon } from "../components/icons";
import { Nav } from "../components/Nav";
import { Sparkles } from "../components/Sparkles";
import { emptyAnswers, QUIZ_QUESTIONS, quizDone, toggleAnswer } from "../lib/quiz";
import pouchImage from "../assets/slowmo-pouch.png";

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
            <img className="hero-pouch" src={pouchImage} alt="Slow Mo pouch" />
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

function BenefitIllus({ type }: { type: "calm" | "sleep" | "balance" }) {
  if (type === "calm") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
        <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2" />
        <path d="M11 15c1 1.5 2 2 5 2s4-.5 5-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "sleep") {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
        <path
          d="M25 18a9 9 0 1 1-11-11 7 7 0 0 0 11 11z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="8" r="1" fill="currentColor" />
        <circle cx="6" cy="14" r="0.8" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M16 4v24M8 12h16M8 20h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function Benefits() {
  const items = [
    {
      type: "calm" as const,
      title: "Calm mind",
      desc: "The kind of quiet where your shoulders finally come down and to-do lists lose their volume.",
    },
    {
      type: "sleep" as const,
      title: "Deep sleep",
      desc: "Fall asleep like a stone. Wake up like a sunrise. No 3AM stares at the ceiling.",
    },
    {
      type: "balance" as const,
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
                <BenefitIllus type={item.type} />
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

function IngLeaflet({
  rot,
  len,
  w,
  cx,
  cy,
  color,
}: {
  rot: number;
  len: number;
  w: number;
  cx: number;
  cy: number;
  color: string;
}) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
      <path
        d={`M 0 0 Q ${-w} ${-len * 0.35} ${-w * 0.5} ${-len * 0.75} Q 0 ${-len} ${w * 0.5} ${-len * 0.75} Q ${w} ${-len * 0.35} 0 0 Z`}
        fill={color}
      />
      <line x1="0" y1="0" x2="0" y2={-len + 4} stroke="#0a2a20" strokeWidth="0.8" opacity="0.5" />
      {[0.2, 0.4, 0.6, 0.8].map((t) => (
        <g key={t}>
          <path
            d={`M ${-w * 0.5 * Math.sin(Math.PI * t)} ${-len * t} l -2 -3`}
            stroke="#0a2a20"
            strokeWidth="0.6"
            opacity="0.4"
            fill="none"
          />
          <path
            d={`M ${w * 0.5 * Math.sin(Math.PI * t)} ${-len * t} l 2 -3`}
            stroke="#0a2a20"
            strokeWidth="0.6"
            opacity="0.4"
            fill="none"
          />
        </g>
      ))}
    </g>
  );
}

function IngIllus() {
  return (
    <svg viewBox="0 0 400 400" width="78%" className="max-w-[400px]" aria-hidden>
      <defs>
        <linearGradient id="ing-stem-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a7859" />
          <stop offset="100%" stopColor="#8A5A3B" />
        </linearGradient>
      </defs>

      <g transform="translate(208 205) scale(0.86) translate(-200 -200)">
        <path
          d="M 200 350 Q 198 280 200 210 Q 202 150 200 80"
          stroke="url(#ing-stem-grad)"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />

        <g transform="translate(200 280)">
          <line x1="0" y1="0" x2="-45" y2="20" stroke="#4a7859" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <IngLeaflet rot={-130} len={55} w={14} cx={155} cy={300} color="#1B5240" />
        <IngLeaflet rot={-110} len={65} w={16} cx={155} cy={300} color="#0F3B2E" />
        <IngLeaflet rot={-90} len={75} w={18} cx={155} cy={300} color="#1B5240" />
        <IngLeaflet rot={-70} len={65} w={16} cx={155} cy={300} color="#0F3B2E" />
        <IngLeaflet rot={-50} len={55} w={14} cx={155} cy={300} color="#1B5240" />

        <g transform="translate(200 280)">
          <line x1="0" y1="0" x2="45" y2="20" stroke="#4a7859" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <IngLeaflet rot={-130} len={55} w={14} cx={245} cy={300} color="#0F3B2E" />
        <IngLeaflet rot={-110} len={65} w={16} cx={245} cy={300} color="#1B5240" />
        <IngLeaflet rot={-90} len={75} w={18} cx={245} cy={300} color="#0F3B2E" />
        <IngLeaflet rot={-70} len={65} w={16} cx={245} cy={300} color="#1B5240" />
        <IngLeaflet rot={-50} len={55} w={14} cx={245} cy={300} color="#0F3B2E" />

        <g transform="translate(200 210)">
          <line x1="0" y1="0" x2="-55" y2="10" stroke="#4a7859" strokeWidth="3" strokeLinecap="round" />
          <line x1="0" y1="0" x2="55" y2="10" stroke="#4a7859" strokeWidth="3" strokeLinecap="round" />
        </g>
        <IngLeaflet rot={-150} len={55} w={14} cx={140} cy={220} color="#1B5240" />
        <IngLeaflet rot={-130} len={75} w={18} cx={140} cy={220} color="#0F3B2E" />
        <IngLeaflet rot={-110} len={95} w={22} cx={140} cy={220} color="#1B5240" />
        <IngLeaflet rot={-90} len={110} w={24} cx={140} cy={220} color="#0F3B2E" />
        <IngLeaflet rot={-70} len={95} w={22} cx={140} cy={220} color="#1B5240" />
        <IngLeaflet rot={-50} len={75} w={18} cx={140} cy={220} color="#0F3B2E" />
        <IngLeaflet rot={-30} len={55} w={14} cx={140} cy={220} color="#1B5240" />

        <IngLeaflet rot={-150} len={55} w={14} cx={260} cy={220} color="#0F3B2E" />
        <IngLeaflet rot={-130} len={75} w={18} cx={260} cy={220} color="#1B5240" />
        <IngLeaflet rot={-110} len={95} w={22} cx={260} cy={220} color="#0F3B2E" />
        <IngLeaflet rot={-90} len={110} w={24} cx={260} cy={220} color="#1B5240" />
        <IngLeaflet rot={-70} len={95} w={22} cx={260} cy={220} color="#0F3B2E" />
        <IngLeaflet rot={-50} len={75} w={18} cx={260} cy={220} color="#1B5240" />
        <IngLeaflet rot={-30} len={55} w={14} cx={260} cy={220} color="#0F3B2E" />

        <IngLeaflet rot={-145} len={50} w={12} cx={200} cy={100} color="#1B5240" />
        <IngLeaflet rot={-125} len={70} w={16} cx={200} cy={100} color="#0F3B2E" />
        <IngLeaflet rot={-105} len={90} w={20} cx={200} cy={100} color="#1B5240" />
        <IngLeaflet rot={-85} len={90} w={20} cx={200} cy={100} color="#0F3B2E" />
        <IngLeaflet rot={-65} len={70} w={16} cx={200} cy={100} color="#1B5240" />
        <IngLeaflet rot={-45} len={50} w={12} cx={200} cy={100} color="#0F3B2E" />
      </g>

      <line x1="118" y1="168" x2="72" y2="148" stroke="#0F3B2E" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
      <text x="48" y="142" fontSize="9" fill="#0F3B2E" opacity="0.65" fontFamily="var(--font-mono)">
        FIG. 01
      </text>
      <text x="48" y="154" fontSize="8" fill="#0F3B2E" opacity="0.55" fontFamily="var(--font-mono)">
        Palmate leaf
      </text>

      <line
        x1="286"
        y1="268"
        x2="322"
        y2="286"
        stroke="#0F3B2E"
        strokeWidth="0.8"
        strokeDasharray="2 2"
        opacity="0.5"
      />
      <text x="326" y="284" fontSize="9" fill="#0F3B2E" opacity="0.65" fontFamily="var(--font-mono)">
        Vijaya
      </text>
      <text x="326" y="296" fontSize="7" fill="#0F3B2E" opacity="0.55" fontFamily="var(--font-mono)">
        C. sativa
      </text>
    </svg>
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
            <Sparkles
              items={[
                { top: "12%", left: "18%" },
                { top: "70%", left: "78%" },
                { top: "28%", left: "82%" },
              ]}
            />
            <IngIllus />
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
            Two minutes to a{" "}
            <em style={{ color: "var(--purple)", fontStyle: "italic", fontWeight: 400 }}>better night&apos;s sleep.</em>
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
