import { useCallback, useEffect, useRef, useState } from 'react'
import { WS_BASE, USE_MOCK } from './env.js'
import { mockGenerateDiscard, mockApplyPoints } from './mock.js'

/**
 * Estados:
 *  connecting | ready | analyzing | success | rejected | interrupted | error | closed
 *
 * Eventos do back-end (WS):
 *  discard_started, discard_finished, session_interrupted
 * Mensagem enviada pelo front:
 *  close_session
 */
export function useSession({ sessionId, wsToken, enabled = true }) {
  const [status, setStatus] = useState('connecting')
  const [result, setResult] = useState(null) // payload do discard_finished
  const [errorReason, setErrorReason] = useState(null)

  const wsRef = useRef(null)
  const userClosedRef = useRef(false)
  const reconnectedRef = useRef(false)
  const statusRef = useRef('connecting')
  const mockTimers = useRef([])

  const setS = useCallback((s) => {
    statusRef.current = s
    setStatus(s)
  }, [])

  // ---------- MODO DEMO ----------
  useEffect(() => {
    if (!enabled || !USE_MOCK) return
    setS('connecting')
    const t = setTimeout(() => setS('ready'), 1300)
    mockTimers.current.push(t)
    return () => {
      mockTimers.current.forEach(clearTimeout)
      mockTimers.current = []
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled])

  const simulateDiscard = useCallback(() => {
    if (!USE_MOCK) return
    if (statusRef.current !== 'ready') return
    setResult(null)
    setS('analyzing')
    const t = setTimeout(() => {
      const d = mockGenerateDiscard()
      const totals = d.accepted ? mockApplyPoints(d.points) : { user_points: undefined, user_tickets: undefined }
      const payload = {
        discard_id: 'mock-' + Date.now(),
        status: d.accepted ? 'accepted' : 'rejected',
        selected_material: d.selected,
        detected_material: d.accepted ? d.selected : 'unknown',
        detected_label: d.accepted ? d.label : 'Não identificado',
        confidence: d.accepted ? 0.85 + Math.random() * 0.13 : 0.3 + Math.random() * 0.2,
        points_awarded: d.points,
        user_points: totals.user_points,
        user_tickets: totals.user_tickets,
      }
      setResult(payload)
      setS(d.accepted ? 'success' : 'rejected')
    }, 2600)
    mockTimers.current.push(t)
  }, [setS])

  // ---------- WEBSOCKET REAL ----------
  useEffect(() => {
    if (!enabled || USE_MOCK) return
    if (!sessionId || !wsToken) {
      setErrorReason('missing_session')
      setS('error')
      return
    }

    userClosedRef.current = false
    reconnectedRef.current = false

    function connect() {
      const url = `${WS_BASE}/api/session/${sessionId}/ws?token=${encodeURIComponent(wsToken)}`
      let ws
      try {
        ws = new WebSocket(url)
      } catch {
        setS('error')
        return
      }
      wsRef.current = ws

      ws.onopen = () => {
        if (statusRef.current === 'connecting') setS('ready')
      }

      ws.onmessage = (ev) => {
        let msg
        try {
          msg = JSON.parse(ev.data)
        } catch {
          return
        }
        switch (msg.type) {
          case 'discard_started':
            setResult(null)
            setS('analyzing')
            break
          case 'discard_finished':
            setResult(msg.data || null)
            setS(msg.data && msg.data.status === 'accepted' ? 'success' : 'rejected')
            break
          case 'session_interrupted':
            setErrorReason((msg.data && msg.data.reason) || 'interrupted')
            setS('interrupted')
            break
          default:
            break
        }
      }

      ws.onerror = () => {
        if (statusRef.current === 'connecting') setS('error')
      }

      ws.onclose = (ev) => {
        const cur = statusRef.current
        if (userClosedRef.current || ev.code === 1000) {
          setS('closed')
          return
        }
        if (ev.code === 1013) {
          // descarte pendente: backend pediu para aguardar; mantem analisando
          return
        }
        if (['success', 'rejected', 'interrupted', 'closed', 'error'].includes(cur)) return
        if (!reconnectedRef.current) {
          // janela curta de reconexao
          reconnectedRef.current = true
          setTimeout(connect, 1500)
        } else {
          setS('interrupted')
        }
      }
    }

    connect()

    return () => {
      const ws = wsRef.current
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        try {
          ws.close()
        } catch {
          /* noop */
        }
      }
      wsRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, sessionId, wsToken])

  // ---------- Acoes ----------
  const closeSession = useCallback(() => {
    userClosedRef.current = true
    if (USE_MOCK) {
      setS('closed')
      return
    }
    const ws = wsRef.current
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({ type: 'close_session' }))
      } catch {
        /* noop */
      }
      // fallback caso o servidor demore a fechar
      setTimeout(() => {
        if (statusRef.current !== 'closed') setS('closed')
      }, 1500)
    } else {
      setS('closed')
    }
  }, [setS])

  const recycleAgain = useCallback(() => {
    setResult(null)
    setS('ready')
  }, [setS])

  return {
    status,
    result,
    errorReason,
    isMock: USE_MOCK,
    closeSession,
    recycleAgain,
    simulateDiscard,
  }
}
