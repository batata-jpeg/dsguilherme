import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Filter } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import project5 from "@/assets/project-5.jpg";
import { useLanguage } from "@/contexts/LanguageContext";
import GlareHover from "@/components/GlareHover";

function FadeInSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

export default function Projects() {
  const { t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = [
    { key: "all", label: t("projects.filter.all") },
    { key: "Identity", label: "Identity" },
  ];

  const projects = [
    {
      id: "armagedom-rpg",
      title: "ARMAGEDOM - RPG",
      category: "Identidade",
      categoryKey: "Identity",
      description: "Identidade visual completa para o jogo de tabuleiro RPG Armagedom.",
      image: project1,
      year: "2024",
      tags: ["Identity", "Branding"],
    },
  ];

  const filtered = activeCategory === "all"
    ? projects
    : projects.filter((p) => p.categoryKey === activeCategory || p.tags.includes(activeCategory));

  return (
    <div className="min-h-screen dot-grid bg-transparent">
      {/* Header */}
      <div className="relative pt-36 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <span className="section-label block mb-6">{t("projects.label")}</span>
            <h1 className="font-display font-extrabold uppercase leading-tight mb-6" style={{ fontSize: "clamp(3rem, 7vw, 7rem)" }}>
              {t("projects.h1a")}
              <br />
              <span className="gradient-text">{t("projects.h1b")}</span>
            </h1>
            <p className="font-body text-lg max-w-xl" style={{ color: "hsl(var(--muted-foreground))" }}>
              {t("projects.description")}
            </p>
          </FadeInSection>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <FadeInSection className="flex flex-wrap gap-3 items-center">
          <Filter className="w-4 h-4 mr-1" style={{ color: "hsl(var(--muted-foreground))" }} />
          {categories.map((cat) => (
            <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
              className="glass-panel-sm px-4 py-2 font-display text-xs tracking-[0.15em] uppercase transition-all duration-300"
              style={{
                color: activeCategory === cat.key ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                borderColor: activeCategory === cat.key ? "rgba(162,213,198,0.6)" : undefined,
                boxShadow: activeCategory === cat.key ? "var(--glow-blue-sm)" : undefined,
                background: activeCategory === cat.key ? "rgba(207,255,226,0.25)" : undefined,
              }}>
              {cat.label}
            </button>
          ))}
        </FadeInSection>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((proj, i) => (
            <FadeInSection key={proj.id} delay={i * 0.08}>
              <Link to={`/projects/${proj.id}`}>
                <GlareHover
                  width="100%"
                  height="100%"
                  borderRadius="var(--radius)"
                  borderColor="hsl(var(--border))"
                  background="transparent"
                  glareColor="#ffffff"
                  glareOpacity={0.30}
                  glareAngle={-45}
                  glareSize={220}
                  transitionDuration={650}
                  className="group aspect-[16/9]"
                  style={{ display: "block" }}
                >
                  <div className="relative w-full h-full rounded-[var(--radius)]">
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${proj.image})` }} />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(10,20,50,0.80) 100%)" }} />
                    {/* Bottom title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="block font-display text-[10px] tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.6)" }}>{proj.category}</span>
                      <h3 className="font-display font-bold text-sm uppercase leading-tight text-white">{proj.title}</h3>
                    </div>
                  </div>
                </GlareHover>
              </Link>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
}
