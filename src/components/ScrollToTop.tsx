import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const NEAR_END_PX = 320;
const MIN_SCROLL_Y = 240;

export default function ScrollToTop() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrollBottom = window.scrollY + window.innerHeight;
      const nearEnd = doc.scrollHeight - scrollBottom <= NEAR_END_PX;
      setVisible(nearEnd && window.scrollY >= MIN_SCROLL_Y);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.button
          key="scroll-top"
          type="button"
          initial={{ opacity: 0, y: 20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.92 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed z-[70] glass-panel-sm flex items-center justify-center rounded-full p-3 shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200"
          style={{
            bottom: "calc(2rem + env(safe-area-inset-bottom, 0px))",
            right: "calc(1.5rem + env(safe-area-inset-right, 0px))",
            color: "hsl(var(--foreground))",
          }}
          aria-label={t("scrollToTop.aria")}
        >
          <ChevronUp className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden />
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
