import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageTransition } from '../../components/PageTransition.jsx'
import { TopBar } from '../../components/Chrome.jsx'
import { Button } from '../../components/Button.jsx'
import { Field } from '../../components/Field.jsx'
import { IconMail } from '../../components/Icons.jsx'
import { api } from '../../lib/api.js'
import { useToast } from '../../components/Toast.jsx'

export default function RecoverEmail() {
  const navigate = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit() {
    if (loading) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Digite um e-mail válido')
      return
    }
    setError('')
    setLoading(true)
    try {
      await api.forgotPassword(email.trim())
      toast.success('Enviamos um código para o seu e-mail')
      navigate('/recover/code', { state: { email: email.trim() } })
    } catch (err) {
      // Por segurança, a API costuma responder igual mesmo se o e-mail não existir.
      toast.show('Se o e-mail existir, enviaremos um código')
      navigate('/recover/code', { state: { email: email.trim() } })
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="auth">
        <div className="auth-back">
          <TopBar back to="/login" />
        </div>
        <div className="auth-inner" style={{ paddingTop: 4 }}>
          <div className="auth-hero" style={{ padding: '14px 0 22px', alignItems: 'flex-start', textAlign: 'left' }}>
            <div className="status-emoji" style={{ background: 'var(--green-50)', color: 'var(--green-600)', margin: 0 }}>
              <IconMail size={34} />
            </div>
            <h1 className="auth-title" style={{ marginTop: 18 }}>
              Esqueceu a senha?
            </h1>
            <p className="auth-sub" style={{ maxWidth: 320 }}>
              Informe o e-mail da sua conta e enviaremos um código de verificação.
            </p>
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
                onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                error={error}
              />
              <Button onClick={onSubmit} loading={loading}>
                Enviar código
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
