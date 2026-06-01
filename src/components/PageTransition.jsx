import { motion } from 'framer-motion'

const variants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

/**
 * Envolve cada página. A transição "fade + slide" roda quando a rota muda
 * (controlada pelo AnimatePresence em App.jsx com key={location.pathname}).
 */
export function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      className={`screen ${className}`}
      variants={variants}
      initial="initial"
      animate="enter"
      exit="exit"
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
