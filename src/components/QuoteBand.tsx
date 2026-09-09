// The Einstein quote, as a slab that cuts across the page.
//
// It is a full-bleed band rather than another transparent section: it breaks
// the run of background colour between the Hero and the category grid, and the
// shadow it throws upward is what makes it read as sitting on top of the page
// instead of being a hole in it.
//
// The quote itself is WarpText (WebGL glass refraction, bends toward the
// cursor) and the sphere on the right is DotSphere. Both take their colours
// from the theme.

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import DotSphere from "@/components/DotSphere";
import WarpText from "@/components/WarpText";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import "@/components/QuoteBand.css";

export default function QuoteBand() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();
  const reduceMotion = usePrefersReducedMotion();

  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  // Matches the phone breakpoint in QuoteBand.css. The quote is rasterised, so
  // where it breaks has to be decided here rather than by the browser.
  const [isPhone, setIsPhone] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = () => setIsPhone(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // WarpText rasterises the string into a texture, so it needs a concrete
  // colour rather than a CSS variable. Both values are read off the band, not
  // off the page: the slab is light in one theme and slate in the other.
  const textColor = theme === "dark" ? "#eef2f7" : "#0a1a2f";

  const quote = [
    t("index.philosophy.line1"),
    ...(isPhone
      ? [t("index.philosophy.line2"), t("index.philosophy.accent")]
      : [`${t("index.philosophy.line2")} ${t("index.philosophy.accent")}`]),
  ].join("\n");

  return (
    <section className="quote-band" ref={ref}>
      <motion.div
        className="quote-band__inner"
        initial={reduceMotion ? false : { opacity: 0, y: 28 }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="quote-band__text">
          <WarpText
            // Remounting on a language change is deliberate: the texture is
            // rebuilt from scratch and the fit-to-box maths reruns for the new
            // string length.
            key={`${language}-${isPhone}`}
            text={quote}
            color={textColor}
            fontFamily="var(--font-display), sans-serif"
            fontWeight={800}
            fontSize={isPhone ? "clamp(2.2rem, 9.5vw, 3.2rem)" : "clamp(2rem, 5.8vw, 4.8rem)"}
            letterSpacing="-0.03em"
            lineHeight={1.02}
            warpStrength={0.075}
            pointerInfluence={0.38}
            pointerStrength={0.34}
            className="quote-band__warp"
          />

          <p className="quote-band__author">{t("index.philosophy.author")}</p>
        </div>

        <div className="quote-band__orb">
          <DotSphere />
        </div>
      </motion.div>
    </section>
  );
}
