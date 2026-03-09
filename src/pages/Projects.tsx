import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Filter } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const categories = ["All", "Branding", "Motion", "UI/UX", "3D", "Identity"];

const projects = [
  {
    id: "luminary-brand",
    title: "Luminary Brand Identity",
    category: "Branding",
    description: "A complete luxury brand system with custom typeface, logomark, and a premium visual language for a high-end cosmetics label.",
    image: project1,
    year: "2024",
    tags: ["Branding", "Identity", "Typography"],
  },
  {
    id: "nebula-motion",
    title: "Nebula Motion Series",
    category: "Motion",
    description: "Generative motion graphics series exploring fluid dynamics and organic form evolution through real-time 3D simulations.",
    image: project2,
    year: "2024",
    tags: ["Motion", "3D", "Generative"],
  },
  {
    id: "nova-app",
    title: "Nova App Interface",
    category: "UI/UX",
    description: "A futuristic mobile OS concept with a glassmorphism design language, demonstrating advanced interface design thinking.",
    image: project3,
    year: "2023",
    tags: ["UI/UX", "Product", "Mobile"],
  },
  {
    id: "obsidian-packaging",
    title: "Obsidian Packaging",
    category: "Identity",
    description: "Luxury packaging design for a premium lifestyle brand — matte obsidian finish with subtle holographic foil detailing.",
    image: project4,
    year: "2023",
    tags: ["Identity", "Packaging", "Luxury"],
  },
  {
    id: "void-type",
    title: "Void Typeface",
    category: "Branding",
    description: "An experimental display typeface designed for high-contrast environments, blending geometric precision with organic irregularities.",
    image: project1,
    year: "2023",
    tags: ["Typography", "Branding"],
  },
  {
    id: "prism-visuals",
    title: "Prism Visual System",
    category: "3D",
    description: "A comprehensive 3D visual system for a music label, including stage design concepts, album art, and promotional materials.",
    image: project2,
    year: "2022",
    tags: ["3D", "Motion", "Identity"],
  },
];

function FadeInSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory || p.tags.includes(activeCategory));

  return (
    <div className="min-h-screen dot-grid" style={{ background: "var(--gradient-bg)" }}>
      {/* Header */}
      <div className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute top-0 right-1/4 radial-glow-cyan opacity-30 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 radial-glow-magenta opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <FadeInSection>
            <span className="section-label block mb-6">Portfolio</span>
            <h1
              className="font-display font-extrabold uppercase leading-tight mb-6"
              style={{ fontSize: "clamp(3rem, 7vw, 7rem)" }}
            >
              ALL
              <br />
              <span className="gradient-text">PROJECTS</span>
            </h1>
            <p className="font-body text-lg max-w-xl" style={{ color: "hsl(var(--muted-foreground))" }}>
              A curated collection of work spanning branding, motion, 3D, and digital experiences.
            </p>
          </FadeInSection>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <FadeInSection className="flex flex-wrap gap-3 items-center">
          <Filter className="w-4 h-4 mr-1" style={{ color: "hsl(var(--muted-foreground))" }} />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="glass-panel-sm px-4 py-2 font-display text-xs tracking-[0.15em] uppercase transition-all duration-300"
              style={{
                color: activeCategory === cat ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                borderColor: activeCategory === cat ? "rgba(112,251,249,0.5)" : "rgba(112,251,249,0.15)",
                boxShadow: activeCategory === cat ? "var(--glow-cyan-sm)" : "none",
                background: activeCategory === cat ? "rgba(112,251,249,0.08)" : "var(--glass-bg)",
              }}
            >
              {cat}
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
                <div
                  className="glass-panel group overflow-hidden"
                  style={{ cursor: "none" }}
                >
                  {/* Thumbnail */}
                  <div className="relative h-56 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${proj.image})` }}
                    />
                    <div
                      className="absolute inset-0 transition-opacity duration-300"
                      style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(3,6,21,0.9) 100%)" }}
                    />
                    {/* Hover overlay */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                      style={{ background: "rgba(112,251,249,0.04)", backdropFilter: "blur(2px)" }}
                    >
                      <div className="glass-panel-sm px-5 py-2 flex items-center gap-2">
                        <span className="font-display text-xs tracking-widest uppercase" style={{ color: "hsl(var(--primary))" }}>
                          View Project
                        </span>
                        <ArrowRight className="w-3 h-3" style={{ color: "hsl(var(--primary))" }} />
                      </div>
                    </div>
                    {/* Year badge */}
                    <div
                      className="absolute top-4 right-4 glass-panel-sm px-2 py-1"
                    >
                      <span className="font-display text-xs tracking-widest" style={{ color: "hsl(var(--muted-foreground))" }}>{proj.year}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-3">
                    <span className="section-label">{proj.category}</span>
                    <h3 className="font-display font-bold text-lg uppercase">{proj.title}</h3>
                    <p className="font-body text-sm leading-relaxed" style={{ color: "hsl(var(--muted-foreground))" }}>
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {proj.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-display text-xs tracking-[0.1em] uppercase px-2 py-1 rounded-lg"
                          style={{ background: "rgba(112,251,249,0.06)", color: "rgba(112,251,249,0.6)", border: "1px solid rgba(112,251,249,0.12)" }}
                        >
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
