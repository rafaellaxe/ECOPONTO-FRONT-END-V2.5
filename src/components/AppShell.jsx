import { useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav.jsx'

// Rotas que exibem a navegação inferior (abas principais e telas de detalhe).
const NAV_ROUTES = [
  '/home',
  '/ranking',
  '/ranking/rewards',
  '/activities',
  '/points',
  '/points/explained',
  '/profile',
]

function showsNav(pathname) {
  return NAV_ROUTES.includes(pathname)
}

/**
 * Moldura do app: coluna central estilo telefone.
 * A bottom nav fica FORA do AnimatePresence (persiste entre páginas)
 * e aparece só nas rotas autenticadas principais.
 */
export function AppShell({ children }) {
  const { pathname } = useLocation()
  const withNav = showsNav(pathname)

  return (
    <div className={`app-shell ${withNav ? 'has-nav' : ''}`}>
      {children}
      {withNav && <BottomNav />}
    </div>
  )
}
