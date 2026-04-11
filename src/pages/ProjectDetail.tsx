import { useParams, Link } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Maximize, Minimize, X, ChevronRight, Calendar, Wrench, User, Target, AlignLeft, FileText, Images } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import project5 from "@/assets/project-5.jpg";

const projectStaticData: Record<string, {
  image: string;
  year: string;
  tags: string[];
  tools: string[];
  slides: string[];
  translationPrefix: string;
}> = {
  "armagedom-rpg": {
    image: project1,
    year: "2024",
    tags: ["Game Design", "RPG", "Identity", "Illustration", "Product Design"],
    tools: ["Illustrator", "Photoshop", "InDesign", "Figma"],
    slides: [project1, project2, project3, project4, project5],
    translationPrefix: "projdet.armagedom",
  },
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const staticData = id ? projectStaticData[id] : null;
  const prefix = staticData?.translationPrefix ?? "";
  const project = staticData ? {
    ...staticData,
    title: t(`${prefix}.title`),
    category: t(`${prefix}.category`),
    description: t(`${prefix}.description`),
    client: t(`${prefix}.client`),
    audience: t(`${prefix}.audience`),
    challenge: t(`${prefix}.challenge`),
    process: t(`${prefix}.process`),
    outcome: t(`${prefix}.outcome`),
  } : null;
  const [descOpen, setDescOpen] = useState(true);
  const [mobileView, setMobileView] = useState<"slides" | "description">("slides");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const enterFullscreen = useCallback(() => {
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen();
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen dot-grid flex items-center justify-center bg-transparent">
        <div className="text-center space-y-4">
          <h1 className="font-display font-bold text-4xl uppercase">Project Not Found</h1>
          <Link to="/projects">
            <button className="btn-glass-primary">Back to Projects</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* ── TOP BAR */}
      <div className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-4"
        style={{ background: "rgba(10,20,50,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(10,132,255,0.15)" }}>
        <Link to="/projects">
          <button className="btn-glass-primary text-xs flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> {t("projdet.label.backToProjects")}
          </button>
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-display text-xs tracking-widest uppercase hidden sm:block" style={{ color: "hsl(var(--muted-foreground))" }}>
            {project.category}
          </span>
          {!isMobile && (
            <button
              onClick={isFullscreen ? exitFullscreen : enterFullscreen}
              className="glass-panel-sm p-2 transition-all duration-200 hover:scale-105"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen presentation"}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* ── MOBILE LAYOUT */}
      {isMobile ? (
        <div className="relative">
          <AnimatePresence mode="wait">
            {mobileView === "slides" ? (
              <motion.div
                key="slides"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Project title */}
                <div className="px-4 pt-8 pb-6">
                  <h1 className="font-display font-extrabold uppercase leading-tight text-2xl" style={{ color: "hsl(var(--foreground))" }}>
                    {project.title}
                  </h1>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="font-display text-[10px] tracking-[0.1em] uppercase px-2 py-0.5 rounded-lg"
                        style={{ background: "rgba(10,132,255,0.12)", color: "hsl(var(--primary))", border: "1px solid rgba(10,132,255,0.25)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Slides */}
                <div className="px-4 pb-28 space-y-3">
                  {project.slides.map((img, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="relative w-full overflow-hidden"
                      style={{
                        aspectRatio: "16/9",
                        borderRadius: "var(--radius)",
                        border: "1px solid rgba(10,132,255,0.1)",
                        background: "#0a1432",
                      }}
                    >
                      <img
                        src={img}
                        alt={`${project.title} — slide ${i + 1}`}
                        className="w-full h-full object-contain"
                        loading={i === 0 ? "eager" : "lazy"}
                      />
                      <div className="absolute bottom-3 right-3 font-display text-[10px] tracking-widest"
                        style={{ color: "rgba(255,255,255,0.4)" }}>
                        {String(i + 1).padStart(2, "0")} / {String(project.slides.length).padStart(2, "0")}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="description"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 py-8 pb-28 space-y-8"
                style={{ background: "hsl(var(--background))", minHeight: "100vh" }}
              >
                {/* Title */}
                <div>
                  <h2 className="font-display font-bold text-xl uppercase leading-tight" style={{ color: "hsl(var(--foreground))" }}>
                    {project.title}
                  </h2>
                  <p className="font-display text-xs tracking-widest uppercase mt-1" style={{ color: "hsl(var(--primary))" }}>
                    {project.category}
                  </p>
                </div>
                <Divider />
                <div className="space-y-4">
                  <MetaRow icon={<Calendar className="w-4 h-4" />} label={t("projdet.label.year")} value={project.year} />
                  <MetaRow icon={<User className="w-4 h-4" />} label={t("projdet.label.client")} value={project.client} />
                  <MetaRow icon={<Target className="w-4 h-4" />} label={t("projdet.label.audience")} value={project.audience} />
                </div>
                <Divider />
                <div>
                  <SectionLabel icon={<AlignLeft className="w-3.5 h-3.5" />} label={t("projdet.label.about")} />
                  <p className="font-body text-sm leading-relaxed mt-3" style={{ color: "hsl(var(--muted-foreground))" }}>{project.description}</p>
                </div>
                <Divider />
                <div>
                  <SectionLabel icon={<ChevronRight className="w-3.5 h-3.5" />} label={t("projdet.label.challenge")} />
                  <p className="font-body text-sm leading-relaxed mt-3" style={{ color: "hsl(var(--muted-foreground))" }}>{project.challenge}</p>
                </div>
                <div>
                  <SectionLabel icon={<ChevronRight className="w-3.5 h-3.5" />} label={t("projdet.label.process")} />
                  <p className="font-body text-sm leading-relaxed mt-3" style={{ color: "hsl(var(--muted-foreground))" }}>{project.process}</p>
                </div>
                <div>
                  <SectionLabel icon={<ChevronRight className="w-3.5 h-3.5" />} label={t("projdet.label.outcome")} />
                  <p className="font-body text-sm leading-relaxed mt-3" style={{ color: "hsl(var(--muted-foreground))" }}>{project.outcome}</p>
                </div>
                <Divider />
                <div>
                  <SectionLabel icon={<Wrench className="w-3.5 h-3.5" />} label={t("projdet.label.tools")} />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tools.map((tool) => (
                      <span key={tool} className="glass-panel-sm px-3 py-1 font-display text-xs tracking-[0.1em] uppercase" style={{ color: "hsl(var(--foreground))" }}>{tool}</span>
                    ))}
                  </div>
                </div>
                <Divider />
                <div>
                  <SectionLabel icon={<Target className="w-3.5 h-3.5" />} label={t("projdet.label.tags")} />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tags.map((tag) => (
                      <span key={tag} className="font-display text-xs tracking-[0.1em] uppercase px-3 py-1 rounded-full"
                        style={{ background: "rgba(10,132,255,0.12)", color: "hsl(var(--primary))", border: "1px solid rgba(10,132,255,0.25)" }}>{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile floating toggle button */}
          <motion.button
            onClick={() => setMobileView(mobileView === "slides" ? "description" : "slides")}
            className="fixed z-50 flex items-center gap-2 font-display text-xs tracking-[0.15em] uppercase"
            style={{
              bottom: "1.5rem",
              right: "1rem",
              left: "1rem",
              background: "rgba(8,16,42,0.92)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(10,132,255,0.35)",
              borderRadius: "9999px",
              padding: "0.875rem 1.25rem",
              color: "#fff",
              boxShadow: "0 0 24px rgba(10,132,255,0.2), 0 8px 32px rgba(0,0,0,0.4)",
              justifyContent: "center",
            }}
            whileTap={{ scale: 0.97 }}
          >
            {mobileView === "slides" ? (
              <>
                <FileText className="w-4 h-4" />
                {t("projdet.label.descPanel")}
              </>
            ) : (
              <>
                <Images className="w-4 h-4" />
                {t("projdet.label.backToSlides")}
              </>
            )}
          </motion.button>
        </div>
      ) : (
        /* ── DESKTOP LAYOUT */
        <>
          <div ref={containerRef} className="relative flex" style={isFullscreen ? { background: "#000", height: "100vh", overflow: "auto" } : {}}>
            {/* SLIDES FEED */}
            <div
              className="flex-1 transition-all duration-500"
              style={{ marginRight: descOpen ? "380px" : "0" }}
            >
              {/* Project title */}
              <div className="max-w-[1920px] mx-auto px-6 pt-12 pb-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <h1 className="font-display font-extrabold uppercase leading-tight" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "hsl(var(--foreground))" }}>
                    {project.title}
                  </h1>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tags.map((tag) => (
                      <span key={tag} className="font-display text-xs tracking-[0.1em] uppercase px-3 py-1 rounded-xl"
                        style={{ background: "rgba(10,132,255,0.12)", color: "hsl(var(--primary))", border: "1px solid rgba(10,132,255,0.25)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* 16:9 slides stacked vertically */}
              <div className="max-w-[1920px] mx-auto px-6 pb-24 space-y-4">
                {project.slides.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.7, delay: i * 0.05 }}
                    className="relative w-full overflow-hidden"
                    style={{
                      aspectRatio: "16/9",
                      borderRadius: "var(--radius)",
                      border: "1px solid rgba(10,132,255,0.1)",
                      background: "#0a1432",
                    }}
                  >
                    <img
                      src={img}
                      alt={`${project.title} — slide ${i + 1}`}
                      className="w-full h-full object-contain"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                    <div className="absolute bottom-4 right-4 font-display text-xs tracking-widest"
                      style={{ color: "rgba(255,255,255,0.4)" }}>
                      {String(i + 1).padStart(2, "0")} / {String(project.slides.length).padStart(2, "0")}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── DESCRIPTION PANEL */}
            <AnimatePresence>
              {descOpen && (
                <motion.aside
                  initial={{ x: 380, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 380, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="fixed right-0 top-0 h-full z-50 overflow-y-auto"
                  style={{
                    width: "380px",
                    background: "hsl(var(--background))",
                    backdropFilter: "blur(20px)",
                    borderLeft: "1px solid hsl(var(--border))",
                  }}
                >
                  <div className="sticky top-0 flex items-center justify-between px-6 py-5 z-10"
                    style={{ background: "hsl(var(--background))", borderBottom: "1px solid hsl(var(--border))" }}>
                    <span className="font-display text-xs tracking-[0.2em] uppercase" style={{ color: "hsl(var(--primary))" }}>
                      {t("projdet.label.descPanel")}
                    </span>
                    <button onClick={() => setDescOpen(false)}
                      className="glass-panel-sm p-1.5 hover:scale-105 transition-transform">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="px-6 py-8 space-y-8">
                    <div>
                      <h2 className="font-display font-bold text-xl uppercase leading-tight" style={{ color: "hsl(var(--foreground))" }}>
                        {project.title}
                      </h2>
                      <p className="font-display text-xs tracking-widest uppercase mt-1" style={{ color: "hsl(var(--primary))" }}>
                        {project.category}
                      </p>
                    </div>
                    <Divider />
                    <div className="space-y-4">
                      <MetaRow icon={<Calendar className="w-4 h-4" />} label={t("projdet.label.year")} value={project.year} />
                      <MetaRow icon={<User className="w-4 h-4" />} label={t("projdet.label.client")} value={project.client} />
                      <MetaRow icon={<Target className="w-4 h-4" />} label={t("projdet.label.audience")} value={project.audience} />
                    </div>
                    <Divider />
                    <div>
                      <SectionLabel icon={<AlignLeft className="w-3.5 h-3.5" />} label={t("projdet.label.about")} />
                      <p className="font-body text-sm leading-relaxed mt-3" style={{ color: "hsl(var(--muted-foreground))" }}>{project.description}</p>
                    </div>
                    <Divider />
                    <div>
                      <SectionLabel icon={<ChevronRight className="w-3.5 h-3.5" />} label={t("projdet.label.challenge")} />
                      <p className="font-body text-sm leading-relaxed mt-3" style={{ color: "hsl(var(--muted-foreground))" }}>{project.challenge}</p>
                    </div>
                    <div>
                      <SectionLabel icon={<ChevronRight className="w-3.5 h-3.5" />} label={t("projdet.label.process")} />
                      <p className="font-body text-sm leading-relaxed mt-3" style={{ color: "hsl(var(--muted-foreground))" }}>{project.process}</p>
                    </div>
                    <div>
                      <SectionLabel icon={<ChevronRight className="w-3.5 h-3.5" />} label={t("projdet.label.outcome")} />
                      <p className="font-body text-sm leading-relaxed mt-3" style={{ color: "hsl(var(--muted-foreground))" }}>{project.outcome}</p>
                    </div>
                    <Divider />
                    <div>
                      <SectionLabel icon={<Wrench className="w-3.5 h-3.5" />} label={t("projdet.label.tools")} />
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.tools.map((tool) => (
                          <span key={tool} className="glass-panel-sm px-3 py-1 font-display text-xs tracking-[0.1em] uppercase" style={{ color: "hsl(var(--foreground))" }}>{tool}</span>
                        ))}
                      </div>
                    </div>
                    <Divider />
                    <div>
                      <SectionLabel icon={<Target className="w-3.5 h-3.5" />} label={t("projdet.label.tags")} />
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.tags.map((tag) => (
                          <span key={tag} className="font-display text-xs tracking-[0.1em] uppercase px-3 py-1 rounded-full"
                            style={{ background: "rgba(10,132,255,0.12)", color: "hsl(var(--primary))", border: "1px solid rgba(10,132,255,0.25)" }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.aside>
              )}
            </AnimatePresence>
          </div>

          {/* ── FLOATING DESCRIPTION BUTTON (desktop) */}
          <AnimatePresence>
            {!descOpen && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.7, x: 30 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setDescOpen(true)}
                className="fixed z-50 flex items-center gap-2 font-display text-xs tracking-[0.15em] uppercase"
                style={{
                  bottom: "2rem",
                  right: "2rem",
                  background: "rgba(8,16,42,0.92)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(10,132,255,0.35)",
                  borderRadius: "9999px",
                  padding: "0.75rem 1.25rem",
                  color: "#fff",
                  boxShadow: "0 0 24px rgba(10,132,255,0.2), 0 8px 32px rgba(0,0,0,0.4)",
                }}
                whileHover={{ scale: 1.06, boxShadow: "0 0 36px rgba(10,132,255,0.35), 0 8px 40px rgba(0,0,0,0.5)" }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: "hsl(var(--primary))" }} />
                  <span className="relative inline-flex rounded-full h-2 w-2"
                    style={{ background: "hsl(var(--primary))" }} />
                </span>
                {t("projdet.label.descPanel")}
              </motion.button>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: "hsl(var(--border))" }} />;
}

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span style={{ color: "hsl(var(--primary))" }}>{icon}</span>
      <span className="font-display text-xs tracking-[0.2em] uppercase" style={{ color: "hsl(var(--primary))" }}>{label}</span>
    </div>
  );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0" style={{ color: "hsl(var(--primary))" }}>{icon}</span>
      <div>
        <p className="font-display text-[10px] tracking-[0.2em] uppercase mb-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{label}</p>
        <p className="font-body text-sm" style={{ color: "hsl(var(--foreground))" }}>{value}</p>
      </div>
    </div>
  );
}
