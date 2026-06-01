import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageTransition } from '../components/PageTransition.jsx'
import { TopBar, Avatar } from '../components/Chrome.jsx'
import {
  IconEdit,
  IconSparkles,
  IconMapPin,
  IconGift,
  IconLogout,
  IconChevronRight,
} from '../components/Icons.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useAsync } from '../lib/useAsync.js'
import { api } from '../lib/api.js'
import { formatNumber } from '../lib/format.js'
import { useToast } from '../components/Toast.jsx'

export default function Profile() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, logout } = useAuth()
  const { data } = useAsync(() => api.home(), [])

  const fullName = `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'Reciclador'
  const points = data?.summary?.points ?? user?.points ?? 0
  const tickets = data?.summary?.tickets ?? user?.tickets ?? 0
  const position = data?.ranking?.position

  async function handleLogout() {
    await logout()
    toast.show('Você saiu da conta')
    navigate('/login', { replace: true })
  }

  return (
    <PageTransition>
      <div className="screen-scroll">
        <TopBar
          title="Perfil"
          right={
            <motion.button
              className="icon-btn"
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate('/profile/edit')}
              aria-label="Editar perfil"
            >
              <IconEdit size={19} />
            </motion.button>
          }
        />

        <div className="profile-pad">
          {/* Cabeçalho */}
          <motion.div
            className="profile-head"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Avatar name={fullName} src={user?.avatar_url} size={96} />
            <div className="profile-name">{fullName}</div>
            <div className="profile-email">{user?.email}</div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="profile-stats"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
          >
            <div className="pstat">
              <div className="ps-v">{formatNumber(points)}</div>
              <div className="ps-l">pontos</div>
            </div>
            <div className="pstat">
              <div className="ps-v">{formatNumber(tickets)}</div>
              <div className="ps-l">tickets</div>
            </div>
            <div className="pstat">
              <div className="ps-v">{position ? `#${position}` : '—'}</div>
              <div className="ps-l">ranking</div>
            </div>
          </motion.div>

          {/* Menu */}
          <motion.div
            className="menu-list"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
          >
            <MenuItem Icon={IconEdit} label="Editar perfil" onClick={() => navigate('/profile/edit')} />
            <MenuItem Icon={IconSparkles} label="Como funcionam os pontos" onClick={() => navigate('/points/explained')} />
            <MenuItem Icon={IconGift} label="Recompensas" onClick={() => navigate('/ranking/rewards')} />
            <MenuItem Icon={IconMapPin} label="Onde encontrar uma máquina" onClick={() => navigate('/scan/find')} />
            <MenuItem Icon={IconLogout} label="Sair da conta" danger onClick={handleLogout} />
          </motion.div>

          <p className="tiny muted center-text" style={{ marginTop: 4 }}>
            EcoPonto · versão de demonstração
          </p>
        </div>
      </div>
    </PageTransition>
  )
}

function MenuItem({ Icon, label, onClick, danger = false }) {
  return (
    <button className={`menu-item ${danger ? 'danger' : ''}`} onClick={onClick}>
      <div className="mi-ic">
        <Icon size={19} />
      </div>
      <div className="mi-tt">{label}</div>
      {!danger && <IconChevronRight size={19} className="mi-ch" />}
    </button>
  )
}
