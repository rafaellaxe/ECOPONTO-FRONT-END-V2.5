import { motion } from 'framer-motion'

// Marca de reciclagem (tres setas) + wordmark.
export function LogoMark({ size = 56, spin = false }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      initial={false}
      animate={spin ? { rotate: 360 } : { rotate: 0 }}
      transition={spin ? { repeat: Infinity, duration: 6, ease: 'linear' } : {}}
    >
      <defs>
        <linearGradient id="lg-mark" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00C268" />
          <stop offset="1" stopColor="#007D40" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="18" fill="url(#lg-mark)" />
      <g transform="translate(32 32)" fill="none" stroke="#fff" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 -14 L7.5 -1 L-7.5 -1 Z" />
        <path d="M0 -14 L7.5 -1 L-7.5 -1 Z" transform="rotate(120)" />
        <path d="M0 -14 L7.5 -1 L-7.5 -1 Z" transform="rotate(240)" />
      </g>
    </motion.svg>
  )
}

export function Wordmark({ size = 26, light = false }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: size,
        letterSpacing: '-0.04em',
        color: light ? '#fff' : 'var(--navy)',
        lineHeight: 1,
      }}
    >
      eco
      <span style={{ color: light ? '#CFF5E3' : 'var(--green-500)' }}>ponto</span>
    </span>
  )
}

export function LogoLockup({ markSize = 48, textSize = 24, light = false, gap = 12 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap }}>
      <LogoMark size={markSize} />
      <Wordmark size={textSize} light={light} />
    </div>
  )
}
