// Floating liquid-glass navbar: one bar holding the wordmark, the page pills
// and the two independent controls.
//
// The controls are deliberately unrelated to each other. Language swaps the
// pill labels and nothing else; theme swaps colour and nothing else. All four
// combinations (light/dark × pt/en) are reachable and none implies another —
// the reference screenshots just happened to show two of them.

import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import flagBr from "@/assets/flag-br.png";
import flagUs from "@/assets/flag-us.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import "@/components/GlassNav.css";

export default function GlassNav() {
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const reduceMotion = usePrefersReducedMotion();

  const [menuOpen, setMenuOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const isDark = theme === "dark";
  const isPt = language === "pt";

  const items = [
    { href: "/", label: t("nav.home") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/about", label: t("nav.aboutMe") },
  ];

  // Close the mobile menu on navigation, on Escape, and on an outside tap.
  useEffect(() => setMenuOpen(false), [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [menuOpen]);

  // Both controls are sliding switches: the knob carries the icon and travels
  // to the far end, so the position itself says which side you are on. The
  // state lives in a class, not in a framer transform — a CSS transition on
  // `transform` is the one thing that keeps sliding smoothly even while the
  // theme's own 1.5s view transition is running over the top of it.
  const controls = (
    <div className="gnav__controls">
      <button
        type="button"
        className={`gnav__switch${isPt ? "" : " is-end"}`}
        onClick={toggleLanguage}
        aria-label={isPt ? "Switch to English" : "Mudar para Português"}
        title={isPt ? "Switch to English" : "Mudar para Português"}
      >
        <span className="gnav__switch-knob gnav__switch-knob--flag">
          <img src={isPt ? flagBr : flagUs} alt="" className="gnav__flag" draggable={false} />
        </span>
      </button>

      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        className={`gnav__switch${isDark ? " is-end" : ""}`}
        onClick={toggleTheme}
        aria-label={isDark ? t("nav.theme.light") : t("nav.theme.dark")}
        title={isDark ? t("nav.theme.light") : t("nav.theme.dark")}
      >
        <span
          className={`gnav__switch-knob gnav__switch-knob--${isDark ? "moon" : "sun"}`}
        >
          {isDark ? (
            <Moon className="gnav__switch-icon" strokeWidth={2.2} />
          ) : (
            <Sun className="gnav__switch-icon" strokeWidth={2.4} />
          )}
        </span>
      </button>
    </div>
  );

  return (
    <div className="gnav-wrap" ref={wrapRef}>
      <motion.nav
        className="gnav"
        aria-label="Primary"
        initial={reduceMotion ? false : { opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Flat siblings on purpose: the middle group is centred against the bar
            itself, so it must not sit inside a positioned wrapper. */}
        <Link to="/" className="gnav__logo">
          GUIMA
        </Link>

        <ul className="gnav__list">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`gnav__pill${location.pathname === item.href ? " is-active" : ""}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {controls}

        <button
          type="button"
          className="gnav__burger"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? t("nav.menu.close") : t("nav.menu.open")}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X className="gnav__ctrl-icon" strokeWidth={2.2} />
          ) : (
            <Menu className="gnav__ctrl-icon" strokeWidth={2.2} />
          )}
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="gnav__sheet"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="gnav__sheet-list">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`gnav__pill gnav__pill--block${
                      location.pathname === item.href ? " is-active" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
