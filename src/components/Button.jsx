import { motion } from 'framer-motion'

export function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  type = 'button',
  icon = null,
  className = '',
  ...rest
}) {
  const cls = {
    primary: 'btn btn-primary',
    ghost: 'btn btn-ghost',
    soft: 'btn btn-soft',
    dark: 'btn btn-dark',
    google: 'btn btn-google',
    dangerGhost: 'btn btn-danger-ghost',
  }[variant]

  return (
    <motion.button
      type={type}
      className={`${cls} ${className}`}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      {...rest}
    >
      {loading ? (
        <span className="spin" style={{ display: 'inline-flex' }} aria-hidden>
          <Spinner size={20} />
        </span>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </motion.button>
  )
}

export function Spinner({ size = 22, color = 'currentColor', stroke = 2.6 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke={color} strokeOpacity="0.22" strokeWidth={stroke} />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
      />
    </svg>
  )
}
