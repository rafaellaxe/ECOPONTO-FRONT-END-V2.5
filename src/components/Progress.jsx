import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import { formatNumber } from '../lib/format.js'

export function ProgressRing({
  value = 0, // 0..100
  size = 132,
  stroke = 12,
  track = 'rgba(255,255,255,0.25)',
  color = '#fff',
  rounded = true,
  children,
  delay = 0.15,
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const target = Math.max(0, Math.min(100, value))
  const offset = c - (target / 100) * c

  return (
    <div className="ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap={rounded ? 'round' : 'butt'}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay }}
        />
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  )
}

export function CountUp({ value = 0, duration = 1.1, className = '', format = formatNumber }) {
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState(format(0))
  const rounded = useTransform(mv, (v) => format(v))

  useEffect(() => {
    const controls = animate(mv, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    })
    const unsub = rounded.on('change', (v) => setDisplay(v))
    return () => {
      controls.stop()
      unsub()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <span className={`mono-num ${className}`}>{display}</span>
}

// Barra de progresso linear animada.
export function ProgressBar({ value = 0, height = 10, color = 'var(--grad-brand)', track = 'var(--green-100)', delay = 0.1 }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div style={{ height, borderRadius: 999, background: track, overflow: 'hidden' }}>
      <motion.div
        style={{ height: '100%', borderRadius: 999, background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${v}%` }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay }}
      />
    </div>
  )
}
