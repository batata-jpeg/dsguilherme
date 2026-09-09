// Makes the glass react to the pointer: a soft highlight tracks the cursor
// across any glass surface, which is what sells the material as glass rather
// than as a tinted rectangle.
//
// One document-level listener rather than a hook per panel — there are dozens
// of glass surfaces across the site and this costs a single rAF-throttled
// handler for all of them. It writes two CSS variables and nothing else, so
// the effect itself stays entirely in CSS.

import { useEffect } from "react";

const GLASS_SELECTOR = ".glass-panel, .glass-panel-sm, .category-block, .btn-glass-secondary";

export default function GlassPointer() {
  useEffect(() => {
    // Touch has no hover, so the highlight would only ever flash on tap.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let pending: { el: HTMLElement; x: number; y: number } | null = null;

    const flush = () => {
      frame = 0;
      if (!pending) return;
      const { el, x, y } = pending;
      pending = null;
      el.style.setProperty("--gx", `${x}%`);
      el.style.setProperty("--gy", `${y}%`);
    };

    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.(GLASS_SELECTOR) as HTMLElement | null;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      pending = {
        el,
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      };
      if (!frame) frame = requestAnimationFrame(flush);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
