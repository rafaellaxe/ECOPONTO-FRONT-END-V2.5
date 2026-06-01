import { useMemo } from 'react'
import { motion } from 'framer-motion'

const COLORS = ['#00A85A', '#36D17F', '#FFCC00', '#FFD700', '#1273D4', '#FF7AB6']

/**
 * Explosão de confete leve (puro Framer Motion, sem libs externas).
 * Renderiza N peças que sobem/caem e somem. Use com key única para reiniciar.
 */
export function Confetti({ count = 26, run = true }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 320,
        y: 120 + Math.random() * 260,
        rot: (Math.random() - 0.5) * 720,
        delay: Math.random() * 0.18,
        size: 7 + Math.random() * 7,
        color: COLORS[i % COLORS.length],
        round: Math.random() > 0.5,
      })),
    [count]
  )

  if (!run) return null

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        top: '34%',
        left: '50%',
        width: 0,
        height: 0,
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.round ? p.size : p.size * 0.5,
            borderRadius: p.round ? '50%' : 2,
            background: p.color,
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rot }}
          transition={{ duration: 1.5, ease: [0.18, 0.7, 0.3, 1], delay: p.delay }}
        />
      ))}
    </div>
  )
}
