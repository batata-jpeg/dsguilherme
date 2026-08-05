import { useEffect, useState } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

/**
 * True only on devices that can actually hover.
 *
 * The `(hover: none)` media query alone is not enough: in-app webviews and some
 * hybrid Android browsers report hover support on a touch-only screen, which
 * leaves hover-gated effects stuck in their resting state. A real touch event is
 * the ground truth, so it overrides the media query permanently once observed.
 */
export function useCanHover(): boolean {
  const [canHover, setCanHover] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    let touched = false;

    const update = () => setCanHover(!touched && mq.matches);
    update();

    const onTouch = () => {
      touched = true;
      setCanHover(false);
    };

    mq.addEventListener("change", update);
    window.addEventListener("touchstart", onTouch, { passive: true, once: true });
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("touchstart", onTouch);
    };
  }, []);

  return canHover;
}
