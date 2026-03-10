import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, ChevronDown, ExternalLink, Zap, Award, Users, Layers } from "lucide-react";
import heroVisualDark from "@/assets/hero-character.png";
import heroVisualLight from "@/assets/hero-character-light.png";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import aboutPortrait from "@/assets/about-portrait.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";

// 7 badges arranged in a rough ellipse around the character (center ~50%,50%)
// Desktop (x/y): ellipse rx≈40%, ry≈43% — slight negatives OK (overflow visible)
// Mobile  (mx/my): tighter ellipse fully inside the container
const floatingBadges = [
  { label: "Motion Design",  icon: "◈", delay: 0,   x: "36%",  y: "0%",   mx: "28%", my: "0%",  xKeys: [0,  22, -16,  8, -20,  0], yKeys: [0, -18, 12, -22,  8,  0], rKeys: [0,  4, -3,  5, -2,  0], dur: 8   },
  { label: "Edição de Vídeo",icon: "▶", delay: 0.3, x: "72%",  y: "10%",  mx: "58%", my: "8%",  xKeys: [0, -18, 24, -10, 18,  0], yKeys: [0,  20, -14, 22, -10, 0], rKeys: [0, -3,  4, -5,  3,  0], dur: 8.8 },
  { label: "UI/UX",          icon: "◉", delay: 0.6, x: "84%",  y: "44%",  mx: "66%", my: "38%", xKeys: [0, -20, 28, -12, 20,  0], yKeys: [0,  24, -16, 26, -10, 0], rKeys: [0, -3,  5, -4,  3,  0], dur: 9   },
  { label: "Branding",       icon: "◆", delay: 1,   x: "68%",  y: "80%",  mx: "55%", my: "74%", xKeys: [0,  18, -24,  8, -20, 0], yKeys: [0, -16, 22,  -6, 18,  0], rKeys: [0,  5, -4,  3, -5,  0], dur: 7.5 },
  { label: "3D Design",      icon: "◎", delay: 1.3, x: "26%",  y: "86%",  mx: "20%", my: "78%", xKeys: [0, -26, 12, 20, -16,  0], yKeys: [0,  12, -24, 16, -6,  0], rKeys: [0, -4,  3, -5,  2,  0], dur: 10  },
  { label: "Blender",        icon: "⬡", delay: 1.7, x: "-6%",  y: "44%",  mx: "2%",  my: "40%", xKeys: [0,  14, -18, 24, -12, 0], yKeys: [0, -22, 14, -12, 24,  0], rKeys: [0,  3, -5,  4, -3,  0], dur: 8.5 },
  { label: "Imagens",        icon: "◇", delay: 0.8, x: "-4%",  y: "12%",  mx: "2%",  my: "10%", xKeys: [0, -16, 22, -20, 12,  0], yKeys: [0,  18, -10, 24, -16, 0], rKeys: [0, -5,  4, -3,  5,  0], dur: 9.5 },
];


function FadeInSection({ children, delay = 0, className = "" }: {children: React.ReactNode;delay?: number;className?: string;}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}>
      
      {children}
    </motion.div>);

}

export default function Index() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const isDark = theme === "dark";
  const heroVisual = isDark ? heroVisualDark : heroVisualLight;
  const heroRef = useRef<HTMLDivElement>(null);

  // Bouncy character swap
  const charControls = useAnimation();
  const [displayedVisual, setDisplayedVisual] = useState(heroVisual);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    const run = async () => {
      setDisplayedVisual(heroVisual); // swap immediately
      // Quick jump up with horizontal pre-wiggle
      await charControls.start({ y: -60, x: -8, scaleX: 0.88, scaleY: 1.1, transition: { duration: 0.1, ease: "easeIn" } });
      // Wiggle + bouncy land
      await charControls.start({ y: 0, x: 0, scaleX: 1, scaleY: 1, transition: { type: "spring", stiffness: 480, damping: 12, mass: 0.65 } });
      await charControls.start({ y: 0, scaleX: 1, scaleY: 1, transition: { type: "spring", stiffness: 520, damping: 16, mass: 0.7 } });
    };
    run();
  }, [theme]);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const stats = [
  { value: "5+", label: t("index.stats.years"), icon: Zap },
  { value: "78+", label: t("index.stats.projects"), icon: Award },
  { value: "40+", label: t("index.stats.clients"), icon: Users },
  { value: "6", label: t("index.stats.fields"), icon: Layers }];


  const featuredProjects = [
  {
    id: "luminary-brand",
    title: t("proj.luminary.title"),
    category: t("proj.luminary.category") + " · Identity",
    description: "A complete luxury brand system featuring custom typography, mark design, and a premium visual language.",
    image: project1,
    year: "2024"
  },
  {
    id: "nebula-motion",
    title: t("proj.nebula.title"),
    category: t("proj.nebula.category") + " · 3D",
    description: "Generative motion graphics exploring fluid dynamics and organic form.",
    image: project2,
    year: "2024"
  },
  {
    id: "nova-app",
    title: t("proj.nova.title"),
    category: t("proj.nova.category") + " · Product",
    description: "A futuristic mobile OS concept with glassmorphism design language.",
    image: project3,
    year: "2023"
  }];


  return (
    <div className="min-h-screen overflow-x-hidden dot-grid" style={{ background: "var(--gradient-bg)" }}>
      {/* ── HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6 pt-28 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }} className="space-y-2">
                <h1 className="font-display font-extrabold leading-[0.9] tracking-tight uppercase" style={{ fontSize: "clamp(3.5rem, 7vw, 6.5rem)" }}>
                  {t("index.hero.h1a")}
                  <br />
                  <span className="gradient-text">{t("index.hero.h1b")}</span>
                  <br />
                  {t("index.hero.h1c")}
                </h1>
              </motion.div>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.7 }}
              className="font-body text-lg leading-relaxed max-w-md" style={{ color: "hsl(var(--muted-foreground))" }}>
                {t("index.hero.description")}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.9 }} className="flex flex-wrap gap-4">
                <Link to="/projects">
                  <button className="btn-glass-primary">{t("index.hero.cta.projects")} <ArrowRight className="w-4 h-4" /></button>
                </Link>
                <Link to="/about">
                  <button className="btn-glass-secondary">{t("index.hero.cta.about")}</button>
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="inline-flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "hsl(var(--primary))" }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "hsl(var(--primary))" }} />
                </span>
                <span className="font-display text-xs tracking-[0.2em] uppercase" style={{ color: "hsl(var(--primary))" }}>
                  {t("index.hero.available")}
                </span>
              </motion.div>
            </div>

            {/* Right – visual centerpiece */}
            <div className="relative flex items-center justify-center min-h-[520px] lg:min-h-[560px]" style={{ overflow: "visible" }}>

              {/* Floating badges — circular pattern around character */}
              {floatingBadges.map((badge) =>
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 + badge.delay }}
                className="z-20 absolute"
                style={{
                  left: isMobile ? badge.mx : badge.x,
                  top: isMobile ? badge.my : badge.y,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <motion.div
                  animate={{ x: badge.xKeys, y: badge.yKeys, rotate: badge.rKeys }}
                  transition={{ duration: badge.dur, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
                  className="glass-panel-sm px-2 py-1.5 lg:px-3 lg:py-2 flex items-center gap-1.5 lg:gap-2 whitespace-nowrap hover:scale-105 transition-transform duration-300"
                >
                  <span className="text-xs lg:text-sm" style={{ color: "hsl(var(--primary))" }}>{badge.icon}</span>
                  <span className="font-display text-[9px] lg:text-xs tracking-[0.1em] uppercase" style={{ color: "hsl(var(--foreground))" }}>{badge.label}</span>
                </motion.div>
              </motion.div>
              )}

              {/* Character */}
              <div className="flex flex-col items-center gap-4 z-10">
                <div style={{ filter: "drop-shadow(0 24px 60px rgba(59,153,252,0.25)) drop-shadow(0 0 100px rgba(147,84,245,0.15))" }}>
                  <motion.img
                    src={displayedVisual}
                    alt="Designer 3D Character"
                    className="w-56 h-auto sm:w-72 md:w-80 lg:w-80 xl:w-[440px] object-contain"
                    animate={charControls}
                    transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="font-display text-xs tracking-[0.25em] uppercase" style={{ color: "hsl(var(--muted-foreground))" }}>{t("index.hero.scroll")}</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDown className="w-4 h-4" style={{ color: "hsl(var(--primary))" }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS */}
      <FadeInSection>
        <section className="relative py-12">
          <div className="max-w-7xl mx-auto px-6">
            <div className="glass-panel p-1 rounded-2xl">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0"
              style={{ borderColor: "rgba(10,132,255,0.08)" } as React.CSSProperties}>
                {stats.map(({ value, label, icon: Icon }, i) =>
                <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-8 flex flex-col items-center text-center gap-3">
                    <Icon className="w-5 h-5 mb-1" style={{ color: "hsl(var(--primary))", opacity: 0.7 }} />
                    <span className="font-display font-extrabold gradient-text" style={{ fontSize: "2.8rem", lineHeight: 1 }}>{value}</span>
                    <span className="font-display text-xs tracking-[0.15em] uppercase" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ── PHILOSOPHY */}
      <section className="relative py-32 overflow-hidden">
        {/* Prismatic band */}
        <div className="relative max-w-7xl mx-auto px-6">
          <FadeInSection>
            <span className="section-label mb-8 block">{t("index.philosophy.label")}</span>
          </FadeInSection>
          <FadeInSection delay={0.2}>
            <h2 className="font-display font-extrabold leading-[0.85] tracking-tight uppercase" style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)" }}>
              {t("index.philosophy.line1")}
              <br />
              {t("index.philosophy.line2")}{" "}
              <span className="gradient-text">{t("index.philosophy.accent")}</span>
            </h2>
          </FadeInSection>
          <FadeInSection delay={0.4}>
            <h2 className="font-display font-extrabold leading-[0.85] tracking-tight mt-4 uppercase"
            style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)", color: "hsl(var(--muted-foreground))", opacity: 0.5 }}>
              {t("index.philosophy.author")}
            </h2>
          </FadeInSection>
        </div>
      </section>

      {/* ── FEATURED PROJECTS */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection className="flex justify-between items-end mb-14">
            <div>
              <span className="section-label block mb-4">{t("index.featured.label")}</span>
              <h2 className="font-display font-bold uppercase" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
                {t("index.featured.title")}
              </h2>
            </div>
            <Link to="/projects" className="hidden md:flex">
              <button className="btn-glass-primary">{t("index.featured.cta")} <ArrowRight className="w-4 h-4" /></button>
            </Link>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FadeInSection delay={0.1} className="md:col-span-2">
              <Link to={`/projects/${featuredProjects[0].id}`}>
                <div className="glass-panel group overflow-hidden h-[420px] relative">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${featuredProjects[0].image})` }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,20,50,0.85) 30%, rgba(10,20,50,0.15) 70%)" }} />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "rgba(59,153,252,0.08)" }} />
                  <div className="absolute bottom-0 left-0 right-0 p-8 space-y-2">
                    <span className="section-label" style={{ color: "rgba(255,255,255,0.7)" }}>{featuredProjects[0].category}</span>
                    <h3 className="font-display font-bold text-2xl uppercase text-white">{featuredProjects[0].title}</h3>
                    <p className="font-body text-sm leading-relaxed text-white/60">{featuredProjects[0].description}</p>
                    <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <span className="font-display text-xs tracking-widest uppercase text-white/80">{t("index.featured.view")}</span>
                      <ExternalLink className="w-3 h-3 text-white/80" />
                    </div>
                  </div>
                </div>
              </Link>
            </FadeInSection>

            <div className="space-y-6">
              {featuredProjects.slice(1).map((proj, i) =>
              <FadeInSection key={proj.id} delay={0.2 + i * 0.15}>
                  <Link to={`/projects/${proj.id}`}>
                    <div className="glass-panel group overflow-hidden h-[196px] relative">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${proj.image})` }} />
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(10,20,50,0.85) 40%, rgba(10,20,50,0.1) 100%)" }} />
                      <div className="absolute bottom-0 left-0 right-0 p-5 space-y-1">
                        <span className="font-display text-xs tracking-[0.12em] uppercase text-white/60">{proj.category}</span>
                        <h3 className="font-display font-bold text-base uppercase text-white">{proj.title}</h3>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="font-display text-xs tracking-widest uppercase text-white/80">{t("index.featured.view.short")}</span>
                          <ArrowRight className="w-3 h-3 text-white/80" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </FadeInSection>
              )}
            </div>
          </div>

          <FadeInSection className="md:hidden mt-8 text-center">
            <Link to="/projects">
              <button className="btn-glass-primary">{t("index.featured.cta")} <ArrowRight className="w-4 h-4" /></button>
            </Link>
          </FadeInSection>
        </div>
      </section>

      {/* ── ABOUT PREVIEW */}
      































      

      {/* ── CONTACT CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <FadeInSection>
            <span className="section-label justify-center mb-6 flex">{t("index.cta.label")}</span>
            <h2 className="font-display font-extrabold uppercase leading-tight mb-6" style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}>
              {t("index.cta.line1")}
              <br />
              <span className="gradient-text">{t("index.cta.line2")}</span>
              <br />
              {t("index.cta.line3")}
            </h2>
            <p className="font-body text-lg mb-10 mx-auto max-w-md" style={{ color: "hsl(var(--muted-foreground))" }}>
              {t("index.cta.body")}
            </p>
            <Link to="/contact">
              <button className="btn-glass-primary px-10 py-4 text-base">
                {t("index.cta.btn")} <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </FadeInSection>
        </div>
      </section>
    </div>);

}