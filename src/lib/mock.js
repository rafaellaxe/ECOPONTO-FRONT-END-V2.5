// ============================================================
// MODO DEMO (mock) — espelha o contrato da API FastAPI.
// Permite rodar o front sem back-end. Estado mantido em memoria
// (reseta ao recarregar a pagina).
// ============================================================

const POINTS_PER_TICKET = 10000

// --- Usuario logado (estado mutavel) ---
const me = {
  id: 'me-uuid',
  first_name: 'João',
  last_name: 'Ferreira',
  email: 'joao.teste@ecoponto.com.br',
  phone: '(21) 99999-0592',
  birth_date: '2004-03-18',
  avatar_url: null,
  monthly_goal_kg: 10,
  points: 7450,
  tickets: 0,
}

// --- Outros usuarios para o ranking ---
const others = [
  { name: 'Rafaela Colonese', points: 999999 },
  { name: 'Pedro Rocha', points: 11240 },
  { name: 'Beatriz Lima', points: 9900 },
  { name: 'Carlos Souza', points: 5400 },
  { name: 'Marina Alves', points: 4820 },
  { name: 'Rafael Dias', points: 4310 },
  { name: 'Juliana Costa', points: 3980 },
  { name: 'Lucas Martins', points: 3540 },
  { name: 'Camila Nunes', points: 3120 },
  { name: 'Bruno Teixeira', points: 2870 },
  { name: 'Larissa Gomes', points: 2510 },
  { name: 'Felipe Araújo', points: 2190 },
  { name: 'Sofia Ribeiro', points: 1880 },
  { name: 'Gabriel Pinto', points: 1540 },
  { name: 'Helena Castro', points: 1230 },
  { name: 'Thiago Moreira', points: 980 },
  { name: 'Isabela Freitas', points: 720 },
  { name: 'Mateus Barbosa', points: 540 },
  { name: 'Laura Cardoso', points: 360 },
  { name: 'Daniel Correia', points: 180 },
].map((u, i) => ({ user_id: `u${i + 1}`, avatar_url: null, ...u }))

function rankedList() {
  const all = [...others, { user_id: me.id, name: 'Você', points: me.points, avatar_url: me.avatar_url, _self: true }]
  all.sort((a, b) => b.points - a.points)
  return all.map((u, i) => ({ position: i + 1, ...u }))
}

// --- Atividades simuladas ---
let activitySeq = 1
const baseActivities = [
  { material: 'plastic_bottle', label: 'Garrafa PET', quantity: 5, points_awarded: 450, days_ago: 1 },
  { material: 'metal_can', label: 'Lata de Alumínio', quantity: 3, points_awarded: 330, days_ago: 2 },
  { material: 'plastic_bottle', label: 'Garrafa PET', quantity: 2, points_awarded: 180, days_ago: 4 },
  { material: 'metal_can', label: 'Lata de Alumínio', quantity: 4, points_awarded: 440, days_ago: 7 },
  { material: 'plastic_bottle', label: 'Garrafa PET', quantity: 6, points_awarded: 540, days_ago: 11 },
]
const activities = baseActivities.map((a) => {
  const d = new Date()
  d.setDate(d.getDate() - a.days_ago)
  d.setHours(14, 30, 0, 0)
  return {
    id: `act-${activitySeq++}`,
    material: a.material,
    label: a.label,
    quantity: a.quantity,
    points_awarded: a.points_awarded,
    created_at: d.toISOString(),
  }
})

function prependActivity(material, label, quantity, points) {
  activities.unshift({
    id: `act-${activitySeq++}`,
    material,
    label,
    quantity,
    points_awarded: points,
    created_at: new Date().toISOString(),
  })
}

// --- Util ---
function delay(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function progress() {
  const inCycle = me.points % POINTS_PER_TICKET
  return {
    points: me.points,
    tickets: me.tickets,
    points_per_ticket: POINTS_PER_TICKET,
    progress_percentage: Number(((inCycle / POINTS_PER_TICKET) * 100).toFixed(1)),
    points_until_next_ticket: POINTS_PER_TICKET - inCycle,
  }
}

// Aplica pontos ganhos (atualiza tickets).
export function mockApplyPoints(points) {
  me.points += points
  me.tickets = Math.floor(me.points / POINTS_PER_TICKET)
  return { user_points: me.points, user_tickets: me.tickets }
}

export function getMockUser() {
  return { ...me }
}

// --- "Roteador" do mock: imita as respostas da API ---
export async function mockRequest(path, { method = 'GET', body } = {}) {
  await delay(420 + Math.random() * 350)
  const url = path.split('?')[0]
  const query = Object.fromEntries(new URLSearchParams(path.split('?')[1] || ''))
  const data = body || {}

  // ---- AUTH ----
  if (url === '/api/auth/login' && method === 'POST') {
    if (data.password && String(data.email || '').includes('@')) {
      return {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user: {
          id: me.id,
          first_name: me.first_name,
          last_name: me.last_name,
          email: data.email,
          points: me.points,
          tickets: me.tickets,
        },
      }
    }
    throw apiError(401, 'Email ou senha inválidos.')
  }

  if (url === '/api/auth/register' && method === 'POST') {
    return {
      id: 'new-uuid',
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      points: 0,
      tickets: 0,
    }
  }

  if (url === '/api/auth/refresh' && method === 'POST') {
    return { access_token: 'mock-access-token-renewed' }
  }
  if (url === '/api/auth/logout' && method === 'POST') {
    return { message: 'Logout realizado com sucesso.' }
  }
  if (url === '/api/auth/password/forgot' && method === 'POST') {
    return { message: 'Código enviado, se o email estiver cadastrado.' }
  }
  if (url === '/api/auth/password/resend-code' && method === 'POST') {
    return { message: 'Novo código enviado, se o email estiver cadastrado.' }
  }
  if (url === '/api/auth/password/verify-code' && method === 'POST') {
    if (String(data.code || '').length === 6) return { reset_token: 'mock-reset-token' }
    throw apiError(400, 'Código inválido ou expirado.')
  }
  if (url === '/api/auth/password/reset' && method === 'POST') {
    if (data.new_password !== data.confirm_password) throw apiError(400, 'As senhas não conferem.')
    return { message: 'Senha alterada com sucesso.' }
  }

  // ---- USER ----
  if (url === '/api/users/me' && method === 'GET') {
    return { ...me }
  }
  if (url === '/api/users/me' && method === 'PATCH') {
    Object.assign(me, data)
    return { ...me }
  }

  // ---- HOME ----
  if (url === '/api/home/summary' && method === 'GET') {
    const list = rankedList()
    const self = list.find((u) => u._self)
    const monthly = activities.reduce((s, a) => s + a.quantity, 0)
    return {
      user: { first_name: me.first_name },
      summary: {
        points: me.points,
        tickets: me.tickets,
        monthly_items_count: monthly,
        monthly_estimated_kg: 6.8,
        monthly_goal_kg: me.monthly_goal_kg,
        goal_percentage: Math.min(100, Math.round((6.8 / me.monthly_goal_kg) * 100)),
      },
      recent_activities: activities.slice(0, 3),
      ranking: { position: self ? self.position : null },
    }
  }

  // ---- POINTS ----
  if (url === '/api/points/summary' && method === 'GET') {
    return progress()
  }

  // ---- RANKINGS ----
  if (url === '/api/rankings/summary' && method === 'GET') {
    const list = rankedList()
    const podium = list.slice(0, 3)
    const idx = list.findIndex((u) => u._self)
    const current = list[idx]
    const near = list.slice(Math.max(0, idx - 1), idx + 2)
    return {
      podium: podium.map(strip),
      current_user: strip(current),
      near_current_user: near.map(strip),
    }
  }
  if (url === '/api/rankings/list' && method === 'GET') {
    const list = rankedList().map(strip)
    const limit = Number(query.limit || 5)
    const offset = Number(query.offset || 0)
    const items = list.slice(offset, offset + limit)
    return { items, limit, offset, has_more: offset + limit < list.length }
  }

  // ---- ACTIVITIES ----
  if (url === '/api/activities/summary' && method === 'GET') {
    const period = query.period || 'month'
    const labels = { week: 'esta semana', month: 'este mês', year: 'este ano', all: 'desde o início' }
    if (!labels[period]) throw apiError(400, 'Período inválido.')
    const byMat = {}
    for (const a of activities) {
      if (!byMat[a.material]) byMat[a.material] = { material: a.material, label: a.label, quantity: 0, points: 0 }
      byMat[a.material].quantity += a.quantity
      byMat[a.material].points += a.points_awarded
    }
    const kgPer = { plastic_bottle: 0.08, metal_can: 0.015 }
    const materials = Object.values(byMat).map((m) => ({
      ...m,
      estimated_kg: Number((m.quantity * (kgPer[m.material] || 0.03)).toFixed(2)),
    }))
    const totalKg = materials.reduce((s, m) => s + m.estimated_kg, 0)
    return {
      period,
      period_label: labels[period],
      materials,
      impact: {
        estimated_co2_kg: Number((totalKg * 2.1).toFixed(2)),
        co2_equivalent: 'Equivale a plantar 1 árvore(s)',
        estimated_energy_kwh: Number((totalKg * 6).toFixed(1)),
        energy_equivalent: 'Mantém uma TV ligada por 21 dia(s)',
        estimated_water_l: Number((totalKg * 7).toFixed(1)),
        water_equivalent: 'Equivale a 2 banho(s) de 10 minutos',
      },
      history: activities.slice(0, 20),
    }
  }

  // ---- SESSION ----
  if (url === '/api/session/create' && method === 'POST') {
    if (!data.key) throw apiError(400, 'QR Code inválido.')
    return {
      session_id: 'mock-session-' + Date.now(),
      ws_token: 'mock-ws-token',
      started_at: new Date().toISOString(),
    }
  }

  throw apiError(404, `Rota mock não encontrada: ${method} ${url}`)
}

function strip(u) {
  if (!u) return null
  return { position: u.position, user_id: u.user_id, name: u.name, points: u.points, avatar_url: u.avatar_url }
}

function apiError(status, detail) {
  const err = new Error(detail)
  err.status = status
  err.detail = detail
  return err
}

// Gera um descarte simulado (para o minigame em modo demo).
export function mockGenerateDiscard() {
  const isPlastic = Math.random() > 0.5
  const selected = isPlastic ? 'plastic_bottle' : 'metal_can'
  const label = isPlastic ? 'Garrafa PET' : 'Lata de Alumínio'
  // ~78% de chance de acerto
  const accepted = Math.random() < 0.78
  const points = accepted ? (isPlastic ? 90 : 110) : 0
  return { selected, label, accepted, points }
}

export const MOCK_POINTS_PER_TICKET = POINTS_PER_TICKET
export { prependActivity }
