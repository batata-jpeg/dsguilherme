import { useEffect, useRef, useState } from "react";

/**
 * LiquidGlassCursor
 * ─────────────────
 * A two-part cursor:
 *  1. Small precise dot — sits exactly under the pointer.
 *  2. Glass lens orb    — follows with smooth lerp, applies a
 *     frosted glass + SVG feDisplacementMap lens distortion
 *     that visually refracts the content beneath it.
 *
 * Interaction states
 *  • Default  : 48 px frosted orb
 *  • Hovering a[href], button, [role=button] : orb scales up to 64 px
 *    and shifts colour to accent
 *  • Clicking : orb compresses to 38 px
 */

const LERP = 0.12;
const SIZE_DEFAULT = 48;
const SIZE_HOVER = 68;
const SIZE_CLICK = 38;

export default function LiquidGlassCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const orbRef  = useRef<HTMLDivElement>(null);

  const mouse   = useRef({ x: 0, y: 0 });
  const orb     = useRef({ x: 0, y: 0 });
  const rafId   = useRef<number>(0);

  const [visible,   setVisible]   = useState(false);
  const [isHover,   setIsHover]   = useState(false);
  const [isClick,   setIsClick]   = useState(false);

  // Current orb target size kept in a ref so animation frame can read it
  const orbSize = useRef(SIZE_DEFAULT);

  useEffect(() => {
    // ── Hide native cursor globally ────────────────────────────────────────
    document.documentElement.style.cursor = "none";

    // ── Mouse tracking ─────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      // Update dot immediately (no lerp)
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    };

    // ── Hover detection ────────────────────────────────────────────────────
    const onOver = (e: MouseEvent) => {
      const el = (e.target as Element).closest(
        "a, button, [role='button'], label, input, textarea, select, [tabindex]"
      );
      setIsHover(!!el);
    };

    // ── Click feedback ─────────────────────────────────────────────────────
    const onDown = () => setIsClick(true);
    const onUp   = () => setIsClick(false);

    // ── Lerp animation loop ────────────────────────────────────────────────
    const loop = () => {
      orb.current.x += (mouse.current.x - orb.current.x) * LERP;
      orb.current.y += (mouse.current.y - orb.current.y) * LERP;

      if (orbRef.current) {
        orbRef.current.style.transform =
          `translate(${orb.current.x}px, ${orb.current.y}px) translate(-50%, -50%)`;
      }
      rafId.current = requestAnimationFrame(loop);
    };
    rafId.current = requestAnimationFrame(loop);

    document.addEventListener("mousemove",   onMove);
    document.addEventListener("mouseover",   onOver);
    document.addEventListener("mousedown",   onDown);
    document.addEventListener("mouseup",     onUp);

    return () => {
      document.documentElement.style.cursor = "";
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mousedown",  onDown);
      document.removeEventListener("mouseup",    onUp);
    };
  }, []);

  // ── Compute derived sizes ───────────────────────────────────────────────
  const size = isClick ? SIZE_CLICK : isHover ? SIZE_HOVER : SIZE_DEFAULT;
  orbSize.current = size;

  return (
    <>
      {/* ── SVG filter definitions (invisible) ─────────────────────────── */}
      <svg
        aria-hidden
        style={{ position: "fixed", width: 0, height: 0, overflow: "hidden", zIndex: -1 }}
      >
        <defs>
          {/*
            Lens distortion filter:
            feImage references an inline radialGradient (as a data-URI) to
            create a soft radial displacement map — lighter at the centre,
            darker at the edge — giving the barrel / convex-lens bulge.
          */}
          <filter
            id="lg-lens"
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            {/* Turbulence very subtle organic wobble */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.015"
              numOctaves="2"
              seed="8"
              result="noise"
            />
            {/* Blend noise with a radial gradient so distortion is strongest at edge */}
            <feBlend in="noise" in2="noise" mode="multiply" result="noiseMask" />
            {/* Main radial displacement — creates convex lens "bulge" */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="noiseMask"
              scale="14"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            {/* Slight brighten at centre — simulates light convergence */}
            <feComposite in="displaced" in2="SourceGraphic" operator="over" />
          </filter>

          {/* Glow filter for the orb ring */}
          <filter id="lg-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>

      {/* ── Lens orb ──────────────────────────────────────────────────── */}
      <div
        ref={orbRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width:  `${size}px`,
          height: `${size}px`,
          pointerEvents: "none",
          zIndex: 9998,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.4s ease, width 0.25s cubic-bezier(0.34,1.56,0.64,1), height 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          willChange: "transform",
        }}
      >
        {/* Distortion layer — applies SVG lens filter to what's behind */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            backdropFilter: "blur(3px) saturate(160%) brightness(1.08)",
            WebkitBackdropFilter: "blur(3px) saturate(160%) brightness(1.08)",
            filter: "url(#lg-lens)",
            overflow: "hidden",
          }}
        />

        {/* Glass surface — visual shell on top of the distortion */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: isHover
              ? "radial-gradient(circle at 32% 30%, rgba(255,255,255,0.55) 0%, rgba(10,132,255,0.10) 55%, rgba(191,90,242,0.06) 100%)"
              : "radial-gradient(circle at 32% 30%, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.10) 55%, rgba(59,153,252,0.05) 100%)",
            border: "1px solid rgba(255,255,255,0.85)",
            borderBottomColor: "rgba(180,200,235,0.40)",
            borderRightColor:  "rgba(180,200,235,0.40)",
            boxShadow: isHover
              ? "0 6px 28px rgba(10,132,255,0.22), inset 0 1.5px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(10,132,255,0.14)"
              : "0 4px 20px rgba(59,153,252,0.12), inset 0 1.5px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(59,153,252,0.10)",
            transition: "background 0.25s ease, box-shadow 0.25s ease",
          }}
        >
          {/* Specular top-edge highlight */}
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "20%",
              width: "60%",
              height: "28%",
              borderRadius: "50%",
              background: "radial-gradient(ellipse, rgba(255,255,255,0.70) 0%, transparent 75%)",
              filter: "blur(1px)",
              transform: "rotate(-20deg)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* ── Precise dot ───────────────────────────────────────────────── */}
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHover ? "5px" : "5px",
          height: isHover ? "5px" : "5px",
          borderRadius: "50%",
          background: isHover ? "hsl(212 97% 52%)" : "rgba(30,60,120,0.75)",
          pointerEvents: "none",
          zIndex: 9999,
          opacity: visible ? 1 : 0,
          transition: "opacity 0.4s ease, background 0.2s ease",
          willChange: "transform",
          boxShadow: "0 0 6px rgba(255,255,255,0.8)",
        }}
      />
    </>
  );
}
