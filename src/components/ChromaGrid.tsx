// Chroma spotlight grid: everything sits desaturated and dimmed until the
// cursor gets near, which reveals the artwork in colour inside a soft radius.
//
// Adapted from React Bits (https://reactbits.dev/components/chroma-grid).
// Changes from the original:
//   - TypeScript, and no demo data — items are required.
//   - The card footer (name / handle / role) is gone: these cards show the
//     image only.
//   - Cards call onSelect(index) instead of window.open(url), so a click opens
//     the gallery lightbox rather than navigating away.
//   - The greyscale layers are skipped entirely where hover is unavailable.
//     Without a pointer to carry the spotlight the artwork would sit permanently
//     desaturated, which is the opposite of what a portfolio wants.

import { useRef, useEffect, type CSSProperties } from "react";
import { gsap } from "gsap";
import { useCanHover } from "@/hooks/use-can-hover";
import "./ChromaGrid.css";

export interface ChromaItem {
  image: string;
  alt?: string;
  borderColor?: string;
  gradient?: string;
}

interface ChromaGridProps {
  items: ChromaItem[];
  className?: string;
  /** Radius in px of the colour-reveal spotlight. */
  radius?: number;
  columns?: number;
  /** Width of each card in px. */
  cardWidth?: number;
  /** Aspect ratio of the artwork inside a card, e.g. "1640 / 2360". */
  aspect?: string;
  /** Seconds the spotlight takes to catch up with the pointer. */
  damping?: number;
  /** Seconds for the grid to fade back to grey after the pointer leaves. */
  fadeOut?: number;
  ease?: string;
  onSelect?: (index: number) => void;
}

export default function ChromaGrid({
  items,
  className = "",
  radius = 300,
  columns = 3,
  cardWidth = 300,
  aspect = "1 / 1",
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
  onSelect,
}: ChromaGridProps) {
  const canHover = useCanHover();

  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<((v: number) => void) | null>(null);
  const setY = useRef<((v: number) => void) | null>(null);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !canHover) return;
    setX.current = gsap.quickSetter(el, "--x", "px") as (v: number) => void;
    setY.current = gsap.quickSetter(el, "--y", "px") as (v: number) => void;
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, [canHover]);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = rootRef.current;
    if (!el || !canHover) return;
    const r = el.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    if (!canHover) return;
    gsap.to(fadeRef.current, { opacity: 1, duration: fadeOut, overwrite: true });
  };

  const handleCardMove = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={
        {
          "--r": `${radius}px`,
          "--cols": columns,
          "--card-w": `${cardWidth}px`,
          "--card-aspect": aspect,
        } as CSSProperties
      }
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {items.map((c, i) => (
        <button
          key={c.image}
          type="button"
          className="chroma-card"
          aria-label={c.alt}
          onMouseMove={handleCardMove}
          onClick={() => onSelect?.(i)}
          style={
            {
              "--card-border": c.borderColor || "transparent",
              "--card-gradient": c.gradient,
            } as CSSProperties
          }
        >
          <div className="chroma-img-wrapper">
            <img src={c.image} alt={c.alt ?? ""} loading="lazy" draggable={false} />
          </div>
        </button>
      ))}
      {canHover && (
        <>
          <div className="chroma-overlay" />
          <div ref={fadeRef} className="chroma-fade" />
        </>
      )}
    </div>
  );
}
