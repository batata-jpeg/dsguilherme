import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Filter } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

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
    { key: "Branding", label: "Branding" },
    { key: "Motion", label: "Motion" },
    { key: "UI/UX", label: "UI/UX" },
    { key: "3D", label: "3D" },
    { key: "Identity", label: "Identity" },
  ];

  const projects = [
    {
      id: "luminary-brand",
      title: t("proj.luminary.title"),
      category: t("proj.luminary.category"),
      categoryKey: "Branding",
      description: t("proj.luminary.desc"),
      image: project1,
      year: "2024",
      tags: ["Branding", "Identity", "Typography"],
    },
    {
      id: "nebula-motion",
      title: t("proj.nebula.title"),
      category: t("proj.nebula.category"),
      categoryKey: "Motion",
      description: t("proj.nebula.desc"),
      image: project2,
      year: "2024",
      tags: ["Motion", "3D", "Generative"],
    },
    {
      id: "nova-app",
      title: t("proj.nova.title"),
      category: t("proj.nova.category"),
      categoryKey: "UI/UX",
      description: t("proj.nova.desc"),
      image: project3,
      year: "2023",
      tags: ["UI/UX", "Product", "Mobile"],
    },
    {
      id: "obsidian-packaging",
      title: t("proj.obsidian.title"),
      category: t("proj.obsidian.category"),
      categoryKey: "Identity",
      description: t("proj.obsidian.desc"),
      image: project4,
      year: "2023",
      tags: ["Identity", "Packaging", "Luxury"],
    },
    {
      id: "void-type",
      title: t("proj.void.title"),
      category: t("proj.void.category"),
      categoryKey: "Branding",
      description: t("proj.void.desc"),
      image: project1,
      year: "2023",
      tags: ["Typography", "Branding"],
    },
    {
      id: "prism-visuals",
      title: t("proj.prism.title"),
      category: t("proj.prism.category"),
      categoryKey: "3D",
      description: t("proj.prism.desc"),
      image: project2,
      year: "2022",
      tags: ["3D", "Motion", "Identity"],
    },
  ];

  const filtered = activeCategory === "all"
    ? projects
    : projects.filter((p) => p.categoryKey === activeCategory || p.tags.includes(activeCategory));

  return (
    <div className="min-h-screen dot-grid" style={{ background: "var(--gradient-bg)" }}>
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
                borderColor: activeCategory === cat.key ? "rgba(10,132,255,0.5)" : undefined,
                boxShadow: activeCategory === cat.key ? "var(--glow-blue-sm)" : undefined,
                background: activeCategory === cat.key ? "rgba(10,132,255,0.10)" : undefined,
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
                <div className="glass-panel group overflow-hidden">
                  <div className="relative h-56 overflow-hidden">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${proj.image})` }} />
                    <div className="absolute inset-0 transition-opacity duration-300" style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(10,20,50,0.85) 100%)" }} />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                      style={{ background: "rgba(59,153,252,0.10)" }}>
                      <div className="glass-panel-sm px-5 py-2 flex items-center gap-2">
                        <span className="font-display text-xs tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>{t("projects.view")}</span>
                        <ArrowRight className="w-3 h-3" style={{ color: "hsl(var(--primary))" }} />
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 glass-panel-sm px-2 py-1">
                      <span className="font-display text-xs tracking-widest" style={{ color: "hsl(var(--muted-foreground))" }}>{proj.year}</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <span className="section-label">{proj.category}</span>
                    <h3 className="font-display font-bold text-lg uppercase">{proj.title}</h3>
                    <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>{proj.description}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {proj.tags.map((tag) => (
                        <span key={tag} className="font-display text-xs tracking-[0.1em] uppercase px-2 py-1 rounded-lg glass-panel-sm"
                          style={{ color: "hsl(var(--primary))", opacity: 0.8 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
}
