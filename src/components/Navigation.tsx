import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/contact">
              <button className="btn-glass-primary text-xs">
                Let's Talk
              </button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden glass-panel-sm p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
            ) : (
              <Menu className="w-5 h-5" style={{ color: "hsl(var(--primary))" }} />
            )}
          </button>
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
                  <button className="btn-glass-primary mt-4">Let's Talk</button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
