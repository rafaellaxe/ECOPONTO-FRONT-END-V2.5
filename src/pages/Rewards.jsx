import { motion } from 'framer-motion'
import { PageTransition } from '../components/PageTransition.jsx'
import { TopBar } from '../components/Chrome.jsx'
import { ProgressBar, CountUp } from '../components/Progress.jsx'
import { IconTicket, IconGift, IconSparkles, IconTrophy } from '../components/Icons.jsx'
import { useAsync } from '../lib/useAsync.js'
import { api } from '../lib/api.js'
import { formatNumber } from '../lib/format.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Rewards() {
  const { user } = useAuth()
  const { data, loading } = useAsync(() => api.points(), [])

  const tickets = data?.tickets ?? user?.tickets ?? 0
  const perTicket = data?.points_per_ticket ?? 10000
  const pct = data?.progress_percentage ?? 0
  const untilNext = data?.points_until_next_ticket ?? perTicket

  return (
    <PageTransition>
      <div className="screen-scroll">
        <TopBar title="Recompensas" back to="/ranking" />

        <div className="points-pad">
          {/* Card dourado de tickets */}
          <motion.div
            className="reward-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          >
            <div className="reward-ic">
              <IconTicket size={30} />
            </div>
            <div className="reward-n">
              {loading ? formatNumber(tickets) : <CountUp value={tickets} />}
            </div>
            <div className="reward-t">tickets de sorteio</div>
          </motion.div>

          {/* Progresso até o próximo ticket */}
          <div className="tk-progress">
            <div className="tkp-head">
              <span className="tkp-h">Próximo ticket</span>
              <span className="tkp-n">{Math.round(pct)}%</span>
            </div>
            <ProgressBar value={pct} height={12} />
            <div className="tkp-foot">
              Faltam <b>{formatNumber(untilNext)}</b> pontos · cada {formatNumber(perTicket)} pts = 1 ticket
            </div>
          </div>

          {/* Como funciona */}
          <div>
            <div className="section-head">
              <h3>Como funciona</h3>
            </div>
            <div className="stack gap-12">
              <RewardInfo
                Icon={IconSparkles}
                title="Recicle e acumule pontos"
                text="Cada descarte correto na lixeira inteligente gera pontos automaticamente."
              />
              <RewardInfo
                Icon={IconTicket}
                title={`${formatNumber(perTicket)} pontos viram 1 ticket`}
                text="Ao atingir a meta de pontos, você ganha um ticket para o sorteio."
              />
              <RewardInfo
                Icon={IconGift}
                title="Concorra a prêmios"
                text="Quanto mais tickets, maiores as suas chances nos sorteios de recompensas."
              />
              <RewardInfo
                Icon={IconTrophy}
                title="Suba no ranking"
                text="Seus pontos também valem posição entre os melhores recicladores."
              />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

function RewardInfo({ Icon, title, text }) {
  return (
    <div className="card reward-info">
      <div className="ri-ic">
        <Icon size={20} />
      </div>
      <div>
        <div className="ri-tt">{title}</div>
        <div className="ri-tx">{text}</div>
      </div>
    </div>
  )
}
