// The first viewport: background, one soft light, DSGUILHERME at full width,
// and the character in front of it. Nothing else — no tagline, no CTA, no
// stats, no scroll hint.
//
// Layout lives entirely in Hero.css and is identical in both themes; the theme
// only swaps colour. See the layer comment at the top of that file.

import { motion } from "framer-motion";
import charLight from "@/assets/hero-guima-light.webp";
import charDark from "@/assets/hero-guima-dark.webp";
import charMobileLight from "@/assets/hero-guima-mobile-light.webp";
import charMobileDark from "@/assets/hero-guima-mobile-dark.webp";
import { useTheme } from "@/contexts/ThemeContext";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import "@/components/Hero.css";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const reduceMotion = usePrefersReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="hero">
      {/* No background layer here: SiteBackground shows through. See Hero.css. */}
      <div className="hero__glow" aria-hidden="true" />

      {/* Phone only. On a narrow screen "DSGUILHERME" on one line has to shrink
          to stay whole, so the "Ds" breaks out above as an app icon and
          "GUILHERME" gets the full width to itself. */}
      <motion.div
        className="hero__badge"
        aria-hidden="true"
        // x lives here, not in the class: animating `y` makes framer write the
        // whole transform, which silently drops a CSS translateX(-50%) and
        // leaves the badge sitting off-centre.
        style={{ x: "-50%" }}
        initial={reduceMotion ? false : { opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
      >
        <span className="hero__badge-d">D</span>
        <span className="hero__badge-s">s</span>
      </motion.div>

      <motion.h1
        className="hero__wordmark"
        // The visible text differs by breakpoint, so the label is what keeps
        // the name intact for assistive tech either way.
        aria-label="DSGuilherme"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
      >
        <span className="hero__word--wide" aria-hidden="true">DSGUILHERME</span>
        <span className="hero__word--narrow" aria-hidden="true">GUILHERME</span>
      </motion.h1>

      {/* Two boxes on purpose. The outer one owns position and size in CSS —
          which lets the phone breakpoint re-anchor it to the viewport edge —
          and the inner one owns the entry animation. Keeping them apart is
          what stops framer's transform from clobbering the placement. */}
      <div className="hero__character">
        <motion.div
          className="hero__character-anim"
          initial={reduceMotion ? false : { opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.22, ease: EASE }}
        >
        {/* Both shirts are rendered and crossfaded rather than swapping one src:
            the two files are already decoded, so the theme toggle never flashes
            an empty frame. They are cropped to identical dimensions, so the
            character does not shift by a pixel between themes. Decorative —
            the <h1> above already carries the name. */}
        {/* <picture> rather than one <img>: the browser resolves the media
            query itself and fetches only the matching file, so a phone never
            downloads the desktop pose and vice versa. */}
        <picture>
          <source media="(max-width: 640px)" srcSet={charMobileLight} />
          <img
            src={charLight}
            alt=""
            draggable={false}
            className={`hero__character-img${isDark ? "" : " is-on"}`}
          />
        </picture>
        <picture>
          <source media="(max-width: 640px)" srcSet={charMobileDark} />
          <img
            src={charDark}
            alt=""
            draggable={false}
            className={`hero__character-img${isDark ? " is-on" : ""}`}
          />
        </picture>
        </motion.div>
      </div>
    </section>
  );
}
