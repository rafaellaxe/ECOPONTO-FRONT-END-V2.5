import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageTransition } from '../components/PageTransition.jsx'
import { TopBar, Avatar } from '../components/Chrome.jsx'
import { Button } from '../components/Button.jsx'
import { Field } from '../components/Field.jsx'
import { IconUser, IconPhone, IconCalendar, IconTarget } from '../components/Icons.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../lib/api.js'
import { useToast } from '../components/Toast.jsx'

function toDateInput(v) {
  if (!v) return ''
  return String(v).slice(0, 10)
}

export default function ProfileEdit() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user, updateUser } = useAuth()

  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    birth_date: toDateInput(user?.birth_date),
    monthly_goal_kg: user?.monthly_goal_kg ?? '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const fullName = `${form.first_name} ${form.last_name}`.trim() || 'Reciclador'

  function validate() {
    const e = {}
    if (!form.first_name.trim()) e.first_name = 'Obrigatório'
    if (!form.last_name.trim()) e.last_name = 'Obrigatório'
    if (form.monthly_goal_kg !== '' && Number(form.monthly_goal_kg) < 0) e.monthly_goal_kg = 'Valor inválido'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSave() {
    if (loading) return
    if (!validate()) return
    setLoading(true)
    // Monta apenas os campos preenchidos / alterados.
    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
    }
    payload.phone = form.phone.trim()
    if (form.birth_date) payload.birth_date = form.birth_date
    if (form.monthly_goal_kg !== '') payload.monthly_goal_kg = Number(form.monthly_goal_kg)

    try {
      const updated = await api.updateMe(payload)
      // Sincroniza o contexto com a resposta (ou com o payload, se a API não devolver o objeto).
      updateUser(updated && typeof updated === 'object' ? updated : payload)
      toast.success('Perfil atualizado!')
      navigate('/profile')
    } catch (err) {
      toast.error(err?.message || 'Não foi possível salvar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageTransition>
      <div className="screen-scroll">
        <TopBar title="Editar perfil" back to="/profile" />

        <div className="profile-pad">
          <div className="profile-head" style={{ paddingBottom: 0 }}>
            <Avatar name={fullName} src={user?.avatar_url} size={88} />
            <div className="profile-name" style={{ fontSize: 18 }}>
              {fullName}
            </div>
          </div>

          <div className="profile-form">
            <div className="form-row-2">
              <Field
                label="Nome"
                placeholder="João"
                icon={<IconUser size={18} />}
                value={form.first_name}
                onChange={set('first_name')}
                error={errors.first_name}
              />
              <Field
                label="Sobrenome"
                placeholder="Silva"
                value={form.last_name}
                onChange={set('last_name')}
                error={errors.last_name}
              />
            </div>
            <Field
              label="Telefone"
              type="tel"
              inputMode="tel"
              placeholder="(00) 90000-0000"
              icon={<IconPhone size={18} />}
              value={form.phone}
              onChange={set('phone')}
            />
            <Field
              label="Data de nascimento"
              type="date"
              icon={<IconCalendar size={18} />}
              value={form.birth_date}
              onChange={set('birth_date')}
            />
            <Field
              label="Meta mensal (kg)"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.5"
              placeholder="10"
              icon={<IconTarget size={18} />}
              value={form.monthly_goal_kg}
              onChange={set('monthly_goal_kg')}
              error={errors.monthly_goal_kg}
              hint={!errors.monthly_goal_kg ? 'Quantos kg você quer reciclar por mês' : undefined}
            />

            <div className="stack gap-8" style={{ marginTop: 6 }}>
              <Button onClick={onSave} loading={loading}>
                Salvar alterações
              </Button>
              <Button variant="ghost" onClick={() => navigate('/profile')}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
