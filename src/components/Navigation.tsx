import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Globe, Sun, Moon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [globeSpinning, setGlobeSpinning] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/projects", label: t("nav.projects") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLanguageToggle = () => {
    setGlobeSpinning(true);
    toggleLanguage();
    setTimeout(() => setGlobeSpinning(false), 600);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <div
          className={`mx-auto max-w-7xl px-6 flex items-center justify-between transition-all duration-500 ${
            scrolled
              ? "glass-panel rounded-2xl py-3 px-6 mx-4"
              : ""
          }`}
          style={scrolled ? { boxShadow: "var(--glow-combined)" } : {}}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-lg border border-primary/40 group-hover:border-primary/80 transition-colors duration-300 flex items-center justify-center">
                <div className="w-3 h-3 rounded-sm bg-primary/60 group-hover:bg-primary/90 transition-colors duration-300" />
              </div>
              <div className="absolute inset-0 rounded-lg animate-pulse-glow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span
              className="font-display font-bold text-sm tracking-widest uppercase"
              style={{ color: "hsl(var(--foreground))" }}
            >
              Refraction Point
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className="relative font-display text-xs font-400 tracking-[0.2em] uppercase transition-colors duration-300 group"
                  style={{
                    color: isActive
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted-foreground))",
                  }}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-0 h-px transition-all duration-300"
                    style={{
                      width: isActive ? "100%" : "0%",
                      background: "hsl(var(--primary))",
                      boxShadow: "var(--glow-cyan-sm)",
                    }}
                  />
                  <span
                    className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                    style={{
                      background: "rgba(112,251,249,0.4)",
                    }}
                  />
                </Link>
              );
            })}
          </nav>

          {/* CTA + Controls */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language toggle */}
            <motion.button
              onClick={handleLanguageToggle}
              className="glass-panel-sm flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all duration-300 hover:border-primary/40 group"
              title={language === "en" ? "Mudar para Português" : "Switch to English"}
              whileTap={{ scale: 0.93 }}
            >
              <motion.div
                animate={globeSpinning ? { rotateY: 360 } : { rotateY: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <Globe
                  className="w-3.5 h-3.5 transition-colors duration-300"
                  style={{ color: "hsl(var(--primary))" }}
                />
              </motion.div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={language}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.2 }}
                  className="font-display text-[10px] tracking-[0.15em] font-bold uppercase"
                  style={{ color: "hsl(var(--foreground))" }}
                >
                  {language === "en" ? "EN" : "PT"}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              className="glass-panel-sm p-2 rounded-xl transition-all duration-300 hover:border-primary/40"
              title={theme === "dark" ? "Modo claro" : "Modo escuro"}
              whileTap={{ scale: 0.93 }}
            >
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sun className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Moon className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <Link to="/contact">
              <button className="btn-glass-primary text-xs">
                {t("nav.cta")}
              </button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center gap-2">
            {/* Language toggle mobile */}
            <motion.button
              onClick={handleLanguageToggle}
              className="glass-panel-sm flex items-center gap-1 px-2 py-1.5 rounded-lg"
              whileTap={{ scale: 0.93 }}
            >
              <motion.div
                animate={globeSpinning ? { rotateY: 360 } : { rotateY: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <Globe className="w-3 h-3" style={{ color: "hsl(var(--primary))" }} />
              </motion.div>
              <span
                className="font-display text-[9px] tracking-widest font-bold uppercase"
                style={{ color: "hsl(var(--foreground))" }}
              >
                {language === "en" ? "EN" : "PT"}
              </span>
            </motion.button>

            {/* Theme toggle mobile */}
            <motion.button
              onClick={toggleTheme}
              className="glass-panel-sm p-1.5 rounded-lg"
              whileTap={{ scale: 0.93 }}
            >
              <AnimatePresence mode="wait">
                {theme === "dark" ? (
                  <motion.div
                    key="sun-m"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Sun className="w-3.5 h-3.5" style={{ color: "hsl(var(--primary))" }} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon-m"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Moon className="w-3.5 h-3.5" style={{ color: "hsl(var(--primary))" }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <button
              className="glass-panel-sm p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
              ) : (
                <Menu className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: "rgba(3, 6, 21, 0.95)", backdropFilter: "blur(24px)" }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={link.href}
                    className="font-display font-bold text-3xl tracking-widest uppercase"
                    style={{
                      color:
                        location.pathname === link.href
                          ? "hsl(var(--primary))"
                          : "hsl(var(--foreground))",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Link to="/contact">
                  <button className="btn-glass-primary mt-4">{t("nav.cta")}</button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
