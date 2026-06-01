import { useEffect, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PageTransition } from '../../components/PageTransition.jsx'
import { TopBar } from '../../components/Chrome.jsx'
import { Button, Spinner } from '../../components/Button.jsx'
import { Confetti } from '../../components/Confetti.jsx'
import { CountUp } from '../../components/Progress.jsx'
import {
  IconWifi,
  IconCheck,
  IconX,
  IconAlert,
  IconRefresh,
  IconScan,
  IconTicket,
  IconSparkles,
} from '../../components/Icons.jsx'
import { useSession } from '../../lib/useSession.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { formatNumber, formatDecimal, materialMeta } from '../../lib/format.js'

export default function Session() {
  const navigate = useNavigate()
  const { sessionId } = useParams()
  const location = useLocation()
  const wsToken = location.state?.ws_token
  const { user, applyResult } = useAuth()

  const { status, result, errorReason, isMock, closeSession, recycleAgain, simulateDiscard } =
    useSession({ sessionId, wsToken, enabled: true })

  // pontos/tickets de referência antes do descarte (para detectar ticket novo)
  const ticketsBefore = useRef(user?.tickets ?? 0)
  const appliedRef = useRef(null)

  useEffect(() => {
    if (status === 'analyzing') ticketsBefore.current = user?.tickets ?? 0
  }, [status, user])

  // aplica pontos uma única vez por descarte aceito
  useEffect(() => {
    if (status === 'success' && result && appliedRef.current !== result.discard_id) {
      appliedRef.current = result.discard_id
      applyResult(result)
    }
  }, [status, result, applyResult])

  // ao fechar a sessão, volta para a home
  useEffect(() => {
    if (status === 'closed') navigate('/home', { replace: true })
  }, [status, navigate])

  function exit() {
    closeSession()
    navigate('/home', { replace: true })
  }

  const ticketEarned =
    status === 'success' &&
    result &&
    typeof result.user_tickets === 'number' &&
    result.user_tickets > ticketsBefore.current

  return (
    <PageTransition>
      <div className="session-screen">
        <TopBar back to="/home" onBack={exit} />

        <AnimatePresence mode="wait">
          {/* CONNECTING */}
          {status === 'connecting' && (
            <StateWrap key="connecting">
              <div className="session-emoji green">
                <span className="spin">
                  <Spinner size={42} color="var(--green-600)" />
                </span>
              </div>
              <h1 className="session-title">Conectando…</h1>
              <p className="session-sub">Estabelecendo conexão com a lixeira inteligente</p>
            </StateWrap>
          )}

          {/* READY */}
          {status === 'ready' && (
            <StateWrap key="ready">
              <motion.div
                className="session-emoji green"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16 }}
              >
                <IconWifi size={46} />
              </motion.div>
              <h1 className="session-title win">Máquina conectada!</h1>
              <p className="session-sub">
                Agora é com você. Faça o descarte na lixeira e aguarde a análise.
              </p>

              <div className="ready-list">
                <div className="ready-item">
                  <div className="rli plastic">🧴</div>
                  <span>Garrafas PET</span>
                </div>
                <div className="ready-item">
                  <div className="rli metal">🥫</div>
                  <span>Latas de alumínio</span>
                </div>
                <div className="ready-item">
                  <div className="rli ok">
                    <IconCheck size={16} />
                  </div>
                  <span>Aguardando seu descarte…</span>
                </div>
              </div>
            </StateWrap>
          )}

          {/* ANALYZING */}
          {status === 'analyzing' && (
            <StateWrap key="analyzing">
              <div className="pulse-ring">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="pr-wave"
                    initial={{ scale: 0.6, opacity: 0.6 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.5, ease: 'easeOut' }}
                  />
                ))}
                <div className="pr-core">
                  <IconSparkles size={28} />
                </div>
              </div>
              <h1 className="session-title">Analisando…</h1>
              <p className="session-sub">A lixeira está identificando o material descartado</p>
            </StateWrap>
          )}

          {/* SUCCESS */}
          {status === 'success' && result && (
            <StateWrap key="success">
              <Confetti run />
              <motion.div
                className="session-emoji gold"
                initial={{ scale: 0.4, rotate: -20, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 240, damping: 14 }}
              >
                <IconCheck size={50} />
              </motion.div>
              <h1 className="session-title win">Descarte correto!</h1>
              <p className="session-sub">Mandou bem. Seus pontos já foram creditados.</p>

              <motion.div
                className="win-points"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="wp-plus">
                  +<CountUp value={result.points_awarded || 0} duration={1.2} />
                </div>
                {typeof result.user_points === 'number' && (
                  <div className="wp-total">Total: {formatNumber(result.user_points)} pontos</div>
                )}
                {ticketEarned && (
                  <div className="wp-ticket">
                    <IconTicket size={15} /> Você ganhou um ticket de sorteio!
                  </div>
                )}
              </motion.div>

              {result.detected_label && (
                <div className="win-detail">
                  <div className={`mat-icon ${materialMeta(result.detected_material).iconClass}`} style={{ width: 38, height: 38 }}>
                    <span style={{ fontSize: 18 }}>{materialMeta(result.detected_material).emoji}</span>
                  </div>
                  <div className="grow">
                    <div className="wd-tt">Material identificado</div>
                    <div className="wd-v">{result.detected_label}</div>
                  </div>
                  {typeof result.confidence === 'number' && (
                    <div className="chip" style={{ background: 'var(--green-50)' }}>
                      {Math.round(result.confidence * 100)}%
                    </div>
                  )}
                </div>
              )}
            </StateWrap>
          )}

          {/* REJECTED */}
          {status === 'rejected' && (
            <StateWrap key="rejected">
              <motion.div
                className="session-emoji red"
                initial={{ x: 0 }}
                animate={{ x: [0, -10, 10, -7, 7, 0] }}
                transition={{ duration: 0.5 }}
              >
                <IconX size={48} />
              </motion.div>
              <h1 className="session-title">Algo deu errado</h1>
              <p className="session-sub">
                A lixeira não conseguiu validar o descarte. Sem pontos desta vez.
              </p>

              <div className="fail-reasons">
                <div className="fr-h">Pode ter acontecido o seguinte:</div>
                <ul>
                  <li>O material não é reciclável neste ponto</li>
                  <li>O item não foi identificado com clareza</li>
                  <li>Mais de um objeto foi descartado de uma vez</li>
                </ul>
              </div>
            </StateWrap>
          )}

          {/* INTERRUPTED */}
          {status === 'interrupted' && (
            <StateWrap key="interrupted">
              <div className="session-emoji gray">
                <IconAlert size={44} />
              </div>
              <h1 className="session-title">Sessão interrompida</h1>
              <p className="session-sub">
                {errorReason
                  ? `A conexão com a lixeira foi encerrada (${errorReason}).`
                  : 'A conexão com a lixeira foi encerrada.'}
              </p>
            </StateWrap>
          )}

          {/* ERROR */}
          {status === 'error' && (
            <StateWrap key="error">
              <div className="session-emoji red">
                <IconAlert size={44} />
              </div>
              <h1 className="session-title">Não foi possível conectar</h1>
              <p className="session-sub">
                Não conseguimos abrir a sessão com a lixeira. Tente escanear novamente.
              </p>
            </StateWrap>
          )}
        </AnimatePresence>

        {/* Botão de simulação (apenas no modo demonstração, com a máquina pronta) */}
        {isMock && status === 'ready' && (
          <div className="demo-sim">
            <div className="center" style={{ flexDirection: 'column' }}>
              <span className="demo-tag">
                <IconSparkles size={13} /> modo demonstração
              </span>
            </div>
            <Button onClick={simulateDiscard} icon={<IconRefresh size={19} />}>
              Simular descarte
            </Button>
          </div>
        )}

        {/* Ações por estado */}
        <div className="session-actions">
          {(status === 'success' || status === 'rejected') && (
            <>
              <Button onClick={recycleAgain} icon={<IconRefresh size={19} />}>
                Reciclar novamente
              </Button>
              <Button variant="ghost" onClick={exit}>
                Voltar ao início
              </Button>
            </>
          )}

          {status === 'interrupted' && (
            <>
              <Button onClick={() => navigate('/scan', { replace: true })} icon={<IconScan size={19} />}>
                Escanear de novo
              </Button>
              <Button variant="ghost" onClick={exit}>
                Voltar ao início
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <Button onClick={() => navigate('/scan', { replace: true })} icon={<IconScan size={19} />}>
                Tentar escanear
              </Button>
              <Button variant="ghost" onClick={exit}>
                Voltar ao início
              </Button>
            </>
          )}

          {status === 'ready' && !isMock && (
            <Button variant="ghost" onClick={exit}>
              Encerrar sessão
            </Button>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

function StateWrap({ children }) {
  return (
    <motion.div
      className="session-body"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
