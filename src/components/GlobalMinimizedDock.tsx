import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMinimizedProject } from "@/contexts/MinimizedProjectContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function GlobalMinimizedDock() {
  const { minimized, close, restore } = useMinimizedProject();
  const { theme } = useTheme();
  const dk = theme === "dark";
  const navigate = useNavigate();
  const location = useLocation();

  const handleRestore = () => {
    restore();
    if (location.pathname !== "/projects") navigate("/projects");
  };

  return (
    <AnimatePresence>
      {minimized && (
        <div
          className="fixed bottom-5 left-1/2 z-[200]"
          style={{ transform: "translateX(-50%)", pointerEvents: "auto" }}
        >
          <motion.div
            key="global-dock"
            initial={{ y: 48, opacity: 0, scale: 0.84 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 48, opacity: 0, scale: 0.84 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="flex items-center gap-3"
            style={{
              background: dk ? "rgba(16,22,34,0.97)" : "rgba(228,233,242,0.97)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: `1px solid ${dk ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              borderRadius: 16,
              padding: "10px 12px",
              boxShadow: "0 20px 64px rgba(0,0,0,0.5)",
            }}
          >
            {/* Thumbnail */}
            <img
              src={minimized.thumbnail}
              alt=""
              className="rounded-lg object-cover shrink-0"
              style={{ width: 62, height: 40 }}
            />

            {/* Info */}
            <div className="flex flex-col items-start gap-0.5">
              <span
                className="font-display text-[9px] tracking-[0.2em] uppercase"
                style={{ color: dk ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)" }}
              >
                {minimized.category}
              </span>
              <span
                className="font-display font-bold text-[13px] uppercase tracking-wide whitespace-nowrap"
                style={{ color: dk ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.85)" }}
              >
                {minimized.title}
              </span>
            </div>

            {/* Restore */}
            <motion.button
              onClick={handleRestore}
              className="flex items-center justify-center w-7 h-7 rounded-full ml-1"
              style={{
                background: dk ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
                border: `1px solid ${dk ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
              }}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              title="Restaurar"
            >
              <ChevronUp className="w-3.5 h-3.5" style={{ color: dk ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.6)" }} />
            </motion.button>

            {/* Close */}
            <motion.button
              onClick={close}
              className="flex items-center justify-center w-7 h-7 rounded-full"
              style={{
                background: dk ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)",
                border: `1px solid ${dk ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)"}`,
              }}
              whileHover={{ scale: 1.12, background: "rgba(255,95,87,0.2)", borderColor: "rgba(255,95,87,0.4)" }}
              whileTap={{ scale: 0.92 }}
              title="Fechar"
            >
              <X className="w-3.5 h-3.5" style={{ color: dk ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.6)" }} />
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
