import { AnimatePresence, motion } from "framer-motion";
import { Globe, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import PillNav from "@/components/PillNav";

const LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%25" stop-color="%230A84FF"/><stop offset="100%25" stop-color="%23BF5AF2"/></linearGradient></defs><rect x="5" y="5" width="14" height="14" rx="3" fill="url(%23g)"/></svg>`;

export default function Navigation() {
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [globeSpinning, setGlobeSpinning] = useState(false);

  const handleLanguageToggle = () => {
    setGlobeSpinning(true);
    toggleLanguage();
    setTimeout(() => setGlobeSpinning(false), 600);
  };

  const items = [
    { href: "/", label: t("nav.home") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const isDark = theme === "dark";
  const baseColor = isDark ? "hsl(224, 35%, 13%)" : "hsl(220, 20%, 97%)";
  const pillColor = isDark ? "hsl(224, 25%, 22%)" : "hsl(220, 15%, 88%)";
  const hoveredPillTextColor = isDark ? "hsl(220, 20%, 92%)" : "hsl(220, 25%, 18%)";

  const extraControls = (
    <>
      <motion.button
        onClick={handleLanguageToggle}
        className="ctrl-btn"
        title={language === "en" ? "Mudar para Português" : "Switch to English"}
        whileTap={{ scale: 0.93 }}
      >
        <motion.div
          animate={globeSpinning ? { rotateY: 360 } : { rotateY: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <Globe style={{ width: "12px", height: "12px" }} />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.span
            key={language}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
          >
            {language === "en" ? "EN" : "PT"}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      <motion.button
        onClick={toggleTheme}
        className="ctrl-btn"
        title={isDark ? "Modo claro" : "Modo escuro"}
        whileTap={{ scale: 0.93 }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div key="sun" initial={{ opacity: 0, rotate: -90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.5 }} transition={{ duration: 0.25 }}>
              <Sun style={{ width: "13px", height: "13px" }} />
            </motion.div>
          ) : (
            <motion.div key="moon" initial={{ opacity: 0, rotate: 90, scale: 0.5 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: -90, scale: 0.5 }} transition={{ duration: 0.25 }}>
              <Moon style={{ width: "13px", height: "13px" }} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );

  const mobileExtraControls = (
    <>
      <button className="ctrl-btn" onClick={handleLanguageToggle}>
        <Globe style={{ width: "12px", height: "12px" }} />
        {language === "en" ? "EN" : "PT"}
      </button>
      <button className="ctrl-btn" onClick={toggleTheme}>
        {isDark ? <Sun style={{ width: "13px", height: "13px" }} /> : <Moon style={{ width: "13px", height: "13px" }} />}
        {isDark ? "Light" : "Dark"}
      </button>
    </>
  );

  return (
    <PillNav
      logo={LOGO_SVG}
      logoAlt="Refraction Point"
      items={items}
      activeHref={location.pathname}
      baseColor={baseColor}
      pillColor={pillColor}
      hoveredPillTextColor={hoveredPillTextColor}
      pillTextColor={isDark ? "hsl(220, 20%, 92%)" : "hsl(220, 25%, 18%)"}
      extraControls={extraControls}
      mobileExtraControls={mobileExtraControls}
      initialLoadAnimation={true}
    />
  );
}
