/* ---------------- sections.jsx ----------------
   Renders Products / About / Services / Final CTA / Footer
   beneath the hero. Reuses motion shim, DotPattern, ArrowRight
   from hero.jsx (loaded earlier on the page).
------------------------------------------------- */

const { useState: sUseState, useEffect: sUseEffect, useRef: sUseRef, useCallback: sUseCallback } = React;

/* ---------------- GridVignetteBackground ----------------
   A grid pattern that's bright at the center and fades to nothing at the edges
   via a radial mask. Drop into any section as an absolute positioned bg. */
const GridVignetteBackground = ({
  size = 56,
  x = 50, y = 50,
  horizontalVignetteSize = 60,
  verticalVignetteSize = 55,
  intensity = 50,
  opacity = 0.55,
  color = "rgba(229,231,235,0.32)",
  style
}) => {
  const mask = `radial-gradient(ellipse ${horizontalVignetteSize}% ${verticalVignetteSize}% at ${x}% ${y}%, black ${100 - intensity}%, transparent 100%)`;
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        opacity,
        backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        WebkitMaskImage: mask,
        maskImage: mask,
        pointerEvents: "none",
        ...style
      }} />
  );
};

/* ---------------- Section wrapper — content only, no per-section grid bg ---- */
const SectionShell = ({ children, padding = "140px 80px 120px", style, maxWidth = 1400 }) => (
  <section style={{ position: "relative", padding, ...style }}>
    <div style={{ position: "relative", zIndex: 1, maxWidth, margin: "0 auto" }}>
      {children}
    </div>
  </section>
);

/* ---------------- Shared backdrop sitting behind sections 1-4 -------------- */
const SectionsBackdrop = ({ children }) => (
  <div style={{ position: "relative", background: "#0D1117", padding: "0 20px 20px" }}>

    {/* Liquid glass frame wrapping all sections */}
    <div style={{
      position: "relative",
      borderRadius: 24,
      padding: 2,
      background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 35%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.08) 80%, rgba(255,255,255,0.22) 100%)",
      backdropFilter: "blur(8px) saturate(140%)",
      WebkitBackdropFilter: "blur(8px) saturate(140%)",
      boxShadow: "0 20px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(255,255,255,0.04), 0 0 0 1px rgba(255,255,255,0.08)"
    }}>
      {/* Top sheen */}
      <span aria-hidden="true" style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "8%",
        background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 100%)",
        borderRadius: "24px 24px 0 0",
        pointerEvents: "none",
        zIndex: 1
      }} />

      <div style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        background: "#0D1117",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 0 1px rgba(255,255,255,0.06)"
      }}>
        {/* Single continuous grid behind everything */}
        <div aria-hidden="true" style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(to right, rgba(229,231,235,0.32) 1px, transparent 1px), linear-gradient(to bottom, rgba(229,231,235,0.32) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
          backgroundPosition: "center top",
          opacity: 0.55,
          WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.15) 0%, black 28%, black 72%, rgba(0,0,0,0.15) 100%)",
          maskImage: "linear-gradient(to right, rgba(0,0,0,0.15) 0%, black 28%, black 72%, rgba(0,0,0,0.15) 100%)",
          pointerEvents: "none",
          zIndex: 0
        }} />

        {/* Side fades to soften grid edges */}
        <div aria-hidden="true" style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, #0D1117 0%, rgba(13,17,23,0.6) 18%, rgba(13,17,23,0) 35%, rgba(13,17,23,0) 65%, rgba(13,17,23,0.6) 82%, #0D1117 100%)",
          pointerEvents: "none",
          zIndex: 1
        }} />

        <div style={{ position: "relative", zIndex: 3 }}>
          {children}
        </div>
      </div>
    </div>
  </div>
);


/* ---------------- Reusable bordered/dotted box with corner accents ---------------- */
const BoxedSurface = ({ children, padding = "56px 64px", style }) => (
  <div style={{
    position: "relative",
    border: "1px solid rgba(229,231,235,0.22)",
    background: "linear-gradient(135deg, rgba(28,33,43,0.85) 0%, rgba(13,17,23,0.92) 100%)",
    backdropFilter: "blur(12px) saturate(160%)",
    WebkitBackdropFilter: "blur(12px) saturate(160%)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
    padding,
    ...style
  }}>
    <DotPattern width={6} height={6} cr={0.6} color="rgba(229,231,235,0.12)" />
    {[
      { top: -5, left: -5 },
      { top: -5, right: -5 },
      { bottom: -5, left: -5 },
      { bottom: -5, right: -5 }
    ].map((pos, i) => (
      <div key={i} style={{
        position: "absolute",
        width: 10, height: 10,
        background: "#E5E7EB",
        zIndex: 2,
        ...pos
      }} />
    ))}
    <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
  </div>
);

/* ---------------- SectionLabel ---------------- */
const SectionLabel = ({ index, label }) => (
  <div style={{
    display: "flex",
    alignItems: "center",
    gap: 18,
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "0.34em",
    textTransform: "uppercase",
    color: "rgba(229,231,235,0.75)",
    marginBottom: 32
  }}>
    <span style={{
      fontFamily: "'Poppins', sans-serif",
      fontVariantNumeric: "tabular-nums",
      color: "rgba(229,231,235,0.45)"
    }}>{index}</span>
    <span style={{ width: 56, height: 1, background: "rgba(229,231,235,0.4)" }} />
    {label}
  </div>
);

/* ---------------- CardStack (fanned 3D stack) ---------------- */
const wrapIndex = (n, len) => len <= 0 ? 0 : ((n % len) + len) % len;
const signedOffset = (i, active, len, loop) => {
  const raw = i - active;
  if (!loop || len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
};

const CardStack = ({
  items,
  initialIndex = 0,
  maxVisible = 5,
  cardWidth = 540,
  cardHeight = 360,
  overlap = 0.42,
  spreadDeg = 24,
  depthPx = 90,
  activeLiftPx = 16,
  activeScale = 1.04,
  inactiveScale = 0.94,
  loop = true,
  autoAdvance = true,
  intervalMs = 3800,
}) => {
  const len = items.length;
  const [active, setActive] = sUseState(wrapIndex(initialIndex, len));
  const [hovering, setHovering] = sUseState(false);

  // Responsive sizing: shrink the card if it (plus side spread) won't fit the container
  const stageRef = sUseRef(null);
  const [stageW, setStageW] = sUseState(0);
  sUseEffect(() => {
    if (!stageRef.current) return;
    const el = stageRef.current;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) setStageW(e.contentRect.width);
    });
    ro.observe(el);
    setStageW(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));
  // The horizontal extent of the fan = cardWidth + 2 * maxOffset * spacing.
  // We need (extent + a little breathing room) <= stageW. Solve for an effective cardWidth.
  const ratio = (1 + 2 * maxOffset * (1 - overlap));
  const safety = 48; // edge breathing room
  const fitCardWidth = stageW > 0
    ? Math.min(cardWidth, Math.max(280, Math.floor((stageW - safety) / ratio)))
    : cardWidth;
  const fitCardHeight = Math.round(cardHeight * (fitCardWidth / cardWidth));

  const cardSpacing = Math.max(10, Math.round(fitCardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const next = sUseCallback(() => setActive(a => wrapIndex(a + 1, len)), [len]);
  const prev = sUseCallback(() => setActive(a => wrapIndex(a - 1, len)), [len]);

  sUseEffect(() => {
    if (!autoAdvance || hovering || !len) return;
    const id = setInterval(next, Math.max(1500, intervalMs));
    return () => clearInterval(id);
  }, [autoAdvance, hovering, len, intervalMs, next]);

  const onKey = (e) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  if (!len) return null;
  const activeItem = items[active];

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{ width: "100%" }}>
      {/* Stage */}
      <div
        ref={stageRef}
        tabIndex={0}
        onKeyDown={onKey}
        style={{
          position: "relative",
          width: "100%",
          height: fitCardHeight + 120,
          outline: "none"
        }}>
        {/* spotlight wash */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(229,231,235,0.06) 0%, rgba(13,17,23,0) 70%)",
          pointerEvents: "none"
        }} />

        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          perspective: "1400px"
        }}>
          {items.map((item, i) => {
            const off = signedOffset(i, active, len, loop);
            const abs = Math.abs(off);
            if (abs > maxOffset) return null;

            const isActive = off === 0;
            const rotateZ = off * stepDeg;
            const x = off * cardSpacing;
            const y = abs * 8 + (isActive ? -activeLiftPx : 0);
            const z = -abs * depthPx;
            const scale = isActive ? activeScale : inactiveScale;
            const opacity = isActive ? 1 : 0.85 - abs * 0.1;

            return (
              <div
                key={item.id}
                onClick={() => setActive(i)}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  marginLeft: -fitCardWidth / 2,
                  marginTop: -fitCardHeight / 2,
                  width: fitCardWidth,
                  height: fitCardHeight,
                  zIndex: 100 - abs,
                  transform: `translate3d(${x}px, ${y}px, ${z}px) rotateZ(${rotateZ}deg) scale(${scale})`,
                  transformStyle: "preserve-3d",
                  transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s",
                  opacity,
                  cursor: isActive ? "default" : "pointer",
                  borderRadius: 18,
                  overflow: "hidden",
                  border: "1px solid rgba(229,231,235,0.25)",
                  boxShadow: isActive
                    ? "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)"
                    : "0 16px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)",
                  background: "linear-gradient(135deg, rgba(28,33,43,0.92) 0%, rgba(13,17,23,0.95) 100%)",
                  backdropFilter: "blur(14px) saturate(160%)",
                  WebkitBackdropFilter: "blur(14px) saturate(160%)"
                }}>

                {/* Image / placeholder */}
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    draggable={false}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      userSelect: "none"
                    }} />
                )}
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: item.gradient,
                  mixBlendMode: "color",
                  opacity: 0.55
                }} />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(229,231,235,0.10) 1px, transparent 0)`,
                  backgroundSize: "14px 14px",
                  opacity: 0.4,
                  mixBlendMode: "overlay"
                }} />
                <div style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(13,17,23,0.15) 0%, rgba(13,17,23,0) 35%, rgba(13,17,23,0.92) 100%)"
                }} />

                {/* Glass sheen */}
                <div style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: "40%",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 100%)",
                  pointerEvents: "none"
                }} />

                {/* Number */}
                <div style={{
                  position: "absolute",
                  top: 22, left: 24,
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "0.32em",
                  color: "rgba(229,231,235,0.75)"
                }}>
                  {String(i + 1).padStart(2, "0")} / {String(len).padStart(2, "0")}
                </div>

                {/* Tag */}
                {item.tag && (
                  <div style={{
                    position: "absolute",
                    top: 18, right: 22,
                    padding: "6px 12px",
                    border: "1px solid rgba(229,231,235,0.28)",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: "rgba(229,231,235,0.85)",
                    background: "rgba(13,17,23,0.55)",
                    backdropFilter: "blur(10px)"
                  }}>{item.tag}</div>
                )}

                {/* Content */}
                <div style={{
                  position: "absolute",
                  bottom: 0, left: 0, right: 0,
                  padding: "28px 30px 30px"
                }}>
                  <div style={{
                    fontSize: 28,
                    fontWeight: 600,
                    color: "#E5E7EB",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.15,
                    marginBottom: 10
                  }}>{item.title}</div>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 300,
                    color: "rgba(229,231,235,0.75)",
                    lineHeight: 1.5,
                    maxWidth: 440,
                    textWrap: "pretty"
                  }}>{item.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls + dots */}
      <div style={{
        marginTop: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 28
      }}>
        <button onClick={prev} style={navBtnStyle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {items.map((it, idx) => (
            <button
              key={it.id}
              onClick={() => setActive(idx)}
              aria-label={`Go to ${it.title}`}
              style={{
                width: idx === active ? 28 : 8,
                height: 8,
                borderRadius: 999,
                background: idx === active ? "#E5E7EB" : "rgba(229,231,235,0.28)",
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                cursor: "pointer",
                border: "none",
                padding: 0
              }} />
          ))}
        </div>

        <button onClick={next} style={navBtnStyle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E5E7EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* Active item meta below */}
      <div style={{
        marginTop: 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "rgba(229,231,235,0.55)"
      }}>
        Currently viewing · <span style={{ color: "#E5E7EB" }}>{activeItem.title}</span>
      </div>
    </div>
  );
};

const navBtnStyle = {
  width: 44, height: 44,
  borderRadius: "50%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)",
  backdropFilter: "blur(14px) saturate(180%)",
  WebkitBackdropFilter: "blur(14px) saturate(180%)",
  border: "1px solid rgba(255,255,255,0.22)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), 0 4px 16px rgba(0,0,0,0.3)",
  cursor: "pointer",
  transition: "transform 0.2s ease",
};

/* ---------------- Products section ---------------- */
const productItems = [
  {
    id: "p1",
    tag: "Build",
    title: "Website Design & Restructure",
    description: "Custom websites engineered for conversion — rebuilt from the ground up for speed, clarity, and growth. No template, no shortcuts.",
    image: "https://images.unsplash.com/photo-1545665277-5937489579f2?auto=format&fit=crop&w=1400&q=80",
    gradient: "linear-gradient(135deg, oklch(0.45 0.08 220) 0%, oklch(0.25 0.04 230) 100%)"
  },
  {
    id: "p2",
    tag: "Convert",
    title: "Sales Pipelines & Funnels",
    description: "End-to-end pipelines that turn cold traffic into booked calls — landing pages, lead capture, nurture sequences, the lot.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=80",
    gradient: "linear-gradient(135deg, oklch(0.5 0.09 280) 0%, oklch(0.25 0.05 270) 100%)"
  },
  {
    id: "p3",
    tag: "Automate",
    title: "Workflow Automation",
    description: "Connect your stack and remove the manual work. Lead routing, follow-ups, reporting, ops — running quietly in the background.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80",
    gradient: "linear-gradient(135deg, oklch(0.5 0.1 150) 0%, oklch(0.25 0.05 160) 100%)"
  },
  {
    id: "p4",
    tag: "Grow",
    title: "Revenue Growth Plans",
    description: "A 90-day operating plan tailored to your business — what to ship, when, and how to measure it. Less noise, more compounding.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80",
    gradient: "linear-gradient(135deg, oklch(0.5 0.09 60) 0%, oklch(0.25 0.05 50) 100%)"
  }
];

const ProductsSection = () => (
  <SectionShell padding="160px 40px 140px" maxWidth={1700}>
    <div style={{ position: "relative", zIndex: 2 }}>
      <SectionLabel index="01" label="What we build" />

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 32,
        marginBottom: 80,
        maxWidth: 1100
      }}>
        <h2 style={{
          fontSize: "clamp(56px, 7.5vw, 124px)",
          fontWeight: 600,
          lineHeight: 0.92,
          letterSpacing: "-0.045em",
          color: "#E5E7EB",
          margin: 0,
          textWrap: "balance"
        }}>
          Four products. <span style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(229,231,235,0.55)" }}>One operating system.</span>
        </h2>
        <p style={{
          fontSize: 20,
          lineHeight: 1.55,
          fontWeight: 300,
          color: "rgba(229,231,235,0.78)",
          margin: 0,
          textWrap: "pretty",
          maxWidth: 720
        }}>
          Most studios sell one piece. We build the whole loop — the site, the funnel, the automation, the plan that connects them. Pick the entry point that fits where you are.
        </p>
      </div>

      <CardStack items={productItems} cardWidth={1100} cardHeight={680} overlap={0.6} spreadDeg={16} maxVisible={5} />
    </div>
  </SectionShell>
);

/* ---------------- About section ---------------- */
const AboutSection = () => (
  <SectionShell padding="120px 60px">
      <SectionLabel index="02" label="Who we are" />

      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
        gap: 100,
        alignItems: "start"
      }}>
        <div>
          <h2 style={{
            fontSize: "clamp(48px, 5.5vw, 88px)",
            fontWeight: 300,
            fontStyle: "italic",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: "#E5E7EB",
            margin: 0,
            marginBottom: 36
          }}>
            A small studio that <span style={{ fontStyle: "normal", fontWeight: 600 }}>ships.</span>
          </h2>
          <p style={{
            fontSize: 22,
            lineHeight: 1.45,
            fontWeight: 300,
            color: "rgba(229,231,235,0.85)",
            margin: 0,
            marginBottom: 24,
            textWrap: "pretty"
          }}>
            Mainframe Digital is an Auckland-based studio working with operators who are tired of paying agency rates for templated sites and disconnected tools.
          </p>
          <p style={{
            fontSize: 17,
            lineHeight: 1.65,
            fontWeight: 300,
            color: "rgba(229,231,235,0.65)",
            margin: 0,
            textWrap: "pretty"
          }}>
            We treat your business like a system. Every project starts with how revenue actually moves through your company — then we design the site, pipeline, and automations to match. No retainers for work that should ship in weeks. No dashboards nobody opens.
          </p>
        </div>

        <BoxedSurface padding="44px 48px">
          <div style={{
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(229,231,235,0.55)",
            marginBottom: 28
          }}>How we work</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            {[
              { k: "01", t: "Diagnose", v: "We map your funnel end-to-end before touching a pixel." },
              { k: "02", t: "Design", v: "Custom UI, custom copy, custom logic. No template stretch." },
              { k: "03", t: "Automate", v: "Connect the stack so the manual work disappears." },
              { k: "04", t: "Measure", v: "Numbers that show whether the build paid for itself." }
            ].map((row) => (
              <div key={row.k} style={{
                display: "grid",
                gridTemplateColumns: "44px 130px 1fr",
                gap: 16,
                alignItems: "baseline",
                paddingBottom: 18,
                borderBottom: "1px solid rgba(229,231,235,0.1)"
              }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "0.16em",
                  color: "rgba(229,231,235,0.45)"
                }}>{row.k}</div>
                <div style={{
                  fontSize: 18,
                  fontWeight: 500,
                  color: "#E5E7EB",
                  letterSpacing: "-0.01em"
                }}>{row.t}</div>
                <div style={{
                  fontSize: 14,
                  lineHeight: 1.5,
                  fontWeight: 300,
                  color: "rgba(229,231,235,0.7)"
                }}>{row.v}</div>
              </div>
            ))}
          </div>
        </BoxedSurface>
      </div>
  </SectionShell>
);

/* ---------------- Services / capabilities grid ---------------- */
const services = [
  { k: "Sites", v: "Built from scratch in code. No drag-drop builders, no plugin sprawl." },
  { k: "Apps", v: "Internal tools, customer portals, dashboards — whatever the workflow needs." },
  { k: "Funnels", v: "Landing pages, lead magnets, nurture flows, booking systems wired together." },
  { k: "Automation", v: "Zapier · Make · custom APIs. Lead capture, CRM sync, ops, reporting." },
  { k: "Copy", v: "Headlines that actually say something. Written by humans, for humans." },
  { k: "Strategy", v: "A 90-day plan tied to revenue, not vanity metrics." }
];

const ServicesSection = () => (
  <SectionShell padding="120px 60px">
      <SectionLabel index="03" label="Capabilities" />

      <h2 style={{
        fontSize: "clamp(48px, 5.5vw, 80px)",
        fontWeight: 600,
        lineHeight: 0.95,
        letterSpacing: "-0.035em",
        color: "#E5E7EB",
        margin: 0,
        marginBottom: 56,
        maxWidth: 900
      }}>
        Everything under one roof, <span style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(229,231,235,0.55)" }}>billed once.</span>
      </h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 0,
        border: "1px solid rgba(229,231,235,0.18)",
        background: "linear-gradient(135deg, rgba(28,33,43,0.85) 0%, rgba(13,17,23,0.92) 100%)",
        backdropFilter: "blur(12px) saturate(160%)",
        WebkitBackdropFilter: "blur(12px) saturate(160%)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
        position: "relative"
      }}>
        <DotPattern width={6} height={6} cr={0.6} color="rgba(229,231,235,0.08)" />
        {[
          { top: -5, left: -5 },
          { top: -5, right: -5 },
          { bottom: -5, left: -5 },
          { bottom: -5, right: -5 }
        ].map((pos, i) => (
          <div key={i} style={{
            position: "absolute",
            width: 10, height: 10,
            background: "#E5E7EB",
            zIndex: 2,
            ...pos
          }} />
        ))}

        {services.map((s, i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          return (
            <div key={s.k} style={{
              position: "relative",
              padding: "44px 40px 48px",
              borderRight: col < 2 ? "1px solid rgba(229,231,235,0.1)" : "none",
              borderBottom: row === 0 ? "1px solid rgba(229,231,235,0.1)" : "none",
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 24
            }}>
              <div style={{
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(229,231,235,0.55)"
              }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div style={{
                  fontSize: 30,
                  fontWeight: 500,
                  color: "#E5E7EB",
                  letterSpacing: "-0.02em",
                  marginBottom: 12
                }}>{s.k}</div>
                <div style={{
                  fontSize: 15,
                  lineHeight: 1.55,
                  fontWeight: 300,
                  color: "rgba(229,231,235,0.7)",
                  textWrap: "pretty"
                }}>{s.v}</div>
              </div>
            </div>
          );
        })}
      </div>
  </SectionShell>
);

/* ---------------- Final CTA section ---------------- */
const FinalCTASection = () => {
  const [hovered, setHovered] = sUseState(false);

  return (
    <SectionShell padding="140px 60px 120px">
        <SectionLabel index="04" label="Let's get to it" />

        <BoxedSurface padding="80px 80px 88px" style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.05) 100%)",
          backdropFilter: "blur(14px) saturate(160%)",
          WebkitBackdropFilter: "blur(14px) saturate(160%)"
        }}>
          {/* glass sheen */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "40%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 100%)",
            pointerEvents: "none",
            zIndex: 0
          }} />

          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.3fr) minmax(0, 1fr)",
            gap: 80,
            alignItems: "center"
          }}>
            <div>
              <h2 style={{
                fontSize: "clamp(56px, 7.5vw, 120px)",
                fontWeight: 600,
                lineHeight: 0.92,
                letterSpacing: "-0.045em",
                color: "#E5E7EB",
                margin: 0
              }}>
                Still paying <span style={{ fontStyle: "italic", fontWeight: 300, color: "rgba(229,231,235,0.55)" }}>$5k a month</span> for a site that doesn't&nbsp;sell?
              </h2>
              <p style={{
                fontSize: 22,
                lineHeight: 1.45,
                fontWeight: 300,
                color: "rgba(229,231,235,0.78)",
                margin: 0,
                marginTop: 32,
                maxWidth: 640,
                textWrap: "pretty"
              }}>
                Most businesses are bleeding money on disconnected tools, vague retainers, and websites built from templates that were never theirs to begin with. We fix that — once, properly.
              </p>
            </div>

            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 28
            }}>
              <button
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: hovered ? 28 : 22,
                  background: "linear-gradient(135deg, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.18) 100%)",
                  backdropFilter: "blur(18px) saturate(180%)",
                  WebkitBackdropFilter: "blur(18px) saturate(180%)",
                  border: "1px solid rgba(255,255,255,0.34)",
                  boxShadow: hovered
                    ? "inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(255,255,255,0.1), 0 14px 40px rgba(0,0,0,0.4)"
                    : "inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(255,255,255,0.08), 0 8px 28px rgba(0,0,0,0.3)",
                  color: "#E5E7EB",
                  paddingLeft: 44,
                  paddingRight: 12,
                  paddingTop: 12,
                  paddingBottom: 12,
                  borderRadius: 999,
                  fontSize: 24,
                  fontWeight: 500,
                  letterSpacing: "-0.015em",
                  transition: "all 0.3s ease",
                  transform: hovered ? "translateY(-2px)" : "translateY(0)",
                  overflow: "hidden",
                  cursor: "pointer",
                  fontFamily: "inherit"
                }}>
                <span style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: "50%",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 100%)",
                  borderRadius: "999px 999px 0 0",
                  pointerEvents: "none"
                }} />
                <span style={{ position: "relative", zIndex: 1 }}>Book a free audit</span>
                <span style={{
                  position: "relative",
                  zIndex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 70, height: 70,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(13,17,23,0.95) 0%, rgba(28,33,43,0.95) 100%)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 12px rgba(0,0,0,0.4)",
                  transition: "transform 0.3s ease",
                  transform: hovered ? "scale(1.06) rotate(-12deg)" : "scale(1)"
                }}>
                  <ArrowRight size={26} color="#E5E7EB" />
                </span>
              </button>

              <div style={{
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(229,231,235,0.55)",
                lineHeight: 1.6
              }}>
                30 minutes · no pitch · no retainer
                <br />
                Walk away with a written plan, regardless.
              </div>
            </div>
          </div>
        </BoxedSurface>
    </SectionShell>
  );
};

/* ---------------- Footer ---------------- */
const Footer = () => (
  <footer style={{ padding: "80px 80px 56px", borderTop: "1px solid rgba(229,231,235,0.1)" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)",
        gap: 60,
        marginBottom: 64
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <MFDLogo size={56} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#E5E7EB",
                lineHeight: 1
              }}>Mainframe Digital</span>
              <span style={{
                fontSize: 10,
                fontWeight: 400,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(229,231,235,0.5)",
                lineHeight: 1
              }}>Design · Automate · Grow</span>
            </div>
          </div>
          <p style={{
            fontSize: 14,
            lineHeight: 1.65,
            fontWeight: 300,
            color: "rgba(229,231,235,0.6)",
            maxWidth: 360,
            margin: 0
          }}>
            Tomorrow's systems, today. A New Zealand digital studio for operators who want one team to ship the whole loop.
          </p>
        </div>

        {[
          { title: "Studio", links: ["Our work", "Process", "About", "Careers"] },
          { title: "Services", links: ["Websites", "Web Apps", "Funnels", "Automation"] },
          { title: "Contact", links: ["hello@mainframe.digital", "Auckland · NZ", "Booking Q3 '26", "Instagram"] }
        ].map((col) => (
          <div key={col.title}>
            <div style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "rgba(229,231,235,0.5)",
              marginBottom: 18
            }}>{col.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {col.links.map((l) => (
                <a key={l} href="#" style={{
                  fontSize: 15,
                  fontWeight: 300,
                  color: "rgba(229,231,235,0.85)"
                }}>{l}</a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        paddingTop: 28,
        borderTop: "1px solid rgba(229,231,235,0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: 12,
        fontWeight: 400,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "rgba(229,231,235,0.4)"
      }}>
        <span>© 2026 Mainframe Digital — Aotearoa</span>
        <span>v.2026.05 · 36.8485°S 174.7633°E</span>
      </div>
    </div>
  </footer>
);

/* ---------------- Page assembly ---------------- */
const MainframePage = () => (
  <>
    <MainframeHero />
    <SectionsBackdrop>
      <ProductsSection />
      <AboutSection />
      <ServicesSection />
      <FinalCTASection />
    </SectionsBackdrop>
    <Footer />
  </>
);

// Override the hero-only render
ReactDOM.createRoot(document.getElementById("root")).render(<MainframePage />);
