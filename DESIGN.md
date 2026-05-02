# Design System: Mainframe Digital

> "Tomorrow's systems, today." A New Zealand digital studio site. The interface is a quiet, confident, near-monochrome dark canvas that lets typography, asymmetry, and liquid-glass surfaces carry every screen. Use this document as the single source of truth when prompting Stitch — match the language, the tokens, and the bans exactly.

---

## 1. Visual Theme & Atmosphere

A premium, near-monochrome studio interface. Deep ink canvas, bone typography, frosted liquid-glass UI elements, and small editorial flourishes (corner squares, geographic coordinates, pulsing booking-status dots). The mood is **architectural** — controlled white space, calm contrast, and sparing motion. Every section feels like a pinned plate inside a glass frame.

- **Density: 5/10 (Daily App Balanced)** — generous outer padding (80px gutters, 140–160px section vertical rhythm), but content blocks themselves are dense (3-column capability grids, mini stats rows, layered hero copy).
- **Variance: 8/10 (Offset Asymmetric)** — the hero is a `1fr / 1.05fr` grid where left holds a giant wordmark and right holds a bordered text block; coordinates rotate 90° on the rail; corner squares pin to negative offsets; italic-light pairs with semibold roman in the same line.
- **Motion: 6/10 (Fluid CSS)** — typewriter cycles in the hero, gooey-morph word transitions, staggered word-pull-up reveals on entrance, an auto-advancing 3D card-stack, glass CTA hover with arrow-puck rotation. Easing is uniformly `cubic-bezier(0.16, 1, 0.3, 1)`. No bouncing, no parallax overload.

The reference points are the existing implementation in `hero.jsx` and `sections.jsx`. New screens must feel like they belong inside the same liquid-glass frame.

---

## 2. Color Palette & Roles

Strictly dark, near-monochrome. One accent — and it only appears at micro-scale (status dots).

- **Ink Canvas** (`#0D1117`) — Primary background. The outer shell, every section base, every hero floor.
- **Ink Surface** (`#1C212B`) — Slightly raised tone used inside frosted card gradients (`linear-gradient(135deg, rgba(28,33,43,0.85) 0%, rgba(13,17,23,0.92) 100%)`).
- **Bone Text** (`#E5E7EB`) — Primary text, wordmarks, CTA labels, corner-square markers.
- **Paper White** (`#FFFFFF`) — Reserved exclusively for liquid-glass highlight sheens (10–22% alpha) and inset top borders. Never used as a fill.
- **Bone Muted** (`rgba(229,231,235,0.55)`) — Italic display secondaries, "Design, Automate, Grow" sub-wordmark, soft headlines like *"One operating system."*
- **Bone Body** (`rgba(229,231,235,0.78)`) — Body copy and large supporting paragraphs.
- **Bone Soft** (`rgba(229,231,235,0.62)`) — Tertiary metadata, mini-stats labels, footer column titles.
- **Bone Whisper** (`rgba(229,231,235,0.45)`) — Side-rail coordinates, footer legal, deep-meta-only.
- **Whisper Border** (`rgba(229,231,235,0.22)`) — 1px borders on boxed surfaces, the right-side hero block, the capabilities grid.
- **Hairline** (`rgba(229,231,235,0.12)`) — Internal dividers (mini-stats top border, capability grid cell separators, footer underline).
- **Glass Edge** (`rgba(255,255,255,0.28)`) — Liquid-glass nav-pill and CTA borders. Always paired with an inset highlight at the top edge.

**Single Accent (status only — never CTAs):**
- **Heartbeat Mint** (`#7DD8A4`) — A muted, sub-80%-saturation mint used exclusively for the "Booking · Q3 ’26" 6px pulse dot in the top-right meta cluster. Glow it via `box-shadow: 0 0 8px #7DD8A4`. Never expand to fills, never use on hover states, never recolor type. *(Note: the existing implementation uses `#7CFFB2`, which is 100% saturation. Future screens should adopt this calmer Heartbeat Mint to stay within the design-system saturation budget.)*

**Mandatory bans:**
- No purple, no neon blue, no "AI gradient" sweeps. The CTA glow is *glass*, not light.
- No pure `#000000`. Always use `#0D1117`.
- No second accent. If a screen "needs" another color, the design is wrong — solve it with weight, scale, or whitespace.

---

## 3. Typography Rules

A single typeface, used with full hierarchy through **weight**, **case**, **letter-spacing**, and **italic vs. roman**. No second display face.

- **Display: Poppins** — Loaded weights `300, 400, 500, 600, 700` from Google Fonts. Used for everything from the giant wordmark down to nav links.
  - **Mega wordmark:** weight `600`, `font-size: clamp(80px, 17vw, 270px)`, `line-height: 0.85`, `letter-spacing: -0.06em`, color `#E5E7EB`. Carries an `®` floated at the upper-right of the last word at `0.3em` size.
  - **Italic counter-line:** weight `300`, italic, `clamp(70px, 11vw, 200px)`, `line-height: 0.85`, `letter-spacing: -0.05em`, color `rgba(229,231,235,0.55)`. This is where the typewriter cycle lives.
  - **Section heading:** weight `600`, `clamp(56px, 7.5vw, 124px)`, `line-height: 0.92`, `letter-spacing: -0.045em`, with an italic-light secondary clause inline: `font-style: italic; font-weight: 300; color: rgba(229,231,235,0.55)`. Example: *"Four products. **One operating system.***"*
  - **About-style heading:** weight `300` italic at `clamp(48px, 5.5vw, 88px)` with the punchline reverting to `font-weight: 600; font-style: normal`. Use this when the line is a single thought ("A small studio that **ships.**").
  - **CTA label:** weight `500`, `font-size: 22–24px`, `letter-spacing: -0.015em`.
  - **Body lede:** weight `300`, `38px`, `line-height: 1.22`, `letter-spacing: -0.02em`, color `rgba(229,231,235,0.95)`. Used in the right-side hero pane.
  - **Body paragraph:** weight `300`, `17–22px`, `line-height: 1.45–1.65`, color `rgba(229,231,235,0.7–0.85)`.
  - **Eyebrow / section label:** weight `500–600`, `13–16px`, `letter-spacing: 0.32–0.34em`, `text-transform: uppercase`, paired with a `56–64px × 1px` rule on the leading edge.
  - **Meta row:** weight `400`, `10–12px`, `letter-spacing: 0.16–0.32em`, `text-transform: uppercase`, color `rgba(229,231,235,0.45–0.65)`.

- **Mono: JetBrains Mono** *(recommended for any future tabular-num contexts — invoice tables, build numbers, latency readouts.)* The current implementation uses Poppins with `font-variant-numeric: tabular-nums` for index numerals (`01 / 04`). Keep that pattern for in-line counters; reach for JetBrains Mono only when columns of digits need to align.

**Banned:**
- **Inter** — banned. Poppins is the house face.
- All generic serif fonts (`Times New Roman`, `Georgia`, `Garamond`, `Palatino`). If an editorial moment ever needs a serif, it must be `Fraunces` or `Instrument Serif`. Otherwise: lean on Poppins italic light.
- Never substitute a system font stack on prod. Always preconnect to `fonts.gstatic.com` and load Poppins explicitly.

---

## 4. Component Stylings

### Liquid-Glass Nav Pill
The flagship surface. A `999px`-radius pill, `padding: 18px 38px`, `gap: 44px` between items.
- Background: `linear-gradient(135deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.14) 100%)`.
- `backdrop-filter: blur(18px) saturate(180%)`.
- Border: `1px solid rgba(255,255,255,0.28)`.
- Box-shadow stack: `inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.28)`.
- A 50%-height top sheen sits inside via an absolute `<span>` — `linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)`.
- Item color: `rgba(229,231,235,0.78)` resting → `#FFFFFF` on hover (text only — no underline, no chip, no pill background change).

### Liquid-Glass CTA ("Work With Us", "Book a free audit")
A pill-shaped button with a dark inset arrow-puck on the right.
- Outer pill: same glass treatment as the nav, `border-radius: 999px`, asymmetric padding (`paddingLeft: 38–44px`, `paddingRight: 10–12px`, vertical `10–12px`).
- Label inside, then a `62–70px` round dark puck (`linear-gradient(135deg, rgba(13,17,23,0.95) 0%, rgba(28,33,43,0.95) 100%)`) holding a 24–26px arrow icon stroked at `2px` in Bone.
- Hover: `gap` widens by `4–6px`, button lifts `translateY(-2px)`, puck `scale(1.06) rotate(-12deg)`. Transition: `0.3s ease` on `gap, box-shadow, transform`.
- **No outer glow.** Shadow is only black drop + inset white highlight.
- **No secondary CTA next to it** beyond an underlined plain text link ("See our work") — that link uses `1px solid rgba(229,231,235,0.4)` underline at `paddingBottom: 4px`, no hover color change.

### Boxed Surface (right-hero block, About card, Final-CTA card)
The structural container of the brand. Always:
- `1px solid rgba(229,231,235,0.22)` border.
- Background gradient: `linear-gradient(135deg, rgba(28,33,43,0.85) 0%, rgba(13,17,23,0.92) 100%)`.
- `backdrop-filter: blur(12px) saturate(160%)`.
- Shadow: `0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)`.
- Internal `DotPattern` overlay (see below) at `rgba(229,231,235,0.12–0.14)`.
- **Four corner squares**: `10×10px` Bone (`#E5E7EB`) absolutely positioned at `top:-5px; left:-5px` / `top:-5px; right:-5px` / `bottom:-5px; left:-5px` / `bottom:-5px; right:-5px`. **These are non-negotiable** — they are the brand mark for any framed surface.

### DotPattern (background texture)
SVG `<pattern>` of `0.6r` circles on a `6×6px` grid, `fill: rgba(229,231,235,0.12–0.18)`, absolute-positioned to fill its parent. Use it inside every boxed surface and behind right-hero copy. Never let it bleed onto a section that already has the GridVignette behind it.

### GridVignette (behind sections 1–4)
A continuous 56px grid (`linear-gradient(to right, rgba(229,231,235,0.32) 1px, transparent 1px), linear-gradient(to bottom, ...)`), masked with a horizontal linear gradient that fades the edges (`mask-image: linear-gradient(to right, rgba(0,0,0,0.15) 0%, black 28%, black 72%, rgba(0,0,0,0.15) 100%)`) plus a side-fade overlay of `#0D1117`. This is the floor for Products / About / Services / Final-CTA. Only one grid per section group.

### Card Stack (3D fanned carousel)
Used for the Products section. Cards measure `cardWidth × cardHeight` (default `1100 × 680` desktop, scaled to viewport), fan around the active card with `spreadDeg: 16`, `overlap: 0.6`, `maxVisible: 5`. Active card lifts `-16px`, scales to `1.04`, side cards drop to `0.94` and reduce opacity by `0.1` per step out. Each card is a glass tile with a cover image, a tinted color-mix overlay, a 14px dot grid mixed in `overlay`, a bottom-up dark gradient, and a top sheen. Auto-advance every `3800ms`, paused on hover. Controls: round 44px glass arrow buttons + a row of dots where the active dot stretches from `8px` to `28px` width.

### Capabilities Grid
3 columns × 2 rows, **flat 1-px Hairline cell separators only — no card elevation**. Outer wrapper carries the same Boxed-Surface treatment (border + corner squares + dot pattern). Each cell: `padding: 44px 40px 48px`, `min-height: 220px`, label-up + body-down composition. Index numerals (`01`–`06`) live in the upper-left as eyebrow type.

### Mini Stats Row (inside boxed surfaces)
3 columns separated only by a `1px solid rgba(229,231,235,0.12)` top border. Each cell: tiny eyebrow label (`12px / 0.26em`) + 17px Bone body line. No icons.

### Top Meta Cluster (right of nav)
Inline flex with: pulse dot + "Booking · Q3 ’26", `1px × 14px` bone-soft divider, "Auckland · NZ". All caps `11px / 0.12em`. Pulse dot is the only chromatic element on the screen.

### Side Rail
Right edge of the hero, vertical text (`transform: rotate(90deg)` on the wrapper, `transform-origin: right center`) showing geographic coordinates and a quiet "Scroll · 36.8485°S 174.7633°E". `10px / 0.32em`, `rgba(229,231,235,0.45)`. **Never include a chevron, scroll arrow, or "scroll to explore" copy.** This is the navigation cue — it does the job by itself.

### Forms / Inputs *(forward guidance — not yet implemented)*
- Eyebrow label above input (`12px / 0.26em / uppercase / Bone Soft`).
- Input: bg `rgba(13,17,23,0.55)`, `1px solid rgba(229,231,235,0.22)` border, `border-radius: 12px`, `padding: 14px 18px`, `color: #E5E7EB`, `font-size: 17px`.
- Focus: border becomes `rgba(229,231,235,0.55)` and a 2px outer ring of `rgba(229,231,235,0.12)` appears. **No accent-mint focus ring** — the accent is reserved for status only.
- Helper / error text below at `13px`. Error color: `#E5E7EB` with a `1px` left border in `rgba(229,231,235,0.55)` and the message in italic.

### Loading / Empty / Error States *(forward guidance)*
- **Loaders:** Skeletal blocks shaped like the final layout, with a `linear-gradient` shimmer driven by `transform: translateX()`. No circular spinners.
- **Empty:** A single bordered Boxed Surface (corner squares, dot pattern) holding a one-sentence diagnosis and a single liquid-glass CTA back to action. No illustrations of "empty boxes" or cartoon mascots.
- **Error:** Inline, in the surface that failed. Use Bone copy with the italic-light secondary treatment. Do not introduce red.

---

## 5. Layout Principles

- **Outer shell.** Every page is wrapped in a `20px` ink-canvas margin and a `borderRadius: 24` liquid-glass frame (`hero.jsx` + `SectionsBackdrop` in `sections.jsx`). The page itself looks like a glass plate sitting on the canvas. Footer breaks out of the frame.
- **Hero is asymmetric, always.** Grid template: `minmax(0, 1fr) minmax(0, 1.05fr)`, `gap: 56px`, `align-items: end`. Left column = giant wordmark stack; right column = bordered text block with eyebrow + lede + CTA + mini stats. Centered-hero compositions are banned.
- **Section padding.** Default `140–160px` top/bottom, `60–80px` sides. Max content width `1280–1700px` depending on density (use the `SectionShell` `maxWidth` prop pattern).
- **No 3-equal-card "feature row".** Products use the fanned 3D card-stack. Capabilities use a 3×2 internal grid that's framed as a single Boxed Surface (so it reads as one structural object, not three floating cards).
- **CSS Grid first.** Never solve column math with `calc()` percentages or `flex-basis` hacks.
- **Containment.** Always set `max-width` and `margin: 0 auto` on the inner content layer, even inside a full-bleed section.
- **Full-height sections.** Use `min-height: 100dvh`, never `height: 100vh`. The current hero uses `height: 100vh` — flag this for migration on next pass.
- **Negative-offset corner squares.** Whenever a surface has the Whisper Border, it gets the four 10×10 Bone corner squares pinned at `-5px`. This applies to the hero outer frame, the right-hero copy block, About sidebar, Capabilities grid, and Final-CTA surface.

---

## 6. Responsive Rules

- **Mobile (<768px) collapse.** The hero `1fr / 1.05fr` grid becomes a single column: wordmark on top, italic counter-line below, copy block beneath. The right-side block keeps its border + corner squares but goes full-width with reduced padding (`28px 24px`).
- **Typography clamps.**
  - Mega wordmark already uses `clamp(80px, 17vw, 270px)`.
  - Italic counter: `clamp(70px, 11vw, 200px)`.
  - Section H2: `clamp(56px, 7.5vw, 124px)` or `clamp(48px, 5.5vw, 88px)` depending on density.
  - Body never below `15px`.
- **Section padding scales.** Use `clamp(80px, 12vw, 160px)` vertical and `clamp(20px, 5vw, 80px)` horizontal.
- **Touch targets.** Glass CTA stays at full size (the round puck is already 62–70px). Nav pill items get `44px` min tap height.
- **Nav pill on mobile.** Collapses to a single liquid-glass round button (top-right) that opens a full-bleed glass sheet with stacked nav items, `28px` Poppins `500`, vertically centered. The booking-meta cluster stacks above. **No hamburger-icon-only dropdown** — the brand opens a sheet.
- **Card stack on mobile.** Reduces `maxVisible` to 3, `cardWidth` to viewport-width minus `40px` gutters, `spreadDeg` to `8`. Auto-advance interval increases to `5200ms` to give users time to read.
- **No horizontal scroll** at any viewport. The side-rail rotated coordinate text must be hidden below `1024px`.
- **Side meta cluster on mobile.** Coordinates and "Booking · Q3" stack vertically below the lede; pulse dot stays.

---

## 7. Motion & Interaction

- **Easing default:** `cubic-bezier(0.16, 1, 0.3, 1)` for all entrance and hover transitions. Duration `0.6–0.8s` for entrances, `0.2–0.3s` for hovers.
- **Spring-physics analog:** when entrance feels "weighty" — the giant wordmark word-pull-up — use the same cubic-bezier with `0.8s` duration and a `0.1s` per-word stagger (`WordsPullUp` in `hero.jsx`).
- **Perpetual micro-loops (sparingly):**
  - **Booking pulse dot:** `box-shadow: 0 0 8px Heartbeat Mint`, no animation needed (the glow itself reads as alive). If animated, slow `2.4s` opacity breathe between `0.85` and `1.0` — never scale or color-shift.
  - **Typewriter cursor:** `0.06em × 0.85em` Bone block, `1s steps(2)` opacity blink.
  - **Italic display typewriter:** types/deletes through `["Design.", "Automate.", "Grow."]` at `typeSpeed: 95ms`, `deleteSpeed: 55ms`, `holdTime: 1600ms`, with an initial `Digital.` hold of `1200ms` before the first deletion.
  - **Card-stack auto-advance:** `3800ms` interval, paused on hover.
- **Staggered orchestration:** Hero metadata enters in order — logo `delay: 0.2s`, nav `0.35s`, booking meta `0.5s`, eyebrow `0.4s`, lede `0.55s`, CTA row `0.7s`, mini stats `0.85s`, side rail `1.4s`. Replicate this cascade pattern on new sections.
- **Performance:** Animate via `transform` and `opacity` only. Never animate `width`, `height`, `top`, `left`. The noise overlay (`noise-overlay` SVG turbulence) sits on a fixed pseudo-element with `mix-blend-mode: overlay` and `pointer-events: none` — copy this pattern when adding texture to new screens.
- **No parallax.** No scroll-jacking. No "reveal on scroll" past the first viewport — entrances run on mount, scroll afterwards is just scroll.

---

## 8. Anti-Patterns (Banned)

These are AI tells. They will not appear in any new screen.

- **No `Inter`.** Poppins is the only display face.
- **No generic serifs** (`Times New Roman`, `Georgia`, `Garamond`, `Palatino`). If a serif is needed: `Fraunces` or `Instrument Serif` only — and never inside a dashboard.
- **No pure `#000000`.** `#0D1117` is the floor.
- **No purple, no neon blue, no gradient sweeps as accents.** The CTA glow is *glass*, not light.
- **No second accent.** One pulse-dot mint is the entire chromatic budget.
- **No outer-glow `box-shadow` on buttons.** Shadows are black drop + inset white highlight only.
- **No emojis** anywhere in product UI.
- **No 3-equal-card feature rows.** Products = 3D fanned stack. Capabilities = single framed grid surface.
- **No centered hero composition.** Hero is always the asymmetric `1fr / 1.05fr` grid.
- **No "Scroll", "Swipe", chevrons, bouncing arrows.** The side-rail coordinate string is the only scroll cue.
- **No fabricated metrics.** No "99.98% UPTIME", no "124ms AVG. RESPONSE", no "18.5k DEPLOY CYCLES", no fake "BY THE NUMBERS" cards. If a real number isn't available, write a qualitative line ("Built · Shipped · Scaled") or use a `[metric]` placeholder.
- **No `LABEL // YEAR` formatting.** The format is `Booking · Q3 ’26` and `36.8485°S 174.7633°E` — middle-dot separators, real coordinates, real date.
- **No generic placeholder names** ("John Doe", "Acme Corp", "Nexus", "Lorem"). The studio is *Mainframe Digital*. The location is *Auckland · NZ*. The contact is *hello@mainframe.digital*. Use these or leave it blank.
- **No AI copy clichés.** Banned words: *Elevate, Seamless, Unleash, Next-Gen, Revolutionize, Empower, Cutting-edge, Unlock, Game-changing, Synergy.* Replace with concrete verbs (*Build, Ship, Connect, Diagnose, Measure, Automate*).
- **No broken `images.unsplash.com` links.** When a placeholder image is needed, prefer `picsum.photos` with a stable seed or commit a real asset under `assets/`.
- **No custom mouse cursors.** Default arrow + pointer only.
- **No overlapping text on text or text on images** — every element gets a clean spatial zone. The hero italic counter-line sits *under* the wordmark, not behind it.
- **No "Learn more" secondary CTA.** Pair the primary glass CTA with a single underlined plain-text link or nothing.
- **No retainer/agency-speak.** Stay in the studio's voice: short sentences, em-dashes, lowercase brand language ("we", "the loop", "a small studio that ships"). Read the existing About and Final-CTA copy in `sections.jsx` and stay in that register.
