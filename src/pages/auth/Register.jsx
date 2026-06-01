import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageTransition } from '../../components/PageTransition.jsx'
import { TopBar } from '../../components/Chrome.jsx'
import { LogoMark } from '../../components/Logo.jsx'
import { Button } from '../../components/Button.jsx'
import { Field, PasswordField } from '../../components/Field.jsx'
import { IconMail, IconLock, IconUser, IconPhone, IconCalendar } from '../../components/Icons.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../components/Toast.jsx'

export default function Register() {
  const { register, login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    birth_date: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  function validate() {
    const e = {}
    if (!form.first_name.trim()) e.first_name = 'Obrigatório'
    if (!form.last_name.trim()) e.last_name = 'Obrigatório'
    if (!form.email.trim()) e.email = 'Informe seu e-mail'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'E-mail inválido'
    if (!form.password) e.password = 'Crie uma senha'
    else if (form.password.length < 8) e.password = 'Mínimo de 8 caracteres'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit() {
    if (loading) return
    if (!validate()) return
    setLoading(true)
    try {
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        password: form.password,
      }
      if (form.phone.trim()) payload.phone = form.phone.trim()
      if (form.birth_date) payload.birth_date = form.birth_date
      await register(payload)
      // Tenta entrar automaticamente após o cadastro.
      try {
        await login(form.email.trim(), form.password)
        toast.success('Conta criada com sucesso!')
        navigate('/home', { replace: true })
      } catch {
        toast.success('Conta criada! Faça login para continuar.')
        navigate('/login', { replace: true })
      }
    } catch (err) {
      toast.error(err?.message || 'Não foi possível criar a conta')
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
          <div className="auth-hero" style={{ padding: '8px 0 18px' }}>
            <LogoMark size={54} />
            <h1 className="auth-title" style={{ marginTop: 16 }}>
              Criar conta
            </h1>
            <p className="auth-sub">É rápido. Comece a reciclar e pontuar hoje.</p>
          </div>

          <div className="auth-card">
            <div className="auth-form">
              <div className="form-row-2">
                <Field
                  label="Nome"
                  placeholder="João"
                  autoComplete="given-name"
                  icon={<IconUser size={18} />}
                  value={form.first_name}
                  onChange={set('first_name')}
                  error={errors.first_name}
                />
                <Field
                  label="Sobrenome"
                  placeholder="Silva"
                  autoComplete="family-name"
                  value={form.last_name}
                  onChange={set('last_name')}
                  error={errors.last_name}
                />
              </div>
              <Field
                label="E-mail"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="voce@email.com"
                icon={<IconMail size={18} />}
                value={form.email}
                onChange={set('email')}
                error={errors.email}
              />
              <Field
                label="Telefone (opcional)"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="(00) 90000-0000"
                icon={<IconPhone size={18} />}
                value={form.phone}
                onChange={set('phone')}
              />
              <Field
                label="Data de nascimento (opcional)"
                type="date"
                icon={<IconCalendar size={18} />}
                value={form.birth_date}
                onChange={set('birth_date')}
              />
              <PasswordField
                label="Senha"
                autoComplete="new-password"
                placeholder="Mínimo de 8 caracteres"
                icon={<IconLock size={18} />}
                value={form.password}
                onChange={set('password')}
                error={errors.password}
                hint={!errors.password ? 'Use ao menos 8 caracteres' : undefined}
              />
              <Button onClick={onSubmit} loading={loading} style={{ marginTop: 4 }}>
                Criar conta
              </Button>
            </div>
          </div>

          <div className="auth-foot">
            Já tem conta? <Link to="/login">Entrar</Link>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
