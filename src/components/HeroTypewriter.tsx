import { useEffect, useState, type CSSProperties } from "react";

type HeroTypewriterProps = {
  line1: string;
  line2: string;
  line3: string;
  className?: string;
  style?: CSSProperties;
  msPerChar?: number;
  pauseBetweenLines?: number;
  resetKey: string;
  reducedMotion: boolean;
  onComplete?: () => void;
};

export default function HeroTypewriter({
  line1,
  line2,
  line3,
  className = "",
  style,
  msPerChar = 58,
  pauseBetweenLines = 480,
  resetKey,
  reducedMotion,
  onComplete,
}: HeroTypewriterProps) {
  const [l1, setL1] = useState(reducedMotion ? line1 : "");
  const [l2, setL2] = useState(reducedMotion ? line2 : "");
  const [l3, setL3] = useState(reducedMotion ? line3 : "");

  useEffect(() => {
    if (reducedMotion) {
      setL1(line1);
      setL2(line2);
      setL3(line3);
      onComplete?.();
      return;
    }

    setL1("");
    setL2("");
    setL3("");

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timeouts.push(id);
      return id;
    };

    const typeLine = (full: string, setter: (s: string) => void, onComplete: () => void) => {
      const tick = (idx: number) => {
        if (cancelled) return;
        setter(full.slice(0, idx));
        if (idx >= full.length) {
          onComplete();
          return;
        }
        schedule(() => tick(idx + 1), msPerChar);
      };
      tick(0);
    };

    typeLine(line1, setL1, () => {
      schedule(() => {
        typeLine(line2, setL2, () => {
          schedule(() => {
            typeLine(line3, setL3, () => {
              onComplete?.();
            });
          }, pauseBetweenLines);
        });
      }, pauseBetweenLines);
    });

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [line1, line2, line3, resetKey, reducedMotion, msPerChar, pauseBetweenLines, onComplete]);

  const c1 = !reducedMotion && l1.length < line1.length;
  const c2 = !reducedMotion && l1.length >= line1.length && l2.length < line2.length;
  const c3 = !reducedMotion && l1.length >= line1.length && l2.length >= line2.length && l3.length < line3.length;

  const Cursor = () => (
    <span
      className="inline-block w-[0.08em] min-h-[0.75em] ml-0.5 align-[-0.06em] rounded-sm opacity-90 animate-pulse"
      style={{ background: "hsl(var(--primary))" }}
      aria-hidden
    />
  );

  return (
    <h1
      className={className}
      style={style}
      aria-label={`${line1} ${line2} ${line3}`.replace(/\s+/g, " ").trim()}
    >
      {l1}
      {c1 ? <Cursor /> : null}
      <br />
      <span className="gradient-text">
        {l2}
        {c2 ? <Cursor /> : null}
      </span>
      <br />
      {l3}
      {c3 ? <Cursor /> : null}
    </h1>
  );
}
