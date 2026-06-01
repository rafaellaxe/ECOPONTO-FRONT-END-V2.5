import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Html5Qrcode } from 'html5-qrcode'
import { PageTransition } from '../../components/PageTransition.jsx'
import { TopBar } from '../../components/Chrome.jsx'
import { Button, Spinner } from '../../components/Button.jsx'
import { IconCamera, IconMapPin, IconQr } from '../../components/Icons.jsx'
import { api, ApiError } from '../../lib/api.js'
import { useToast } from '../../components/Toast.jsx'
import { USE_MOCK } from '../../lib/env.js'

const READER_ID = 'qr-reader'

export default function Scan() {
  const navigate = useNavigate()
  const toast = useToast()

  // intro | scanning | denied | creating
  const [stage, setStage] = useState('intro')
  const [manualKey, setManualKey] = useState(USE_MOCK ? 'ecoponto-teste' : '')

  const scannerRef = useRef(null)
  const runningRef = useRef(false)
  const handledRef = useRef(false)

  const stopScanner = useCallback(async () => {
    const s = scannerRef.current
    if (s && runningRef.current) {
      try {
        await s.stop()
      } catch {
        /* noop */
      }
      try {
        await s.clear()
      } catch {
        /* noop */
      }
    }
    runningRef.current = false
  }, [])

  const createSession = useCallback(
    async (key) => {
      if (handledRef.current) return
      handledRef.current = true
      setStage('creating')
      await stopScanner()
      try {
        const res = await api.createSession(key)
        navigate(`/session/${res.session_id}`, {
          replace: true,
          state: { ws_token: res.ws_token, started_at: res.started_at },
        })
      } catch (err) {
        let msg = 'Não foi possível conectar à lixeira'
        if (err instanceof ApiError) {
          if (err.status === 400) msg = 'QR Code inválido'
          else if (err.status === 409) msg = 'Esta máquina já está processando outro descarte'
          else if (err.message) msg = err.message
        }
        toast.error(msg)
        handledRef.current = false
        setStage('intro')
      }
    },
    [navigate, stopScanner, toast]
  )

  const startScanner = useCallback(async () => {
    setStage('scanning')
    handledRef.current = false
    // espera o nó do leitor existir no DOM
    await new Promise((r) => setTimeout(r, 60))
    try {
      const scanner = new Html5Qrcode(READER_ID, { verbose: false })
      scannerRef.current = scanner
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 }, aspectRatio: 1 },
        (decodedText) => {
          createSession(decodedText)
        },
        () => {
          /* leitura por frame sem QR: ignora */
        }
      )
      runningRef.current = true
    } catch (err) {
      runningRef.current = false
      setStage('denied')
    }
  }, [createSession])

  // limpeza ao desmontar
  useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [stopScanner])

  function submitManual() {
    const key = manualKey.trim()
    if (!key) {
      toast.error('Digite a chave da lixeira')
      return
    }
    createSession(key)
  }

  return (
    <PageTransition>
      <div className="scan-screen">
        <TopBar
          back
          to="/home"
          onBack={async () => {
            await stopScanner()
            navigate('/home')
          }}
          right={
            <button
              className="icon-btn"
              style={{ background: 'rgba(255,255,255,0.12)', border: 'none', color: '#fff' }}
              onClick={() => navigate('/scan/find')}
              aria-label="Onde encontrar"
            >
              <IconMapPin size={19} />
            </button>
          }
        />

        <AnimatePresence mode="wait">
          {/* INTRO / permissão */}
          {stage === 'intro' && (
            <motion.div
              key="intro"
              className="cam-perm"
              style={{ color: '#fff' }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="cp-ic"
                style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }}
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ repeat: Infinity, duration: 2.4 }}
              >
                <IconQr size={40} />
              </motion.div>
              <h2 style={{ color: '#fff' }}>Escanear lixeira</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)' }}>
                Aponte a câmera para o QR Code na lixeira inteligente para iniciar a reciclagem.
              </p>
              <div className="cp-actions">
                <Button onClick={startScanner} icon={<IconCamera size={20} />}>
                  Ativar câmera
                </Button>
              </div>
            </motion.div>
          )}

          {/* SCANNING */}
          {stage === 'scanning' && (
            <motion.div
              key="scanning"
              className="scan-cam"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div id={READER_ID} />
              <div className="scan-overlay">
                <div className="scan-reticle">
                  <span className="tl" />
                  <span className="tr" />
                  <span className="bl" />
                  <span className="br" />
                  <motion.div
                    className="scan-laser"
                    animate={{ top: ['12%', '88%', '12%'] }}
                    transition={{ repeat: Infinity, duration: 2.6, ease: 'easeInOut' }}
                  />
                </div>
              </div>
              <div className="scan-hint">Posicione o QR Code dentro da moldura</div>
            </motion.div>
          )}

          {/* DENIED */}
          {stage === 'denied' && (
            <motion.div
              key="denied"
              className="cam-perm"
              style={{ color: '#fff' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="cp-ic" style={{ background: 'rgba(255,56,60,0.15)', color: '#FF6A6E' }}>
                <IconCamera size={38} />
              </div>
              <h2 style={{ color: '#fff' }}>Câmera indisponível</h2>
              <p style={{ color: 'rgba(255,255,255,0.75)' }}>
                Não conseguimos acessar a câmera. Verifique as permissões do navegador ou use a
                chave manual abaixo.
              </p>
              <div className="cp-actions">
                <Button variant="ghost" onClick={startScanner}>
                  Tentar novamente
                </Button>
              </div>
            </motion.div>
          )}

          {/* CREATING */}
          {stage === 'creating' && (
            <motion.div
              key="creating"
              className="cam-perm"
              style={{ color: '#fff' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="spin" style={{ color: '#36D17F' }}>
                <Spinner size={34} color="#36D17F" />
              </span>
              <h2 style={{ color: '#fff', marginTop: 16 }}>Conectando…</h2>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>Iniciando sessão com a lixeira</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entrada manual (sempre disponível, exceto durante a criação) */}
        {stage !== 'creating' && (
          <div className="scan-foot">
            <div className="scan-manual">
              <span className="sm-label">
                {USE_MOCK ? 'Modo demonstração · use a chave de teste' : 'Ou digite a chave da lixeira'}
              </span>
              <input
                value={manualKey}
                onChange={(e) => setManualKey(e.target.value)}
                placeholder="ex.: ecoponto-teste"
                onKeyDown={(e) => e.key === 'Enter' && submitManual()}
              />
              <Button onClick={submitManual}>Conectar manualmente</Button>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
