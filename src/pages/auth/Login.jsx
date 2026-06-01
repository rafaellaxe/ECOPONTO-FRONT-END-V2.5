import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageTransition } from '../../components/PageTransition.jsx'
import logoUrl from '../../assets/logo.svg'
import { Button } from '../../components/Button.jsx'
import { Field, PasswordField } from '../../components/Field.jsx'
import { IconMail, IconLock } from '../../components/Icons.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../components/Toast.jsx'
import { ApiError } from '../../lib/api.js'
import { USE_MOCK } from '../../lib/env.js'

export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/home'

  const [email, setEmail] = useState(USE_MOCK ? 'joao.teste@ecoponto.com.br' : '')
  const [password, setPassword] = useState(USE_MOCK ? 'secret' : '')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  function validate() {
    const e = {}
    if (!email.trim()) e.email = 'Informe seu e-mail'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'E-mail inválido'
    if (!password) e.password = 'Informe sua senha'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit() {
    if (loading) return
    if (!validate()) return
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate(from, { replace: true })
    } catch (err) {
      const msg =
        err instanceof ApiError && err.status === 401
          ? 'E-mail ou senha incorretos'
          : err?.message || 'Não foi possível entrar'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="auth">
        <div className="auth-inner">
          <div className="auth-hero">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <img src={logoUrl} alt="EcoPonto" width={104} height={118} style={{ display: 'block' }} />
            </motion.div>
            <h1 className="auth-title">Bem-vindo de volta</h1>
            <p className="auth-sub">Recicle, ganhe pontos e suba no ranking.</p>
          </div>

          <div className="auth-card">
            <div className="auth-form">
              <Field
                label="E-mail"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="voce@email.com"
                icon={<IconMail size={19} />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              <PasswordField
                label="Senha"
                autoComplete="current-password"
                placeholder="••••••••"
                icon={<IconLock size={19} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                error={errors.password}
              />
              <div className="forgot-row">
                <Link to="/recover/email" className="btn-link">
                  Esqueci minha senha
                </Link>
              </div>
              <Button onClick={onSubmit} loading={loading}>
                Entrar
              </Button>
            </div>

            <div className="or-divider" style={{ margin: '18px 0' }}>
              ou
            </div>
            <Button variant="google" onClick={() => toast.show('Login social em breve')}>
              <GoogleGlyph /> Continuar com Google
            </Button>
          </div>

          <div className="auth-foot">
            Não tem uma conta? <Link to="/register">Criar conta</Link>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

function GoogleGlyph() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 4.75 12 4.75Z" />
    </svg>
  )
}
