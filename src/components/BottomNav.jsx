import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IconHome, IconTrophy, IconActivity, IconUser, IconScan } from './Icons.jsx'

const ITEMS = [
  { to: '/home', label: 'Início', Icon: IconHome },
  { to: '/ranking', label: 'Ranking', Icon: IconTrophy },
]
const ITEMS_RIGHT = [
  { to: '/activities', label: 'Atividades', Icon: IconActivity },
  { to: '/profile', label: 'Perfil', Icon: IconUser },
]

function NavTab({ to, label, Icon }) {
  return (
    <NavLink to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span layoutId="nav-dot" className="nav-dot" transition={{ duration: 0.3 }} />
          )}
          <Icon size={23} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  )
}

export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const [hidden, setHidden] = useState(false)
  const lastTop = useRef(0)

  // Some ao rolar para baixo; reaparece ao rolar para cima ou perto do topo.
  useEffect(() => {
    const onScroll = (e) => {
      const el = e.target
      if (!el || !el.classList || !el.classList.contains('screen-scroll')) return
      const top = el.scrollTop
      if (top <= 8) setHidden(false)
      else if (top > lastTop.current + 6) setHidden(true)
      else if (top < lastTop.current - 6) setHidden(false)
      lastTop.current = top
    }
    window.addEventListener('scroll', onScroll, true)
    return () => window.removeEventListener('scroll', onScroll, true)
  }, [])

  // Garante a nav visível ao trocar de aba.
  useEffect(() => {
    setHidden(false)
    lastTop.current = 0
  }, [location.pathname])

  return (
    <nav
      className="bottom-nav"
      style={{
        transform: hidden ? 'translateY(120%)' : 'translateY(0)',
        transition: 'transform 0.28s ease',
      }}
    >
      {ITEMS.map((it) => (
        <NavTab key={it.to} {...it} />
      ))}
      <div className="nav-fab-wrap">
        <motion.button
          className="nav-fab"
          onClick={() => navigate('/scan')}
          whileTap={{ scale: 0.88, rotate: -8 }}
          aria-label="Escanear lixeira"
        >
          <IconScan size={27} />
        </motion.button>
      </div>
      {ITEMS_RIGHT.map((it) => (
        <NavTab key={it.to} {...it} />
      ))}
    </nav>
  )
}
