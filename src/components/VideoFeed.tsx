// Vertical video feed in the TikTok/Reels shape: one full-height slide per
// video, snap scrolling between them, and only the slide you are looking at
// plays. Rendered by CategoryModal for any category whose gallery declares
// `layout: "feed"` (today that is Vídeos).
//
// Deliberately not a social feed — no like, no comment, no follow. The only
// control on the right is Share; everything else is playback.

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Play, Share2, Volume2, VolumeX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import "@/components/VideoFeed.css";

export interface FeedVideo {
  src: string;
  poster?: string;
  title?: string;
  sub?: string;
}

interface Props {
  items: FeedVideo[];
  /** Link handed to the share sheet. Defaults to the current page. */
  shareUrl?: string;
}

/**
 * Whether the feed opens silently. TikTok, Reels and Shorts all autoplay muted
 * on the web for the same reason: unmuted autoplay is refused by most browsers
 * unless the page has enough engagement, and where it is allowed it can still
 * be cut mid-playback when the tab has no audio focus — which strands the
 * viewer on a frozen frame. Muted always plays. One tap on the speaker gives
 * sound, and that choice then carries to every other video in the feed.
 *
 * Flip to false to open with sound; the fallback below still covers a refusal.
 */
const START_MUTED = true;

/**
 * The async Clipboard API is the right call but is not everywhere: Firefox only
 * got `writeText` in a secure context, and any page served over plain http
 * loses it entirely. The old execCommand path still works in those cases, and
 * it is only reached from inside a click handler, where it is still allowed.
 */
async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    /* Fall through. */
  }

  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function VideoFeed({ items, shareUrl }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ratios = useRef<number[]>([]);

  const [active, setActive] = useState(0);
  // Shared across slides: unmuting one video keeps the next one audible.
  const [muted, setMuted] = useState(START_MUTED);
  // The 9:16 box the video actually occupies. Measured rather than left to
  // `aspect-ratio`, because the overlays hug the video — a stage that is a few
  // pixels off puts the share button in the letterbox instead of on the frame.
  const [stage, setStage] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const measure = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (!w || !h) return;
      const boxW = Math.min(w, (h * 9) / 16);
      setStage({ w: boxW, h: (boxW * 16) / 9 });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Whichever slide covers most of the viewport is the one that plays.
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const i = Number((entry.target as HTMLElement).dataset.index);
          ratios.current[i] = entry.intersectionRatio;
        }
        let best = -1;
        let bestRatio = 0.55;
        ratios.current.forEach((r, i) => {
          if (r > bestRatio) {
            bestRatio = r;
            best = i;
          }
        });
        if (best >= 0) setActive(best);
      },
      { root, threshold: [0, 0.25, 0.55, 0.8, 1] },
    );

    slideRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [items.length]);

  return (
    <div
      ref={scrollerRef}
      className="video-feed relative flex-1 min-h-0 overflow-y-auto"
      style={{ background: "#000" }}
    >
      {items.map((item, i) => (
        <div
          key={item.src}
          data-index={i}
          ref={(el) => {
            slideRefs.current[i] = el;
          }}
          className="video-feed__slide relative w-full flex items-center justify-center"
        >
          <VideoSlide
            item={item}
            isActive={i === active}
            stage={stage}
            muted={muted}
            onMutedChange={setMuted}
            shareUrl={shareUrl}
          />
        </div>
      ))}

      {/* Slide counter — the scrollbar is hidden, so this is the only cue that
          there is more below. Hidden for a single video. */}
      {items.length > 1 && (
        <div
          className="sticky bottom-3 left-0 float-right mr-3 px-2.5 py-1 rounded-full pointer-events-none"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)" }}
        >
          <span className="font-display text-[9px] tracking-[0.18em] uppercase text-white/70">
            {active + 1} / {items.length}
          </span>
        </div>
      )}
    </div>
  );
}

interface SlideProps {
  item: FeedVideo;
  isActive: boolean;
  stage: { w: number; h: number } | null;
  muted: boolean;
  onMutedChange: (muted: boolean) => void;
  shareUrl?: string;
}

function VideoSlide({ item, isActive, stage, muted, onMutedChange, shareUrl }: SlideProps) {
  const { t } = useLanguage();
  const reduceMotion = usePrefersReducedMotion();

  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const mutedRef = useRef(muted);
  const resumeAfterScrub = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);
  const [scrubbing, setScrubbing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    mutedRef.current = muted;
    const v = videoRef.current;
    if (v) v.muted = muted;
  }, [muted]);

  // Playback follows the active slide. The feed only exists while the Vídeos
  // window is open, so mounting here *is* "the tab was opened" — and unmounting
  // tears the video down, which is the stop.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (!isActive) {
      v.pause();
      v.currentTime = 0;
      setTime(0);
      return;
    }

    let cancelled = false;
    void (async () => {
      v.muted = mutedRef.current;
      try {
        await v.play();
      } catch {
        // Only reachable with sound on: drop to muted rather than leaving the
        // viewer on a still frame, and let the speaker toggle offer it back.
        if (cancelled || v.muted) return;
        v.muted = true;
        onMutedChange(true);
        try {
          await v.play();
        } catch {
          /* Refused outright — the play button in the middle is the way in. */
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // `muted` is read through mutedRef so toggling sound never restarts playback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  // Pause when the browser tab goes to the background, resume on return.
  useEffect(() => {
    if (!isActive) return;
    const onVisibility = () => {
      const v = videoRef.current;
      if (!v) return;
      if (document.hidden) v.pause();
      else void v.play().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [isActive]);

  // `timeupdate` only fires about four times a second, which makes the seek bar
  // visibly step. rAF keeps it smooth, and only runs while something is moving.
  useEffect(() => {
    if (!playing) return;
    const tick = () => {
      const v = videoRef.current;
      if (v) setTime(v.currentTime);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playing]);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  }, []);

  // ── Seeking ────────────────────────────────────────────────────────────────
  const seekToClientX = useCallback((clientX: number) => {
    const el = trackRef.current;
    const v = videoRef.current;
    if (!el || !v || !Number.isFinite(v.duration) || v.duration <= 0) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    v.currentTime = ratio * v.duration;
    setTime(v.currentTime);
  }, []);

  const onScrubStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    const v = videoRef.current;
    resumeAfterScrub.current = !!v && !v.paused;
    v?.pause();
    setScrubbing(true);
    // Seek before capturing: setPointerCapture throws for a pointer the browser
    // no longer considers active, and a failed capture must not cost the seek.
    seekToClientX(e.clientX);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* Dragging outside the track just will not track — the click still landed. */
    }
  };

  const onScrubMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrubbing) return;
    seekToClientX(e.clientX);
  };

  const onScrubEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrubbing) return;
    setScrubbing(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* Never captured, or already released. */
    }
    if (resumeAfterScrub.current) void videoRef.current?.play().catch(() => {});
  };

  // ── Share ──────────────────────────────────────────────────────────────────
  const share = async () => {
    const url = shareUrl ?? window.location.href;
    const payload: ShareData = { title: item.title ?? document.title, url };

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(payload);
        return;
      } catch {
        // Cancelled or unsupported for this payload — fall through to copying.
      }
    }

    if (await copyToClipboard(url)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  const progress = duration > 0 ? Math.min(1, time / duration) : 0;
  const pct = `${progress * 100}%`;

  const stageStyle = stage
    ? { width: stage.w, height: stage.h }
    : { width: "100%", height: "100%" };

  const overlayButton =
    "flex items-center justify-center rounded-full transition-colors";
  const overlayButtonStyle = {
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "#fff",
  } as const;

  return (
    <div className="relative overflow-hidden" style={stageStyle}>
      <video
        ref={videoRef}
        src={item.src}
        poster={item.poster}
        loop
        playsInline
        preload={isActive ? "auto" : "metadata"}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        className="absolute inset-0 w-full h-full"
        style={{ objectFit: "cover", display: "block" }}
      />

      {/* Tap layer. Covers the frame; the controls sit above it and stop the
          click so hitting Share or the seek bar never toggles playback. */}
      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? t("feed.pause") : t("feed.play")}
        className="absolute inset-0 w-full h-full cursor-default"
        style={{ background: "transparent" }}
      />

      {/* Paused state: a real, pressable play button. Its exit animation (scale
          up and fade) is the confirmation that playback resumed. */}
      <AnimatePresence>
        {!playing && (
          <motion.button
            key="play"
            type="button"
            onClick={togglePlay}
            aria-label={t("feed.play")}
            className="absolute top-1/2 left-1/2 w-[74px] h-[74px] flex items-center justify-center rounded-full"
            style={{
              x: "-50%",
              y: "-50%",
              background: "rgba(0,0,0,0.42)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.18)",
            }}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.72 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.35 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            <Play className="w-8 h-8 ml-1 text-white" fill="currentColor" strokeWidth={0} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Sound. The feed opens muted, so this is the only route to audio —
          it carries a label while muted so it reads as an invitation, and
          shrinks to a bare icon once sound is on. */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMutedChange(!muted);
        }}
        aria-label={muted ? t("feed.unmute") : t("feed.mute")}
        className={`absolute top-3 right-3 h-9 gap-1.5 ${muted ? "pl-2.5 pr-3" : "w-9"} ${overlayButton}`}
        style={muted ? overlayButtonStyle : { ...overlayButtonStyle, background: "rgba(0,0,0,0.28)" }}
      >
        {muted ? (
          <>
            <VolumeX className="w-[18px] h-[18px] shrink-0" strokeWidth={1.9} />
            <span className="font-display text-[9px] tracking-[0.16em] uppercase">
              {t("feed.sound")}
            </span>
          </>
        ) : (
          <Volume2 className="w-[18px] h-[18px]" strokeWidth={1.9} />
        )}
      </button>

      {/* Bottom gradient so the caption and the seek bar stay readable over a
          bright frame. */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: 190,
          background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 42%, transparent 100%)",
        }}
      />

      {/* Share — the one action button, bottom right, as asked. */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          void share();
        }}
        aria-label={t("feed.share")}
        className={`absolute right-3 bottom-[68px] w-11 h-11 ${overlayButton}`}
        style={overlayButtonStyle}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="copied"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className="flex"
            >
              <Check className="w-5 h-5" strokeWidth={2.2} />
            </motion.span>
          ) : (
            <motion.span
              key="share"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.15 }}
              className="flex"
            >
              <Share2 className="w-[19px] h-[19px]" strokeWidth={1.9} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {copied && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="absolute right-[60px] bottom-[76px] px-2.5 py-1 rounded-md whitespace-nowrap pointer-events-none font-display text-[9px] tracking-[0.16em] uppercase text-white"
            style={{ background: "rgba(0,0,0,0.62)", backdropFilter: "blur(8px)" }}
          >
            {t("feed.copied")}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Caption */}
      {(item.title || item.sub) && (
        <div className="absolute left-4 bottom-[70px] right-16 pointer-events-none">
          {item.sub && (
            <span className="block font-display text-[8px] tracking-[0.24em] uppercase text-white/60 mb-1">
              {item.sub}
            </span>
          )}
          {item.title && (
            <h3 className="font-display font-extrabold uppercase text-sm leading-tight text-white">
              {item.title}
            </h3>
          )}
        </div>
      )}

      {/* ── Temporizador: elapsed / total plus a draggable seek bar. */}
      <div className="absolute inset-x-0 bottom-0 px-4 pb-3">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-display text-[10px] tabular-nums tracking-wider text-white/80">
            {formatTime(time)}
          </span>
          <span className="font-display text-[10px] tabular-nums tracking-wider text-white/45">
            {formatTime(duration)}
          </span>
        </div>

        <div
          ref={trackRef}
          className="video-feed__track relative"
          data-scrubbing={scrubbing}
          role="slider"
          tabIndex={0}
          aria-label={t("feed.seek")}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuenow={Math.round(time)}
          aria-valuetext={`${formatTime(time)} / ${formatTime(duration)}`}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={onScrubStart}
          onPointerMove={onScrubMove}
          onPointerUp={onScrubEnd}
          onPointerCancel={onScrubEnd}
          onKeyDown={(e) => {
            const v = videoRef.current;
            if (!v || !Number.isFinite(v.duration)) return;
            if (e.key === "ArrowRight") {
              e.preventDefault();
              v.currentTime = Math.min(v.duration, v.currentTime + 5);
              setTime(v.currentTime);
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              v.currentTime = Math.max(0, v.currentTime - 5);
              setTime(v.currentTime);
            }
          }}
        >
          <div className="video-feed__rail relative w-full">
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ width: pct, background: "#fff" }}
            />
            <div
              className="video-feed__knob absolute top-1/2 w-3 h-3 rounded-full"
              style={{
                left: pct,
                marginLeft: -6,
                marginTop: -6,
                background: "#fff",
                boxShadow: "0 1px 6px rgba(0,0,0,0.5)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
