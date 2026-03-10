import { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

export default function LampCord() {
  const { theme, toggleTheme } = useTheme();
  const controls = useAnimation();
  const [pulling, setPulling] = useState(false);
  const isDark = theme === 'dark';

  const handlePull = async () => {
    if (pulling) return;
    setPulling(true);
    await controls.start({
      y: 44,
      transition: { duration: 0.13, ease: 'easeOut' },
    });
    toggleTheme();
    await controls.start({
      y: 0,
      transition: { type: 'spring', stiffness: 420, damping: 14, mass: 0.7 },
    });
    setPulling(false);
  };

  const cordColor = isDark
    ? 'rgba(255,255,255,0.22)'
    : 'rgba(0,0,0,0.18)';

  const beadBg = isDark
    ? 'linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(200,200,200,0.6) 100%)'
    : 'linear-gradient(160deg, rgba(60,60,60,0.8) 0%, rgba(30,30,30,0.6) 100%)';

  const beadShadow = isDark
    ? '0 2px 10px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.4)'
    : '0 2px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: '2.5rem',
        zIndex: 98,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      {/* static segment from top to navbar bottom */}
      <div
        style={{
          width: 1.5,
          height: '4.5rem',
          background: cordColor,
          borderRadius: 2,
        }}
      />

      {/* animated pull section */}
      <motion.button
        animate={controls}
        onClick={handlePull}
        aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
        title={isDark ? 'Puxe para ligar a luz' : 'Puxe para apagar a luz'}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          cursor: 'n-resize',
          padding: 0,
          pointerEvents: 'auto',
          userSelect: 'none',
        }}
        whileHover={{ scale: 1.05 }}
      >
        {/* rope segment */}
        <div
          style={{
            width: 1.5,
            height: 40,
            background: `repeating-linear-gradient(
              to bottom,
              ${cordColor} 0px,
              ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'} 3px,
              ${cordColor} 6px
            )`,
            borderRadius: 2,
          }}
        />

        {/* knot */}
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: cordColor,
            margin: '1px 0',
          }}
        />

        {/* pull bead */}
        <motion.div
          animate={{ rotate: pulling ? [0, -8, 8, -4, 4, 0] : 0 }}
          transition={{ duration: 0.5 }}
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: beadBg,
            boxShadow: beadShadow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 8,
            lineHeight: 1,
          }}
        >
          {isDark ? '☀' : '☾'}
        </motion.div>
      </motion.button>
    </div>
  );
}
