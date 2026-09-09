// ── BOTOES HOME ──────────────────────────────────────────────────────────────
//
// PARKED — not rendered anywhere right now. Removed from the live home page on
// 2026-08-03 while the galleries are still missing content.
//
// This is the "O que eu crio" section: six category blocks that open a gallery
// modal with whatever is declared in src/data/categories.ts. A category with no
// media renders as a disabled block with an "em breve" badge — that placeholder
// look is why it came off the live site.
//
// All six galleries are currently empty, so every block renders disabled. Add
// media to src/data/categories.ts to switch one on; nothing else is needed.
//
// To put it back: import this component into src/pages/Index.tsx and drop
// <BotoesHome /> between the PHILOSOPHY and CONTACT CTA sections. Nothing else
// is needed — state and modals live in here.

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Box, Film, Camera, Paintbrush, Monitor, Sparkles } from "lucide-react";
import CategoryModal from "@/components/CategoryModal";
import { categoryCount } from "@/data/categories";
import { useLanguage } from "@/contexts/LanguageContext";

function FadeInSection({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}>

      {children}
    </motion.div>);

}

export default function BotoesHome() {
  const { t } = useLanguage();
  const [openCategory, setOpenCategory] = useState<
    { id: string; label: string; gradient: string; glow: string } | null
  >(null);

  // Own tap detection for touch. The synthesised click is what was failing on
  // real phones, so the open no longer depends on it; onClick still handles
  // mouse and keyboard, and running both is harmless since opening the same
  // category twice is idempotent.
  const tapRef = useRef<{ x: number; y: number; id: number } | null>(null);

  const onTapStart = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    tapRef.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };

  const onTapEnd = (e: React.PointerEvent, open: () => void) => {
    if (e.pointerType === "mouse") return;
    const start = tapRef.current;
    tapRef.current = null;
    if (!start || start.id !== e.pointerId) return;
    // A finger that travelled was scrolling, not tapping.
    if (Math.hypot(e.clientX - start.x, e.clientY - start.y) > 12) return;
    open();
  };

  return (
    <>
      <section className="relative py-16 sm:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <FadeInSection>
            <span className="section-label flex justify-center mb-10 sm:mb-14">
              {t("index.categories.label")}
            </span>
          </FadeInSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {[
              {
                label: "3D",
                icon: Box,
                gradient: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
                glow: "rgba(124,58,237,0.35)",
                category: "3d",
              },
              {
                label: "Vídeos",
                icon: Film,
                gradient: "linear-gradient(135deg, #ec4899 0%, #ef4444 100%)",
                glow: "rgba(236,72,153,0.35)",
                category: "videos",
              },
              {
                label: "Imagens",
                icon: Camera,
                gradient: "linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)",
                glow: "rgba(14,165,233,0.35)",
                category: "imagens",
              },
              {
                label: "Ilustração",
                icon: Paintbrush,
                gradient: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
                glow: "rgba(16,185,129,0.35)",
                category: "ilustracao",
              },
              {
                label: "Motions",
                icon: Sparkles,
                gradient: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
                glow: "rgba(245,158,11,0.35)",
                category: "motions",
              },
              {
                label: "Websites",
                icon: Monitor,
                gradient: "linear-gradient(135deg, #0d9488 0%, #2563eb 100%)",
                glow: "rgba(13,148,136,0.35)",
                category: "websites",
              },
            ].map(({ label, icon: Icon, gradient, glow, category }, i) => {
              // A category block stays disabled until its gallery has media.
              const count = categoryCount(category);
              const enabled = count > 0;
              const handleClick = () => setOpenCategory({ id: category, label, gradient, glow });

              return (
              <FadeInSection key={label} delay={i * 0.07}>
                  {/* Plain <button>, deliberately not motion.button: the framer
                      gestures were the one thing these blocks had that the
                      working buttons elsewhere on the site do not. Hover and
                      press live in CSS now (.category-block). */}
                  <button
                    type="button"
                    disabled={!enabled}
                    aria-label={label}
                    className="glass-panel category-block w-full flex flex-col items-center justify-center gap-4 py-8 sm:py-10 px-4 rounded-2xl select-none"
                    onClick={enabled ? handleClick : undefined}
                    // Belt and braces for touch: open from our own tap detection
                    // as well, guarded by a movement threshold so ending a
                    // scroll over the block does not count. Idempotent with
                    // onClick, so both firing is harmless.
                    onPointerDown={enabled ? onTapStart : undefined}
                    onPointerUp={enabled ? (e) => onTapEnd(e, handleClick) : undefined}
                  >
                    {/* The category's own colour only exists on hover. At rest
                        every tile is the same glass, which is what keeps the
                        grid calm against the flat background. */}
                    {enabled && (
                      <span
                        className="category-block__glow"
                        style={{
                          background: `radial-gradient(circle at 50% 30%, ${glow} 0%, transparent 68%)`,
                          boxShadow: `inset 0 0 0 1px ${glow}`,
                        }}
                      />
                    )}

                    {/* Icon container */}
                    <div className="relative shrink-0">
                      <div
                        className="category-block__icon w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ opacity: enabled ? 1 : 0.5 }}
                      >
                        <Icon
                          className="w-7 h-7"
                          strokeWidth={1.8}
                          style={{ color: "hsl(var(--foreground))" }}
                        />
                      </div>
                      {count > 0 && (
                        <div
                          className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center"
                          style={{
                            background: "hsl(var(--primary))",
                            boxShadow: "0 0 8px hsl(var(--primary) / 0.6)",
                          }}
                        >
                          <span className="font-display font-black text-[10px] leading-none" style={{ color: "hsl(var(--primary-foreground))" }}>
                            {count}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className="font-display font-bold text-[11px] sm:text-xs tracking-[0.18em] uppercase text-center leading-tight"
                      style={{ color: "hsl(var(--foreground))" }}
                    >
                      {label}
                    </span>

                    {!enabled && (
                      <span
                        className="absolute top-2.5 right-2.5 font-display font-bold text-[8px] tracking-[0.16em] uppercase px-2 py-1 rounded-full"
                        style={{
                          background: "hsl(var(--muted) / 0.6)",
                          color: "hsl(var(--muted-foreground))",
                        }}
                      >
                        {t("category.soon")}
                      </span>
                    )}
                  </button>
              </FadeInSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Category gallery modal */}
      <AnimatePresence>
        {openCategory && (
          <CategoryModal
            categoryId={openCategory.id}
            label={openCategory.label}
            gradient={openCategory.gradient}
            glow={openCategory.glow}
            onClose={() => setOpenCategory(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
