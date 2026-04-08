import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, useAnimation, useMotionValue, PanInfo } from 'framer-motion';
import ProfileCard from './ProfileCard';

interface ThrowableProfileCardProps {
  avatarUrls: string[];
  miniAvatarUrl?: string;
  grainUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  showUserInfo?: boolean;
  className?: string;
}

const VELOCITY_THRESHOLD = 50;
const FLY_DISTANCE = 2500;

const ThrowableProfileCard: React.FC<ThrowableProfileCardProps> = ({
  avatarUrls,
  miniAvatarUrl,
  grainUrl,
  name,
  title,
  handle,
  status,
  showUserInfo = true,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlying, setIsFlying] = useState(false);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentAvatar = avatarUrls[currentIndex % avatarUrls.length];

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % avatarUrls.length);
  }, [avatarUrls.length]);

  const handleDragEnd = useCallback(
    async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const vx = info.velocity.x;
      const vy = info.velocity.y;
      const speed = Math.sqrt(vx * vx + vy * vy);

      if (speed > VELOCITY_THRESHOLD) {
        setIsFlying(true);

        // Normalize direction and multiply by fly distance
        const angle = Math.atan2(vy, vx);
        const flyX = Math.cos(angle) * FLY_DISTANCE;
        const flyY = Math.sin(angle) * FLY_DISTANCE;
        // Add random Z rotation for dramatic effect
        const spin = (Math.random() - 0.5) * 720;

        await controls.start({
          x: flyX,
          y: flyY,
          rotate: spin,
          scale: 0.5,
          opacity: 0,
          transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
          },
        });

        // Swap image
        nextImage();

        // Reset position instantly (invisible)
        controls.set({ x: 0, y: 0, rotate: 0, scale: 0.3, opacity: 0 });

        // Animate new card entrance
        await controls.start({
          scale: 1,
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          },
        });

        setIsFlying(false);
      } else {
        // Snap back
        controls.start({
          x: 0,
          y: 0,
          rotate: 0,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 25,
          },
        });
      }
    },
    [controls, nextImage]
  );

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ touchAction: 'none' }}>
      <motion.div
        drag
        dragElastic={0.8}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, y, cursor: isFlying ? 'default' : 'grab' }}
        whileDrag={{ cursor: 'grabbing', scale: 1.04 }}
        className="relative select-none"
      >
        <ProfileCard
          avatarUrl={currentAvatar}
          miniAvatarUrl={miniAvatarUrl || currentAvatar}
          grainUrl={grainUrl}
          name={name}
          title={title}
          handle={handle}
          status={status}
          showUserInfo={showUserInfo}
          enableTilt={!isFlying}
          className="w-full mx-auto pointer-events-none"
        />
      </motion.div>

      {/* Hint text */}
      <motion.p
        className="text-center mt-3 font-display text-xs tracking-[0.15em] uppercase select-none"
        style={{ color: 'hsl(var(--muted-foreground))' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        ✦ Arraste e jogue para trocar ✦
      </motion.p>
    </div>
  );
};

export default ThrowableProfileCard;
