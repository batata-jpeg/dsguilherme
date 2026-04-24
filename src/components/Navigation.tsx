import { AnimatePresence, motion } from "framer-motion";
import { Globe } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import PillNav from "@/components/PillNav";
import Logo from "@/components/Logo";

export default function Navigation() {
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme } = useTheme();
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
  const baseColor = isDark ? "hsl(0, 0%, 7%)" : "hsl(0, 0%, 98%)";
  const pillColor = isDark ? "hsl(0, 0%, 12%)" : "hsl(0, 0%, 92%)";
  const hoveredPillTextColor = isDark ? "hsl(165, 55%, 12%)" : "hsl(260, 25%, 22%)";

  const extraControls = (
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
  );

  const mobileExtraControls = (
    <button className="ctrl-btn" onClick={handleLanguageToggle}>
      <Globe style={{ width: "12px", height: "12px" }} />
      {language === "en" ? "EN" : "PT"}
    </button>
  );

  return (
    <PillNav
      logo=""
      logoNode={<Logo height={64} />}
      logoAlt="Guima"
      items={items}
      activeHref={location.pathname}
      baseColor={baseColor}
      pillColor={pillColor}
      hoveredPillTextColor={hoveredPillTextColor}
      pillTextColor={isDark ? "hsl(0, 0%, 94%)" : "hsl(260, 15%, 18%)"}
      extraControls={extraControls}
      mobileExtraControls={mobileExtraControls}
      initialLoadAnimation={false}
    />
  );
}
