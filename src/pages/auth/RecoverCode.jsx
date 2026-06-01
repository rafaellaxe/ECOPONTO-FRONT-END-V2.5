import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { PageTransition } from '../../components/PageTransition.jsx'
import { TopBar } from '../../components/Chrome.jsx'
import { Button } from '../../components/Button.jsx'
import { api, ApiError } from '../../lib/api.js'
import { useToast } from '../../components/Toast.jsx'

const LEN = 6

export default function RecoverCode() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const email = location.state?.email

  const [digits, setDigits] = useState(Array(LEN).fill(''))
  const [loading, setLoading] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(45)
  const inputs = useRef([])

  useEffect(() => {
    if (secondsLeft <= 0) return
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [secondsLeft])

  useEffect(() => {
    inputs.current[0]?.focus()
  }, [])

  // Sem e-mail no state: o usuário entrou direto na URL. Volta ao começo.
  if (!email) return <Navigate to="/recover/email" replace />

  const code = digits.join('')

  function setAt(i, val) {
    const v = val.replace(/\D/g, '').slice(-1)
    setDigits((d) => {
      const next = [...d]
      next[i] = v
      return next
    })
    if (v && i < LEN - 1) inputs.current[i + 1]?.focus()
  }

  function onKey(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus()
    }
    if (e.key === 'Enter') onSubmit()
  }

  function onPaste(e) {
    const txt = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, LEN)
    if (!txt) return
    e.preventDefault()
    const next = Array(LEN).fill('')
    txt.split('').forEach((c, idx) => (next[idx] = c))
    setDigits(next)
    inputs.current[Math.min(txt.length, LEN - 1)]?.focus()
  }

  async function onSubmit() {
    if (loading) return
    if (code.length < LEN) {
      toast.error('Digite os 6 dígitos do código')
      return
    }
    setLoading(true)
    try {
      const res = await api.verifyCode(email, code)
      navigate('/recover/reset', { state: { email, reset_token: res.reset_token } })
    } catch (err) {
      const msg =
        err instanceof ApiError && (err.status === 400 || err.status === 422)
          ? 'Código inválido ou expirado'
          : err?.message || 'Não foi possível verificar o código'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  async function resend() {
    if (secondsLeft > 0) return
    try {
      await api.resendCode(email)
      toast.success('Novo código enviado')
      setSecondsLeft(45)
      setDigits(Array(LEN).fill(''))
      inputs.current[0]?.focus()
    } catch (err) {
      toast.error(err?.message || 'Não foi possível reenviar')
    }
  }

  return (
    <PageTransition>
      <div className="auth">
        <div className="auth-back">
          <TopBar back to="/recover/email" />
        </div>
        <div className="auth-inner" style={{ paddingTop: 4 }}>
          <div className="auth-hero" style={{ padding: '14px 0 24px' }}>
            <h1 className="auth-title">Verifique seu e-mail</h1>
            <p className="auth-sub">
              Digite o código de 6 dígitos enviado para <b style={{ color: 'var(--navy)' }}>{email}</b>.
            </p>
          </div>

          <div className="auth-card">
            <div className="auth-form">
              <div className="code-inputs" onPaste={onPaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputs.current[i] = el)}
                    inputMode="numeric"
                    maxLength={1}
                    className={d ? 'filled' : ''}
                    value={d}
                    onChange={(e) => setAt(i, e.target.value)}
                    onKeyDown={(e) => onKey(i, e)}
                    aria-label={`Dígito ${i + 1}`}
                  />
                ))}
              </div>
              <Button onClick={onSubmit} loading={loading} style={{ marginTop: 4 }}>
                Verificar
              </Button>
              <div className="resend-row">
                {secondsLeft > 0 ? (
                  <span>Reenviar código em {secondsLeft}s</span>
                ) : (
                  <button className="btn-link" onClick={resend}>
                    Reenviar código
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
