import { useParams, Link } from "react-router-dom";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Maximize, Minimize, X, ChevronRight, Calendar, Wrench, User, Target, AlignLeft } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import project5 from "@/assets/project-5.jpg";

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
  "armagedom-rpg": {
    title: "ARMAGEDOM - RPG",
    category: "Identidade",
    description: "Identidade visual completa para o jogo de tabuleiro RPG Armagedom, incluindo logotipo, cartas, tabuleiro, manual de regras e fichas de personagens.",
    image: project1,
    year: "2024",
    client: "Projeto Pessoal",
    audience: "Jogadores de RPG de mesa e board games",
    tags: ["Identity", "Branding"],
    tools: ["Adobe Illustrator", "Adobe Photoshop", "Blender"],
    challenge: "Criar uma identidade visual coesa e imersiva para um jogo de tabuleiro RPG com temática sobrenatural e investigativa.",
    process: "Desenvolvimento do logotipo com tipografia customizada, criação das ilustrações de cartas e personagens, design do tabuleiro e materiais gráficos complementares como fichas confidenciais e manual de regras.",
    outcome: "Um sistema visual completo que transmite a atmosfera sombria e misteriosa do jogo, com todos os materiais prontos para produção.",
    slides: [project1, project2, project3, project4, project5],
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
                  className="w-full h-full object-contain"
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
