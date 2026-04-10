import { useEffect, useRef, useCallback } from "react";

interface HexCell {
  cx: number;
  cy: number;
  points: string;
  elevation: number;
  targetElevation: number;
}

const HEX_SIZE = 38;
const COLS_EXTRA = 4;
const ROWS_EXTRA = 4;
const HOVER_RADIUS = 180;
const MAX_ELEVATION = 2.5;

function flatHexPoints(cx: number, cy: number, size: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
    pts.push(`${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`);
  }
  return pts.join(" ");
}

export default function HexagonBackground({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const cellsRef = useRef<HexCell[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef(0);
  const polygonsRef = useRef<SVGPolygonElement[]>([]);

  const buildGrid = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const W = svg.clientWidth || window.innerWidth;
    const H = svg.clientHeight || window.innerHeight;

    const hexW = HEX_SIZE * 2;
    const hexH = Math.sqrt(3) * HEX_SIZE;
    const cols = Math.ceil(W / (hexW * 0.75)) + COLS_EXTRA;
    const rows = Math.ceil(H / hexH) + ROWS_EXTRA;

    const cells: HexCell[] = [];
    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        const cx = c * hexW * 0.75;
        const cy = r * hexH + (c % 2 === 1 ? hexH / 2 : 0);
        cells.push({
          cx,
          cy,
          points: flatHexPoints(cx, cy, HEX_SIZE - 1.5),
          elevation: 0,
          targetElevation: 0,
        });
      }
    }

    cellsRef.current = cells;

    // Clear and rebuild SVG polygons
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    // defs for shadow filter
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
    filter.setAttribute("id", "hex-shadow");
    filter.setAttribute("x", "-50%");
    filter.setAttribute("y", "-50%");
    filter.setAttribute("width", "200%");
    filter.setAttribute("height", "200%");

    const feDropShadow = document.createElementNS("http://www.w3.org/2000/svg", "feDropShadow");
    feDropShadow.setAttribute("dx", "0");
    feDropShadow.setAttribute("dy", "2");
    feDropShadow.setAttribute("stdDeviation", "3");
    feDropShadow.setAttribute("flood-color", "rgba(0,0,0,0.12)");
    filter.appendChild(feDropShadow);
    defs.appendChild(filter);
    svg.appendChild(defs);

    const polys: SVGPolygonElement[] = [];
    cells.forEach((cell) => {
      const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      poly.setAttribute("points", cell.points);
      poly.setAttribute("fill", "#ffffff");
      poly.setAttribute("stroke", "#e8e8e8");
      poly.setAttribute("stroke-width", "0.5");
      svg.appendChild(poly);
      polys.push(poly);
    });
    polygonsRef.current = polys;
  }, []);

  useEffect(() => {
    buildGrid();
    const ro = new ResizeObserver(buildGrid);
    if (svgRef.current) ro.observe(svgRef.current);

    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const animate = () => {
      const cells = cellsRef.current;
      const polys = polygonsRef.current;
      const svg = svgRef.current;
      if (!svg || cells.length === 0) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const rect = svg.getBoundingClientRect();
      const mx = mouseRef.current.x - rect.left;
      const my = mouseRef.current.y - rect.top;

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const dx = cell.cx - mx;
        const dy = cell.cy - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        cell.targetElevation = dist < HOVER_RADIUS
          ? MAX_ELEVATION * (1 - dist / HOVER_RADIUS)
          : 0;

        // Lerp
        cell.elevation += (cell.targetElevation - cell.elevation) * 0.12;

        if (Math.abs(cell.elevation) < 0.001) cell.elevation = 0;

        const e = cell.elevation;
        const poly = polys[i];
        if (!poly) continue;

        if (e > 0.01) {
          const shade = Math.round(255 - e * 18);
          const lift = e * 8;
          poly.setAttribute("fill", `rgb(${shade},${shade},${shade})`);
          poly.setAttribute("stroke", `rgb(${Math.round(200 - e * 40)},${Math.round(200 - e * 40)},${Math.round(200 - e * 40)})`);
          poly.setAttribute("filter", "url(#hex-shadow)");
          poly.setAttribute("transform", `translate(0, ${-lift})`);
        } else {
          poly.setAttribute("fill", "#ffffff");
          poly.setAttribute("stroke", "#e8e8e8");
          poly.removeAttribute("filter");
          poly.removeAttribute("transform");
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, [buildGrid]);

  return (
    <svg
      ref={svgRef}
      className={className}
      style={{ width: "100%", height: "100%", display: "block", background: "#f6f6f6" }}
      aria-hidden
    />
  );
}
