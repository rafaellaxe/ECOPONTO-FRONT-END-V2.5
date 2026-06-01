import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '../components/PageTransition.jsx'
import { TopBar } from '../components/Chrome.jsx'
import { Spinner } from '../components/Button.jsx'
import { IconLeafImpact, IconBolt, IconDrop, IconActivity } from '../components/Icons.jsx'
import { useAsync } from '../lib/useAsync.js'
import { api } from '../lib/api.js'
import { formatNumber, formatDecimal, relativeDate, materialMeta } from '../lib/format.js'

const PERIODS = [
  { key: 'week', label: 'Semana' },
  { key: 'month', label: 'Mês' },
  { key: 'year', label: 'Ano' },
  { key: 'all', label: 'Tudo' },
]

export default function Activities() {
  const [period, setPeriod] = useState('month')
  const { data, loading } = useAsync(() => api.activities(period), [period])

  const materials = data?.materials || []
  const impact = data?.impact
  const history = data?.history || []
  const label = data?.period_label || ''

  return (
    <PageTransition>
      <div className="screen-scroll">
        <TopBar title="Atividades" />

        <div className="act-pad">
          {/* Tabs de período */}
          <div className="pill-tabs">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                className={`pill-tab ${period === p.key ? 'active' : ''}`}
                onClick={() => setPeriod(p.key)}
              >
                {period === p.key && (
                  <motion.span
                    layoutId="pill-active"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 'var(--r-pill)',
                      background: 'var(--grad-brand)',
                      zIndex: -1,
                    }}
                    transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  />
                )}
                {p.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={period + (loading ? '-l' : '')}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="stack gap-16"
            >
              {loading ? (
                <div className="center" style={{ padding: 50, color: 'var(--green-500)' }}>
                  <span className="spin">
                    <Spinner size={26} />
                  </span>
                </div>
              ) : (
                <>
                  {/* Materiais */}
                  <section>
                    <div className="section-head">
                      <h3>O que você reciclou</h3>
                      <span className="tiny muted">{label}</span>
                    </div>
                    {materials.length === 0 ? (
                      <div className="act-empty">Nenhuma reciclagem registrada neste período.</div>
                    ) : (
                      <div className="stack gap-8">
                        {materials.map((m, i) => {
                          const meta = materialMeta(m.material)
                          return (
                            <motion.div
                              key={m.material}
                              className="mat-row"
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.06 }}
                            >
                              <div className={`mat-icon ${meta.iconClass}`}>
                                <span style={{ fontSize: 22 }}>{meta.emoji}</span>
                              </div>
                              <div className="mr-main">
                                <div className="mr-tt">{m.label || meta.label}</div>
                                <div className="mr-st">{formatDecimal(m.estimated_kg)} kg estimados</div>
                              </div>
                              <div className="mr-right">
                                <div className="mr-q">{formatNumber(m.quantity)}</div>
                                <div className="mr-pts">+{formatNumber(m.points)} pts</div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    )}
                  </section>

                  {/* Impacto ambiental */}
                  {impact && (
                    <section>
                      <div className="section-head">
                        <h3>Seu impacto 🌍</h3>
                      </div>
                      <div className="impact-grid">
                        <ImpactCard
                          tone="co2"
                          Icon={IconLeafImpact}
                          value={`${formatDecimal(impact.estimated_co2_kg)} kg`}
                          label="CO₂ evitado"
                        />
                        <ImpactCard
                          tone="energy"
                          Icon={IconBolt}
                          value={`${formatDecimal(impact.estimated_energy_kwh)} kWh`}
                          label="Energia poupada"
                        />
                        <ImpactCard
                          tone="water"
                          Icon={IconDrop}
                          value={`${formatDecimal(impact.estimated_water_l)} L`}
                          label="Água poupada"
                        />
                      </div>
                      <div className="stack gap-8" style={{ marginTop: 10 }}>
                        <EquivLine Icon={IconLeafImpact} text={impact.co2_equivalent} tone="co2" />
                        <EquivLine Icon={IconBolt} text={impact.energy_equivalent} tone="energy" />
                        <EquivLine Icon={IconDrop} text={impact.water_equivalent} tone="water" />
                      </div>
                    </section>
                  )}

                  {/* Histórico */}
                  <section>
                    <div className="section-head">
                      <h3>Histórico</h3>
                    </div>
                    {history.length === 0 ? (
                      <div className="act-empty">Sem registros por enquanto.</div>
                    ) : (
                      <div className="card card-pad">
                        {history.map((h) => {
                          const meta = materialMeta(h.material)
                          const accepted =
                            h.status != null ? h.status === 'accepted' : (h.points_awarded ?? 0) > 0
                          return (
                            <div className="hist-row" key={h.id}>
                              <div className={`hr-dot ${accepted ? '' : 'rej'}`} />
                              <div className="hr-main">
                                <div className="hr-tt">{h.label || meta.label}</div>
                                <div className="hr-st">{relativeDate(h.created_at)}</div>
                              </div>
                              <div className="hr-pts">
                                {accepted ? `+${formatNumber(h.points_awarded)}` : '—'}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </section>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  )
}

function ImpactCard({ tone, Icon, value, label }) {
  return (
    <motion.div
      className="impact-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <div className={`ic-ic ${tone}`}>
        <Icon size={19} />
      </div>
      <div className="ic-v">{value}</div>
      <div className="ic-l">{label}</div>
    </motion.div>
  )
}

function EquivLine({ Icon, text, tone }) {
  if (!text) return null
  return (
    <div className="row gap-8" style={{ fontSize: 12.5, color: 'var(--gray-600)' }}>
      <span className={`ic-ic ${tone}`} style={{ width: 28, height: 28, borderRadius: 9 }}>
        <Icon size={15} />
      </span>
      <span>{text}</span>
    </div>
  )
}
