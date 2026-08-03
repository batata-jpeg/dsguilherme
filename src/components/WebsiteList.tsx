// Link-list layout for the Websites category.
//
// Each site is a strip separated by a hairline, the same language as the
// project strips on /projects but shorter — these are sub-projects, not case
// studies. Only the logo plate is the button: the description beside it is
// plain text, not part of the click target.
//
// The plate follows the theme — dark plate + white logo in dark mode, light
// plate + black logo in light mode — so each brand keeps its own contrast.

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import SpecularButton from "@/components/SpecularButton";
import { useTheme } from "@/contexts/ThemeContext";
import { useIsMobile } from "@/hooks/use-mobile";
import type { LinkItem } from "@/data/categories";

function LogoPlate({ item, dk }: { item: LinkItem; dk: boolean }) {
  const [failed, setFailed] = useState(false);
  const src = dk ? item.logoWhite : item.logoBlack;

  if (failed) {
    // Until a logo file lands, the wordmark keeps the row readable.
    return (
      <span
        className="font-display font-black uppercase tracking-tight text-center leading-tight"
        style={{ color: dk ? "#fff" : "#111", fontSize: "clamp(0.8rem, 1.6vw, 1.15rem)" }}
      >
        {item.name}
      </span>
    );
  }

  return (
    <img
      key={src}
      src={src}
      alt={item.name}
      onError={() => setFailed(true)}
      draggable={false}
      style={{ maxWidth: "100%", maxHeight: 52, objectFit: "contain" }}
    />
  );
}

export default function WebsiteList({ links }: { links: LinkItem[] }) {
  const { theme } = useTheme();
  const dk = theme === "dark";
  const isMobile = useIsMobile();

  const plateBg = dk ? "#0d1520" : "#ffffff";
  const hairline = dk ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.08)";

  return (
    <div className="flex flex-col">
      {links.map((item, i) => (
        <div
          key={item.url}
          className="flex items-center"
          style={{
            gap: isMobile ? 14 : 26,
            padding: isMobile ? "16px 2px" : "20px 4px",
            borderTop: i === 0 ? "none" : `1px solid ${hairline}`,
          }}
        >
          {/* Button: the logo plate, and nothing else */}
          <SpecularButton
            size="plate"
            radius={14}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir ${item.name} — ${item.url}`}
            tint={plateBg}
            tintOpacity={1}
            lineColor={dk ? "#ffffff" : "#0f172a"}
            baseColor={dk ? "#525252" : "#94a3b8"}
            thickness={4}
            shineSize={10}
            shineFade={40}
            speed={0.35}
            followMouse
            hoverOnly
            style={{
              width: isMobile ? 128 : 200,
              height: isMobile ? 78 : 96,
            }}
          >
            <LogoPlate item={item} dk={dk} />
          </SpecularButton>

          {/* Description: plain text, outside the click target */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className="font-display font-bold uppercase tracking-[0.14em] text-[10px] sm:text-[11px] truncate"
                style={{ color: dk ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.85)" }}
              >
                {item.name}
              </span>
              <ArrowUpRight
                className="w-3 h-3 shrink-0"
                style={{ color: "hsl(var(--primary))" }}
              />
            </div>

            <p
              className="font-body leading-relaxed text-xs sm:text-sm"
              style={{ color: dk ? "rgba(255,255,255,0.52)" : "rgba(0,0,0,0.55)" }}
            >
              {item.description}
            </p>

            <span
              className="block font-display text-[9px] tracking-[0.16em] uppercase mt-1.5 truncate"
              style={{ color: dk ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.32)" }}
            >
              {item.url.replace(/^https?:\/\//, "")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
