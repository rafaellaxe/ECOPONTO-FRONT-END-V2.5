import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageTransition } from '../../components/PageTransition.jsx'
import { TopBar } from '../../components/Chrome.jsx'
import { Button } from '../../components/Button.jsx'
import { IconMapPin, IconAlert, IconScan } from '../../components/Icons.jsx'

const SPOTS = [
  { name: 'Campus Universitário', detail: 'Bloco central · próximo ao refeitório' },
  { name: 'Biblioteca', detail: 'Entrada principal' },
  { name: 'Centro de Convivência', detail: 'Praça de alimentação' },
]

export default function FindMachine() {
  const navigate = useNavigate()
  return (
    <PageTransition>
      <div className="screen-scroll">
        <TopBar title="Onde reciclar" back to="/scan" />

        <div className="points-pad">
          {/* Banner beta */}
          <motion.div
            className="beta-banner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <IconAlert size={18} />
            <span>
              Estamos em fase de testes. Em breve mais lixeiras inteligentes estarão disponíveis
              perto de você.
            </span>
          </motion.div>

          {/* Mapa ilustrativo */}
          <motion.div
            className="card"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              height: 170,
              background:
                'linear-gradient(135deg, #E7F4EC 0%, #D6EFE0 100%)',
              position: 'relative',
              overflow: 'hidden',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'linear-gradient(var(--green-200) 1px, transparent 1px), linear-gradient(90deg, var(--green-200) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
                opacity: 0.5,
              }}
            />
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              style={{ position: 'relative', color: 'var(--green-600)' }}
            >
              <IconMapPin size={46} />
            </motion.div>
          </motion.div>

          {/* Pontos próximos */}
          <section>
            <div className="section-head">
              <h3>Pontos de coleta</h3>
            </div>
            <div className="stack gap-8">
              {SPOTS.map((s, i) => (
                <motion.div
                  key={s.name}
                  className="card reward-info"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i }}
                >
                  <div className="ri-ic">
                    <IconMapPin size={20} />
                  </div>
                  <div>
                    <div className="ri-tt">{s.name}</div>
                    <div className="ri-tx">{s.detail}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <Button onClick={() => navigate('/scan')} icon={<IconScan size={20} />}>
            Escanear uma lixeira
          </Button>
        </div>
      </div>
    </PageTransition>
  )
}
