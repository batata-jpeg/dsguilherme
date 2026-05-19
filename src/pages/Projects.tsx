import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";
import project5 from "@/assets/project-5.jpg";
import fallingCharDark from "@/assets/hero-character-falling.png";
import fallingCharLight from "@/assets/hero-character-falling-light.png";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";

const GAZZ_THUMB = "/gazz/gazz-01.jpg";
const gazzSlides = [
  "/gazz/gazz-01.jpg", "/gazz/gazz-02.jpg", "/gazz/gazz-04.jpg",
  "/gazz/gazz-06.jpg", "/gazz/gazz-07.jpg", "/gazz/gazz-08.jpg",
  "/gazz/gazz-11.jpg", "/gazz/gazz-13.jpg", "/gazz/gazz-14.jpg",
  "/gazz/gazz-15.jpg", "/gazz/gazz-17.jpg", "/gazz/gazz-18.jpg",
  "/gazz/gazz-19.jpg", "/gazz/gazz-20.jpg", "/gazz/gazz-21.jpg",
];
const armSlides = [project1, project2, project3, project4, project5];

type Project = {
  id: string;
  title: string;
  year: string;
  category: string;
  description: string;
  client: string;
  audience: string;
  challenge: string;
  process: string;
  outcome: string;
  tags: string[];
  tools: string[];
  stripImage: string;
  slides: string[];
};

// ── MacOS Modal ──────────────────────────────────────────────────────────────
function MacOSModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(0);
  const [showDesc, setShowDesc] = useState(false);

  const go = useCallback((d: number) => {
    setDir(d);
    setCurrent(c => (c + d + project.slides.length) % project.slides.length);
  }, [project.slides.length]);

  const goTo = (i: number) => {
    setDir(i > current ? 1 : -1);
    setCurrent(i);
  };

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : d < 0 ? "-100%" : 0 }),
    center: { x: 0 },
    exit:  (d: number) => ({ x: d > 0 ? "-100%" : d < 0 ? "100%" : 0 }),
  };

  const windowSpring = { type: "spring", stiffness: 360, damping: 36 } as const;
  const windowAnim = { initial: { scale: 0.87, opacity: 0, y: 24 }, animate: { scale: 1, opacity: 1, y: 0 }, exit: { scale: 0.87, opacity: 0, y: 24 } };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ padding: "clamp(12px, 2.5vw, 36px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.86)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
        onClick={onClose}
      />

      {/* Windows row — auto width so the outer flex-center slides everything left as description appears */}
      <div
        className="relative z-10 flex items-stretch"
        style={{ gap: 10, height: "min(88vh, 860px)" }}
      >
        {/* ── Main image window — fixed width, never resizes */}
        <motion.div
          className="relative flex flex-col overflow-hidden rounded-2xl flex-shrink-0"
          style={{
            width: "min(90vw, 1220px)",
            background: dk ? "#08101d" : "#f0f4f8",
            boxShadow: dk
              ? "0 60px 160px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.07)"
              : "0 40px 120px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.08)",
          }}
          {...windowAnim}
          transition={windowSpring}
        >
          {/* Chrome bar */}
          <div
            className="flex items-center shrink-0 h-11 px-4 gap-4"
            style={{
              background: dk ? "#111d2e" : "#e2e8f0",
              borderBottom: `1px solid ${dk ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
            }}
          >
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="w-[13px] h-[13px] rounded-full hover:opacity-75 transition-opacity" style={{ background: "#ff5f57" }} />
              <div className="w-[13px] h-[13px] rounded-full" style={{ background: "#ffbd2e" }} />
              <div className="w-[13px] h-[13px] rounded-full" style={{ background: "#28c941" }} />
            </div>

            <div className="flex items-center gap-1.5 mx-auto">
              <button onClick={() => go(-1)} className="flex items-center justify-center w-6 h-6 rounded-full transition-colors" style={{ background: dk ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", border: `1px solid ${dk ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, color: dk ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)" }}>
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => go(1)} className="flex items-center justify-center w-6 h-6 rounded-full transition-colors" style={{ background: dk ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", border: `1px solid ${dk ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, color: dk ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)" }}>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <motion.button
              onClick={() => setShowDesc(d => !d)}
              className="font-display text-[9px] tracking-[0.14em] uppercase px-3 py-1 rounded-full"
              animate={{
                borderColor: showDesc ? "rgba(162,213,198,0.7)" : dk ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)",
                color: showDesc ? "rgb(162,213,198)" : dk ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)",
                background: showDesc ? "rgba(162,213,198,0.08)" : "transparent",
              }}
              style={{ border: "1px solid" }}
              transition={{ duration: 0.2 }}
            >
              Descrição do Projeto
            </motion.button>
          </div>

          {/* Image carousel */}
          <div className="relative flex-1 overflow-hidden bg-black">
            <AnimatePresence custom={dir}>
              <motion.img
                key={current}
                src={project.slides[current]}
                alt={`Slide ${current + 1}`}
                custom={dir}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 380, damping: 40 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            {project.slides.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {project.slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="rounded-full transition-all duration-200"
                    style={{
                      width: i === current ? 18 : 5,
                      height: 5,
                      background: i === current ? "hsl(var(--primary))" : "rgba(255,255,255,0.3)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Description window — separate macOS window, same spring animation + lateral expansion */}
        <AnimatePresence>
          {showDesc && (
            // Outer wrapper: animates width for the lateral expansion mechanic
            <motion.div
              className="flex-shrink-0 overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: 440 }}
              exit={{ width: 0 }}
              transition={windowSpring}
            >
              {/* Inner window: same pop-in animation as main window */}
              <motion.div
                className="flex flex-col overflow-hidden rounded-2xl h-full"
                style={{
                  width: 440,
                  background: dk ? "#0d1520" : "#f7f9fc",
                  boxShadow: `0 0 0 1px ${dk ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                }}
                {...windowAnim}
                transition={{ ...windowSpring, delay: 0.05 }}
              >
                {/* Own Chrome bar */}
                <div
                  className="flex items-center shrink-0 h-11 px-4 gap-3"
                  style={{
                    background: dk ? "#111d2e" : "#e2e8f0",
                    borderBottom: `1px solid ${dk ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowDesc(false)} className="w-[13px] h-[13px] rounded-full hover:opacity-75 transition-opacity" style={{ background: "#ff5f57" }} />
                    <div className="w-[13px] h-[13px] rounded-full" style={{ background: "#ffbd2e" }} />
                    <div className="w-[13px] h-[13px] rounded-full" style={{ background: "#28c941" }} />
                  </div>
                  <span className="font-display text-[9px] tracking-[0.2em] uppercase ml-2" style={{ color: dk ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.28)" }}>
                    Descrição
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 overflow-y-auto" style={{ padding: "28px 24px", gap: 0 }}>

                  {/* Header */}
                  <div className="mb-5">
                    <span className="block font-display text-[9px] tracking-[0.22em] uppercase mb-1" style={{ color: "hsl(var(--primary))" }}>
                      {project.category} · {project.year}
                    </span>
                    <h3 className="font-display font-extrabold uppercase text-lg leading-tight" style={{ color: dk ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.88)" }}>
                      {project.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="font-body text-sm leading-relaxed mb-5" style={{ color: dk ? "rgba(255,255,255,0.62)" : "rgba(0,0,0,0.62)", whiteSpace: "pre-line" }}>
                    {project.description}
                  </p>

                  <div className="mb-5" style={{ height: 1, background: dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)" }} />

                  {/* Client & Audience */}
                  {[
                    { label: "Cliente", value: project.client },
                    { label: "Público", value: project.audience },
                  ].map(({ label, value }) => (
                    <div key={label} className="mb-4">
                      <span className="block font-display text-[9px] tracking-[0.18em] uppercase mb-1" style={{ color: "hsl(var(--primary))" }}>{label}</span>
                      <p className="font-body text-xs leading-relaxed" style={{ color: dk ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)" }}>{value}</p>
                    </div>
                  ))}

                  <div className="mb-5" style={{ height: 1, background: dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)" }} />

                  {/* Challenge / Process / Outcome */}
                  {[
                    { label: "Desafio", value: project.challenge },
                    { label: "Processo", value: project.process },
                    { label: "Resultado", value: project.outcome },
                  ].map(({ label, value }) => (
                    <div key={label} className="mb-5">
                      <span className="block font-display text-[9px] tracking-[0.18em] uppercase mb-1.5" style={{ color: dk ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>{label}</span>
                      <p className="font-body text-xs leading-relaxed" style={{ color: dk ? "rgba(255,255,255,0.52)" : "rgba(0,0,0,0.52)", whiteSpace: "pre-line" }}>{value}</p>
                    </div>
                  ))}

                  <div className="mb-5" style={{ height: 1, background: dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)" }} />

                  {/* Tags */}
                  <div className="mb-4">
                    <span className="block font-display text-[9px] tracking-[0.18em] uppercase mb-2" style={{ color: dk ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.3)" }}>Disciplinas</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map(tag => (
                        <span key={tag} className="font-display text-[8px] tracking-[0.12em] uppercase px-2 py-1 rounded"
                          style={{ background: dk ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", color: dk ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.45)", border: `1px solid ${dk ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)"}` }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tools */}
                  <div>
                    <span className="block font-display text-[9px] tracking-[0.18em] uppercase mb-2" style={{ color: dk ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.3)" }}>Ferramentas</span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tools.map(tool => (
                        <span key={tool} className="font-display text-[8px] tracking-[0.12em] uppercase px-2 py-1 rounded"
                          style={{ background: "rgba(162,213,198,0.08)", color: "rgba(162,213,198,0.75)", border: "1px solid rgba(162,213,198,0.15)" }}>
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ── Project Strip ────────────────────────────────────────────────────────────
function ProjectStrip({
  project, isHovered, isAnyHovered, onEnter, onLeave, onClick,
}: {
  project: Project;
  isHovered: boolean;
  isAnyHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    setPressed(true);
    setTimeout(() => { setPressed(false); onClick(); }, 130);
  };

  const dimmed = isAnyHovered && !isHovered;

  return (
    <motion.div
      className="relative cursor-pointer overflow-hidden"
      style={{
        borderBottom: `1px solid ${dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}`,
        zIndex: isHovered ? 10 : 1,
      }}
      animate={{
        opacity: dimmed ? 0.28 : 1,
        filter: dimmed ? "grayscale(88%)" : "grayscale(0%)",
        scaleY: pressed ? 0.975 : isHovered ? 1.02 : 1,
      }}
      transition={{
        opacity: { duration: 0.28 },
        filter: { duration: 0.32 },
        scaleY: { type: "spring", stiffness: 420, damping: 28 },
      }}
      onHoverStart={onEnter}
      onHoverEnd={onLeave}
      onClick={handleClick}
    >
      {/* Pulse glow */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 1, 0.3],
              boxShadow: [
                "inset 0 0 0 1px rgba(162,213,198,0.1)",
                "inset 0 0 0 1px rgba(162,213,198,0.4)",
                "inset 0 0 0 1px rgba(162,213,198,0.1)",
              ],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={project.stripImage}
          alt=""
          className="w-full h-full object-cover"
          style={{ opacity: isHovered ? 0.2 : 0.07, transition: "opacity 0.35s ease" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: dk
              ? "linear-gradient(90deg, rgba(5,10,20,0.99) 0%, rgba(5,10,20,0.82) 55%, rgba(5,10,20,0.4) 100%)"
              : "linear-gradient(90deg, rgba(22,24,28,0.97) 0%, rgba(22,24,28,0.88) 55%, rgba(22,24,28,0.55) 100%)",
            transition: "background 0.35s ease",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between px-8 sm:px-14 lg:px-20" style={{ height: 320 }}>
        {/* Left */}
        <div className="flex flex-col gap-3">
          <motion.h2
            className="font-display font-extrabold uppercase leading-none"
            animate={{
              color: isHovered ? "#ffffff" : dk ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.55)",
            }}
            style={{ fontSize: isHovered ? "clamp(2.4rem, 4vw, 4rem)" : "clamp(1.8rem, 3.2vw, 3.2rem)", transition: "font-size 0.22s ease" }}
            transition={{ duration: 0.22 }}
          >
            {project.title}
          </motion.h2>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.18 }}
                className="flex items-center gap-3 flex-wrap"
              >
                {project.tags.map(tag => (
                  <span key={tag} className="font-display text-[10px] tracking-[0.18em] uppercase" style={{ color: "hsl(var(--primary))" }}>
                    {tag}
                  </span>
                ))}
                <span className="font-display text-[10px] tracking-[0.18em] uppercase" style={{ color: dk ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.28)" }}>
                  — {project.year}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: image */}
        <motion.div
          className="shrink-0 overflow-hidden rounded-2xl ml-8"
          animate={{
            width: isHovered ? 460 : 300,
            height: isHovered ? 270 : 190,
            opacity: isHovered ? 1 : 0.45,
          }}
          transition={{ type: "spring", stiffness: 340, damping: 32 }}
        >
          <img src={project.stripImage} alt="" className="w-full h-full object-cover" />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Projects() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const dk = theme === "dark";
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [openProject, setOpenProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: "gazz-energy",
      title: "GAZZ ENERGY",
      year: "2025",
      category: t("projdet.gazz.category"),
      description: t("projdet.gazz.description"),
      client: t("projdet.gazz.client"),
      audience: t("projdet.gazz.audience"),
      challenge: t("projdet.gazz.challenge"),
      process: t("projdet.gazz.process"),
      outcome: t("projdet.gazz.outcome"),
      tags: ["Branding", "Packaging", "3D", "Visual Identity", "Retail Experience", "Creative Direction"],
      tools: ["Illustrator", "Photoshop", "Blender", "Figma"],
      stripImage: GAZZ_THUMB,
      slides: gazzSlides,
    },
    {
      id: "armagedom-rpg",
      title: "ARMAGEDOM — RPG",
      year: "2024",
      category: t("projdet.armagedom.category"),
      description: t("projdet.armagedom.description"),
      client: t("projdet.armagedom.client"),
      audience: t("projdet.armagedom.audience"),
      challenge: t("projdet.armagedom.challenge"),
      process: t("projdet.armagedom.process"),
      outcome: t("projdet.armagedom.outcome"),
      tags: ["Game Design", "RPG", "Identity", "Illustration", "Product Design"],
      tools: ["Illustrator", "Photoshop", "InDesign", "Figma"],
      stripImage: project1,
      slides: armSlides,
    },
  ];

  return (
    <div className="min-h-screen bg-transparent overflow-x-hidden">

      {/* ── HERO */}
      <section className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: "90vh" }}>

        {/* Hero text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none px-4">
          <div style={{ position: "relative" }}>

            {dk ? (
              <>
                {/* ── Layer 1: Liquid glass material — rim + thin specular */}
                <h1
                  className="font-display font-extrabold uppercase leading-none text-center"
                  style={{
                    fontSize: "clamp(7rem, 30vw, 28rem)",
                    letterSpacing: "-0.03em",
                    WebkitTextStroke: "1.2px rgba(255,255,255,0.55)",
                    background: `linear-gradient(180deg,
                      rgba(255,255,255,0.92) 0%,
                      rgba(255,255,255,0.70) 3%,
                      rgba(255,255,255,0.18) 7%,
                      rgba(255,255,255,0.03) 16%,
                      rgba(220,235,255,0.02) 40%,
                      rgba(220,235,255,0.02) 62%,
                      rgba(255,255,255,0.04) 72%,
                      rgba(255,255,255,0.12) 84%,
                      rgba(255,255,255,0.28) 93%,
                      rgba(255,255,255,0.40) 100%)`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.50)) drop-shadow(0 -1px 0 rgba(255,255,255,0.35))",
                  }}
                >PROJETOS</h1>

                {/* ── Layer 2: Prismatic fringe */}
                <h1
                  aria-hidden="true"
                  className="font-display font-extrabold uppercase leading-none text-center"
                  style={{
                    position: "absolute",
                    inset: 0,
                    fontSize: "clamp(7rem, 30vw, 28rem)",
                    letterSpacing: "-0.03em",
                    background: `linear-gradient(
                      96deg,
                      rgba(255, 45, 108, 0.18) 0%,
                      rgba(138, 40, 255, 0.14) 16%,
                      rgba(38,  112, 255, 0.12) 32%,
                      rgba(0,   218, 255, 0.10) 48%,
                      rgba(0,   255, 148, 0.08) 60%,
                      rgba(255, 238, 0,   0.11) 74%,
                      rgba(255, 118, 0,   0.14) 88%,
                      rgba(255, 45,  148, 0.18) 100%
                    )`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    mixBlendMode: "screen",
                  }}
                >PROJETOS</h1>
              </>
            ) : (
              /* Light mode: thin stroke outline + subtle dark fill */
              <h1
                className="font-display font-extrabold uppercase leading-none text-center"
                style={{
                  fontSize: "clamp(7rem, 30vw, 28rem)",
                  letterSpacing: "-0.03em",
                  WebkitTextStroke: "1px rgba(0,0,0,0.55)",
                  WebkitTextFillColor: "rgba(0,0,0,0.12)",
                  color: "rgba(0,0,0,0.12)",
                }}
              >PROJETOS</h1>
            )}

          </div>
        </div>

        {/* Falling character */}
        <div
          className="pointer-events-none select-none"
          style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "flex-start", zIndex: 10 }}
        >
          <motion.img
            src={dk ? fallingCharDark : fallingCharLight}
            alt="Guilherme 3D character"
            style={{
              flexShrink: 0,
              marginTop: "-7vh",
              width: "116%",
              height: "116%",
              objectFit: "contain",
              objectPosition: "center",
              filter: dk
                ? "drop-shadow(0 30px 100px rgba(40,100,200,0.22)) drop-shadow(0 0 60px rgba(162,213,198,0.08))"
                : "drop-shadow(0 30px 80px rgba(0,0,0,0.18)) drop-shadow(0 0 40px rgba(0,0,0,0.08))",
              mixBlendMode: dk ? "screen" : "normal",
            }}
            animate={{ y: [-3, -17, -3], rotate: [-0.5, 0.5, -0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Credit */}
        <div className="absolute bottom-8 right-8">
          <span className="font-display text-[10px] tracking-[0.25em] uppercase" style={{ color: dk ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.18)" }}>
            Guilherme Carvalho
          </span>
        </div>

      </section>

      {/* ── STRIPS */}
      <section style={{ borderTop: `1px solid ${dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}` }}>
        {projects.map(proj => (
          <ProjectStrip
            key={proj.id}
            project={proj}
            isHovered={hoveredId === proj.id}
            isAnyHovered={hoveredId !== null}
            onEnter={() => setHoveredId(proj.id)}
            onLeave={() => setHoveredId(null)}
            onClick={() => setOpenProject(proj)}
          />
        ))}
        <div style={{ borderBottom: `1px solid ${dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}` }} />
      </section>

      {/* ── MODAL */}
      <AnimatePresence>
        {openProject && (
          <MacOSModal project={openProject} onClose={() => setOpenProject(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
