import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageTransition } from '../components/PageTransition.jsx'
import { Avatar } from '../components/Chrome.jsx'
import { ProgressRing, CountUp } from '../components/Progress.jsx'
import {
  IconSparkles,
  IconTicket,
  IconScan,
  IconTrophy,
  IconGift,
  IconChevronRight,
} from '../components/Icons.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useAsync } from '../lib/useAsync.js'
import { api } from '../lib/api.js'
import { formatNumber, formatKg, relativeDate, materialMeta } from '../lib/format.js'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: 0.05 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] } }),
}

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data, loading } = useAsync(() => api.home(), [])

  const firstName = data?.user?.first_name || user?.first_name || 'reciclador'
  const s = data?.summary || {}
  const points = s.points ?? user?.points ?? 0
  const tickets = s.tickets ?? user?.tickets ?? 0
  const goalPct = s.goal_percentage ?? 0
  const goalKg = s.monthly_goal_kg ?? 0
  const doneKg = s.monthly_estimated_kg ?? 0
  const itemsCount = s.monthly_items_count ?? 0
  const position = data?.ranking?.position
  const activities = data?.recent_activities || []

  return (
    <PageTransition>
      <div className="screen-scroll">
        {/* Cabeçalho */}
        <div className="topbar between">
          <div>
            <div className="greet-hi">{greeting()},</div>
            <div className="greet-name">{firstName} 👋</div>
          </div>
          <motion.button whileTap={{ scale: 0.92 }} onClick={() => navigate('/profile')} aria-label="Perfil">
            <Avatar name={`${firstName} ${user?.last_name || ''}`} src={user?.avatar_url} size={46} />
          </motion.button>
        </div>

        <div className="home-pad">
          {/* Card de pontos */}
          <motion.div className="points-card" variants={fade} custom={0} initial="hidden" animate="show">
            <div className="between" style={{ alignItems: 'flex-start' }}>
              <div>
                <div className="pc-label">
                  <IconSparkles size={15} /> Seus pontos
                </div>
                <div className="pc-value">
                  {loading ? (
                    <span className="mono-num">{formatNumber(points)}</span>
                  ) : (
                    <CountUp value={points} />
                  )}
                  <small>pts</small>
                </div>
              </div>
              <div className="pc-ring">
                <ProgressRing value={goalPct} size={92} stroke={9}>
                  <div className="pc-ring-label">
                    <b>{Math.round(goalPct)}%</b>
                    meta
                  </div>
                </ProgressRing>
              </div>
            </div>

            <div style={{ fontSize: 12.5, opacity: 0.92, marginTop: 4 }}>
              {formatKg(doneKg)} de {formatKg(goalKg)} reciclados este mês · {formatNumber(itemsCount)} itens
            </div>

            <div className="pc-tickets">
              <div className="pct-left">
                <div className="pct-ic">
                  <IconTicket size={20} />
                </div>
                <div>
                  <div className="pct-n">{formatNumber(tickets)}</div>
                  <div className="pct-t">tickets de sorteio</div>
                </div>
              </div>
              <motion.button
                className="chip-gold chip"
                style={{ cursor: 'pointer' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/points')}
              >
                Ver pontos <IconChevronRight size={15} />
              </motion.button>
            </div>
          </motion.div>

          {/* Ações rápidas */}
          <motion.div className="quick-row" variants={fade} custom={1} initial="hidden" animate="show">
            <button className="quick-card" onClick={() => navigate('/ranking')}>
              <div className="qc-ic green">
                <IconTrophy size={21} />
              </div>
              <div>
                <div className="qc-tt">Ranking</div>
                <div className="qc-st">{position ? `Você é #${position}` : 'Ver posições'}</div>
              </div>
            </button>
            <button className="quick-card" onClick={() => navigate('/ranking/rewards')}>
              <div className="qc-ic gold">
                <IconGift size={21} />
              </div>
              <div>
                <div className="qc-tt">Recompensas</div>
                <div className="qc-st">Seus tickets</div>
              </div>
            </button>
          </motion.div>

          {/* CTA reciclar */}
          <motion.button
            className="scan-cta"
            variants={fade}
            custom={2}
            initial="hidden"
            animate="show"
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/scan')}
          >
            <div className="sc-ic">
              <IconScan size={26} />
            </div>
            <div className="sc-tx">
              <div className="sc-tt">Reciclar agora</div>
              <div className="sc-st">Escaneie o QR Code da lixeira</div>
            </div>
            <IconChevronRight size={22} style={{ zIndex: 1, opacity: 0.7 }} />
          </motion.button>

          {/* Atividades recentes */}
          <motion.div variants={fade} custom={3} initial="hidden" animate="show">
            <div className="section-head">
              <h3>Atividades recentes</h3>
              <button className="btn-link" onClick={() => navigate('/activities')}>
                Ver tudo
              </button>
            </div>

            {loading ? (
              <div className="act-list">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="act-row">
                    <div className="sk" style={{ width: 46, height: 46, borderRadius: 14 }} />
                    <div className="grow">
                      <div className="sk" style={{ width: '60%', height: 13, marginBottom: 7 }} />
                      <div className="sk" style={{ width: '35%', height: 11 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <div className="act-empty">
                Você ainda não reciclou nada.
                <br />
                Que tal começar agora? ♻️
              </div>
            ) : (
              <div className="act-list">
                {activities.map((a, i) => {
                  const meta = materialMeta(a.material)
                  return (
                    <motion.div
                      key={a.id}
                      className="act-row"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.07 }}
                    >
                      <div className={`mat-icon ${meta.iconClass}`}>
                        <span style={{ fontSize: 22 }}>{meta.emoji}</span>
                      </div>
                      <div className="ar-main">
                        <div className="ar-tt">{a.label || meta.label}</div>
                        <div className="ar-st">{relativeDate(a.created_at)}</div>
                      </div>
                      <div className="ar-pts">+{formatNumber(a.points_awarded)}</div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}
