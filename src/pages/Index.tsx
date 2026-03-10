import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, ChevronDown, ExternalLink, Zap, Award, Users, Layers } from "lucide-react";
import heroVisual from "@/assets/hero-visual.png";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import aboutPortrait from "@/assets/about-portrait.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const floatingBadges = [
  { label: "Motion Design", icon: "◈", delay: 0, x: "-10%", y: "10%" },
  { label: "UI/UX", icon: "◉", delay: 0.5, x: "80%", y: "5%" },
  { label: "Branding", icon: "◆", delay: 1, x: "85%", y: "60%" },
  { label: "3D Design", icon: "◎", delay: 1.5, x: "-5%", y: "65%" },
  { label: "Blender", icon: "⬡", delay: 2, x: "40%", y: "-8%" },
  { label: "Edição de Imagens", icon: "◇", delay: 0.8, x: "75%", y: "35%" },
];

function FadeInSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Index() {
  const { t } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const stats = [
    { value: "7+", label: t("index.stats.years"), icon: Zap },
    { value: "120+", label: t("index.stats.projects"), icon: Award },
    { value: "40+", label: t("index.stats.clients"), icon: Users },
    { value: "6", label: t("index.stats.fields"), icon: Layers },
  ];

  const featuredProjects = [
    {
      id: "luminary-brand",
      title: t("proj.luminary.title"),
      category: t("proj.luminary.category") + " · Identity",
      description: "A complete luxury brand system featuring custom typography, mark design, and a premium visual language.",
      image: project1,
      year: "2024",
    },
    {
      id: "nebula-motion",
      title: t("proj.nebula.title"),
      category: t("proj.nebula.category") + " · 3D",
      description: "Generative motion graphics exploring fluid dynamics and organic form.",
      image: project2,
      year: "2024",
    },
    {
      id: "nova-app",
      title: t("proj.nova.title"),
      category: t("proj.nova.category") + " · Product",
      description: "A futuristic mobile OS concept with glassmorphism design language.",
      image: project3,
      year: "2023",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden dot-grid" style={{ background: "var(--gradient-bg)" }}>
      {/* ── HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute top-32 right-24 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.6) 0%, rgba(59,153,252,0.08) 60%, transparent 100%)", border: "1px solid rgba(255,255,255,0.7)", boxShadow: "0 8px 40px rgba(59,153,252,0.10), inset 0 1px 0 rgba(255,255,255,0.9)", backdropFilter: "blur(20px)" }} />
        <div className="absolute bottom-40 left-12 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.5) 0%, rgba(191,90,242,0.06) 60%, transparent 100%)", border: "1px solid rgba(255,255,255,0.6)", boxShadow: "0 8px 32px rgba(191,90,242,0.10), inset 0 1px 0 rgba(255,255,255,0.8)", backdropFilter: "blur(16px)" }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6 pt-28 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <span className="section-label">{t("index.hero.label")}</span>
              </motion.div>

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
            <div className="relative flex items-center justify-center min-h-[500px]">
              {floatingBadges.map((badge, i) => (
                <motion.div key={badge.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1 + badge.delay }}
                  style={{ position: "absolute", left: badge.x, top: badge.y }} className="z-20">
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                    className="glass-panel-sm px-3 py-2 flex items-center gap-2 whitespace-nowrap hover:scale-105 transition-transform duration-300">
                    <span className="text-sm" style={{ color: "hsl(var(--primary))" }}>{badge.icon}</span>
                    <span className="font-display text-xs tracking-[0.1em] uppercase" style={{ color: "hsl(var(--foreground))" }}>{badge.label}</span>
                  </motion.div>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }} className="relative z-10"
                style={{ filter: "drop-shadow(0 12px 40px rgba(59,153,252,0.22)) drop-shadow(0 0 80px rgba(147,84,245,0.12))" }}>
                <motion.img src={heroVisual} alt="Liquid Glass Crystal"
                  className="w-72 h-72 md:w-96 md:h-96 object-contain"
                  animate={{ rotate: [0, 3, -2, 0], y: [0, -10, 5, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transform: `perspective(1000px)` }} />

              </motion.div>
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
                {stats.map(({ value, label, icon: Icon }, i) => (
                  <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="p-8 flex flex-col items-center text-center gap-3">
                    <Icon className="w-5 h-5 mb-1" style={{ color: "hsl(var(--primary))", opacity: 0.7 }} />
                    <span className="font-display font-extrabold gradient-text" style={{ fontSize: "2.8rem", lineHeight: 1 }}>{value}</span>
                    <span className="font-display text-xs tracking-[0.15em] uppercase" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</span>
                  </motion.div>
                ))}
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
          <FadeInSection delay={0.6} className="mt-10 max-w-lg">
            <p className="font-body text-lg leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
              {t("index.philosophy.body")}
            </p>
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
                    style={{ background: "rgba(59,153,252,0.04)", backdropFilter: "blur(2px)" }} />
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
              {featuredProjects.slice(1).map((proj, i) => (
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
              ))}
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
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass-panel p-12 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <FadeInSection>
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: "radial-gradient(circle at 40% 40%, rgba(59,153,252,0.15) 0%, rgba(147,84,245,0.08) 60%, transparent 80%)", filter: "blur(24px)" }} />
                <img src={aboutPortrait} alt="Designer Portrait" className="relative rounded-2xl w-full object-cover"
                  style={{ height: "400px", objectPosition: "center top", border: "1px solid rgba(255,255,255,0.8)", boxShadow: "var(--glass-shadow)" }} />
              </div>
            </FadeInSection>
            <FadeInSection delay={0.2} className="space-y-6">
              <span className="section-label">{t("index.about.label")}</span>
              <h2 className="font-display font-bold uppercase" style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}>
                {t("index.about.title")}
              </h2>
              <p className="font-body leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                {t("index.about.body")}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["Blender", "Adobe CC", "Cinema 4D", "Figma", "After Effects", "Substance 3D"].map((tool) => (
                  <div key={tool} className="glass-panel-sm px-3 py-2 text-center">
                    <span className="font-display text-xs tracking-[0.15em] uppercase" style={{ color: "hsl(var(--primary))" }}>{tool}</span>
                  </div>
                ))}
              </div>
              <Link to="/about">
                <button className="btn-glass-primary mt-4">{t("index.about.cta")} <ArrowRight className="w-4 h-4" /></button>
              </Link>
            </FadeInSection>
          </div>
        </div>
      </section>

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
    </div>
  );
}
