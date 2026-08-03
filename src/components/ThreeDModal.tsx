import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import ThreeDViewer, { GeometryType } from "./ThreeDViewer";

// ── Data ────────────────────────────────────────────────────────────────────────

interface Project3D {
  id: string;
  label: string;
  sub: string;
  geometryType: GeometryType;
  gradient: string;
  glow: string;
  color: string;
  description: string;
}

const PROJECTS: Project3D[] = [
  {
    id: "cubo",
    label: "Cubo",
    sub: "Poliedro",
    geometryType: "box",
    gradient: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
    glow: "rgba(124,58,237,0.45)",
    color: "#a78bfa",
    description:
      "Geometria fundamental — seis faces planas, oito vértices e doze arestas. Gire com o mouse ou o dedo para explorar cada perspectiva.",
  },
  {
    id: "esfera",
    label: "Esfera",
    sub: "Superfície",
    geometryType: "sphere",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)",
    glow: "rgba(14,165,233,0.45)",
    color: "#38bdf8",
    description:
      "A forma mais perfeita da geometria — todos os pontos da superfície equidistantes do centro.",
  },
  {
    id: "torus",
    label: "Torus",
    sub: "Superfície",
    geometryType: "torus",
    gradient: "linear-gradient(135deg, #ec4899 0%, #ef4444 100%)",
    glow: "rgba(236,72,153,0.45)",
    color: "#f472b6",
    description:
      "Superfície de revolução gerada por um círculo que orbita em torno de um eixo externo. Inspiração para topologia e design.",
  },
  {
    id: "diamante",
    label: "Diamante",
    sub: "Poliedro",
    geometryType: "octahedron",
    gradient: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
    glow: "rgba(16,185,129,0.45)",
    color: "#34d399",
    description:
      "Octaedro regular — oito faces triangulares equiláteras. Símbolo de precisão e elegância geométrica.",
  },
  {
    id: "piramide",
    label: "Pirâmide",
    sub: "Poliedro",
    geometryType: "cone",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
    glow: "rgba(245,158,11,0.45)",
    color: "#fbbf24",
    description:
      "Cone hexagonal — uma das estruturas mais antigas e icônicas reinterpretada em geometria 3D moderna.",
  },
  {
    id: "notorico",
    label: "Nó Tórico",
    sub: "Curva",
    geometryType: "torusknot",
    gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
    glow: "rgba(168,85,247,0.45)",
    color: "#c084fc",
    description:
      "Curva matemática que se enrola continuamente em si mesma formando um nó tridimensional — fascinante e hipnótico.",
  },
];

// ── Bento grid positions ────────────────────────────────────────────────────────

const DESKTOP_POS: Record<string, { gridColumn: string; gridRow: string }> = {
  cubo:     { gridColumn: "1 / 3", gridRow: "1 / 3" },
  esfera:   { gridColumn: "3 / 4", gridRow: "1 / 3" },
  torus:    { gridColumn: "4 / 5", gridRow: "1 / 2" },
  diamante: { gridColumn: "4 / 5", gridRow: "2 / 3" },
  piramide: { gridColumn: "1 / 3", gridRow: "3 / 4" },
  notorico: { gridColumn: "3 / 5", gridRow: "3 / 4" },
};

const MOBILE_POS: Record<string, { gridColumn: string; gridRow: string }> = {
  cubo:     { gridColumn: "1 / 3", gridRow: "1 / 2" },
  esfera:   { gridColumn: "1 / 2", gridRow: "2 / 3" },
  torus:    { gridColumn: "2 / 3", gridRow: "2 / 3" },
  diamante: { gridColumn: "1 / 2", gridRow: "3 / 4" },
  piramide: { gridColumn: "2 / 3", gridRow: "3 / 4" },
  notorico: { gridColumn: "1 / 3", gridRow: "4 / 5" },
};

// ── Decorative SVG overlay for bento cards ──────────────────────────────────────

function CardDecoration() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 200 200"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.08 }}
    >
      <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="1" />
      <circle cx="100" cy="100" r="50" fill="none" stroke="white" strokeWidth="0.7" />
      <line x1="20" y1="100" x2="180" y2="100" stroke="white" strokeWidth="0.5" />
      <line x1="100" y1="20" x2="100" y2="180" stroke="white" strokeWidth="0.5" />
      <rect x="60" y="60" width="80" height="80" fill="none" stroke="white" strokeWidth="0.5" transform="rotate(45 100 100)" />
    </svg>
  );
}

// ── Component ───────────────────────────────────────────────────────────────────

interface Props {
  onClose: () => void;
}

export default function ThreeDModal({ onClose }: Props) {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const isMobile = useIsMobile();

  const [selected, setSelected] = useState<Project3D | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewerKey, setViewerKey] = useState(0); // force re-mount ThreeDViewer

  const chromeBg  = dk ? "#111d2e" : "#e2e8f0";
  const chromeBdr = `1px solid ${dk ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`;
  const bg        = dk ? "#05090f" : "#f0f4f8";

  // ── Traffic lights ───────────────────────────────────────────────────────────
  const TrafficLights = () => (
    <div className="flex items-center gap-2">
      {/* Red: back if viewing, close otherwise */}
      <button
        onClick={selected ? () => setSelected(null) : onClose}
        className="w-[13px] h-[13px] rounded-full hover:opacity-75 transition-opacity"
        style={{ background: "#ff5f57" }}
        title={selected ? "Voltar" : "Fechar"}
      />
      {/* Yellow: close always */}
      <button
        onClick={onClose}
        className="w-[13px] h-[13px] rounded-full hover:opacity-75 transition-opacity"
        style={{ background: "#ffbd2e" }}
        title="Fechar"
      />
      {/* Green: fullscreen (desktop only) */}
      {!isMobile && (
        <button
          onClick={() => setIsExpanded(e => !e)}
          className="w-[13px] h-[13px] rounded-full hover:opacity-75 transition-opacity"
          style={{ background: "#28c941" }}
          title={isExpanded ? "Janela" : "Tela cheia"}
        />
      )}
    </div>
  );

  // ── Chrome bar ───────────────────────────────────────────────────────────────
  const Chrome = () => (
    <div
      className="flex items-center shrink-0 h-11 px-4 gap-3"
      style={{ background: chromeBg, borderBottom: chromeBdr }}
    >
      <TrafficLights />

      {selected && (
        <motion.button
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setSelected(null)}
          className="flex items-center gap-1 ml-2"
          style={{ color: dk ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.42)" }}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="font-display text-[9px] tracking-[0.16em] uppercase">Voltar</span>
        </motion.button>
      )}

      <div className="flex-1" />
      <span
        className="font-display text-[9px] tracking-[0.2em] uppercase"
        style={{ color: dk ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
      >
        {selected ? selected.label : "3D Design"}
      </span>
      <div className="flex-1" />
    </div>
  );

  // ── Bento mosaic ─────────────────────────────────────────────────────────────
  const Mosaic = () => (
    <div
      className="flex-1 min-h-0 overflow-y-auto"
      style={{ padding: 14, background: bg }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
          gridTemplateRows: isMobile ? "180px 180px 180px 180px" : "200px 200px 180px",
          gap: 10,
        }}
      >
        {PROJECTS.map((proj) => {
          const pos = isMobile ? MOBILE_POS[proj.id] : DESKTOP_POS[proj.id];
          return (
            <motion.button
              key={proj.id}
              onClick={() => setSelected(proj)}
              style={{
                ...pos,
                background: proj.gradient,
                borderRadius: 14,
                overflow: "hidden",
                position: "relative",
                cursor: "pointer",
                border: "none",
                padding: 0,
                textAlign: "left",
              }}
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 440, damping: 26 }}
            >
              {/* Decorative wireframe overlay */}
              <CardDecoration />

              {/* Hover glow ring */}
              <motion.div
                className="absolute inset-0 pointer-events-none rounded-[14px]"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.18 }}
                style={{
                  boxShadow: `inset 0 0 0 1.5px ${proj.glow}, 0 0 32px ${proj.glow}`,
                }}
              />

              {/* Bottom label */}
              <div
                className="absolute bottom-0 left-0 right-0 px-4 py-3"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)",
                }}
              >
                <span
                  className="block font-display text-[8px] tracking-[0.22em] uppercase mb-0.5"
                  style={{ color: "rgba(255,255,255,0.52)" }}
                >
                  {proj.sub}
                </span>
                <span className="block font-display font-bold text-sm uppercase tracking-wide text-white">
                  {proj.label}
                </span>
              </div>

              {/* Tap hint on mobile */}
              {isMobile && (
                <div className="absolute top-3 right-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.14)", backdropFilter: "blur(4px)" }}
                  >
                    <RotateCcw className="w-3 h-3 text-white opacity-70" />
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  // ── 3D Viewer view ───────────────────────────────────────────────────────────
  const Viewer = ({ proj }: { proj: Project3D }) => (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Canvas area */}
      <div
        className="relative flex-1 min-h-0"
        style={{ background: dk ? "#070c14" : "#e8edf5" }}
      >
        <ThreeDViewer
          key={`${proj.id}-${viewerKey}`}
          geometryType={proj.geometryType}
          color={proj.color}
          darkBg={dk}
        />

        {/* Gradient accent matching project color */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 50% at 50% 80%, ${proj.glow.replace("0.45", "0.12")} 0%, transparent 70%)`,
          }}
        />

        {/* Reset rotation button */}
        <button
          onClick={() => setViewerKey(k => k + 1)}
          className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
          style={{
            background: dk ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            border: `1px solid ${dk ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
            color: dk ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.45)",
          }}
          title="Resetar rotação"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="font-display text-[8px] tracking-[0.14em] uppercase">Reset</span>
        </button>

        {/* Drag hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
          <span
            className="font-display text-[8px] tracking-[0.18em] uppercase px-3 py-1.5 rounded-full whitespace-nowrap"
            style={{
              background: dk ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
              color: dk ? "rgba(255,255,255,0.32)" : "rgba(0,0,0,0.32)",
              border: `1px solid ${dk ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)"}`,
            }}
          >
            {isMobile ? "Arraste o dedo para girar" : "Clique e arraste para girar"}
          </span>
        </div>
      </div>

      {/* Info panel */}
      <div
        className="shrink-0 px-5 py-4"
        style={{
          background: dk ? "#0d1520" : "#ffffff",
          borderTop: `1px solid ${dk ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
        }}
      >
        <span
          className="block font-display text-[8px] tracking-[0.24em] uppercase mb-1"
          style={{ color: "hsl(var(--primary))" }}
        >
          {proj.sub}
        </span>
        <h3
          className="font-display font-extrabold uppercase text-base mb-2 leading-tight"
          style={{ color: dk ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.88)" }}
        >
          {proj.label}
        </h3>
        <p
          className="font-body text-xs leading-relaxed"
          style={{ color: dk ? "rgba(255,255,255,0.52)" : "rgba(0,0,0,0.52)" }}
        >
          {proj.description}
        </p>
      </div>
    </div>
  );

  // ── Body (animated between mosaic ↔ viewer) ──────────────────────────────────
  const Body = () => (
    <AnimatePresence mode="wait">
      {selected ? (
        <motion.div
          key="viewer"
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Viewer proj={selected} />
        </motion.div>
      ) : (
        <motion.div
          key="mosaic"
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Mosaic />
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ── Mobile: full-screen bottom sheet ─────────────────────────────────────────
  if (isMobile) {
    return createPortal(
      <motion.div
        className="fixed inset-0 z-[150] flex flex-col overflow-hidden"
        style={{ background: bg }}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 38 }}
      >
        <Chrome />
        <Body />
      </motion.div>,
      // Portalled to <body>: PageTransition wraps each route in a transformed
      // motion.div, which creates a stacking context that would trap z-[150]
      // underneath the lamp cord overlay.
      document.body,
    );
  }

  // ── Desktop: windowed or expanded ────────────────────────────────────────────
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[150]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={
        isExpanded
          ? {}
          : { display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(12px, 2.5vw, 36px)" }
      }
    >
      {/* Backdrop (windowed only) */}
      {!isExpanded && (
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            background: "rgba(0,0,0,0.42)",
          }}
          onClick={onClose}
        />
      )}

      {isExpanded ? (
        // Fullscreen
        <div
          className="absolute inset-0 flex flex-col overflow-hidden"
          style={{ background: bg }}
        >
          <Chrome />
          <Body />
        </div>
      ) : (
        // Windowed
        <motion.div
          className="relative flex flex-col overflow-hidden"
          style={{
            width: "min(92vw, 1080px)",
            height: "min(88vh, 780px)",
            borderRadius: 16,
            background: bg,
            boxShadow: "0 48px 120px rgba(0,0,0,0.72), 0 0 0 1px rgba(255,255,255,0.07)",
            zIndex: 1,
          }}
          initial={{ scale: 0.88, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
        >
          <Chrome />
          <Body />
        </motion.div>
      )}
    </motion.div>,
    document.body,
  );
}
