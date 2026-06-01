import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, tokenStore, setUnauthorizedHandler } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => tokenStore.user)
  const [ready, setReady] = useState(false)

  // Logout forcado quando o refresh falha (401).
  useEffect(() => {
    setUnauthorizedHandler(() => {
      tokenStore.clear()
      setUser(null)
    })
  }, [])

  // Ao montar: se ha sessao salva, sincroniza perfil em segundo plano.
  useEffect(() => {
    let alive = true
    async function boot() {
      if (tokenStore.access) {
        try {
          const me = await api.me()
          if (alive && me) {
            tokenStore.setUser(me)
            setUser(me)
          }
        } catch {
          /* mantem usuario do storage; 401 ja trata logout */
        }
      }
      if (alive) setReady(true)
    }
    boot()
    return () => {
      alive = false
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await api.login(email, password)
    tokenStore.setSession(res)
    setUser(res.user)
    return res.user
  }, [])

  const register = useCallback((payload) => api.register(payload), [])

  const logout = useCallback(async () => {
    try {
      if (tokenStore.refresh) await api.logout(tokenStore.refresh)
    } catch {
      /* best-effort */
    }
    tokenStore.clear()
    setUser(null)
  }, [])

  const updateUser = useCallback((partial) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...partial }
      tokenStore.setUser(next)
      return next
    })
  }, [])

  // Atualiza pontos/tickets apos um descarte aceito.
  const applyResult = useCallback((res) => {
    if (!res) return
    const patch = {}
    if (typeof res.user_points === 'number') patch.points = res.user_points
    if (typeof res.user_tickets === 'number') patch.tickets = res.user_tickets
    if (Object.keys(patch).length) updateUser(patch)
  }, [updateUser])

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthenticated: !!tokenStore.access && !!user,
      login,
      register,
      logout,
      updateUser,
      applyResult,
    }),
    [user, ready, login, register, logout, updateUser, applyResult]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return ctx
}
