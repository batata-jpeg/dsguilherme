import { useParams, Link } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Maximize, Minimize, X, ChevronRight, Calendar, Wrench, User, Target, AlignLeft } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const projects: Record<string, {
  title: string;
  category: string;
  description: string;
  image: string;
  year: string;
  client: string;
  audience: string;
  tags: string[];
  tools: string[];
  challenge: string;
  process: string;
  outcome: string;
  slides: string[];
}> = {
  "luminary-brand": {
    title: "Luminary Brand Identity",
    category: "Branding, Identity",
    description: "A complete luxury brand system featuring custom typography, mark design, and a premium visual language for an elite cosmetics label.",
    image: project1,
    year: "2024",
    client: "Luminary Cosmetics",
    audience: "Luxury beauty consumers, 25–45 years, high purchasing power",
    tags: ["Branding", "Identity", "Typography"],
    tools: ["Adobe Illustrator", "Adobe InDesign", "Figma", "After Effects"],
    challenge: "Luminary needed a visual identity that could stand beside the world's most recognised luxury beauty brands while maintaining a distinct, modern perspective. The brand needed to feel both timeless and avant-garde.",
    process: "We began with extensive mood-boarding exploring the intersection of mineral forms and contemporary luxury. The logomark evolved from the refraction patterns of diamonds, translated into precise geometric construction. The custom wordmark was refined over 40+ iterations to achieve the exact balance of authority and elegance.",
    outcome: "The completed brand system launched across 12 product lines and was recognised by the GDUSA American Design Awards. Client reported a 34% increase in perceived premium positioning among target consumers.",
    slides: [project1, project2, project3, project4, project1, project2],
  },
  "nebula-motion": {
    title: "Nebula Motion Series",
    category: "Motion, 3D",
    description: "Generative motion graphics exploring fluid dynamics and organic form through real-time 3D simulations.",
    image: project2,
    year: "2024",
    client: "Personal / Exhibition",
    audience: "Digital art collectors and gallery visitors",
    tags: ["Motion", "3D", "Generative"],
    tools: ["Blender", "Cinema 4D", "After Effects", "TouchDesigner"],
    challenge: "Create a series of visual works that exist at the boundary between digital and natural phenomena — exploring how computational processes can evoke emotional, visceral responses.",
    process: "Using fluid simulation software combined with custom particle systems, we generated a series of base simulations. These were sculpted, coloured, and composed in Blender before final post-processing in After Effects.",
    outcome: "The series was exhibited at three digital art festivals and acquired by two private collectors. It became a reference work for the studio's approach to generative aesthetics.",
    slides: [project2, project3, project1, project4, project2, project3],
  },
  "nova-app": {
    title: "Nova App Interface",
    category: "UI/UX, Product",
    description: "A futuristic mobile OS concept with glassmorphism design language demonstrating advanced interface design thinking.",
    image: project3,
    year: "2023",
    client: "Nova Tech (Concept)",
    audience: "Early adopters of spatial computing and AR technology",
    tags: ["UI/UX", "Product", "Mobile"],
    tools: ["Figma", "Protopie", "After Effects", "Blender"],
    challenge: "Reimagine the mobile operating system interface for a near-future context where the boundary between digital and physical is increasingly blurred.",
    process: "Extensive research into spatial computing, AR interfaces, and biometric interaction patterns informed the initial concepts. The glassmorphism language was chosen to create depth suggesting the interface exists within physical space.",
    outcome: "The concept garnered 200K+ views across design platforms and led to two direct client commissions for similar exploratory work.",
    slides: [project3, project2, project4, project1, project3, project2],
  },
  "obsidian-packaging": {
    title: "Obsidian Packaging",
    category: "Identity, Packaging",
    description: "Luxury packaging design for a premium lifestyle brand with matte obsidian finish and holographic foil detailing.",
    image: project4,
    year: "2023",
    client: "Obsidian Lifestyle Co.",
    audience: "High-end retail consumers, gift buyers, luxury lifestyle market",
    tags: ["Identity", "Packaging", "Luxury"],
    tools: ["Adobe Illustrator", "Keyshot", "Blender", "Adobe Photoshop"],
    challenge: "Design packaging that communicates absolute premium quality through restraint rather than decoration. The product should feel like a collector's item before it's even opened.",
    process: "The minimal approach demanded extreme attention to material texture, proportion, and strategic use of negative space. Obsidian matte finish was selected after evaluating 15+ material samples.",
    outcome: "The packaging design won Gold at the Pentawards 2023. The client reported a 28% increase in retail sell-through attributed to packaging differentiation.",
    slides: [project4, project1, project2, project3, project4, project1],
  },
  "void-type": {
    title: "Void Typography",
    category: "Branding, Typography",
    description: "An explorative typographic system for a conceptual music label, blending brutalism with organic letterform distortion.",
    image: project1,
    year: "2023",
    client: "Void Records (Concept)",
    audience: "Music industry creatives, underground electronic music fans",
    tags: ["Typography", "Branding"],
    tools: ["Adobe Illustrator", "Glyphs App", "After Effects"],
    challenge: "Create a typographic identity that feels both digital and organic — as if the letterforms are dissolving into noise and reforming.",
    process: "Started with a variable font base, then applied custom distortion algorithms to each letterform. The result was a system that can generate unique, never-repeating compositions.",
    outcome: "The system was adopted by three independent music labels and featured in Typographica's annual review.",
    slides: [project1, project3, project2, project4, project1, project3],
  },
  "prism-visuals": {
    title: "Prism Visuals",
    category: "3D, Motion",
    description: "A series of real-time rendered visual identities exploring light refraction and prismatic colour theory.",
    image: project2,
    year: "2022",
    client: "Prism Studio",
    audience: "Creative directors, art buyers, digital art enthusiasts",
    tags: ["3D", "Motion", "Identity"],
    tools: ["Blender", "Cinema 4D", "TouchDesigner", "After Effects"],
    challenge: "Create a living brand identity that changes dynamically based on viewing angle and light conditions — a brand that never looks the same twice.",
    process: "Real-time rendering pipelines in TouchDesigner allowed us to generate procedural light refractions. These were then packaged into a brand toolkit with guidelines for dynamic application.",
    outcome: "The brand won Best Visual Identity at the D&AD New Blood Awards 2022 and was covered by It's Nice That and Creative Review.",
    slides: [project2, project4, project3, project1, project2, project4],
  },
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = id ? projects[id] : null;
  const [descOpen, setDescOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
      <div className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(10,20,50,0.7)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(10,132,255,0.1)" }}>
        <Link to="/projects">
          <button className="btn-glass-primary text-xs flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> All Projects
          </button>
        </Link>
        <div className="flex items-center gap-3">
          <span className="font-display text-xs tracking-widest uppercase hidden sm:block" style={{ color: "hsl(var(--muted-foreground))" }}>
            {project.category}
          </span>
          <button
            onClick={isFullscreen ? exitFullscreen : enterFullscreen}
            className="glass-panel-sm p-2 transition-all duration-200 hover:scale-105"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen presentation"}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT (slides + optional description panel) */}
      <div ref={containerRef} className="relative flex" style={isFullscreen ? { background: "#000", minHeight: "100vh" } : {}}>

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
                  className="w-full h-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                />
                {/* slide counter */}
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
              {/* Panel header */}
              <div className="sticky top-0 flex items-center justify-between px-6 py-5 z-10"
                style={{ background: "hsl(var(--background))", borderBottom: "1px solid hsl(var(--border))" }}>
                <span className="font-display text-xs tracking-[0.2em] uppercase" style={{ color: "hsl(var(--primary))" }}>
                  Project Description
                </span>
                <button onClick={() => setDescOpen(false)}
                  className="glass-panel-sm p-1.5 hover:scale-105 transition-transform">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Panel content */}
              <div className="px-6 py-8 space-y-8">
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

                {/* Meta grid */}
                <div className="space-y-4">
                  <MetaRow icon={<Calendar className="w-4 h-4" />} label="Year" value={project.year} />
                  <MetaRow icon={<User className="w-4 h-4" />} label="Client" value={project.client} />
                  <MetaRow icon={<Target className="w-4 h-4" />} label="Audience" value={project.audience} />
                </div>

                <Divider />

                {/* Description */}
                <div>
                  <SectionLabel icon={<AlignLeft className="w-3.5 h-3.5" />} label="About the Project" />
                  <p className="font-body text-sm leading-relaxed mt-3" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {project.description}
                  </p>
                </div>

                <Divider />

                {/* Challenge */}
                <div>
                  <SectionLabel icon={<ChevronRight className="w-3.5 h-3.5" />} label="The Challenge" />
                  <p className="font-body text-sm leading-relaxed mt-3" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {project.challenge}
                  </p>
                </div>

                {/* Process */}
                <div>
                  <SectionLabel icon={<ChevronRight className="w-3.5 h-3.5" />} label="The Process" />
                  <p className="font-body text-sm leading-relaxed mt-3" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {project.process}
                  </p>
                </div>

                {/* Outcome */}
                <div>
                  <SectionLabel icon={<ChevronRight className="w-3.5 h-3.5" />} label="The Outcome" />
                  <p className="font-body text-sm leading-relaxed mt-3" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {project.outcome}
                  </p>
                </div>

                <Divider />

                {/* Tools */}
                <div>
                  <SectionLabel icon={<Wrench className="w-3.5 h-3.5" />} label="Tools Used" />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tools.map((tool) => (
                      <span key={tool} className="glass-panel-sm px-3 py-1 font-display text-xs tracking-[0.1em] uppercase"
                        style={{ color: "hsl(var(--foreground))" }}>
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <Divider />

                {/* Tags */}
                <div>
                  <SectionLabel icon={<Target className="w-3.5 h-3.5" />} label="Tags" />
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tags.map((tag) => (
                      <span key={tag} className="font-display text-xs tracking-[0.1em] uppercase px-3 py-1 rounded-full"
                        style={{ background: "rgba(10,132,255,0.12)", color: "hsl(var(--primary))", border: "1px solid rgba(10,132,255,0.25)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* ── FLOATING DESCRIPTION BUTTON */}
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
              color: "hsl(var(--foreground))",
              boxShadow: "0 0 24px rgba(10,132,255,0.2), 0 8px 32px rgba(0,0,0,0.4)",
            }}
            whileHover={{ scale: 1.06, boxShadow: "0 0 36px rgba(10,132,255,0.35), 0 8px 40px rgba(0,0,0,0.5)" }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Pulsing dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: "hsl(var(--primary))" }} />
              <span className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: "hsl(var(--primary))" }} />
            </span>
            Descrição do Projeto
          </motion.button>
        )}
      </AnimatePresence>
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
