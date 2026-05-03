import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";

const { fontFamily: INTER } = loadInter();
const { fontFamily: BEBAS } = loadBebas();

const COLORS = {
  ink: "#08080C",
  inkRaised: "#13131C",
  bone: "#F2F2F4",
  boneSoft: "rgba(242,242,244,0.62)",
  boneDim: "rgba(242,242,244,0.38)",
  neon: "#FF4D1A", // signature DJ orange
  neonHi: "#FF8A3D",
  cyan: "#22E5FF",
  magenta: "#FF2EA0",
};

// ---------- Animated background: equalizer bars + radial gradient ----------
const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const barCount = 28;
  const bars = Array.from({ length: barCount });

  return (
    <AbsoluteFill style={{ background: COLORS.ink, overflow: "hidden" }}>
      {/* Radial glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 50% at 50% 30%, rgba(255,77,26,0.28) 0%, rgba(8,8,12,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(70% 50% at 50% 100%, rgba(34,229,255,0.18) 0%, rgba(8,8,12,0) 60%)`,
        }}
      />
      {/* Equalizer bars at bottom */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: height * 0.55,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "0 24px",
          opacity: 0.42,
        }}
      >
        {bars.map((_, i) => {
          const phase = i * 0.42;
          const speed = 0.18;
          const v =
            (Math.sin(frame * speed + phase) +
              Math.sin(frame * speed * 1.7 + phase * 0.6)) /
            2;
          const h = interpolate(v, [-1, 1], [40, height * 0.5]);
          const hue = i % 2 === 0 ? COLORS.neon : COLORS.cyan;
          return (
            <div
              key={i}
              style={{
                width: (width - 24 * 2) / barCount - 6,
                height: h,
                background: `linear-gradient(180deg, ${hue} 0%, rgba(255,77,26,0) 100%)`,
                borderRadius: 4,
                boxShadow: `0 0 18px ${hue}`,
              }}
            />
          );
        })}
      </div>
      {/* Grain / scanlines */}
      <AbsoluteFill
        style={{
          background:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 4px)",
          mixBlendMode: "overlay",
        }}
      />
      {/* Vignette */}
      <AbsoluteFill
        style={{
          boxShadow: "inset 0 0 240px 60px rgba(0,0,0,0.85)",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- Reusable sequence wrapper that fades in/out ----------
const Beat: React.FC<{
  from: number;
  duration: number;
  children: React.ReactNode;
}> = ({ from, duration, children }) => {
  return (
    <Sequence from={from} durationInFrames={duration} layout="none">
      <BeatBody duration={duration}>{children}</BeatBody>
    </Sequence>
  );
};

const BeatBody: React.FC<{ duration: number; children: React.ReactNode }> = ({
  duration,
  children,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 6], [0, 1], {
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [duration - 8, duration - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);
  return (
    <AbsoluteFill
      style={{
        opacity,
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ---------- Scene 1: Hook ----------
const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 140 } });
  return (
    <div style={{ textAlign: "center", transform: `scale(${0.85 + pop * 0.15})` }}>
      <div
        style={{
          fontFamily: INTER,
          fontWeight: 700,
          fontSize: 44,
          letterSpacing: "0.42em",
          color: COLORS.neon,
          textTransform: "uppercase",
          marginBottom: 32,
        }}
      >
        Press Play
      </div>
      <div
        style={{
          fontFamily: BEBAS,
          fontSize: 280,
          lineHeight: 0.88,
          color: COLORS.bone,
          letterSpacing: "-0.01em",
          textShadow: `0 0 60px rgba(255,77,26,0.35)`,
        }}
      >
        READY
        <br />
        TO DJ?
      </div>
    </div>
  );
};

// ---------- Scene 2: Brand reveal ----------
const SceneBrand: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const slam = spring({ frame, fps, config: { damping: 12, stiffness: 180 } });
  const slide = interpolate(slam, [0, 1], [80, 0]);
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: INTER,
          fontWeight: 600,
          fontSize: 36,
          letterSpacing: "0.5em",
          color: COLORS.cyan,
          textTransform: "uppercase",
          marginBottom: 28,
          opacity: slam,
        }}
      >
        Welcome to
      </div>
      <div
        style={{
          fontFamily: BEBAS,
          fontSize: 220,
          lineHeight: 0.86,
          color: COLORS.bone,
          letterSpacing: "0.005em",
          transform: `translateY(${slide}px)`,
        }}
      >
        INDUSTRY
        <br />
        <span style={{ color: COLORS.neon, textShadow: `0 0 40px ${COLORS.neon}` }}>
          DJ SCHOOL
        </span>
      </div>
      <div
        style={{
          marginTop: 40,
          fontFamily: INTER,
          fontWeight: 400,
          fontSize: 38,
          color: COLORS.boneSoft,
          fontStyle: "italic",
          opacity: slam,
        }}
      >
        Your stage starts here.
      </div>
    </div>
  );
};

// ---------- Scene: Feature card ----------
const FeatureCard: React.FC<{
  index: string;
  title: string;
  body: string;
  accent: string;
}> = ({ index, title, body, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 160 },
  });
  const ty = interpolate(enter, [0, 1], [60, 0]);
  return (
    <div
      style={{
        width: "82%",
        transform: `translateY(${ty}px)`,
        opacity: enter,
        textAlign: "left",
      }}
    >
      <div
        style={{
          fontFamily: INTER,
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: "0.42em",
          color: accent,
          textTransform: "uppercase",
          marginBottom: 24,
        }}
      >
        {index} · Feature
      </div>
      <div
        style={{
          fontFamily: BEBAS,
          fontSize: 180,
          lineHeight: 0.88,
          color: COLORS.bone,
          letterSpacing: "-0.005em",
          textShadow: `0 0 40px ${accent}55`,
          marginBottom: 32,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: INTER,
          fontWeight: 400,
          fontSize: 42,
          lineHeight: 1.25,
          color: COLORS.boneSoft,
          maxWidth: "92%",
        }}
      >
        {body}
      </div>
      {/* Accent bar */}
      <div
        style={{
          marginTop: 48,
          width: 220,
          height: 8,
          background: accent,
          boxShadow: `0 0 24px ${accent}`,
          borderRadius: 4,
        }}
      />
    </div>
  );
};

// ---------- Scene: Course tease ----------
const SceneCourse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 12, stiffness: 140 } });
  return (
    <div
      style={{
        textAlign: "center",
        transform: `scale(${0.9 + pop * 0.1})`,
        opacity: pop,
      }}
    >
      <div
        style={{
          fontFamily: INTER,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: "0.42em",
          color: COLORS.cyan,
          textTransform: "uppercase",
          marginBottom: 32,
        }}
      >
        Start Today
      </div>
      <div
        style={{
          fontFamily: BEBAS,
          fontSize: 220,
          lineHeight: 0.88,
          color: COLORS.bone,
        }}
      >
        DJ <span style={{ color: COLORS.neon }}>INTRO</span>
        <br />
        COURSE
      </div>
      <div
        style={{
          marginTop: 36,
          fontFamily: INTER,
          fontWeight: 400,
          fontSize: 36,
          color: COLORS.boneSoft,
          fontStyle: "italic",
        }}
      >
        Self-paced. Industry-led. Job-ready.
      </div>
    </div>
  );
};

// ---------- Scene: CTA ----------
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 150 } });
  const pulse = 1 + Math.sin(frame * 0.32) * 0.025;
  return (
    <div style={{ textAlign: "center", opacity: pop }}>
      <div
        style={{
          fontFamily: BEBAS,
          fontSize: 240,
          lineHeight: 0.88,
          color: COLORS.bone,
          textShadow: `0 0 70px ${COLORS.neon}`,
          transform: `scale(${pulse})`,
        }}
      >
        JOIN
        <br />
        <span style={{ color: COLORS.neon }}>NOW</span>
      </div>
      <div
        style={{
          marginTop: 56,
          display: "inline-block",
          padding: "26px 56px",
          borderRadius: 999,
          background: COLORS.bone,
          color: COLORS.ink,
          fontFamily: INTER,
          fontWeight: 700,
          fontSize: 38,
          letterSpacing: "0.04em",
          boxShadow: `0 20px 60px rgba(255,77,26,0.45)`,
        }}
      >
        industrydjschool.com
      </div>
    </div>
  );
};

// ---------- Top brand chip (persistent after brand reveal) ----------
const TopChip: React.FC = () => {
  const frame = useCurrentFrame();
  // Show from frame 75 onward
  const visible = frame >= 75;
  const opacity = interpolate(frame, [75, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (!visible) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 60,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          padding: "14px 26px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(10px)",
          fontFamily: INTER,
          fontWeight: 700,
          fontSize: 22,
          letterSpacing: "0.34em",
          color: COLORS.bone,
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: COLORS.neon,
            boxShadow: `0 0 12px ${COLORS.neon}`,
          }}
        />
        Industry DJ School
      </div>
    </div>
  );
};

// ---------- Master composition ----------
export const IndustryDJAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: COLORS.ink }}>
      <Backdrop />
      <TopChip />

      {/* 0–30 (0–1s) hook */}
      <Beat from={0} duration={32}>
        <SceneHook />
      </Beat>

      {/* 30–75 (1–2.5s) brand */}
      <Beat from={32} duration={44}>
        <SceneBrand />
      </Beat>

      {/* Five features, ~30 frames each (75–225 = 5s) */}
      <Beat from={76} duration={30}>
        <FeatureCard
          index="01"
          title={"AI DJ\nASSISTANT"}
          body="Industry-first. Trained on real DJ school scenarios — instant answers, 24/7."
          accent={COLORS.neon}
        />
      </Beat>
      <Beat from={106} duration={30}>
        <FeatureCard
          index="02"
          title={"INTERACTIVE\nTUTORS"}
          body="Real mentors mark every assessment and give you personal feedback."
          accent={COLORS.cyan}
        />
      </Beat>
      <Beat from={136} duration={30}>
        <FeatureCard
          index="03"
          title={"MUSIC\nLIBRARY"}
          body="Curated tracks, exclusive packs, and the tools to build your sound."
          accent={COLORS.magenta}
        />
      </Beat>
      <Beat from={166} duration={30}>
        <FeatureCard
          index="04"
          title={"1:1\nCOACHING"}
          body="Direct sessions with working DJs. Learn at your pace, on your time."
          accent={COLORS.neonHi}
        />
      </Beat>
      <Beat from={196} duration={30}>
        <FeatureCard
          index="05"
          title={"REAL\nGIGS."}
          body="Graduate into employment opportunities — gigs, residencies, and bookings."
          accent={COLORS.neon}
        />
      </Beat>

      {/* 226–268 (≈1.4s) course tease */}
      <Beat from={226} duration={44}>
        <SceneCourse />
      </Beat>

      {/* 268–300 (≈1.1s) CTA */}
      <Beat from={268} duration={32}>
        <SceneCTA />
      </Beat>
    </AbsoluteFill>
  );
};
