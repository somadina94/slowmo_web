# Handoff: Slow Mo Wellness — Preorder Ecom (V1)

## Overview

Slow Mo is a D2C wellness brand launching Ayurvedic Vijaya-extract gummies for sleep. This handoff covers the **V1 preorder phase** — the customer-facing storefront + preorder checkout flow, plus an internal-only admin dashboard for the operations team.

The site's job is to convert warm traffic (Instagram, referrals, PR) into preorders while:
- Communicating that this is a **prescription-only Ayurvedic medicine** (soft trust-building, not scary compliance)
- Capturing enough information to complete a doctor consult or verify an existing prescription before dispatch
- Giving the founding team clear operational visibility (orders, consult queue, dispatch, revenue, inventory)

## About the Design Files

The files in this bundle are **design references created in HTML** — a working React-inside-HTML prototype that shows the intended look, copy, layout, interactions, and state transitions. **They are not production code to copy directly.**

The task is to **recreate these designs in the target codebase's existing environment** using its established patterns:
- If shipping in **Next.js / Remix / plain React**, port the JSX components 1:1 into the app's file structure, replacing localStorage state with real API calls and swapping the hash router for the framework's router.
- If shipping in **Shopify / Wix / a headless CMS**, treat the mocks as the source of truth for layout, typography, and color; wire products / orders / customers to the platform's data model.
- If **no environment exists yet**, Next.js 14+ (App Router) + Tailwind + a serverless DB (Supabase or PlanetScale) is the recommended stack — it maps cleanly to the components in this bundle and supports the admin dashboard, file uploads, and COD workflow without extra infra.

The admin dashboard is **internal-only** — it should live at a subdomain (e.g. `admin.slowmo.co`) or a protected route with staff auth, never linked from the customer site.

## Fidelity

**High-fidelity (hifi).** These mocks are final for V1 in terms of:
- Copy (every string)
- Colors (exact hex values documented below)
- Typography (Fraunces display / DM Sans body / Baloo 2 logo / JetBrains Mono for codes)
- Spacing, radii, shadows, layout grids
- Interaction states (hover, active, selected, disabled)
- Sequencing of the preorder flow

The developer should recreate the UI **pixel-perfectly** using the target codebase's component library, replacing the raw CSS classes with the framework's styling primitives (styled-components, Tailwind, CSS modules, etc.) but preserving the visual output.

## Screens / Views

### CUSTOMER-FACING SITE (`/`)

#### 1. Nav (`components.jsx → Nav`)
- **Purpose**: Persistent top navigation across the customer site.
- **Layout**: Sticky top, `backdrop-filter: blur(12px)`, cream background at 88% opacity. Max-width 1440px, 24px horizontal padding, 16px vertical.
- **Left**: Logo — the sleeping-sloth SVG mark (`MoonMark` in `components.jsx`) + `slow mo` wordmark (Baloo 2, 800 weight, 26px) with a `™` superscript.
- **Center** (hidden < 960px): Four anchor links — "The product", "Science", "How it works", "FAQ". DM Sans 14px, weight 500, color `--ink-2` (#3d4b45), hover → `--forest` (#0F3B2E).
- **Right**: Primary CTA button — "Preorder — ₹3,390" with right-arrow icon. Small pill (padding 10px 18px), background `--forest`, text `--cream`.
- **Admin is NOT linked here.** Staff reach admin via a separate URL only.

#### 2. Hero (`landing.jsx → Hero`)
- **Purpose**: Convert on first scroll. Communicate product, price, and prescription-required nature.
- **Layout**: 2-column grid, `1.05fr 0.95fr`, 48px gap, 48px top / 96px bottom padding. Below 960px → stacks to 1 column.
- **Left column**:
  - Eyebrow tag: "✧ Preorders open · Ships from Oct 2026" — purple, 12px, letter-spacing 0.16em, uppercase.
  - Headline: "Take one, take it slow." in Fraunces, clamp(56px, 9vw, 112px), line-height 0.92. "take it slow." is italic in purple (`#3E2A6E`).
  - Sub: 19px DM Sans, `--ink-2`, max-width 480px: "Slow nights, brighter days. A daily gummy of Ayurvedic Vijaya extract to help you unwind, sleep deeper, and wake up feeling like yourself again."
  - CTA row: Primary button "Preorder now →" (18px, padded 20px 36px, background `--forest`) + a price stack on its right (small label "LAUNCH PRICE" / strikethrough ₹3,890 / Fraunces ₹3,390 in `--forest`), separated by a 2px left border.
  - **AYUSH badge** (`AyushBadge` component): rounded pill, white background, `--line` border, 8px padding. Contains a 28px circular AYUSH-style leaf mark (yellow disc, green leaf) + a two-line label: tiny uppercase "CERTIFIED BY" over "Ministry of AYUSH" (weight 700).
  - Trust icons row (below badge): "✓ Cash on delivery · ✓ Doctor consult included · ✓ Free delivery" in 13px `--ink-3`.
- **Right column** (hero visual):
  - The **pouch image** (`assets/slowmo-pouch.png`) at 92% width, with a drop-shadow: `0 30px 50px rgba(62,42,110,0.25)`.
  - A radial-gradient **lavender blob** behind the pouch (blur 20px).
  - Two **floating badges** absolutely positioned: "🌙 Slower nights" (top-right) and "☀️ Brighter days" (bottom-left). White pill, `--line` border, `--shadow-soft`.
  - Five **twinkling SVG sparkles** (purple, 50% opacity, `twinkle` animation — 3s ease-in-out infinite, keyframes at 0/100% opacity 0.3 scale 1, 50% opacity 0.8 scale 1.2). Positions: top-left, top-right, mid-right, bottom-left, mid-left.

#### 3. Trust bar (`landing.jsx → TrustBar`)
- **Purpose**: Reinforce credibility with 4 badges pulled from the pouch design.
- **Layout**: Full-width band, `--cream-2` background, 28px vertical padding, 1px `--line` top+bottom border. 4-column grid (2 cols on mobile).
- **Each item**: 40px circular icon in `--lavender-soft` background with `--purple` glyph, plus a 14px label in `--forest`, weight 500. Icons: Leaf (`Icon.Leaf`), Smile (`Icon.Smile`), Sprout (`Icon.Sprout`), Moon (`Icon.Moon`).
- Labels (in order): "Ayurvedic formulation", "Non-habit forming", "Natural ingredients", "Prescribed wellness".

#### 4. Benefits (`landing.jsx → Benefits`)
- **Purpose**: Communicate the 3 core outcomes.
- **Section**: 96px vertical padding. Centered header — eyebrow "Why Slow Mo", h2 "Good sleep is a *superpower*." (Fraunces, "superpower" in italic purple). **No tagline paragraph.**
- **Grid**: 3 cards, 24px gap. Card background colors alternate: lavender (`--lavender-soft`), warm sand (#E8DCC9), sage (#DCE7DE). Rounded 28px, 40px vertical / 32px horizontal padding.
- **Each card**: 64px rounded-20px white icon tile with a custom SVG (`BenefitIllus`), h3 title, 15px DM Sans description in `--ink-2`.
- Content:
  1. **Calm mind** — "The kind of quiet where your shoulders finally come down and to-do lists lose their volume."
  2. **Deep sleep** — "Fall asleep like a stone. Wake up like a sunrise. No 3AM stares at the ceiling."
  3. **Balanced you** — "The version of you that says yes to the walk, no to the fifth coffee, and means both."
- Alternate "clinical" tone strings are documented in the source; a `tone` prop swaps them. Ship both.

#### 5. How It Works (`landing.jsx → HowItWorks`)
- **Purpose**: Set expectations for the consult → prescription → delivery flow.
- **Section**: `--purple-deep` (#2A1B4F) background, cream text. Centered header — h2 "Because sleep isn't a supplement — it's a prescription." + sub "Four steps from preorder to your first slow night."
- **4-column grid** (2 cols < 960px, 1 col < 640px), 20px gap.
- **Each step**:
  - 64px circular number badge in `--lavender-soft`, Fraunces 28px in `--purple-deep`.
  - h3 title, opacity-0.8 15px description.
  - Step 2 has a **"Skippable"** tag underneath — sun-yellow (`--sun`) pill, purple text, 11px weight 700 uppercase.
- Steps:
  1. **01 — Talk to a sleep specialist** — "A 15-min consult with our Ayurvedic physician to understand your sleep pattern."
  2. **02 — Get a wellness program** *(Skippable)* — "Tailored to your needs. Optional — skip it if you'd rather not."
  3. **03 — Get your prescription** — "Digital Rx signed by our physician. Dosage and duration set for you."
  4. **04 — Wellness at your doorstep** — "COD, free delivery, discreet packaging. Right to your door."

#### 6. Ingredients / Science (`landing.jsx → Ingredients`)
- **Purpose**: Educate on Vijaya extract sourcing and dosing.
- **Layout**: 2-column, 64px gap. Left: copy + 3-stat vertical list. Right: circular botanical illustration.
- **Left**:
  - Eyebrow "The plant"
  - h2 "Vijaya extract. *Ancient tech.*" ("Ancient tech." italic purple.)
  - Body: "Used in Ayurveda for 3,000 years for insomnia, anxiety, and pain. We cold-extract from small-batch, single-origin plants grown in the foothills of Himachal — never isolate, never synthetic."
  - **3 stats** (grid, 20px gap, each row separated by 1px `--line`):
    - `3.5mg` — Standardised Vijaya extract per gummy
    - `30` — Day course. One gummy nightly, 45 min before bed.
    - `0` — Sugar. Artificial flavour. Melatonin. Habit.
  - Stat numbers are Fraunces 40px weight 500 in `--purple`; labels are 14px `--ink-3` right-aligned max-width 60%.
- **Right — the hemp plant illustration** (`IngIllus` SVG, ~440px max, viewBox 400×400). It's a **botanical diagram of a hemp/cannabis stem with palmate compound leaves — NO flower, NO buds, NO berries.** Structure:
  - Vertical stem (gradient from sage green top to sloth-brown bottom, 5px stroke)
  - **3 tiers** of leaves: two lower side-leaves (5 leaflets each), two middle side-leaves (7 leaflets each, largest), one top leaf (6 leaflets) pointing up
  - Each leaflet is a lens shape with a dark central vein and 4 pairs of tiny serration ticks along the edge
  - Two dashed **botanical labels** ("FIG. 01 / Palmate leaf" on the left, "Vijaya / C. sativa" on the right) in JetBrains Mono at 60% opacity
  - Background: radial gradient from `--lavender-soft` to `--cream-2`, clipped to a circle
  - 3 sparkles overlaid

#### 7. Sleep Quiz (`landing.jsx → SleepQuiz`)
- **Purpose**: Interactive assessment that funnels to the preorder CTA.
- **Section**: `--cream-2` background. Centered header — eyebrow "Sleep assessment", h2 "Two minutes. *Better nights.*"
- **Quiz card**: max-width 640px, white background, 40px rounded, 1px `--line` border, `--shadow-card`, 56px vertical / 48px horizontal padding.
- **Progress**: 3 dots at top, 6px tall, `--line` inactive → `--purple` active.
- **Question header**: "Question X of 3 · Select all that apply" (the "Select all that apply" part is un-styled — sentence case, not letter-spaced).
- **Question text**: Fraunces 28px.
- **Options**: **Multi-select checkboxes** (not radios). Each option is a full-width button: `--cream-2` background, 18/20 padding, 16px rounded, transparent 1.5px border. Selected state: `--lavender-soft` background, `--purple` border. Bullet is a 20×20 **rounded 6px checkbox** (not a circle) — border becomes purple + filled purple on select, with a white checkmark inside.
- **Nav row at bottom**: "← Back" (ghost button, hidden on step 0) on left, "Next →" or "See results →" (primary button, disabled when no options selected) on right.
- Questions (all multi-select):
  1. "When do you struggle most?" — Falling asleep · Staying asleep · Waking up refreshed · Racing thoughts at night
  2. "How often does it happen?" — A few nights a week · Most nights · Every night · It comes and goes
  3. "What have you tried?" — Melatonin · Ashwagandha / chamomile · Meditation apps · Nothing yet
- **Result screen**: 72px lavender check-circle, h3 "Slow Mo looks like a fit.", explanation paragraph, primary CTA "Preorder & book consult →", ghost "Retake" link.

#### 8. Testimonials / Waitlist (`landing.jsx → Testimonials`)
- **Purpose**: Social proof + FOMO.
- **Section**: `--forest` background, cream text.
- **Header**: Eyebrow "Early access" (in `--sun` color), then a giant **wait counter**: Fraunces 96px "2,847" in `--sun`, followed by "people already **pre-ordered**" (16px, opacity 0.7). Sub-paragraph: "From our closed beta with 300 early sleepers, Aug–Sep 2026."
- **3-card testimonial grid**, glass-morphic (background rgba(255,253,246,0.06), 1px 12%-opacity border, 32px rounded, 32px padding).
- Each card: 5 sun-yellow star icons row, Fraunces 20px quote, 40px lavender avatar circle (initial in purple, Baloo 2), name (14px weight 600) + role (12px opacity 0.65).
- Copy:
  1. "I stopped counting my 3AM ceiling tiles. That's the whole review." — Ananya R., Product designer, Bengaluru
  2. "My Oura score jumped 14 points in three weeks. My wife noticed before I did." — Vikram S., Founder, Mumbai
  3. "The consult made the difference. Felt like actual medicine, not a wellness meme." — Priya M., Radiologist, Delhi

#### 9. FAQ (`landing.jsx → FAQ`)
- **Purpose**: Absorb objections around legality, dosing, refunds.
- **Section**: default cream background. Centered header — eyebrow "Straight answers", h2 "The questions everyone asks."
- **List**: max-width 780px. Each item: 24px vertical padding, 1px `--line` bottom border.
- **Question row**: Fraunces 22px weight 500, flex-space-between with a 32px circular `+` button on the right. Clicking rotates the `+` 45° and swaps its background to `--purple`; the answer area's max-height animates from 0 to 500px (0.3s ease).
- **Answer**: 16px `--ink-2`, 16px top padding when open.
- 6 items (verbatim):
  1. Is Vijaya extract legal in India? — Yes. Vijaya (cannabis sativa) leaves and extracts are permitted for medicinal use under the Ayurvedic pharmacopoeia and the NDPS Act. Slow Mo is manufactured in a licensed AYUSH facility and is dispensed only against a prescription issued by our physicians.
  2. Why do I need a consult? — Because sleep is contextual. The consult (15 minutes, free with preorder) lets our physician confirm dosage and rule out interactions. You can skip it — but we recommend it for your first course.
  3. Will it get me high? — No. Vijaya extract is standardised for therapeutic effect, not psychoactivity. It's non-habit forming and does not cause next-day sedation at recommended dose.
  4. When will my order ship? — Preorders placed now begin dispatch in October 2026, after your consult and prescription. Delivery is COD, free across India, in discreet packaging.
  5. Can I get a refund? — Yes — full refund within 7 days if unopened. Once the course is opened, we don't refund partial packs (regulatory reasons) but we will replace defective units, no questions.
  6. Is it prescription-required? — Yes. Slow Mo is an Ayurvedic proprietary medicine, dispensed strictly against a valid prescription. Every order includes one; you don't need to arrange this separately.
- Below the list: "Still have questions?" + outline button "Preorder & talk to a doctor →".

#### 10. Footer (`components.jsx → Footer`)
- **Purpose**: Navigation + compliance statement.
- **Section**: `--forest` background, cream text, 80px top / 32px bottom padding.
- **4-column grid** (`2fr 1fr 1fr 1fr`, gap 48px):
  - **Brand column**: large sleeping-sloth logo (32px), tagline "Plant wisdom for a slower, brighter you. Ayurvedic proprietary medicine. Prescription use only.", two subtle tags ("Made in India", "Ayush licensed").
  - **Shop**: Preorder · Bundles · Track order · Refill program
  - **Company**: About · Science · Journal · Careers
  - **Support**: FAQ · Consult a doctor · Contact · hello@slowmo.co
- **Bottom bar**: 1px 12%-opacity border top, "© 2026 Slow Mo Wellness Pvt Ltd." on left, compliance string on right: "Ayurvedic proprietary medicine · License #AYUSH-KA-24-0912 · Prescription required".

---

### PREORDER FLOW (`preorder.jsx`)

A 4-step wizard, each step at its own hash route. State persists to `localStorage['slowmo_order']` so users can refresh without losing progress.

#### Progress bar (top of every step)
Flex row of pill "steps", each with a numbered/checked circle: Product → Program → Consult → Address & Pay.

- **Active step**: `--forest` background, cream text, weight 500
- **Completed step**: `--lavender-soft` background, `--purple` text, checkmark in the circle
- **Upcoming step**: `--cream-2` background, `--ink-3` text
- 24px lines between steps (12px on mobile)

Every step page uses a 2-column layout: `1.4fr 1fr` grid, 48px gap. Main content on the left in a white card (28px rounded, `--line` border, 40px padding), Order Summary sticky-right.

#### Step 1: Product (`/preorder`)
- Eyebrow "Preorder · Ships Oct 2026"
- h2 "Slow Mo *wellness gummies.*"
- Body copy: "Mixed-berry gummies · 3.5mg Vijaya extract each · Ayurvedic proprietary medicine, prescription use only."
- 4 tags in a row: "Ayurvedic" (forest tag), "Non-habit" (default), "Mixed berry" (berry tag), "Prescription" (sun tag)
- **Course selector — 3 pack options** (3-column grid, 12px gap):
  | Pack | Price | MRP | Save | Label | Desc |
  |------|-------|-----|------|-------|------|
  | **10 pack** | ₹3,390 | ₹3,890 | ₹500 | Starter | 10-day trial course |
  | **15 pack** | ₹4,990 | ₹5,790 | ₹800 | Ritual | 15-day balanced course |
  | **30 pack** | ₹8,990 | ₹11,390 | ₹2,400 | Restore | 30-day full course · Best value |
  - Each option: 16px padding, 16px rounded, 1.5px border. Selected: `--purple` border, `--lavender-soft` background.
  - Content: qty (Fraunces 24px `--forest`), description (12px `--ink-3`), price (14px weight 700 `--forest`), save-badge (11px weight 600 `--berry`)
- Consult callout box (`--lavender-soft` background, 20px padding, 16px rounded, flex row with a 40px purple phone-icon circle): "**Free doctor consult included.** A 15-min call with our Ayurvedic physician to confirm your prescription — or upload your own if you already have one."
- Primary CTA: "Continue to wellness program →" (full-width, large button)

#### Step 2: Wellness Program (`/program`) — **Skippable**
- Eyebrow "Step 2 of 4" + **"Skippable"** sun-yellow badge on the right.
- h2 "Pick a wellness program."
- Sub: "A structured plan alongside your gummies. Guided by our physicians. Optional — you can skip this step if you'd rather not."
- **3 program cards** (vertical stack, 12px gap). Each is 24px padded, 20px rounded, 1.5px border. Layout: `56px 1fr auto` grid. Left: 56px rounded-16px icon tile (emoji), Middle: Fraunces 22px name + 12px duration + 14px description, Right: 24px circular selection indicator.
- Programs:
  | Key | Name | Duration | Icon | Description |
  |-----|------|----------|------|-------------|
  | `sleep30` | **Sleep 30** | 30 days | 🌙 | A 30-day guided sleep reset — daily audio, sleep journal, weekly check-in. |
  | `deep-rest` | **Deep Rest** | 60 days | 🌿 | Focus on unwinding the nervous system — breathwork, evening yoga, doctor calls. |
  | `slow-year` | **Slow Year** | 12 months | ✧ | Year-long companion — quarterly consults, seasonal protocols, community access. |
- Bottom row: Primary "Continue →" (disabled until a program is picked) + Ghost "Skip program →". Skip sets `programSkipped: true` and navigates onward.
- Footer note: "You can always add or change your program later from your account."

#### Step 3: Consult (`/consult`) — **Required**
- Eyebrow "Step 3 of 4 · Required"
- h2 "Talk to a specialist — *or upload a prescription.*"
- Sub: "Vijaya extract is a prescription-only Ayurvedic medicine. Either book a consult with our physician or share an existing Rx — one of these is required to dispatch your order."
- **Segmented tab control** (2 columns, 4px padding, `--cream-2` background, 14px rounded):
  - Tab 1: "📞 Book a consult" (default)
  - Tab 2: "⬆ Upload prescription"
  - Active tab: white background + `--shadow-soft` + `--forest` text.

- **Book a consult tab**:
  - Doctor card at top (`--lavender-soft`, 20px padding, 16px rounded, flex row): 48px purple avatar circle with "M" + text block: "**Dr. Meera Iyer, BAMS** / Ayurvedic sleep specialist · 12 years · Registered #KA-AYU-2014 / Our team will call within **24 hours** on your preferred number to schedule a 15-min consult."
  - Form fields (**this step captures info; there is NO date/slot picker**):
    - Full name (text)
    - Phone (tel, WhatsApp preferred)
    - Email
    - "What's the main sleep issue you'd like to address?" (textarea, optional)
    - Preferred time to call (optional, 3-option segmented picker): Morning (9AM–12PM) · Afternoon (12–5PM) · Evening (5–9PM)
  - Continue is disabled until name + phone + email are filled.

- **Upload prescription tab**:
  - Info box (`--cream-2`, 14px): "Already have a prescription for Vijaya extract or a similar Ayurvedic sleep aid? Upload it and our physician will verify — no consult needed."
  - **Drop zone**: label wrapping a hidden `<input type="file" accept="image/*,.pdf">`. 48px vertical / 24px horizontal padding, 2px dashed border, 20px rounded. Empty state: 56px lavender upload-icon circle, "Drag and drop, or click to upload", subtext "PDF, JPG or PNG · up to 10 MB". Filled state (once file chosen): border → `--forest`, background tinted green, check icon in green, filename in JetBrains Mono, "Replace file" link.
  - Warning callout below (`rgba(240,198,74,0.15)` background, `--sun` text): "⚠ Prescriptions are verified by our physician within 24 hrs. If we can't verify, we'll offer you a free consult instead — no charge."

- **Continue is required** — no "Skip" button. Enabled when EITHER the book-form is valid OR a Rx file is uploaded.
- Below the CTA: "Consult or prescription is required — we can't ship without it (regulatory)."

#### Step 4: Address & Pay (`/address`)
- Eyebrow "Step 4 of 4"
- h2 "Where should we send it?"
- **Form fields**:
  - Row 1: Full name / Phone (2-col)
  - Email (for order updates)
  - Address (textarea, 3 rows)
  - Row 2: City / PIN code (2-col)
  - State (select — Karnataka, Maharashtra, Delhi, Tamil Nadu, Telangana, Kerala, West Bengal, Uttar Pradesh, Gujarat, Rajasthan)
- Field styling: 14/16 padding, 1.5px `--line` border, 12px rounded. Focus: `--purple` border. Labels 13px `--ink-2` weight 500.
- **Payment method** — 2 stacked cards:
  - **Cash on Delivery** (selected by default) — sun-yellow 40px cash icon tile, title + subtitle "Pay when your pouch arrives. Available across India.", "Recommended" badge on the right (sun bg, dark sun text)
  - **UPI / Card / NetBanking** (disabled-look, 60% opacity) — lavender card icon, "Coming soon — we'll email you once payment gateway is live."
  - Selected state: `--purple` border, `--lavender-soft` background, radio filled purple.
- CTA: "Confirm preorder — ₹X,XXX →" (full-width, disabled until required fields filled).
- Below CTA: "By placing this order you confirm you are 21+ and agree to our wellness program terms."

On submit: generate an order ID `SM-XXXXXX` (last 6 of `Date.now()`), stamp `placedAt`, navigate to `/confirmation`.

#### Step 5: Confirmation (`/confirmation`)
- **No progress bar** on this page.
- Centered layout, max-width 640px, 80px top padding.
- 96px lavender circle with a moon icon at top.
- Eyebrow "Order confirmed".
- h2 "Your slow days start here."
- Sub: "Thanks {firstName}. We'll call you at {phone} within 24 hours."
- **Order ID badge**: inline block, `--cream-2` background, JetBrains Mono, 8/20 padding, 8px rounded: "ORDER SM-XXXXXX".
- **Timeline** (white card, `--line` border, 28px rounded, 32px padding, 20px gap between rows). Each row is a 3-col grid `40px 1fr auto`: dot / title+desc / ETA. Timeline items are conditionally rendered:
  1. "Preorder placed" · "We've locked in your launch price and slot." · "Just now" · **done** (forest circle, check)
  2. If Rx uploaded → "Prescription received" · "{filename} — verification in progress" · "Within 24 hrs" · **now** (sun circle, pulsing)
     Else → "Consult scheduled" · "We'll call {phone} to book your consult" · "{preferredTime or 'Within 24 hrs'}" · **now**
  3. "Prescription issued" · "Digital Rx signed by our physician" · "After verification / After consult" · pending
  4. If a program was selected → "{Program name} program starts" · "{program description}" · "On delivery" · pending
  5. "Dispatch" · "Free delivery, discreet packaging, COD" · "Oct 2026" · pending
- Bottom: single outline button "Back to home".

#### Order Summary (sidebar on every checkout step)
Sticky-right card. `--cream-2` background, `--line` border, 28px rounded, 32px padding, `top: 96px`.
- Eyebrow "Order summary"
- **Line item**: 80px rounded-16px lavender thumb with the pouch image, product name "Slow Mo Gummies", meta "{qty}-pack · Mixed berry", price (14px weight 700).
- **If wellness program selected** — separate white card row with the emoji icon, program name, "{duration} program" subtitle, "Free" in green on right.
- **Totals stack**:
  - Subtotal (MRP)
  - "Preorder discount" (berry color, negative)
  - Delivery: "Free" (green)
  - Doctor consult: "Included" (green)
  - **Total** (grand row: 18px weight 700 `--forest`, 1px top border, 12px top padding)
- Dispatch note at bottom (14px in a white card): "📦 Dispatch schedule — Ships from Oct 2026 after consult & prescription. You'll get SMS + email updates at every step."

---

### ADMIN DASHBOARD (`admin.jsx`) — Internal Only

**Access**: This dashboard is for the operations team only. It should not be linked from the customer-facing site. Serve it under a protected route (`admin.slowmo.co` or `/admin/*` behind staff auth). All 7 sub-routes should require a logged-in staff user.

#### Layout shell
- 2-column grid `240px 1fr`, min-height 100vh, `#F9F7F0` background (or `#0E0C22` in nocturnal palette).
- **Left sidebar** (`--forest` background, cream text, sticky-full-height):
  - Logo (Baloo 2, 22px, cream): sloth mark + "slow mo™"
  - Nav list (10/14 padding, 10px rounded per row): icon + label, active row has `rgba(246,242,232,0.15)` background + weight 600, hover `rgba(...,0.08)`.
    - **Home**: Overview
    - **Cart**: Orders — badge "12"
    - **Phone**: Consult queue — badge "4"
    - **Truck**: Dispatch
    - Section label "Insights"
    - **Chart**: Analytics
    - **Users**: Customers
    - **Box**: Inventory
  - User pill at bottom-left: 32px lavender avatar "M", "Meera Iyer" / "Founder".
- **Main area**: 32px vertical / 40px horizontal padding.

Every page has a header row: title on the left (h1 32px, optional eyebrow date + subtitle), action buttons on the right.

#### Overview (`/admin` or `/admin/overview`)
- **Header**: Eyebrow "Wed 12 Sep · 9:41 AM" / h1 "Good morning, Meera." / sub "You have **4 consults** today and **12 orders** awaiting confirmation." Right: search pill (280px min-width) + primary "New order" button.
- **Revenue panel** (the marquee element, replaces the old single revenue KPI):
  - Full-width dark gradient card: `linear-gradient(135deg, var(--forest) 0%, var(--purple-deep) 100%)`, cream text, no border.
  - Left: eyebrow "Revenue · {rangeLabel}" (lavender color) + huge Fraunces 56px number + delta pill + "{orders} orders · Avg {AOV}"
  - Right: **4-tab segmented control** with a dark inner-shadow track: **Today · 7 days · 1 month · Lifetime**. Active tab is a sun-yellow pill (`--sun` bg, `--forest` text). Rest are transparent, cream text.
  - Below: a mini bar chart at the bottom of the card (60px tall, sun→lavender gradient bars, radius 3px).
  - Data by range:
    | Range | Value | Delta | Orders | AOV |
    |-------|-------|-------|--------|-----|
    | Today | ₹1.42L | ↑ +18% | 34 | ₹4,180 |
    | 7 days | ₹9.42L | ↑ +41% | 247 | ₹3,814 |
    | 30 days | ₹38.6L | ↑ +62% | 1,042 | ₹3,708 |
    | Lifetime | ₹1.24Cr | since Aug 2026 | 3,218 | ₹3,854 |
- **KPI grid** (4 cards, 20px gap, white background, `--line` border, 20px rounded, 24px padding):
  - Preorders (7d): 247 · ↑ +34%
  - Consults booked: 184 · ↑ +12%
  - COD success rate: 87% · ↓ −3% (down = berry color)
  - Avg order value: ₹3,814 · ↑ +8%
  - Each card: uppercase label (12px `--ink-3` letter-spaced), Fraunces 40px value, delta chip.
- **Two-column row** (2fr 1fr, 24px gap):
  - Left: **Preorders over time** — 14-day bar chart. Panel with header "Preorders over time" + three range tag-buttons "14d / 30d / All". Chart is 220px tall flex-end, 8px gap, gradient bars purple→lavender, 6/6/0/0 radius.
  - Right: **Top cities** — panel listing 7 cities with a small 24px lavender flag chip (2-letter code), city name, horizontal bar showing volume, count. Cities: Bengaluru 42 · Mumbai 35 · Delhi 31 · Hyderabad 24 · Chennai 20 · Pune 17 · Kolkata 12.
- **Recent orders panel** — a table of the 5 most recent orders (see Orders schema below), with "View all →" link.

#### Orders (`/admin/orders`)
- Header: h1 "Orders" + "{count} orders · Preorder phase". Right: "Export CSV", "New order".
- **Filter chip row**: All / Pending consult / Confirmed / Dispatched / Delivered / On hold. Active chip is `--forest` filled, others are default gray tag.
- **Table** (in a bordered white panel, no inner padding):
  - Columns: Order (SM-XXXXXX in JetBrains Mono + placed-at below in `--ink-3`), Customer (weight 600), City (muted), Qty ("Nx"), Total (weight 600), Payment (sun tag "COD"), Status (colored pill), actions (⋯ button).
  - Row hover: `--cream-2` background.
  - Status pill: 4/10 padding, 999 rounded, weight 600, 12px, with a 6px colored dot prefix. Colors:
    - Pending consult → sun background, sun-brown text (`#8a6b1a`)
    - Confirmed → purple 12% background, purple text
    - Dispatched → green 12% background, `#1a7a4f` text
    - Delivered → forest 12% background, forest text
    - On hold → berry 12% background, berry text
- Sample 8-order dataset provided in source.

#### Consult Queue (`/admin/consults`)
- Header: h1 "Consult queue" + "4 calls scheduled today · Dr. Meera Iyer". Right: "Reschedule", "Start next call" (primary).
- **Today panel**: header "Today · Sep 12" + "4 of 4 remaining". Below: 4 stacked cards, each a 3-col grid `80px 1fr auto`, 20px padding, cream background, `--line` border, 16px rounded:
  - Left: Time in Fraunces 22px (hour) + AM/PM below
  - Middle: name (15px weight 600) + order ID (JetBrains Mono muted) + phone (13px `--ink-2`) + intake note (12px italic `--ink-3`)
  - Right: 2 buttons — outline "Reschedule" + primary "Call now"
- 4 consult entries provided.
- **Prescriptions issued panel**: table with columns Order · Patient · Rx code · Dosage · Duration · Status. 3 sample rows.

#### Dispatch (`/admin/dispatch`)
- Header: h1 "Dispatch" + "Via Delhivery · 9 in transit · Avg 2.3 days". Right: "AWB manifest", "Schedule pickup".
- **Kanban board** — 4 columns, 16px gap, each column `--cream-2` background, 16px padding, 16px rounded, 400px min-height:
  - **Packed** (sun) · **Picked up** (lavender) · **In transit** (brown) · **Delivered** (green)
  - Column header: colored dot + label on left, count pill on right.
  - Cards: white 12px rounded, `--line` border, 14px padding, 10px bottom margin. Content: JetBrains Mono order ID (muted), customer name (weight 600), meta "{city} · {time ago}" (11px muted).
- Sample data: 2 packed, 2 picked, 3 transit, 2 delivered.

#### Analytics (`/admin/analytics`)
- Header: h1 "Analytics" + "Last 7 days · Preorder phase". Right: "Filters", "Export".
- **4 KPI cards** (same style as overview): Total revenue ₹9.42L / Avg order value ₹3,814 / Conversion rate 1.98% / Repeat rate 24%.
- **2-column row**:
  - **Preorder funnel** (left): 6 horizontal bars with label + count + pct. Bar is 10px tall, filled with `linear-gradient(to right, var(--forest), var(--purple))`. Steps: Landing visitors 12,480 (100%) → Sleep quiz started 4,230 (34%) → Quiz completed 2,810 (22%) → Preorder started 892 (7%) → Address entered 512 (4.1%) → Order placed 247 (2.0%)
  - **Traffic sources** (right): 5 horizontal bars with a colored square dot and counts: Instagram (berry) 4,120 33% · Organic (forest) 3,240 26% · Direct (purple) 2,510 20% · Google Ads (sun) 1,610 13% · Referral (brown) 1,000 8%
- **Geography panel** — 4-column grid of state cards (16px padding, cream bg, 12px rounded). Each: state name (12px muted), Fraunces 28px count, thin purple progress bar. 8 states: Karnataka 68, Maharashtra 52, Delhi NCR 41, Tamil Nadu 32, Telangana 28, Kerala 18, Gujarat 15, West Bengal 12.

#### Customers (`/admin/customers`)
- Header: h1 "Customers" + "412 total · 89 enrolled in wellness program". Right: search + "Export".
- **Table**: Customer (36px lavender avatar + name/email stack), City, Orders, Total spent, Program (tag), Joined, actions.
- 5 sample customers.

#### Inventory (`/admin/inventory`)
- Header: h1 "Inventory" + "Warehouse: Bengaluru · Last synced 2min ago". Right: "Stock report", "Manual receipt".
- **2-column row**:
  - **Stock levels** (left) — 3 SKU cards stacked:
    | Name | SKU | Stock | Allocated | Weekly forecast | Level |
    |------|-----|-------|-----------|------------------|-------|
    | Slow Mo · 10 pack (mixed berry) | `SM-MB-10` | 1,840 | 1,420 | 950 | hi (green bar) |
    | Slow Mo · 15 pack (mixed berry) | `SM-MB-15` | 620 | 484 | 380 | mid (sun bar) |
    | Slow Mo · 30 pack (mixed berry) | `SM-MB-30` | 128 | 96 | 105 | lo (berry bar) |
    - Each card: 20px cream-padded rounded box. Flex row header: name + JetBrains Mono SKU / right-aligned Fraunces 28px stock count + "units in stock" caption.
    - 8px `--cream-2` progress bar with 4px rounded fill (colored per level).
    - Footer meta row: "{allocated} allocated to open orders" · "{forecast} needed this week".
  - **Batch info** (right) — 3 batch cards (16px padded cream boxes, 12px rounded):
    - B2609-A · Made Sep 06 2026 · Exp Sep 06 2027 · 800 units
    - B2609-B · Sep 09 · 450 units
    - B2609-C · Sep 11 · 242 units
    - Alert callout below: `--lavender-soft` background, purple text: "**Reorder alert:** at current velocity, stock lasts **18 days**. Next batch due Sep 24."

---

## Interactions & Behavior

### Global
- **Router**: Hash-based in the prototype (`#/`, `#/preorder`, `#/admin/orders`, etc.). In production, use the framework's router with real path-based URLs.
- **Persistence**: The customer preorder wizard writes to `localStorage['slowmo_order']` after every field change so the flow survives refresh. In production, persist to a session server-side or use a signed cookie for anonymous carts.
- **Buttons**:
  - Primary/purple/outline all animate `transform: translateY(-1px)` on hover (0.15s ease) with an optional `--shadow-lift` on primary hover.
  - Active: `translateY(0)`.
  - All buttons are `999px` (pill) by default; the "block" CTA variant is `14px` corners.
- **Tags/pills**: 6/12 padding, 999 rounded, 12px, weight 600.
- **Cards**: `translateY(-2px)` + `--shadow-card` on hover.

### Landing-specific
- **Sparkles**: pure CSS `@keyframes twinkle` — 3s ease-in-out infinite (0/100% at scale 1 opacity 0.3, 50% at scale 1.2 opacity 0.8), each with a staggered `animation-delay: index * 0.4s`.
- **Timeline "now" pulse dot**: `@keyframes pulse` — 2s infinite (0/100% no shadow, 50% 10px sun-color 0-alpha shadow).
- **FAQ accordion**: single-item-open. Clicking the "+" rotates it 45° and toggles the answer's `max-height` from 0 to 500px with a 0.3s ease transition.
- **Sleep quiz**: multi-select checkboxes; Back/Next buttons; Next is disabled until at least one option in the current step is selected. On last step Next becomes "See results".

### Preorder flow
- Every step change navigates via `location.hash` and calls `window.scrollTo({top: 0})` (see `RouterProvider.navigate` in `components.jsx`).
- **Product step**: clicking a pack card updates `qty`.
- **Program step**: clicking a card sets `program` and clears `programSkipped`. "Skip program" sets `program: null, programSkipped: true`.
- **Consult step**: local state tracks the active tab (`"book" | "rx"`). Continue enabled based on `mode === "book" ? (name && phone && email) : rxUploaded`. **There is no skip button** — Rx upload is the skip-equivalent.
  - File upload: `<input type="file" accept="image/*,.pdf">` inside a `<label>`. On change, set `rxUploaded: true, rxFileName: file.name`.
- **Address step**: All fields except email are required. On submit, generate order ID `SM-` + last-6 of `Date.now()`, set `placedAt: new Date().toISOString()`, navigate to `/confirmation`.

### Admin
- **Revenue tabs**: setting range mutates local component state, swaps the displayed value/delta/orders/AOV, and regenerates the mini chart data.
- **Orders filter tabs**: mutate the visible dataset in place.
- **All table row action buttons** (`⋯`), "Reschedule", "Call now", "Export CSV" etc.: not wired in the prototype. Wire to backend actions in production.

## State Management

### Customer preorder wizard state
Single flat object, persisted to localStorage:

```ts
type OrderDraft = {
  // Step 1: Product
  qty: 10 | 15 | 30

  // Step 2: Program
  program: "sleep30" | "deep-rest" | "slow-year" | null
  programSkipped: boolean

  // Step 3: Consult
  // Book mode:
  consultName: string
  consultPhone: string
  consultEmail: string
  consultReason: string       // optional
  consultSlot: string | null  // preferred time-of-day window, optional
  // Rx mode:
  rxUploaded: boolean
  rxFileName: string          // set on file selection

  // Step 4: Address
  name, phone, email, address, city, pincode, state: string
  payment: "cod" | "prepaid"

  // Set on order-placed:
  orderId?: string    // "SM-XXXXXX"
  placedAt?: string   // ISO datetime
}
```

In production:
1. Persist server-side keyed by anonymous session ID / phone.
2. On order placement, POST to `/api/orders` — this should:
   - Create the Order record
   - Kick off a **consult scheduling job** OR a **prescription-verification job** based on which mode was used
   - Send confirmation SMS + email
   - Return the order ID
3. File upload on the consult step needs a signed URL flow (S3 / R2 presigned PUT); store the file key and MIME on the order.

### Admin state
Currently all seed data lives inline. In production, each panel needs its own API endpoint:
- `GET /api/admin/orders?status=<x>&limit=50`
- `GET /api/admin/consults?date=today`
- `GET /api/admin/dispatch/kanban`
- `GET /api/admin/analytics?range=7d` (funnel, sources, geo)
- `GET /api/admin/customers?search=`
- `GET /api/admin/inventory` (SKUs + batches)
- `GET /api/admin/revenue?range=today|7d|30d|lifetime` — returns `{ value, delta, deltaType, orders, aov, chart: number[] }`

Row-level mutations (mark shipped, issue Rx, verify Rx upload) should be individual `POST /api/admin/...` endpoints.

## Design Tokens

Copy these directly. All are defined at `:root` in `styles.css`. There are alternate palettes exposed via `body[data-palette="nocturnal"]` and `body[data-palette="minty"]`; V1 ships with the default only.

### Colors
```css
--cream:          #F6F2E8   /* page background */
--cream-2:        #EFE9D9   /* section alt background */
--forest:         #0F3B2E   /* primary brand color, main text */
--forest-2:       #1B5240   /* primary hover */
--lavender:       #C9B8E8   /* accent, admin avatars */
--lavender-soft:  #E9DFF7   /* card fills, icon tile backgrounds */
--purple:         #3E2A6E   /* secondary brand, italic accents */
--purple-deep:    #2A1B4F   /* dark purple sections */
--brown:          #8A5A3B   /* warm sloth accent */
--berry:          #7A1F3D   /* discount/errors/accents */
--berry-2:        #A8324F   /* berry hover */
--sun:            #F0C64A   /* highlights, active tabs */
--ink:            #0F3B2E   /* body text (== forest) */
--ink-2:          #3d4b45   /* secondary body */
--ink-3:          #6b7770   /* muted / captions */
--line:           #E4DDC9   /* dividers, borders */
--white:          #FFFDF6   /* card surfaces (warm white, not pure) */

/* semantic */
green-success:    #1a7a4f   /* used inline for "Free", "delivered" states */
```

### Spacing / radii
Radii tokens: `12 / 20 / 28 / 40` (`--radius-sm/-radius/-radius-lg/-radius-xl`). Everything rounded, no sharp corners.

Common paddings: sections 96px vertical (64px mobile), cards 24–32px, form fields 14/16, buttons 16/28 (default), 20/36 (large), 10/18 (small).

Grid gaps: 12 / 16 / 20 / 24 / 32 / 48 depending on density.

### Shadows
```css
--shadow-soft:  0 4px 20px  rgba(15, 59, 46, 0.06)
--shadow-card:  0 8px 32px  rgba(15, 59, 46, 0.08)
--shadow-lift:  0 20px 60px rgba(15, 59, 46, 0.12)
```

### Typography
| Role | Font | Weight | Notes |
|------|------|--------|-------|
| Display | Fraunces | 500–600 | Optical size responsive; italic used for accent phrases in purple |
| Logo / brand | Baloo 2 | 800 | Very rounded, chunky — matches the pouch wordmark |
| Body / UI | DM Sans | 400 / 500 / 600 / 700 | Default for all controls, tables, paragraphs |
| Mono | JetBrains Mono | 400 / 500 | Order IDs, SKUs, batch codes |

Font loading via Google Fonts (see `Slow Mo Wellness.html` `<head>`).

Type scale:
- h1: `clamp(44px, 7vw, 88px)`, tracking `-0.035em`, line-height 0.98
- h2: `clamp(32px, 4.5vw, 56px)`, tracking `-0.03em`
- h3: `clamp(22px, 2.5vw, 32px)`
- h4: 18px (DM Sans 600)
- body: 16px, line-height 1.55
- small: 13–14px
- meta / eyebrows: 11–12px, letter-spacing 0.12–0.16em, uppercase, weight 600 in purple

### Responsive breakpoints
- `@media (max-width: 960px)` — grids collapse to 2-col or 1-col; nav links hidden; admin sidebar hidden (mobile admin isn't scoped for V1 — desktop-only is fine)
- `@media (max-width: 640px)` — everything collapses to 1-col; hero padding reduces; some table columns hide (`th:nth-child(3, 5)`)

## Assets

- **`assets/slowmo-pouch.png`** — The hero pouch photograph. Uploaded by the client. Used in the hero (right column) and in the order-summary line item thumbnail. 118 KB JPEG (~1000×1200).
- **`assets/slowmo-logo.png`** — Standalone Slow Mo wordmark + sleeping-sloth composition. Uploaded by the client. Not currently rendered in the site (the header + footer render an inline SVG version — the `MoonMark` component). Keep this file for future print/marketing use. 67 KB JPEG.

All other visuals in the site are inline SVG:
- **Sleeping sloth logo** — `MoonMark()` in `components.jsx`. Sloth face with a purple nightcap on a lavender pillow. Used in nav + footer.
- **AYUSH badge** — `AyushBadge()` in `components.jsx`. Stylized yellow disc + green leaf mark + two-line "CERTIFIED BY / Ministry of AYUSH" text.
- **Hemp plant botanical diagram** — `IngIllus()` in `landing.jsx`. Fully procedural SVG — stem + 3 tiers of palmate compound leaves + dashed botanical labels. No flowers/berries.
- **Benefit tile icons** — `BenefitIllus({type})` in `landing.jsx`. Three simple stroke-based glyphs (smile, moon-with-stars, balanced grid).
- **Interface icons** — `Icon.*` collection in `components.jsx`. Hand-picked minimal 1.8-stroke icons: Leaf, Smile, Sprout, Moon, Sparkle, Heart, ArrowRight, Check, Package, Phone, User, Home, Cart, Chart, Truck, Box, Users, Settings, Search, Plus, Calendar, Cash, Card, Bell, Download, MoreH, Filter, Star.

**Production replacement suggestion**: If the client provides polished product photography for other angles (top-down pouch, gummy close-up, lifestyle), swap those into a small hero carousel. The current single-hero-image layout accommodates this without structural change.

## Files

The prototype lives in the project root. Reference these when implementing:

| File | Purpose |
|------|---------|
| `Slow Mo Wellness.html` | Entry point — loads React 18, Babel Standalone, all component scripts, and mounts `<App>` into `#root`. |
| `styles.css` | All design tokens + global styles + component styles. **Every visual value comes from here.** |
| `components.jsx` | Shared: `Icon.*` set, `RouterProvider`, `useRoute`, `Nav`, `Footer`, `MoonMark` (sloth logo), `AyushBadge`, `Sparkles`. |
| `landing.jsx` | `Landing`, `Hero`, `TrustBar`, `Benefits`, `HowItWorks`, `Ingredients`, `IngIllus` (hemp plant SVG), `SleepQuiz`, `Testimonials`, `FAQ`. |
| `preorder.jsx` | `Preorder` (wizard root), `ProgressBar`, `StepProduct`, `StepProgram`, `StepConsult`, `StepAddress`, `StepConfirmation`, `OrderSummary`. Also contains `PACKS` (pricing) + `WELLNESS_PROGRAMS` (program catalog). |
| `admin.jsx` | `Admin` (shell + subroute switch), `AdminSide` (sidebar), `AdminOverview` (with revenue tabs), `AdminOrders`, `OrdersTable`, `AdminConsults`, `AdminDispatch`, `AdminAnalytics`, `AdminCustomers`, `AdminInventory`. Includes seed data for all tables/charts. |
| `app.jsx` | `App` root — wires `useTweaks` + `RouterProvider` + Tweaks panel. **The Tweaks panel is a design-mode tool, not part of the shipped product** — drop it entirely in production. |
| `tweaks_panel.jsx` | Starter component behind the Tweaks panel. Drop in production. |
| `assets/slowmo-pouch.png` | Product hero image. |
| `assets/slowmo-logo.png` | Brand asset (unused in the current site render but keep for print). |

**Note on the Tweaks panel**: The design prototype exposes toggles for palette (default/nocturnal/minty), hero layout (left/right/centered), copy tone (playful/clinical), illustrations on/off, and CTA style (pill/outline/block). These were **exploration knobs** — the shipped product uses `palette=default`, `hero=left`, `tone=playful`, `illus=on`, `cta=pill`. Only implement other variants if the client explicitly chooses them.
