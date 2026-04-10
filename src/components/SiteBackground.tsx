import ColorBends from "@/components/ColorBends";
import HexagonBackground from "@/components/HexagonBackground";
import { useTheme } from "@/contexts/ThemeContext";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

export const SITE_BEND_COLORS = ["#ff5c7a", "#8a5cff", "#00ffd1"] as const;

export default function SiteBackground() {
  const { theme } = useTheme();
  const reduceMotion = usePrefersReducedMotion();
  const isLight = theme === "light";

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden",
        isLight ? "bg-white" : "bg-black",
      )}
      aria-hidden
    >
      <div className={cn("absolute inset-0", isLight ? "bg-white" : "bg-[#000000]")} />

      <div className="absolute inset-0 h-full min-h-[100dvh] w-full">
        {isLight ? (
          <div className="pointer-events-auto h-full w-full min-h-[100dvh]">
            <HexagonBackground className="h-full min-h-[100dvh] w-full" />
          </div>
        ) : reduceMotion ? (
          <div className="relative h-full w-full min-h-[100dvh] bg-black">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  radial-gradient(ellipse 80% 50% at 72% 20%, rgba(255, 92, 122, 0.28) 0%, transparent 50%),
                  radial-gradient(ellipse 70% 48% at 18% 85%, rgba(0, 255, 209, 0.22) 0%, transparent 48%),
                  radial-gradient(ellipse 55% 38% at 50% 50%, rgba(138, 92, 255, 0.1) 0%, transparent 52%),
                  linear-gradient(#000000, #000000)
                `,
              }}
            />
            <div className="absolute inset-0 z-[1] site-bg-dark-veil" aria-hidden />
          </div>
        ) : (
          <div className="relative h-full min-h-[100dvh] w-full">
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ filter: "brightness(0.78) saturate(0.92)" }}
            >
              <ColorBends
                colors={[...SITE_BEND_COLORS]}
                rotation={0}
                speed={0.2}
                scale={1}
                frequency={1}
                warpStrength={1}
                mouseInfluence={1}
                parallax={0.5}
                noise={0.1}
                transparent
                autoRotate={0}
                useGlobalPointer
                className="h-full min-h-[100dvh] w-full"
              />
            </div>
            <div className="absolute inset-0 z-[1] site-bg-dark-veil" aria-hidden />
          </div>
        )}
      </div>
    </div>
  );
}
