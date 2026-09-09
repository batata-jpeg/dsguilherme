// The single background behind every page: the Hero's own treatment, promoted
// to the whole site — a flat themed gradient plus two very large, very soft
// lights that drift, with a slow silk shader woven over the top.
//
// This replaced a pair of WebGL canvases (ColorBends on dark, HexagonBackground
// on light). Both are still in the repo, unused. Dropping them is what makes
// the new theme "cores simples" rather than neon, and it also takes two live
// GL contexts off every page — the Projects page used to disable its animation
// just to keep the 3D book smooth.
//
// The silk brings one context back, so it is deliberately the cheapest canvas
// it can be: DPR pinned to 1, no antialiasing, low-power context, paused on a
// hidden tab, and lazily loaded so three.js lands in its own chunk instead of
// the main bundle. It sits *over* the gradient at low opacity rather than
// replacing it, which means the site's colour is still the gradient's — the
// shader only adds the fold and the sheen — and a device that cannot give us a
// GL context degrades to exactly the background that was here before.

import { Suspense, lazy } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useTheme } from "@/contexts/ThemeContext";
import "@/components/SiteBackground.css";

const Silk = lazy(() => import("@/components/Silk"));

// Neither is a new hue — they are what each blend needs to shade the gradient
// that is already there. The opacity and blend that set the actual strength
// live in SiteBackground.css, next to the rest of the layering.
//
// Dark blends with screen, which only ever lifts, so this is a cool slate far
// enough off #1c2026 to catch light without washing it out.
const SILK_DARK = "#4A5768";
// Near-neutral on purpose. The light theme blends with soft-light, which pushes
// the base up where the source is above mid-grey and down where it is below —
// so a saturated blue here would drag the hue around instead of just shading
// it. The shader's pattern averages ~0.6, so a source of ~0.83 lands the mean
// right on 0.5 and the fold reads as light, not as a second colour.
const SILK_LIGHT = "#C8D6EC";

export default function SiteBackground() {
  const reduceMotion = usePrefersReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="site-bg" aria-hidden>
      <div className="site-bg__base" />

      <div className="site-bg__silk">
        <Suspense fallback={null}>
          <Silk
            color={isDark ? SILK_DARK : SILK_LIGHT}
            // Off in both themes. The folded-satin branch mixes 92% toward pure
            // white at the crests, and on a full-viewport background that is a
            // row of bright bands you cannot read text over — loud in exactly
            // the way this is not supposed to be. The plain multiply keeps the
            // fold and drops the glare.
            lightMode={false}
            // Well under the shader's default 5. This should register as the
            // background moving, not as an animation playing.
            speed={1.6}
            scale={1.4}
            noiseIntensity={1.2}
            rotation={0.35}
            animate={!reduceMotion}
          />
        </Suspense>
      </div>

      <div className={`site-bg__lights${reduceMotion ? " is-still" : ""}`}>
        <span className="site-bg__light site-bg__light--a" />
        <span className="site-bg__light site-bg__light--b" />
      </div>
      <div className="site-bg__grain" />
    </div>
  );
}
