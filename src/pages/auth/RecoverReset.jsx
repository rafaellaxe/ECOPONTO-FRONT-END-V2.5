import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { PageTransition } from '../../components/PageTransition.jsx'
import { TopBar } from '../../components/Chrome.jsx'
import { Button } from '../../components/Button.jsx'
import { PasswordField } from '../../components/Field.jsx'
import { IconLock } from '../../components/Icons.jsx'
import { api } from '../../lib/api.js'
import { useToast } from '../../components/Toast.jsx'

export default function RecoverReset() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const resetToken = location.state?.reset_token

  const [pwd, setPwd] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  if (!resetToken) return <Navigate to="/recover/email" replace />

  function validate() {
    const e = {}
    if (pwd.length < 8) e.pwd = 'Mínimo de 8 caracteres'
    if (confirm !== pwd) e.confirm = 'As senhas não coincidem'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit() {
    if (loading) return
    if (!validate()) return
    setLoading(true)
    try {
      await api.resetPassword(resetToken, pwd, confirm)
      toast.success('Senha redefinida! Faça login.')
      navigate('/login', { replace: true })
    } catch (err) {
      toast.error(err?.message || 'Não foi possível redefinir a senha')
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
          <div className="auth-hero" style={{ padding: '14px 0 24px', alignItems: 'flex-start', textAlign: 'left' }}>
            <div className="status-emoji" style={{ background: 'var(--green-50)', color: 'var(--green-600)', margin: 0 }}>
              <IconLock size={32} />
            </div>
            <h1 className="auth-title" style={{ marginTop: 18 }}>
              Nova senha
            </h1>
            <p className="auth-sub">Crie uma senha forte para proteger sua conta.</p>
          </div>

          <div className="auth-card">
            <div className="auth-form">
              <PasswordField
                label="Nova senha"
                autoComplete="new-password"
                placeholder="Mínimo de 8 caracteres"
                icon={<IconLock size={19} />}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                error={errors.pwd}
              />
              <PasswordField
                label="Confirmar senha"
                autoComplete="new-password"
                placeholder="Repita a senha"
                icon={<IconLock size={19} />}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
                error={errors.confirm}
              />
              <Button onClick={onSubmit} loading={loading} style={{ marginTop: 4 }}>
                Redefinir senha
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
