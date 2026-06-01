// Cliente HTTP central do EcoPonto.
// - Anexa Authorization: Bearer <access_token>
// - Renova access_token automaticamente em 401 (uma vez)
// - Em modo demo, roteia para o mock

import { API_URL, USE_MOCK } from './env.js'
import { mockRequest } from './mock.js'

const LS = {
  access: 'ecoponto.access_token',
  refresh: 'ecoponto.refresh_token',
  user: 'ecoponto.user',
}

export const tokenStore = {
  get access() {
    return localStorage.getItem(LS.access)
  },
  get refresh() {
    return localStorage.getItem(LS.refresh)
  },
  get user() {
    try {
      return JSON.parse(localStorage.getItem(LS.user) || 'null')
    } catch {
      return null
    }
  },
  setSession({ access_token, refresh_token, user }) {
    if (access_token) localStorage.setItem(LS.access, access_token)
    if (refresh_token) localStorage.setItem(LS.refresh, refresh_token)
    if (user) localStorage.setItem(LS.user, JSON.stringify(user))
  },
  setAccess(token) {
    if (token) localStorage.setItem(LS.access, token)
  },
  setUser(user) {
    if (user) localStorage.setItem(LS.user, JSON.stringify(user))
  },
  clear() {
    localStorage.removeItem(LS.access)
    localStorage.removeItem(LS.refresh)
    localStorage.removeItem(LS.user)
  },
}

export class ApiError extends Error {
  constructor(status, detail) {
    super(detail || 'Erro na requisição')
    this.status = status
    this.detail = detail
  }
}

let onUnauthorized = null
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn
}

let refreshing = null
async function tryRefresh() {
  const rt = tokenStore.refresh
  if (!rt) return false
  if (!refreshing) {
    refreshing = (async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: rt }),
        })
        if (!res.ok) return false
        const json = await res.json()
        if (json.access_token) {
          tokenStore.setAccess(json.access_token)
          return true
        }
        return false
      } catch {
        return false
      } finally {
        refreshing = null
      }
    })()
  }
  return refreshing
}

/**
 * Requisicao central.
 * @param {string} path  ex.: '/api/home/summary'
 * @param {object} opts  { method, body, auth, isForm, _retry }
 */
export async function request(path, opts = {}) {
  const { method = 'GET', body, auth = true, isForm = false, _retry = false } = opts

  // ----- MOCK -----
  if (USE_MOCK) {
    try {
      return await mockRequest(path, { method, body })
    } catch (e) {
      throw new ApiError(e.status || 500, e.detail || e.message)
    }
  }

  // ----- REAL -----
  const headers = {}
  if (!isForm) headers['Content-Type'] = 'application/json'
  if (auth && tokenStore.access) headers['Authorization'] = `Bearer ${tokenStore.access}`

  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: isForm ? body : body != null ? JSON.stringify(body) : undefined,
    })
  } catch (networkErr) {
    throw new ApiError(0, 'Não foi possível conectar ao servidor.')
  }

  // 401 -> tenta refresh uma vez
  if (res.status === 401 && auth && !_retry) {
    const ok = await tryRefresh()
    if (ok) {
      return request(path, { ...opts, _retry: true })
    }
    tokenStore.clear()
    if (onUnauthorized) onUnauthorized()
    throw new ApiError(401, 'Sessão expirada. Faça login novamente.')
  }

  let json = null
  const text = await res.text()
  if (text) {
    try {
      json = JSON.parse(text)
    } catch {
      json = { detail: text }
    }
  }

  if (!res.ok) {
    const detail = (json && (json.detail || json.message)) || `Erro ${res.status}`
    throw new ApiError(res.status, typeof detail === 'string' ? detail : 'Erro na requisição')
  }

  return json
}

// ============================================================
// Endpoints
// ============================================================
export const api = {
  // ---- Auth ----
  login: (email, password) => request('/api/auth/login', { method: 'POST', auth: false, body: { email, password } }),
  register: (payload) => request('/api/auth/register', { method: 'POST', auth: false, body: payload }),
  logout: (refresh_token) => request('/api/auth/logout', { method: 'POST', auth: false, body: { refresh_token } }),
  forgotPassword: (email) => request('/api/auth/password/forgot', { method: 'POST', auth: false, body: { email } }),
  resendCode: (email) => request('/api/auth/password/resend-code', { method: 'POST', auth: false, body: { email } }),
  verifyCode: (email, code) =>
    request('/api/auth/password/verify-code', { method: 'POST', auth: false, body: { email, code } }),
  resetPassword: (reset_token, new_password, confirm_password) =>
    request('/api/auth/password/reset', {
      method: 'POST',
      auth: false,
      body: { reset_token, new_password, confirm_password },
    }),

  // ---- User ----
  me: () => request('/api/users/me'),
  updateMe: (payload) => request('/api/users/me', { method: 'PATCH', body: payload }),

  // ---- Home / Points ----
  home: () => request('/api/home/summary'),
  points: () => request('/api/points/summary'),

  // ---- Rankings ----
  rankingSummary: () => request('/api/rankings/summary'),
  rankingList: (limit = 5, offset = 0) => request(`/api/rankings/list?limit=${limit}&offset=${offset}`),

  // ---- Activities ----
  activities: (period = 'month') => request(`/api/activities/summary?period=${period}`),

  // ---- Session ----
  createSession: (key) => request('/api/session/create', { method: 'POST', body: { key } }),
}
