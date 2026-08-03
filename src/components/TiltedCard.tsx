// 3D perspective tilt card that follows the pointer.
//
// Adapted from React Bits (https://reactbits.dev/components/tilted-card).
// The original ships against `motion@^12`; this project already bundles
// `framer-motion@^11`, whose useMotionValue/useSpring/motion APIs are
// identical — so it imports from there instead of adding a second animation
// library. The tilt math is unchanged from the original.
//
// The caption tooltip and mobile warning of the original were dropped: these
// cards show the image only.

import { useRef } from "react";
import { motion, useMotionValue, useSpring, type SpringOptions } from "framer-motion";

const springValues: SpringOptions = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

interface TiltedCardProps {
  imageSrc: string;
  altText?: string;
  /** Aspect ratio of the card, e.g. "3 / 4". */
  aspect?: string;
  scaleOnHover?: number;
  rotateAmplitude?: number;
  onClick?: () => void;
  className?: string;
}

export default function TiltedCard({
  imageSrc,
  altText = "",
  aspect = "3 / 4",
  scaleOnHover = 1.08,
  rotateAmplitude = 14,
  onClick,
  className = "",
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);

  function handleMouse(e: React.MouseEvent<HTMLElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
  }

  function handleMouseLeave() {
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div
      ref={ref}
      className={`relative w-full [perspective:800px] ${className}`}
      style={{ aspectRatio: aspect }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        type="button"
        onClick={onClick}
        aria-label={altText || undefined}
        className="absolute inset-0 block w-full h-full rounded-[15px] [transform-style:preserve-3d] cursor-pointer p-0 border-0 bg-transparent"
        style={{ rotateX, rotateY, scale }}
      >
        <img
          src={imageSrc}
          alt={altText}
          loading="lazy"
          draggable={false}
          className="w-full h-full object-cover rounded-[15px] will-change-transform [transform:translateZ(0)]"
          style={{ boxShadow: "0 18px 40px rgba(0,0,0,0.45)" }}
        />
      </motion.button>
    </div>
  );
}
