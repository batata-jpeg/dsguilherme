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
                  <motion.button
                    type="button"
                    disabled={!enabled}
                    aria-label={label}
                    className="glass-panel w-full flex flex-col items-center justify-center gap-4 py-8 sm:py-10 px-4 rounded-2xl select-none"
                    whileHover={enabled ? { y: -6, scale: 1.03 } : undefined}
                    whileTap={enabled ? { scale: 0.97 } : undefined}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      cursor: enabled ? "pointer" : "not-allowed",
                      opacity: enabled ? 1 : 0.45,
                    }}
                    onClick={enabled ? handleClick : undefined}
                  >
                    {/* Glow layer on hover via CSS */}
                    {enabled && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        style={{ boxShadow: `inset 0 0 0 1px ${glow}, 0 0 28px ${glow}` }}
                      />
                    )}

                    {/* Icon container */}
                    <div className="relative shrink-0">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{
                          background: gradient,
                          boxShadow: `0 8px 24px ${glow}`,
                          filter: enabled ? "none" : "grayscale(75%)",
                        }}
                      >
                        <Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
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
                  </motion.button>
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
