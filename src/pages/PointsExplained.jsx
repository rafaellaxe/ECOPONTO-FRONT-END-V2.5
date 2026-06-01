import { motion } from 'framer-motion'
import { PageTransition } from '../components/PageTransition.jsx'
import { TopBar } from '../components/Chrome.jsx'
import { formatNumber } from '../lib/format.js'
import { useAsync } from '../lib/useAsync.js'
import { api } from '../lib/api.js'

const STEPS = [
  {
    n: 1,
    title: 'Escaneie a lixeira',
    text: 'Abra o app e leia o QR Code na lixeira inteligente para iniciar uma sessão.',
  },
  {
    n: 2,
    title: 'Descarte o material',
    text: 'Coloque a garrafa PET ou a lata de alumínio. A lixeira identifica o material automaticamente.',
  },
  {
    n: 3,
    title: 'Ganhe pontos na hora',
    text: 'Se o descarte for válido, os pontos entram na sua conta imediatamente.',
  },
  {
    n: 4,
    title: 'Acumule e troque por tickets',
    text: 'Ao atingir a meta de pontos, você ganha tickets para concorrer a prêmios.',
  },
]

const MATERIAL_POINTS = [
  { emoji: '🧴', label: 'Garrafa PET', pts: 'Plástico reciclável', cls: 'mat-plastic' },
  { emoji: '🥫', label: 'Lata de Alumínio', pts: 'Metal reciclável', cls: 'mat-metal' },
]

export default function PointsExplained() {
  const { data } = useAsync(() => api.points(), [])
  const perTicket = data?.points_per_ticket ?? 10000

  return (
    <PageTransition>
      <div className="screen-scroll">
        <TopBar title="Como funciona" back to="/points" />

        <div className="points-pad">
          <motion.div
            className="card card-pad"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ background: 'var(--grad-soft)', border: '1px solid var(--green-200)' }}
          >
            <h2 style={{ fontSize: 19 }}>Reciclar nunca foi tão recompensador ♻️</h2>
            <p className="muted small" style={{ marginTop: 6 }}>
              A cada {formatNumber(perTicket)} pontos você ganha um ticket de sorteio. Veja como acumular:
            </p>
          </motion.div>

          <section>
            <div className="section-head">
              <h3>Passo a passo</h3>
            </div>
            <div className="stack gap-12">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.n}
                  className="info-step"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.07 }}
                >
                  <div className="is-num">{s.n}</div>
                  <div>
                    <div className="is-tt">{s.title}</div>
                    <div className="is-tx">{s.text}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <div className="section-head">
              <h3>Materiais aceitos</h3>
            </div>
            <div className="stack gap-8">
              {MATERIAL_POINTS.map((m) => (
                <div key={m.label} className="mat-row">
                  <div className={`mat-icon ${m.cls}`}>
                    <span style={{ fontSize: 22 }}>{m.emoji}</span>
                  </div>
                  <div className="mr-main">
                    <div className="mr-tt">{m.label}</div>
                    <div className="mr-st">{m.pts}</div>
                  </div>
                </div>
              ))}
            </div>
            <p className="tiny muted" style={{ marginTop: 12, textAlign: 'center' }}>
              A pontuação de cada item pode variar conforme o tipo e o peso do material.
            </p>
          </section>
        </div>
      </div>
    </PageTransition>
  )
}
