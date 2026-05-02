const { useRef, useState, useEffect, useLayoutEffect } = React;

/* ---------------- useViewport: width-driven breakpoints ---------------- */
const useViewport = () => {
  const get = () => (typeof window === "undefined" ? 1440 : window.innerWidth);
  const [w, setW] = useState(get);
  useEffect(() => {
    const on = () => setW(get());
    window.addEventListener("resize", on, { passive: true });
    return () => window.removeEventListener("resize", on);
  }, []);
  return { w, isMobile: w < 768, isTablet: w < 1024 };
};

/* ---------------- motion shim: Web Animations API ---------------- */
const makeMotion = (Tag) => React.forwardRef((props, fwdRef) => {
  const {
    initial = {}, animate = {}, exit, transition = {}, whileHover, whileTap, variants,
    style, className, children, ...rest
  } = props;
  const localRef = useRef(null);
  const setRef = (el) => {
    localRef.current = el;
    if (typeof fwdRef === "function") fwdRef(el);else
    if (fwdRef) fwdRef.current = el;
  };
  useLayoutEffect(() => {
    const el = localRef.current;
    if (!el) return;
    const fromY = initial.y ?? 0;
    const toY = animate.y ?? 0;
    const fromOpacity = initial.opacity ?? 1;
    const toOpacity = animate.opacity ?? 1;
    const dur = (transition.duration ?? 0.8) * 1000;
    const delay = (transition.delay ?? 0) * 1000;
    const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
    try {
      el.animate(
        [
        { opacity: fromOpacity, transform: `translateY(${fromY}px)` },
        { opacity: toOpacity, transform: `translateY(${toY}px)` }],

        { duration: dur, delay, fill: "both", easing: ease }
      );
    } catch (e) {
      // fallback: just set the final state
      el.style.opacity = toOpacity;
      el.style.transform = `translateY(${toY}px)`;
    }
  }, []);
  return React.createElement(Tag, { ...rest, ref: setRef, style, className, children });
});

const motion = {
  div: makeMotion("div"),
  span: makeMotion("span"),
  nav: makeMotion("nav"),
  p: makeMotion("p"),
  button: makeMotion("button"),
  a: makeMotion("a"),
  section: makeMotion("section"),
  h1: makeMotion("h1"),
  h2: makeMotion("h2")
};
const useInView = () => true;

/* ---------------- TypewriterText: types/deletes through an array of words ---------------- */
const TypewriterText = ({
  texts,
  initialText = null,
  initialHold = 1100,
  typeSpeed = 90,
  deleteSpeed = 50,
  holdTime = 1400,
  style
}) => {
  // If initialText is provided, render it fully on first paint, then delete it
  // and roll through `texts` in a loop. The initialText itself is NOT part of the loop.
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(initialText ?? "");
  const [phase, setPhase] = useState(initialText ? "intro-holding" : "typing");
  // phases: intro-holding | intro-deleting | typing | holding | deleting

  useEffect(() => {
    let t;
    if (phase === "intro-holding") {
      t = setTimeout(() => setPhase("intro-deleting"), initialHold);
    } else if (phase === "intro-deleting") {
      if (shown.length > 0) {
        t = setTimeout(() => setShown(shown.slice(0, shown.length - 1)), deleteSpeed);
      } else {
        setPhase("typing");
      }
    } else if (phase === "typing") {
      const current = texts[idx];
      if (shown.length < current.length) {
        t = setTimeout(() => setShown(current.slice(0, shown.length + 1)), typeSpeed);
      } else {
        t = setTimeout(() => setPhase("deleting"), holdTime);
      }
    } else if (phase === "deleting") {
      const current = texts[idx];
      if (shown.length > 0) {
        t = setTimeout(() => setShown(current.slice(0, shown.length - 1)), deleteSpeed);
      } else {
        setIdx((i) => (i + 1) % texts.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(t);
  }, [shown, phase, idx, texts, typeSpeed, deleteSpeed, holdTime, initialHold]);

  return (
    <span style={{ display: "inline-block", ...style }}>
      {shown}
      <span style={{
        display: "inline-block",
        width: "0.06em",
        height: "0.85em",
        background: "currentColor",
        marginLeft: "0.05em",
        verticalAlign: "baseline",
        animation: "_tw_blink 1s steps(2) infinite",
        opacity: 0.85
      }} />
    </span>);

};

// inject blink keyframes once
if (typeof document !== "undefined" && !document.getElementById("_tw_blink_kf")) {
  const s = document.createElement("style");
  s.id = "_tw_blink_kf";
  s.textContent = `@keyframes _tw_blink { 0%, 50% { opacity: 0.85; } 50.01%, 100% { opacity: 0; } }`;
  document.head.appendChild(s);
}

/* ---------------- GooeyText: blurred word morph ---------------- */
const GooeyText = ({ texts, morphTime = 1.1, cooldownTime = 1.4, style, textStyle }) => {
  const t1 = useRef(null);
  const t2 = useRef(null);

  useEffect(() => {
    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;
    let raf;

    const setMorph = (fraction) => {
      if (!t1.current || !t2.current) return;
      t2.current.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      t2.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
      const inv = 1 - fraction;
      t1.current.style.filter = `blur(${Math.min(8 / inv - 8, 100)}px)`;
      t1.current.style.opacity = `${Math.pow(inv, 0.4) * 100}%`;
    };

    const doCooldown = () => {
      morph = 0;
      if (!t1.current || !t2.current) return;
      t2.current.style.filter = "";
      t2.current.style.opacity = "100%";
      t1.current.style.filter = "";
      t1.current.style.opacity = "0%";
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;
      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }
      setMorph(fraction);
    };

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;
      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex = (textIndex + 1) % texts.length;
          if (t1.current && t2.current) {
            t1.current.textContent = texts[textIndex % texts.length];
            t2.current.textContent = texts[(textIndex + 1) % texts.length];
          }
        }
        doMorph();
      } else {
        doCooldown();
      }
    };
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block", ...style }}>
      <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true" focusable="false">
        <defs>
          <filter id="mfd-gooey-threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140" />


            



            
          </filter>
        </defs>
      </svg>
      <div style={{
        filter: "url(#mfd-gooey-threshold)",
        position: "relative",
        display: "inline-block",
        width: "100%"
      }}>
        <span ref={t1} style={{
          display: "inline-block",
          userSelect: "none",
          ...textStyle
        }}>{texts[texts.length - 1]}</span>
        <span ref={t2} style={{
          display: "inline-block",
          position: "absolute",
          left: 0, top: 0,
          userSelect: "none",
          ...textStyle
        }}>{texts[0]}</span>
      </div>
    </div>);

};

/* ---------------- WordsPullUp ---------------- */
const WordsPullUp = ({ text, className = "", showAsterisk = false, style }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={className} style={{ display: "inline-flex", flexWrap: "wrap", ...style }}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              display: "inline-block",
              position: "relative",
              marginRight: isLast ? 0 : "0.18em"
            }}>
            
            {word}
            {showAsterisk && isLast &&
            <span style={{
              position: "absolute",
              top: "0.08em",
              right: "-0.05em",
              fontSize: "0.3em",
              fontWeight: 400
            }}>®</span>
            }
          </motion.span>);

      })}
    </div>);

};

/* ---------------- MFD Logo ---------------- */
const MFDLogo = ({ size = 28 }) =>
<img
  src="assets/mfd-logo-real.png"
  alt="Mainframe Digital"
  style={{
    height: size,
    width: size,
    objectFit: "contain",
    filter: "invert(1) brightness(1.05)"
  }} />;


/* ---------------- DotPattern ---------------- */
const DotPattern = ({ width = 5, height = 5, cx = 1, cy = 0.5, cr = 0.5, color = "rgba(229,231,235,0.18)", style }) => {
  const id = React.useId();
  return (
    <svg
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        fill: color,
        ...style
      }}>
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse">
          <circle cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>);

};

/* ---------------- Arrow Right ---------------- */
const ArrowRight = ({ size = 16, color = "#E5E7EB" }) =>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>;


/* ---------------- Hero ---------------- */
const navItems = ["Our work", "Services", "Process", "About", "Contact"];

const MainframeHero = () => {
  const [hoveredNav, setHoveredNav] = useState(null);
  const [hoveredCTA, setHoveredCTA] = useState(false);
  const [scale, setScale] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const { isMobile, isTablet } = useViewport();

  return (
    <section style={{
      height: "100dvh",
      width: "100%",
      padding: isMobile ? "12px" : "20px",
      background: "transparent",
      position: "relative"
    }}>
      <div style={{
        position: "relative",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        borderRadius: 24,
        padding: 2,
        background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 35%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.08) 80%, rgba(255,255,255,0.22) 100%)",
        backdropFilter: "blur(8px) saturate(140%)",
        WebkitBackdropFilter: "blur(8px) saturate(140%)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(255,255,255,0.04), 0 0 0 1px rgba(255,255,255,0.08)"
      }}>
        {/* Outer glass sheen */}
        <span aria-hidden="true" style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "30%",
          background: "linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 100%)",
          borderRadius: "24px 24px 0 0",
          pointerEvents: "none",
          zIndex: 1
        }} />

        <div style={{
          position: "relative",
          height: "100%",
          width: "100%",
          overflow: "hidden",
          borderRadius: 20,
          background: "#0D1117",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 0 1px rgba(255,255,255,0.06)"
        }}>

        {/* Background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center"
          }}>
          <source src="assets/hero-bg.webm" type="video/webm" />
          <source src="assets/hero-bg.mp4" type="video/mp4" />
        </video>


        {/* Noise overlay */}
        <div className="noise-overlay" style={{
          position: "absolute",
          inset: 0,
          opacity: 0.35,
          mixBlendMode: "overlay",
          pointerEvents: "none"
        }} />

        {/* Top gradient — navbar legibility */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(13,17,23,0.55) 0%, rgba(13,17,23,0) 22%, rgba(13,17,23,0) 55%, rgba(13,17,23,0.85) 100%)",
          pointerEvents: "none"
        }} />

        {/* Subtle vignette on left for sun glare balance */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, rgba(13,17,23,0.35) 0%, rgba(13,17,23,0) 35%, rgba(13,17,23,0) 65%, rgba(13,17,23,0.25) 100%)",
          pointerEvents: "none"
        }} />

        {/* Top bar — logo + nav + CTA */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: isMobile ? 12 : 24,
          padding: isMobile ? "14px 16px" : "22px 32px"
        }}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: isMobile ? 12 : isTablet ? 18 : 32,
              minWidth: 0
            }}>

            <MFDLogo size={isMobile ? 44 : isTablet ? 56 : 168} />
            {!isTablet && (
              <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? 4 : 8, minWidth: 0 }}>
                <span style={{
                  fontSize: isMobile ? 14 : 32,
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#E5E7EB",
                  lineHeight: 1,
                  whiteSpace: "nowrap"
                }}>Mainframe Digital</span>
                {!isMobile && (
                  <span style={{
                    fontSize: 20,
                    fontWeight: 400,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "rgba(229,231,235,0.55)",
                    lineHeight: 1,
                    whiteSpace: "nowrap"
                  }}>Design, Automate, Grow</span>
                )}
              </div>
            )}
          </motion.div>

          {/* Nav pill — liquid glass (desktop / tablet only) */}
          {!isMobile && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: isTablet ? 22 : 44,
              background: "linear-gradient(135deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.14) 100%)",
              backdropFilter: "blur(18px) saturate(180%)",
              WebkitBackdropFilter: "blur(18px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.28)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.28)",
              borderRadius: 999,
              padding: isTablet ? "12px 22px" : "18px 38px",
              overflow: "hidden"
            }}>

            {/* Glass highlight sheen */}
            <span style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "50%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)",
              borderRadius: "999px 999px 0 0",
              pointerEvents: "none"
            }} />

            {navItems.map((item) =>
            <a
              key={item}
              href="#"
              onMouseEnter={() => setHoveredNav(item)}
              onMouseLeave={() => setHoveredNav(null)}
              style={{
                position: "relative",
                zIndex: 1,
                fontSize: isTablet ? 14 : 18,
                fontWeight: 500,
                letterSpacing: "0.02em",
                color: hoveredNav === item ? "#FFFFFF" : "rgba(229,231,235,0.78)",
                transition: "color 0.2s ease",
                whiteSpace: "nowrap"
              }}>

                {item}
              </a>
            )}
          </motion.nav>
          )}

          {!isTablet && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(229,231,235,0.65)",
              whiteSpace: "nowrap"
            }}>

            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7CFFB2", boxShadow: "0 0 8px #7CFFB2" }} />
              Booking · Q3 ’26
            </span>
            <span style={{ width: 1, height: 14, background: "rgba(229,231,235,0.2)" }} />
            <span>Auckland · NZ</span>
          </motion.div>
          )}

          {/* Hamburger — mobile only */}
          {isMobile && (
            <motion.button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              style={{
                position: "relative",
                width: 48, height: 48,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.14) 100%)",
                backdropFilter: "blur(18px) saturate(180%)",
                WebkitBackdropFilter: "blur(18px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.28)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 4px 16px rgba(0,0,0,0.28)",
                cursor: "pointer",
                flexShrink: 0
              }}>
              <span aria-hidden="true" style={{
                position: "relative",
                width: 18, height: 12,
                display: "inline-block"
              }}>
                <span style={{
                  position: "absolute", left: 0, right: 0, top: menuOpen ? 5 : 0,
                  height: 1.5, background: "#E5E7EB", borderRadius: 1,
                  transform: menuOpen ? "rotate(45deg)" : "none",
                  transition: "transform 0.25s ease, top 0.25s ease"
                }} />
                <span style={{
                  position: "absolute", left: 0, right: 0, top: 5,
                  height: 1.5, background: "#E5E7EB", borderRadius: 1,
                  opacity: menuOpen ? 0 : 1,
                  transition: "opacity 0.2s ease"
                }} />
                <span style={{
                  position: "absolute", left: 0, right: 0, top: menuOpen ? 5 : 10,
                  height: 1.5, background: "#E5E7EB", borderRadius: 1,
                  transform: menuOpen ? "rotate(-45deg)" : "none",
                  transition: "transform 0.25s ease, top 0.25s ease"
                }} />
              </span>
            </motion.button>
          )}
        </div>

        {/* Mobile nav sheet */}
        {isMobile && menuOpen && (
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 19,
              background: "rgba(13,17,23,0.78)",
              backdropFilter: "blur(18px) saturate(160%)",
              WebkitBackdropFilter: "blur(18px) saturate(160%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              justifyContent: "center",
              padding: "100px 28px 32px"
            }}>
            <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {navItems.map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    fontSize: 28,
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                    color: "#E5E7EB",
                    padding: "14px 0",
                    borderBottom: "1px solid rgba(229,231,235,0.12)"
                  }}>{item}</a>
              ))}
            </nav>
            <div style={{
              marginTop: 32,
              display: "flex",
              flexDirection: "column",
              gap: 10,
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "rgba(229,231,235,0.65)"
            }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7CFFB2", boxShadow: "0 0 8px #7CFFB2" }} />
                Booking · Q3 ’26
              </span>
              <span>Auckland · NZ</span>
            </div>
          </div>
        )}

        {/* Side rails — meta (hidden on mobile per design system) */}
        {!isTablet && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          style={{
            position: "absolute",
            right: 14,
            top: "50%",
            transform: "translateY(-50%) rotate(90deg)",
            transformOrigin: "right center",
            fontSize: 10,
            fontWeight: 400,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "rgba(229,231,235,0.45)",
            whiteSpace: "nowrap"
          }}>

          Scroll · 36.8485°S 174.7633°E
        </motion.div>
        )}

        {/* Floating tagline pill — top center under nav, hidden when nav too crowded */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          style={{
            position: "absolute",
            top: 110,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            border: "1px solid rgba(229,231,235,0.18)",
            borderRadius: 999,
            background: "rgba(13,17,23,0.4)",
            backdropFilter: "blur(8px)",
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(229,231,235,0.78)"
          }}>


        </motion.div>

        {/* Hero content */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0, right: 0,
          padding: isMobile ? "0 18px 24px" : isTablet ? "0 36px 36px" : "0 80px 48px"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : isTablet ? "minmax(0, 1fr)" : "minmax(0, 1fr) minmax(0, 1.05fr)",
            alignItems: "end",
            gap: isMobile ? 24 : isTablet ? 32 : 56
          }}>

            {/* Left — giant wordmark */}
            <div>
              <h1 style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(80px, 17vw, 270px)",
                lineHeight: 0.85,
                letterSpacing: "-0.06em",
                color: "#E5E7EB",
                margin: 0
              }}>
                <WordsPullUp text="Mainframe" showAsterisk />
              </h1>
              <h1 style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: isMobile ? "clamp(48px, 16vw, 96px)" : "clamp(70px, 11vw, 200px)",
                lineHeight: 0.85,
                letterSpacing: "-0.05em",
                color: "rgba(229,231,235,0.55)",
                margin: 0,
                marginTop: 4,
                whiteSpace: "nowrap"
              }}>
                <TypewriterText
                  initialText="Digital."
                  initialHold={1200}
                  texts={["Design.", "Automate.", "Grow."]}
                  typeSpeed={95}
                  deleteSpeed={55}
                  holdTime={1600}
                  style={{ color: "#E5E7EB" }} />
                
              </h1>
            </div>

            {/* Right — copy + CTA */}
            <div style={{
              position: "relative",
              maxWidth: isMobile ? "100%" : isTablet ? "100%" : 600,
              minWidth: 0,
              justifySelf: isMobile || isTablet ? "stretch" : "end",
              width: "100%",
              border: "1px solid rgba(229,231,235,0.22)",
              padding: isMobile ? "22px 20px" : isTablet ? "30px 32px" : "38px 42px"
            }}>
              {/* Dot pattern background */}
              <DotPattern width={6} height={6} cr={0.6} color="rgba(229,231,235,0.14)" />

              {/* Corner accents */}
              {[
              { top: -5, left: -5 },
              { top: -5, right: -5 },
              { bottom: -5, left: -5 },
              { bottom: -5, right: -5 }].
              map((pos, i) =>
              <div key={i} style={{
                position: "absolute",
                width: 10, height: 10,
                background: "#E5E7EB",
                zIndex: 2,
                ...pos
              }} />
              )}

              <div style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                gap: isMobile ? 20 : 32
              }}>
              <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontSize: isMobile ? 11 : isTablet ? 13 : 16,
                    fontWeight: 600,
                    letterSpacing: "0.34em",
                    textTransform: "uppercase",
                    color: "rgba(229,231,235,0.92)",
                    display: "flex",
                    alignItems: "center",
                    gap: isMobile ? 12 : 18
                  }}>

                <span style={{ width: isMobile ? 36 : 64, height: 1, background: "rgba(229,231,235,0.55)" }} />
                Tomorrow's systems, today
              </motion.div>

              <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    fontSize: isMobile ? 20 : isTablet ? 28 : 38,
                    lineHeight: 1.22,
                    fontWeight: 300,
                    color: "rgba(229,231,235,0.95)",
                    margin: 0,
                    textWrap: "pretty",
                    letterSpacing: "-0.02em"
                  }}>
                
                A New Zealand digital studio building the websites, web apps, and AI-driven automation that modern businesses actually run on.
              </motion.p>

              <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                    gap: isMobile ? 18 : 16
                  }}>

                <button
                    onMouseEnter={() => setHoveredCTA(true)}
                    onMouseLeave={() => setHoveredCTA(false)}
                    className="liquid-glass-btn"
                    style={{
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: hoveredCTA ? 22 : 18,
                      background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.16) 100%)",
                      backdropFilter: "blur(18px) saturate(180%)",
                      WebkitBackdropFilter: "blur(18px) saturate(180%)",
                      border: "1px solid rgba(255,255,255,0.28)",
                      boxShadow: hoveredCTA ?
                      "inset 0 1px 0 rgba(255,255,255,0.5), inset 0 -1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05)" :
                      "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(255,255,255,0.08), 0 4px 24px rgba(0,0,0,0.25)",
                      color: "#E5E7EB",
                      paddingLeft: isMobile ? 26 : 38,
                      paddingRight: isMobile ? 8 : 10,
                      paddingTop: isMobile ? 8 : 10,
                      paddingBottom: isMobile ? 8 : 10,
                      borderRadius: 999,
                      fontSize: isMobile ? 17 : 22,
                      fontWeight: 500,
                      letterSpacing: "-0.015em",
                      transition: "gap 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
                      transform: hoveredCTA ? "translateY(-2px)" : "translateY(0)",
                      overflow: "hidden",
                      cursor: "pointer"
                    }}>
                  {/* Glass highlight sheen */}
                  <span style={{
                      position: "absolute",
                      top: 0, left: 0, right: 0,
                      height: "50%",
                      background: "linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 100%)",
                      borderRadius: "999px 999px 0 0",
                      pointerEvents: "none"
                    }} />
                  <span style={{ position: "relative", zIndex: 1 }}>Work With Us</span>
                  <span style={{
                      position: "relative",
                      zIndex: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: isMobile ? 46 : 62, height: isMobile ? 46 : 62,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, rgba(13,17,23,0.95) 0%, rgba(28,33,43,0.95) 100%)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 4px 12px rgba(0,0,0,0.4)",
                      transition: "transform 0.3s ease",
                      transform: hoveredCTA ? "scale(1.06) rotate(-12deg)" : "scale(1)"
                    }}>
                    <ArrowRight size={isMobile ? 20 : 24} color="#E5E7EB" />
                  </span>
                </button>

                <a href="#" style={{
                    fontSize: isMobile ? 15 : 18,
                    fontWeight: 400,
                    color: "rgba(229,231,235,0.82)",
                    borderBottom: "1px solid rgba(229,231,235,0.4)",
                    paddingBottom: 4
                  }}>
                  See our work
                </a>
              </motion.div>

              {/* Mini stats row */}
              <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : "repeat(3, 1fr)",
                    gap: isMobile ? 14 : 16,
                    marginTop: 4,
                    paddingTop: isMobile ? 14 : 18,
                    borderTop: "1px solid rgba(229,231,235,0.12)"
                  }}>

                {[
                  { k: "Sites", v: "Build · Ship · Scale" },
                  { k: "Apps", v: "Custom web platforms" },
                  { k: "AI Ops", v: "Sales · Comms · Leads" }].
                  map((s, i) =>
                  <div key={i} style={isMobile ? {
                    display: "grid",
                    gridTemplateColumns: "82px 1fr",
                    alignItems: "baseline",
                    gap: 12
                  } : {}}>
                    <div style={{
                      fontSize: isMobile ? 11 : 12,
                      fontWeight: 500,
                      letterSpacing: "0.26em",
                      textTransform: "uppercase",
                      color: "rgba(229,231,235,0.62)",
                      marginBottom: isMobile ? 0 : 8
                    }}>{s.k}</div>
                    <div style={{ fontSize: isMobile ? 14 : 17, color: "#E5E7EB", letterSpacing: "-0.01em" }}>{s.v}</div>
                  </div>
                  )}
              </motion.div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Corner squares — match BoxedSurface treatment */}
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
          zIndex: 30,
          ...pos
        }} />
      ))}
    </section>);

};

// Expose for sections.jsx to use
Object.assign(window, { MainframeHero, MFDLogo, DotPattern, ArrowRight, motion, useViewport });