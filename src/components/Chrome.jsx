import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IconChevronLeft } from './Icons.jsx'
import { initialsOf } from '../lib/format.js'

/** Avatar circular: usa imagem se houver, senão iniciais. */
export function Avatar({ name = '', src = null, size = 44, className = '', style = {} }) {
  const dim = { width: size, height: size, fontSize: Math.round(size * 0.36) }
  return (
    <div className={`avatar ${className}`} style={{ ...dim, ...style }}>
      {src ? <img src={src} alt={name} /> : <span>{initialsOf(name)}</span>}
    </div>
  )
}

/** Barra de topo com voltar opcional + título + ação à direita. */
export function TopBar({ title, back = false, to = null, right = null, solid = false, onBack = null }) {
  const navigate = useNavigate()
  const handleBack = () => {
    if (onBack) return onBack()
    if (to) return navigate(to)
    navigate(-1)
  }
  return (
    <div className={`topbar ${solid ? 'solid' : ''}`}>
      {back && (
        <motion.button
          className="icon-btn"
          onClick={handleBack}
          whileTap={{ scale: 0.9 }}
          aria-label="Voltar"
        >
          <IconChevronLeft size={22} />
        </motion.button>
      )}
      {title && <div className="topbar-title grow">{title}</div>}
      {!title && <div className="grow" />}
      {right}
    </div>
  )
}
