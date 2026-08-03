import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import ChromaGrid from "@/components/ChromaGrid";
import WebsiteList from "@/components/WebsiteList";
import { CATEGORY_GALLERIES, categoryCount, GalleryItem } from "@/data/categories";

interface Props {
  /** Key into CATEGORY_GALLERIES. */
  categoryId: string;
  /** Label shown in the window title bar. */
  label: string;
  gradient: string;
  glow: string;
  onClose: () => void;
}

export default function CategoryModal({ categoryId, label, gradient, glow, onClose }: Props) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const dk = theme === "dark";
  const isMobile = useIsMobile();

  const gallery = CATEGORY_GALLERIES[categoryId];
  const items = gallery?.items ?? [];
  const links = gallery?.links;

  const [index, setIndex] = useState<number | null>(null); // null = grid, number = lightbox
  const [isExpanded, setIsExpanded] = useState(false);

  const chromeBg = dk ? "#111d2e" : "#e2e8f0";
  const chromeBdr = `1px solid ${dk ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`;
  const bg = dk ? "#05090f" : "#f0f4f8";

  // Esc backs out of the lightbox first, then closes. Arrows page through.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (index !== null) setIndex(null);
        else onClose();
      }
      if (index === null || items.length === 0) return;
      if (e.key === "ArrowRight") setIndex((i) => ((i ?? 0) + 1) % items.length);
      if (e.key === "ArrowLeft") setIndex((i) => ((i ?? 0) - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, items.length, onClose]);

  // Lock body scroll while open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const current = index !== null ? items[index] : null;

  const renderMedia = (item: GalleryItem, mode: "thumb" | "full") =>
    item.type === "video" ? (
      <video
        src={item.src}
        poster={item.poster}
        muted
        loop
        playsInline
        autoPlay={mode === "full"}
        controls={mode === "full"}
        style={{
          width: "100%",
          height: "100%",
          objectFit: mode === "full" ? "contain" : "cover",
          display: "block",
        }}
      />
    ) : (
      <img
        src={item.src}
        alt={item.title}
        loading={mode === "thumb" ? "lazy" : "eager"}
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: mode === "full" ? "contain" : "cover",
          display: "block",
        }}
      />
    );

  // ── Chrome bar ───────────────────────────────────────────────────────────────
  const chrome = (
    <div
      className="flex items-center shrink-0 h-11 px-4 gap-3"
      style={{ background: chromeBg, borderBottom: chromeBdr }}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={current ? () => setIndex(null) : onClose}
          className="w-[13px] h-[13px] rounded-full hover:opacity-75 transition-opacity"
          style={{ background: "#ff5f57" }}
          title={current ? t("category.back") : t("category.close")}
        />
        <button
          onClick={onClose}
          className="w-[13px] h-[13px] rounded-full hover:opacity-75 transition-opacity"
          style={{ background: "#ffbd2e" }}
          title={t("category.close")}
        />
        {!isMobile && (
          <button
            onClick={() => setIsExpanded((e) => !e)}
            className="w-[13px] h-[13px] rounded-full hover:opacity-75 transition-opacity"
            style={{ background: "#28c941" }}
            title={isExpanded ? t("category.window") : t("category.fullscreen")}
          />
        )}
      </div>

      {current && (
        <motion.button
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setIndex(null)}
          className="flex items-center gap-1 ml-2"
          style={{ color: dk ? "rgba(255,255,255,0.42)" : "rgba(0,0,0,0.42)" }}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="font-display text-[9px] tracking-[0.16em] uppercase">
            {t("category.back")}
          </span>
        </motion.button>
      )}

      <div className="flex-1" />
      <span
        className="font-display text-[9px] tracking-[0.2em] uppercase whitespace-nowrap"
        style={{ color: dk ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}
      >
        {current ? `${index! + 1} / ${items.length}` : `${label} · ${categoryCount(categoryId)}`}
      </span>
      <div className="flex-1" />
    </div>
  );

  // ── Grid ─────────────────────────────────────────────────────────────────────
  //
  // The chroma spotlight keeps the whole grid greyed out except around the
  // cursor, so the card border/gradient follow the category's own colour.
  const grid = links ? (
    <div
      className="flex-1 min-h-0 overflow-y-auto"
      style={{ background: bg, padding: isMobile ? 14 : 24 }}
    >
      <WebsiteList links={links} />
    </div>
  ) : (
    <div className="flex-1 min-h-0 overflow-y-auto" style={{ background: bg }}>
      <ChromaGrid
        items={items.map((item, i) => ({
          image: item.type === "video" && item.poster ? item.poster : item.src,
          alt: item.title ?? `${label} ${i + 1}`,
          borderColor: glow.replace(/[\d.]+\)$/, "0.9)"),
          gradient,
        }))}
        columns={isMobile ? 2 : 3}
        cardWidth={isMobile ? 160 : 300}
        aspect={gallery.aspect}
        radius={isMobile ? 200 : 300}
        onSelect={setIndex}
      />
    </div>
  );

  // ── Lightbox ─────────────────────────────────────────────────────────────────
  const lightbox = current && (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      <div
        className="relative flex-1 min-h-0 flex items-center justify-center"
        style={{ background: dk ? "#070c14" : "#e8edf5", padding: isMobile ? 12 : 28 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.src}
            className="w-full h-full flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          >
            {renderMedia(current, "full")}
          </motion.div>
        </AnimatePresence>

        {items.length > 1 && (
          <>
            <button
              onClick={() => setIndex((i) => ((i ?? 0) - 1 + items.length) % items.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-100"
              style={{
                background: dk ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                border: `1px solid ${dk ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                color: dk ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                opacity: 0.75,
              }}
              title={t("category.prev")}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIndex((i) => ((i ?? 0) + 1) % items.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-opacity hover:opacity-100"
              style={{
                background: dk ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                border: `1px solid ${dk ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                color: dk ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                opacity: 0.75,
              }}
              title={t("category.next")}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Info panel only exists for items that carry a title — image-only
          galleries show the artwork and nothing else. */}
      {(current.title || current.sub) && (
      <div
        className="shrink-0 px-5 py-4"
        style={{
          background: dk ? "#0d1520" : "#ffffff",
          borderTop: `1px solid ${dk ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
        }}
      >
        {current.sub && (
          <span
            className="block font-display text-[8px] tracking-[0.24em] uppercase mb-1"
            style={{ color: "hsl(var(--primary))" }}
          >
            {current.sub}
          </span>
        )}
        <h3
          className="font-display font-extrabold uppercase text-base leading-tight"
          style={{ color: dk ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.88)" }}
        >
          {current.title}
        </h3>
      </div>
      )}
    </div>
  );

  const body = (
    <AnimatePresence mode="wait">
      {current ? (
        <motion.div
          key="lightbox"
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {lightbox}
        </motion.div>
      ) : (
        <motion.div
          key="grid"
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          {grid}
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
        {chrome}
        {body}
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
          : {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(12px, 2.5vw, 36px)",
            }
      }
    >
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
        <div className="absolute inset-0 flex flex-col overflow-hidden" style={{ background: bg }}>
          {chrome}
          {body}
        </div>
      ) : (
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
          {chrome}
          {body}
        </motion.div>
      )}
    </motion.div>,
    document.body,
  );
}
