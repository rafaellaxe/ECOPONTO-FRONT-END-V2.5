import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageTransition } from '../components/PageTransition.jsx'
import { TopBar } from '../components/Chrome.jsx'
import { ProgressRing, ProgressBar, CountUp } from '../components/Progress.jsx'
import { IconSparkles, IconTicket, IconChevronRight } from '../components/Icons.jsx'
import { useAsync } from '../lib/useAsync.js'
import { api } from '../lib/api.js'
import { formatNumber } from '../lib/format.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Points() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data, loading } = useAsync(() => api.points(), [])

  const points = data?.points ?? user?.points ?? 0
  const tickets = data?.tickets ?? user?.tickets ?? 0
  const perTicket = data?.points_per_ticket ?? 10000
  const pct = data?.progress_percentage ?? 0
  const untilNext = data?.points_until_next_ticket ?? perTicket

  return (
    <PageTransition>
      <div className="screen-scroll">
        <TopBar
          title="Pontos"
          right={
            <button className="btn-link" onClick={() => navigate('/points/explained')}>
              Como funciona
            </button>
          }
        />

        <div className="points-pad">
          {/* Hero com anel de progresso */}
          <motion.div
            className="points-hero"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="ph-ring">
              <ProgressRing value={pct} size={168} stroke={14}>
                <div>
                  <div className="ph-big">
                    {loading ? formatNumber(points) : <CountUp value={points} />}
                  </div>
                  <div className="ph-small">pontos</div>
                </div>
              </ProgressRing>
            </div>
            <div className="ph-cap">
              {pct >= 100
                ? 'Você tem um ticket disponível! 🎉'
                : `Faltam ${formatNumber(untilNext)} pts para o próximo ticket`}
            </div>
          </motion.div>

          {/* Tickets */}
          <div className="card card-pad row between">
            <div className="row gap-12">
              <div className="qc-ic gold" style={{ width: 44, height: 44 }}>
                <IconTicket size={21} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: 'var(--navy)' }}>
                  {formatNumber(tickets)}
                </div>
                <div className="tiny muted">tickets de sorteio</div>
              </div>
            </div>
            <motion.button
              className="chip"
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/ranking/rewards')}
              style={{ cursor: 'pointer' }}
            >
              Recompensas <IconChevronRight size={15} />
            </motion.button>
          </div>

          {/* Progresso até o próximo ticket */}
          <div className="tk-progress">
            <div className="tkp-head">
              <span className="tkp-h">Progresso do ticket</span>
              <span className="tkp-n">{Math.round(pct)}%</span>
            </div>
            <ProgressBar value={pct} height={12} />
            <div className="tkp-foot">
              Cada <b>{formatNumber(perTicket)}</b> pontos = 1 ticket de sorteio
            </div>
          </div>

          {/* Atalho para explicação */}
          <motion.button
            className="card card-pad row between"
            whileTap={{ scale: 0.99 }}
            onClick={() => navigate('/points/explained')}
            style={{ width: '100%', textAlign: 'left' }}
          >
            <div className="row gap-12">
              <div className="qc-ic green" style={{ width: 42, height: 42 }}>
                <IconSparkles size={20} />
              </div>
              <div>
                <div className="qc-tt">Como ganho pontos?</div>
                <div className="qc-st">Entenda o sistema de reciclagem</div>
              </div>
            </div>
            <IconChevronRight size={20} style={{ color: 'var(--gray-300)' }} />
          </motion.button>
        </div>
      </div>
    </PageTransition>
  )
}
