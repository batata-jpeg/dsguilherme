import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X, FileText } from "lucide-react";
import project1 from "@/assets/project-1.webp";
import project2 from "@/assets/project-2.webp";
import project3 from "@/assets/project-3.webp";
import project4 from "@/assets/project-4.webp";
import project5 from "@/assets/project-5.webp";
import fallingCharDark from "@/assets/hero-character-falling.webp";
import fallingCharLight from "@/assets/hero-character-falling-light.webp";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useMinimizedProject } from "@/contexts/MinimizedProjectContext";
import { useIsMobile } from "@/hooks/use-mobile";
import Book3D from "@/components/Book3D";

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
  kind?: "book";
};

// ── MacOS Modal ──────────────────────────────────────────────────────────────

function DescPanelContent({ project, dk }: { project: Project; dk: boolean }) {
  return (
    <div className="flex flex-col flex-1 overflow-y-auto" style={{ padding: "28px 24px" }}>
      <div className="mb-5">
        <span className="block font-display text-[9px] tracking-[0.22em] uppercase mb-1" style={{ color: "hsl(var(--primary))" }}>
          {project.category} · {project.year}
        </span>
        <h3 className="font-display font-extrabold uppercase text-lg leading-tight" style={{ color: dk ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.88)" }}>
          {project.title}
        </h3>
      </div>
      <p className="font-body text-sm leading-relaxed mb-5" style={{ color: dk ? "rgba(255,255,255,0.62)" : "rgba(0,0,0,0.62)", whiteSpace: "pre-line" }}>
        {project.description}
      </p>
      <div className="mb-5" style={{ height: 1, background: dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)" }} />
      {[{ label: "Cliente", value: project.client }, { label: "Público", value: project.audience }].map(({ label, value }) => (
        <div key={label} className="mb-4">
          <span className="block font-display text-[9px] tracking-[0.18em] uppercase mb-1" style={{ color: "hsl(var(--primary))" }}>{label}</span>
          <p className="font-body text-xs leading-relaxed" style={{ color: dk ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)" }}>{value}</p>
        </div>
      ))}
      <div className="mb-5" style={{ height: 1, background: dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)" }} />
      {[{ label: "Desafio", value: project.challenge }, { label: "Processo", value: project.process }, { label: "Resultado", value: project.outcome }].map(({ label, value }) => (
        <div key={label} className="mb-5">
          <span className="block font-display text-[9px] tracking-[0.18em] uppercase mb-1.5" style={{ color: dk ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>{label}</span>
          <p className="font-body text-xs leading-relaxed" style={{ color: dk ? "rgba(255,255,255,0.52)" : "rgba(0,0,0,0.52)", whiteSpace: "pre-line" }}>{value}</p>
        </div>
      ))}
      <div className="mb-5" style={{ height: 1, background: dk ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)" }} />
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
  );
}

function MacOSModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const isBook = project.kind === "book";
  const isMobile = useIsMobile();
  const { minimize } = useMinimizedProject();
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(0);
  const [showDesc, setShowDesc] = useState(false);
  const [isSquishing, setIsSquishing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [descWidth, setDescWidth] = useState(400);
  const [isResizingDesc, setIsResizingDesc] = useState(false);
  const descDragRef = useRef<{ startX: number; startWidth: number } | null>(null);

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

  const startDescResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    descDragRef.current = { startX: e.clientX, startWidth: descWidth };
    setIsResizingDesc(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    const onMove = (ev: MouseEvent) => {
      if (!descDragRef.current) return;
      const delta = descDragRef.current.startX - ev.clientX;
      setDescWidth(Math.min(window.innerWidth * 0.55, Math.max(260, descDragRef.current.startWidth + delta)));
    };
    const onUp = () => {
      descDragRef.current = null;
      setIsResizingDesc(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [descWidth]);

  const chromeBg  = dk ? "#111d2e" : "#e2e8f0";
  const chromeBdr = `1px solid ${dk ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`;

  const handleMinimize = useCallback(() => {
    setIsSquishing(true);
    setTimeout(() => {
      minimize({ id: project.id, title: project.title, category: project.category, thumbnail: project.slides[current] });
      onClose();
    }, 420);
  }, [minimize, project, current, onClose]);

  const TrafficLights = ({ onRed = onClose }: { onRed?: () => void }) => (
    <div className="flex items-center gap-2">
      <button onClick={onRed}             className="w-[13px] h-[13px] rounded-full hover:opacity-75 transition-opacity" style={{ background: "#ff5f57" }} />
      <button onClick={handleMinimize}    className="w-[13px] h-[13px] rounded-full hover:opacity-75 transition-opacity" style={{ background: "#ffbd2e" }} />
      <button onClick={() => setIsExpanded(e => !e)} className="w-[13px] h-[13px] rounded-full hover:opacity-75 transition-opacity" style={{ background: "#28c941" }} />
    </div>
  );

  const NavArrows = () => (
    <div className="flex items-center gap-1.5 mx-auto">
      {[{ d: -1, Icon: ChevronLeft }, { d: 1, Icon: ChevronRight }].map(({ d, Icon }) => (
        <button key={d} onClick={() => go(d)}
          className="flex items-center justify-center w-6 h-6 rounded-full"
          style={{ background: dk ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", border: `1px solid ${dk ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`, color: dk ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.5)" }}>
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
    </div>
  );

  // ── Gestures on the image carousel: swipe to change slide, pinch to zoom,
  //    drag to explore while zoomed. Transforms are applied imperatively so
  //    dragging never re-renders (and never restarts the slide animation).
  const zoomRef = useRef<HTMLDivElement>(null);
  const gRef = useRef({
    pointers: new Map<number, { x: number; y: number }>(),
    scale: 1, panX: 0, panY: 0,
    startDist: 0, startScale: 1,
    startX: 0, startY: 0, startPanX: 0, startPanY: 0,
    dragging: false, pinching: false,
    mode: null as null | "swipe" | "pan",
  });

  const applyZoom = () => {
    const g = gRef.current;
    if (zoomRef.current) {
      zoomRef.current.style.transform = `translate(${g.panX}px, ${g.panY}px) scale(${g.scale})`;
    }
  };

  // Reset zoom whenever the slide changes
  useEffect(() => {
    const g = gRef.current;
    g.scale = 1; g.panX = 0; g.panY = 0; g.mode = null;
    if (zoomRef.current) zoomRef.current.style.transform = "";
  }, [current]);

  const onCarouselDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return; // let the dots work
    const g = gRef.current;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    g.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (g.pointers.size === 2) {
      const [a, b] = [...g.pointers.values()];
      g.startDist = Math.hypot(a.x - b.x, a.y - b.y);
      g.startScale = g.scale;
      g.pinching = true;
      g.dragging = false;
      g.mode = null;
      return;
    }
    if (g.pointers.size > 2) return;
    g.dragging = true;
    g.startX = e.clientX; g.startY = e.clientY;
    g.startPanX = g.panX; g.startPanY = g.panY;
    g.mode = null;
  };

  const onCarouselMove = (e: React.PointerEvent) => {
    const g = gRef.current;
    if (g.pointers.has(e.pointerId)) g.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Two fingers → pinch zoom
    if (g.pinching && g.pointers.size >= 2) {
      const [a, b] = [...g.pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d > 0 && g.startDist > 0) {
        g.scale = Math.min(4, Math.max(1, g.startScale * (d / g.startDist)));
        if (g.scale <= 1.01) { g.panX = 0; g.panY = 0; }
        applyZoom();
      }
      return;
    }

    if (!g.dragging) return;
    const dx = e.clientX - g.startX;
    const dy = e.clientY - g.startY;
    if (g.mode === null && Math.abs(dx) + Math.abs(dy) > 8) {
      g.mode = g.scale > 1.02 ? "pan" : "swipe";
    }

    if (g.mode === "pan") {
      const el = zoomRef.current;
      const maxX = el ? (el.clientWidth * (g.scale - 1)) / 2 : 0;
      const maxY = el ? (el.clientHeight * (g.scale - 1)) / 2 : 0;
      g.panX = Math.max(-maxX, Math.min(maxX, g.startPanX + dx));
      g.panY = Math.max(-maxY, Math.min(maxY, g.startPanY + dy));
      applyZoom();
    } else if (g.mode === "swipe" && zoomRef.current) {
      zoomRef.current.style.transform = `translateX(${dx * 0.3}px)`; // rubber-band feedback
    }
  };

  const onCarouselUp = (e: React.PointerEvent) => {
    const g = gRef.current;
    g.pointers.delete(e.pointerId);
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId); } catch {}

    if (g.pinching) {
      if (g.pointers.size < 2) {
        g.pinching = false; g.dragging = false; g.mode = null;
        if (g.scale <= 1.02) { g.scale = 1; g.panX = 0; g.panY = 0; applyZoom(); }
      }
      return;
    }

    if (g.mode === "swipe" && project.slides.length > 1) {
      const dx = e.clientX - g.startX;
      if (dx <= -50) go(1);
      else if (dx >= 50) go(-1);
    }
    // settle back
    if (zoomRef.current) {
      zoomRef.current.style.transition = "transform 0.22s ease";
      applyZoom();
      setTimeout(() => { if (zoomRef.current) zoomRef.current.style.transition = ""; }, 240);
    }
    g.dragging = false;
    g.mode = null;
  };

  const Carousel = () => (
    <div
      className="relative flex-1 overflow-hidden bg-black"
      style={{ touchAction: "none", cursor: "grab" }}
      onPointerDown={onCarouselDown}
      onPointerMove={onCarouselMove}
      onPointerUp={onCarouselUp}
      onPointerCancel={onCarouselUp}
    >
      <div ref={zoomRef} className="absolute inset-0" style={{ transformOrigin: "center center" }}>
        <AnimatePresence custom={dir}>
          <motion.img
            key={current}
            src={project.slides[current]}
            alt={`Slide ${current + 1}`}
            custom={dir}
            variants={slideVariants}
            initial="enter" animate="center" exit="exit"
            transition={{ type: "spring", stiffness: 380, damping: 40 }}
            draggable={false}
            // On phones/tablets show the whole artwork instead of cropping it
            className={`absolute inset-0 w-full h-full select-none ${isMobile ? "object-contain" : "object-cover"}`}
          />
        </AnimatePresence>
      </div>
      {project.slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {project.slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className="rounded-full transition-all duration-200"
              style={{ width: i === current ? 18 : 5, height: 5, background: i === current ? "hsl(var(--primary))" : "rgba(255,255,255,0.3)" }} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      className="fixed inset-0 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        pointerEvents: isSquishing ? "none" : "auto",
        ...(isExpanded ? {} : { display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? "8px" : "clamp(12px,2.5vw,36px)" }),
      }}
    >

      {/* ══ EXPANDED / FULLSCREEN ══════════════════════════════════════════════ */}
      {isExpanded && (
        <div className="absolute inset-0 flex" style={{ background: dk ? "#05090f" : "#f0f4f8" }}>
          {/* Main column */}
          <div className="flex flex-col flex-1 overflow-hidden"
            style={{ marginRight: showDesc ? descWidth : 0, transition: isResizingDesc ? "none" : "margin-right 0.35s cubic-bezier(0.16,1,0.3,1)" }}>
            {/* Chrome */}
            <div className="flex items-center shrink-0 h-11 px-4 gap-4" style={{ background: chromeBg, borderBottom: chromeBdr }}>
              <TrafficLights />
              {!isBook && <NavArrows />}
              <motion.button onClick={() => setShowDesc(d => !d)}
                className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.14em]"
                animate={{
                  borderColor: showDesc ? "rgba(162,213,198,0.95)" : "rgba(162,213,198,0.55)",
                  color: showDesc ? "#06110c" : "rgb(162,213,198)",
                  background: showDesc ? "rgb(162,213,198)" : "rgba(162,213,198,0.16)",
                }}
                style={{ border: "1px solid", boxShadow: "0 2px 12px rgba(162,213,198,0.18)" }}
                transition={{ duration: 0.2 }}>
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">
                  {showDesc ? "Fechar" : isMobile ? "Descrição" : "Descrição do projeto"}
                </span>
              </motion.button>
            </div>
            {isBook ? <Book3D /> : <Carousel />}
          </div>

          {/* Resizable description panel */}
          <AnimatePresence>
            {showDesc && (
              <motion.div
                initial={{ x: descWidth }} animate={{ x: 0 }} exit={{ x: descWidth }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="fixed right-0 top-0 bottom-0 flex flex-col z-20"
                style={{ width: descWidth, background: dk ? "#0d1520" : "#f7f9fc", borderLeft: `1px solid ${dk ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`, userSelect: isResizingDesc ? "none" : "auto" }}
              >
                {/* Drag handle */}
                <div onMouseDown={startDescResize}
                  className="absolute left-0 top-0 bottom-0 w-[6px] cursor-col-resize z-30"
                  style={{ transition: "background 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(10,132,255,0.2)"; }}
                  onMouseLeave={e => { if (!isResizingDesc) e.currentTarget.style.background = "transparent"; }}>
                  <div style={{ position: "absolute", left: 2, top: "50%", transform: "translateY(-50%)", width: 2, height: 40, borderRadius: 2, background: "rgba(10,132,255,0.45)" }} />
                </div>
                {/* Chrome */}
                <div className="flex items-center shrink-0 h-11 px-4 gap-3" style={{ background: chromeBg, borderBottom: chromeBdr }}>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setShowDesc(false)} className="w-[13px] h-[13px] rounded-full hover:opacity-75" style={{ background: "#ff5f57" }} />
                    <div className="w-[13px] h-[13px] rounded-full" style={{ background: "#ffbd2e" }} />
                    <div className="w-[13px] h-[13px] rounded-full" style={{ background: "#28c941" }} />
                  </div>
                  <span className="font-display text-[9px] tracking-[0.2em] uppercase ml-2" style={{ color: dk ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.28)" }}>Descrição</span>
                </div>
                <DescPanelContent project={project} dk={dk} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ══ NORMAL / MINIMIZING MODE ══════════════════════════════════════════ */}
      {!isExpanded && (
        <>
          {/* Backdrop */}
          {!isSquishing && (
            <div className="absolute inset-0"
              style={{ background: "rgba(0,0,0,0.86)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)" }}
              onClick={onClose} />
          )}

          <div
            className="relative z-10 flex items-stretch"
            style={{
              gap: 10,
              height: isMobile ? "100%" : "min(88vh, 860px)",
              width: isMobile ? "100%" : "min(92vw, 1280px)",
              maxWidth: isMobile ? "100%" : "92vw",
            }}
          >
            {/* Main window — flexes to fill whatever the description leaves */}
            <motion.div
              className="relative flex flex-col overflow-hidden rounded-2xl flex-1 min-w-0"
              style={{
                background: dk ? "#08101d" : "#f0f4f8",
                boxShadow: dk ? "0 60px 160px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.07)" : "0 40px 120px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.08)",
                transformOrigin: "bottom center",
              }}
              initial={{ scale: 0.87, opacity: 0, y: 24 }}
              animate={isSquishing ? { scaleX: 0.28, scaleY: 0.05, y: "90vh", opacity: 0 } : { scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.87, opacity: 0, y: 24 }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
            >
              {/* Chrome */}
              <div className="flex items-center shrink-0 h-11 px-4 gap-4" style={{ background: chromeBg, borderBottom: chromeBdr }}>
                <TrafficLights />
                {!isBook && <NavArrows />}
                <motion.button onClick={() => setShowDesc(d => !d)}
                  className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.14em]"
                  animate={{
                    borderColor: showDesc ? "rgba(162,213,198,0.95)" : "rgba(162,213,198,0.55)",
                    color: showDesc ? "#06110c" : "rgb(162,213,198)",
                    background: showDesc ? "rgb(162,213,198)" : "rgba(162,213,198,0.16)",
                  }}
                  style={{ border: "1px solid", boxShadow: "0 2px 12px rgba(162,213,198,0.18)" }}
                  transition={{ duration: 0.2 }}>
                  <FileText className="h-3.5 w-3.5 shrink-0" />
                  <span className="whitespace-nowrap">
                    {showDesc ? "Fechar" : isMobile ? "Descrição" : "Descrição do projeto"}
                  </span>
                </motion.button>
              </div>
              {isBook ? <Book3D /> : <Carousel />}
            </motion.div>

            {/* Description window — desktop only (mobile uses a fullscreen sheet) */}
            <AnimatePresence>
              {showDesc && !isSquishing && !isMobile && (
                <motion.div className="flex-shrink-0 overflow-hidden" initial={{ width: 0 }} animate={{ width: 440 }} exit={{ width: 0 }} transition={windowSpring}>
                  <motion.div className="flex flex-col overflow-hidden rounded-2xl h-full"
                    style={{ width: 440, background: dk ? "#0d1520" : "#f7f9fc", boxShadow: `0 0 0 1px ${dk ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}
                    initial={{ scale: 0.87, opacity: 0, y: 24 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.87, opacity: 0, y: 24 }}
                    transition={{ ...windowSpring, delay: 0.05 }}>
                    <div className="flex items-center shrink-0 h-11 px-4 gap-3" style={{ background: chromeBg, borderBottom: chromeBdr }}>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setShowDesc(false)} className="w-[13px] h-[13px] rounded-full hover:opacity-75" style={{ background: "#ff5f57" }} />
                        <div className="w-[13px] h-[13px] rounded-full" style={{ background: "#ffbd2e" }} />
                        <div className="w-[13px] h-[13px] rounded-full" style={{ background: "#28c941" }} />
                      </div>
                      <span className="font-display text-[9px] tracking-[0.2em] uppercase ml-2" style={{ color: dk ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.28)" }}>Descrição</span>
                    </div>
                    <DescPanelContent project={project} dk={dk} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile / tablet: description takes over the whole screen, one at a time */}
          <AnimatePresence>
            {showDesc && !isSquishing && isMobile && (
              <motion.div
                className="absolute inset-0 z-30 flex flex-col"
                style={{ background: dk ? "#0d1520" : "#f7f9fc" }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", stiffness: 320, damping: 34 }}
              >
                <div
                  className="flex items-center shrink-0 gap-3 px-4"
                  style={{ height: 52, background: chromeBg, borderBottom: chromeBdr }}
                >
                  <button
                    onClick={() => setShowDesc(false)}
                    className="flex items-center gap-2 rounded-full px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.14em]"
                    style={{ background: "rgba(162,213,198,0.14)", border: "1px solid rgba(162,213,198,0.5)", color: "rgb(162,213,198)" }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Voltar
                  </button>
                  <span
                    className="font-display text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: dk ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}
                  >
                    Descrição
                  </span>
                  <button
                    onClick={() => setShowDesc(false)}
                    className="ml-auto flex h-8 w-8 items-center justify-center rounded-full"
                    style={{ background: dk ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", color: dk ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)" }}
                    aria-label="Fechar descrição"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <DescPanelContent project={project} dk={dk} />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

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
  const isMobile = useIsMobile();
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
      <div
        className="relative z-10 flex items-center justify-between gap-4 px-5 sm:px-14 lg:px-20"
        style={{ height: isMobile ? 180 : 320 }}
      >
        {/* Left */}
        <div className="flex min-w-0 flex-col gap-3">
          <motion.h2
            className="font-display font-extrabold uppercase leading-none"
            animate={{
              color: isHovered ? "#ffffff" : dk ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.55)",
            }}
            style={{
              fontSize: isMobile
                ? "clamp(1.15rem, 5.2vw, 1.75rem)"
                : isHovered ? "clamp(2.4rem, 4vw, 4rem)" : "clamp(1.8rem, 3.2vw, 3.2rem)",
              transition: "font-size 0.22s ease",
            }}
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
          className="shrink-0 overflow-hidden rounded-2xl"
          animate={{
            width: isMobile ? 132 : isHovered ? 460 : 300,
            height: isMobile ? 96 : isHovered ? 270 : 190,
            opacity: isMobile ? 0.85 : isHovered ? 1 : 0.45,
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
  const isMobile = useIsMobile();
  const { pendingOpen, clearPendingOpen } = useMinimizedProject();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [openProject, setOpenProject] = useState<Project | null>(null);

  const projects: Project[] = [
    {
      id: "livro-interativo",
      title: "LIVRO INTERATIVO",
      year: "2024",
      category: "Ilustração, Livro Infantil, Editorial",
      description:
        "Do Verde às Cinzas é um livro infantil ilustrado inteiramente à mão, criado como projeto de faculdade em parceria com a Leiturinha, editora especializada em livros infantis.\n\nTodas as páginas foram desenhadas por mim no Procreate, do primeiro rascunho até a arte final, sem uso de imagens prontas. Depois o livro inteiro foi diagramado e fechado no InDesign, da capa à contracapa.\n\nA história fala sobre meio ambiente e sobre o impacto das queimadas na natureza, acompanhando os animais que perdem sua casa e precisam encontrar um recomeço.",
      client: "Leiturinha (projeto acadêmico)",
      audience: "Crianças em fase de leitura, famílias e educadores que trabalham temas ambientais",
      challenge:
        "Falar de um assunto pesado como queimadas e destruição ambiental de um jeito sensível e compreensível para criança, sem perder a leveza e o encanto que um livro infantil precisa ter.",
      process:
        "Primeiro veio o roteiro e o storyboard, definindo o ritmo da narrativa página a página. Depois cada ilustração foi desenhada à mão no Procreate, com uma paleta que acompanha a história e vai do verde vivo até os tons de cinza conforme o fogo avança. Por último, diagramação, tipografia e preparação para impressão no InDesign.",
      outcome:
        "Um livro infantil completo, com capa, miolo e contracapa finalizados, que usa a própria cor como narrativa para conversar com as crianças sobre preservação ambiental.",
      tags: ["Ilustração", "Livro Infantil", "Desenho à Mão", "Editorial", "Meio Ambiente", "Storytelling"],
      tools: ["Procreate", "InDesign"],
      stripImage: "/book/card-livro.webp",
      slides: ["/book/card-livro.webp"],
      kind: "book",
    },
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

  // Auto-open modal when user restores from the global dock
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!pendingOpen) return;
    const proj = projects.find(p => p.id === pendingOpen);
    if (proj) { setOpenProject(proj); clearPendingOpen(); }
  }, [pendingOpen]);

  return (
    <div className="min-h-screen bg-transparent overflow-x-hidden">

      {/* ── HERO */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: isMobile ? "72vh" : "90vh" }}
      >

        {/* Hero text — centered overlay on desktop; stacked above the character on mobile/tablet */}
        <div
          className={`absolute inset-0 flex justify-center pointer-events-none select-none px-4 ${
            isMobile ? "flex-col items-center gap-1" : "items-center"
          }`}
        >
          <div style={{ position: "relative" }}>

            {dk ? (
              <>
                {/* ── Layer 1: Liquid glass material — rim + thin specular */}
                <h1
                  className="font-display font-extrabold uppercase leading-none text-center"
                  style={{
                    fontSize: "clamp(3rem, 21vw, 24rem)",
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
                    fontSize: "clamp(3rem, 21vw, 24rem)",
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
                  fontSize: "clamp(3rem, 21vw, 24rem)",
                  letterSpacing: "-0.03em",
                  WebkitTextStroke: "1px rgba(0,0,0,0.55)",
                  WebkitTextFillColor: "rgba(0,0,0,0.12)",
                  color: "rgba(0,0,0,0.12)",
                }}
              >PROJETOS</h1>
            )}

          </div>

          {/* Mobile / tablet: character sits BELOW the title, using the free space */}
          {isMobile && (
            <motion.img
              src={dk ? fallingCharDark : fallingCharLight}
              alt="Guilherme 3D character"
              style={{
                width: "112%",
                maxWidth: "none",
                maxHeight: "44vh",
                objectFit: "contain",
                objectPosition: "center",
                filter: dk
                  ? "drop-shadow(0 30px 100px rgba(40,100,200,0.22)) drop-shadow(0 0 60px rgba(162,213,198,0.08))"
                  : "drop-shadow(0 30px 80px rgba(0,0,0,0.18)) drop-shadow(0 0 40px rgba(0,0,0,0.08))",
                mixBlendMode: dk ? "screen" : "normal",
              }}
              animate={{ y: [-3, -13, -3], rotate: [-0.5, 0.5, -0.5] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          )}
        </div>

        {/* Falling character — desktop only (overlaps the title) */}
        {!isMobile && (
          <div
            className="pointer-events-none select-none"
            style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "flex-start", zIndex: 10 }}
          >
            <motion.img
              src={dk ? fallingCharDark : fallingCharLight}
              alt="Guilherme 3D character"
              style={{
                flexShrink: 0,
                marginTop: "-3vh",
                width: "92%",
                height: "92%",
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
        )}

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
