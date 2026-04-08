import React, { useState, useRef, useCallback } from 'react';
import { motion, useAnimation, useMotionValue, PanInfo, AnimatePresence } from 'framer-motion';
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
const STACK_OFFSETS = [
  { x: -12, y: 4, rotate: -2.5, scale: 0.97 },
  { x: -22, y: 8, rotate: -4.5, scale: 0.94 },
];

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
  const [isDragging, setIsDragging] = useState(false);
  const controls = useAnimation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const getAvatar = (offset: number) =>
    avatarUrls[(currentIndex + offset) % avatarUrls.length];

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % avatarUrls.length);
  }, [avatarUrls.length]);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = useCallback(
    async (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const vx = info.velocity.x;
      const vy = info.velocity.y;
      const speed = Math.sqrt(vx * vx + vy * vy);

      if (speed > VELOCITY_THRESHOLD) {
        setIsFlying(true);

        const angle = Math.atan2(vy, vx);
        const flyX = Math.cos(angle) * FLY_DISTANCE;
        const flyY = Math.sin(angle) * FLY_DISTANCE;
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

        nextImage();

        controls.set({ x: 0, y: 0, rotate: 0, scale: 0.3, opacity: 0 });

        await controls.start({
          scale: 1,
          opacity: 1,
          transition: {
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          },
        });

        setIsFlying(false);
        setIsDragging(false);
      } else {
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
        setIsDragging(false);
      }
    },
    [controls, nextImage]
  );

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ touchAction: 'none' }}>
      {/* Stack cards behind (furthest first) */}
      {STACK_OFFSETS.slice().reverse().map((offset, reverseIdx) => {
        const stackIdx = STACK_OFFSETS.length - reverseIdx; // 2, 1
        const avatar = getAvatar(stackIdx);

        return (
          <motion.div
            key={`stack-${stackIdx}`}
            className="absolute inset-0 select-none pointer-events-none"
            animate={{
              x: isDragging ? offset.x * 0.3 : offset.x,
              y: isDragging ? offset.y * 0.3 : offset.y,
              rotate: isDragging ? offset.rotate * 0.3 : offset.rotate,
              scale: isDragging && stackIdx === 1 ? 1 : offset.scale,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            style={{ zIndex: -stackIdx }}
          >
            <ProfileCard
              avatarUrl={avatar}
              miniAvatarUrl={miniAvatarUrl || avatar}
              grainUrl={grainUrl}
              name={name}
              title={title}
              handle={handle}
              status={status}
              showUserInfo={showUserInfo}
              enableTilt={false}
              className="w-full mx-auto pointer-events-none opacity-60"
            />
          </motion.div>
        );
      })}

      {/* Main draggable card */}
      <motion.div
        drag
        dragElastic={0.8}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x, y, cursor: isFlying ? 'default' : 'grab', zIndex: 10 }}
        whileDrag={{ cursor: 'grabbing', scale: 1.04 }}
        className="relative select-none"
      >
        <ProfileCard
          avatarUrl={getAvatar(0)}
          miniAvatarUrl={miniAvatarUrl || getAvatar(0)}
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
