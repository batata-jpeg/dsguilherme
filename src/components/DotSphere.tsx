// A sphere built out of circles that reacts to the pointer — the behaviour of
// the Spline community scene, rebuilt natively.
//
// Canvas 2D rather than WebGL on purpose: the whole thing is flat circles, so
// there is nothing here a 3D pipeline would buy, and it keeps a third live GL
// context off the page (WarpText already holds one). A few hundred points at
// 60fps is nothing for 2D.
//
// Colours are never hardcoded. They are read from CSS custom properties on the
// element, so the theme owns them and a toggle repaints on the next frame —
// see DotSphere.css.

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import "@/components/DotSphere.css";

interface Props {
  /** How many circles sit on the sphere. */
  count?: number;
  /** Share of them that render filled in the accent colour, 0..1. */
  accentRatio?: number;
  className?: string;
}

interface Point {
  /** Unit position on the sphere. */
  x: number;
  y: number;
  z: number;
  /** Base radius multiplier, so the field is not perfectly uniform. */
  scale: number;
  accent: boolean;
  /** Eased 0..1 pointer proximity, kept between frames for the falloff. */
  hot: number;
}

/**
 * Fibonacci sphere: the cheapest way to scatter n points over a sphere without
 * the clustering you get at the poles from naive lat/long stepping.
 */
function buildPoints(count: number, accentRatio: number): Point[] {
  const points: Point[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;

    // Deterministic pseudo-random so the accent pattern is stable across
    // reloads and theme changes instead of reshuffling on every mount.
    const r = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;

    points.push({
      x: Math.cos(theta) * radius,
      y,
      z: Math.sin(theta) * radius,
      scale: 0.55 + r * 0.75,
      accent: r < accentRatio,
      hot: 0,
    });
  }

  return points;
}

function readColors(el: HTMLElement) {
  const cs = getComputedStyle(el);
  return {
    dot: cs.getPropertyValue("--ds-dot").trim() || "rgba(20,26,38,0.22)",
    accent: cs.getPropertyValue("--ds-accent").trim() || "#0959c8",
    hot: cs.getPropertyValue("--ds-hot").trim() || "#0959c8",
  };
}

export default function DotSphere({ count = 460, accentRatio = 0.1, className = "" }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const points = buildPoints(count, accentRatio);
    let colors = readColors(host);
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;
    let spin = 0;
    // -1 means "no pointer"; the falloff then decays everything to rest.
    const pointer = { x: -1, y: -1 };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (!width || !height) {
        raf = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      if (!reduceMotion) spin += 0.0022;

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.42;
      const cos = Math.cos(spin);
      const sin = Math.sin(spin);
      // A slight tilt so the pole rings read as a sphere rather than a disc.
      const tilt = -0.42;
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);

      // Painter's algorithm — far points first so near ones overlap them.
      const projected = points
        .map((p) => {
          const rx = p.x * cos - p.z * sin;
          const rz = p.x * sin + p.z * cos;
          const ry = p.y * cosT - rz * sinT;
          const rz2 = p.y * sinT + rz * cosT;
          // Weak perspective: enough to give depth, not enough to distort.
          const persp = 1 / (2.4 - rz2);
          return {
            p,
            sx: cx + rx * radius * persp * 2.4,
            sy: cy + ry * radius * persp * 2.4,
            depth: rz2,
            persp,
          };
        })
        .sort((a, b) => a.depth - b.depth);

      for (const item of projected) {
        const { p, sx, sy, depth, persp } = item;

        // Pointer proximity, eased so dots swell and settle instead of snapping.
        let target = 0;
        if (pointer.x >= 0) {
          const d = Math.hypot(sx - pointer.x, sy - pointer.y);
          const reach = Math.min(width, height) * 0.3;
          if (d < reach) target = 1 - d / reach;
        }
        p.hot += (target - p.hot) * 0.14;

        const front = (depth + 1) / 2;
        const base = radius * 0.052 * p.scale * persp * 2.4;
        const r = base * (1 + p.hot * 1.5);
        if (r <= 0.1) continue;

        // Back of the sphere fades out, which is what stops it reading as a
        // flat ring of confetti.
        const depthAlpha = 0.25 + front * 0.75;

        if (p.accent || p.hot > 0.35) {
          const strength = p.accent ? 1 : (p.hot - 0.35) / 0.65;
          const grad = ctx.createRadialGradient(
            sx - r * 0.35,
            sy - r * 0.4,
            r * 0.1,
            sx,
            sy,
            r,
          );
          grad.addColorStop(0, colors.hot);
          grad.addColorStop(1, colors.accent);
          ctx.globalAlpha = depthAlpha * (0.55 + strength * 0.45);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalAlpha = depthAlpha * (0.5 + p.hot * 0.5);
          ctx.strokeStyle = colors.dot;
          ctx.lineWidth = Math.max(0.6, r * 0.14);
          ctx.beginPath();
          ctx.arc(sx, sy, r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(draw);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -1;
      pointer.y = -1;
    };

    // The theme swaps class on <html>; re-read the custom properties when it does.
    const themeObserver = new MutationObserver(() => {
      colors = readColors(host);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);

    // Only animate while on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        const wasRunning = running;
        running = entry.isIntersecting;
        if (running && !wasRunning) raf = requestAnimationFrame(draw);
      },
      { threshold: 0 },
    );
    io.observe(host);

    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerleave", onPointerLeave);

    resize();
    raf = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [count, accentRatio, reduceMotion]);

  return (
    <div ref={hostRef} className={`dot-sphere ${className}`.trim()} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
