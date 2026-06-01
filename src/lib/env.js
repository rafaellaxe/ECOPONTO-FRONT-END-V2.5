// Configuracao central de ambiente.
// Variaveis VITE_* sao embutidas em tempo de build pelo Vite.

const RAW_API = import.meta.env.VITE_API_URL

export const API_URL = (RAW_API || 'http://localhost:8000').replace(/\/+$/, '')

// Deriva a URL do WebSocket a partir da URL HTTP da API.
export const WS_BASE = API_URL.replace(/^http/i, 'ws')

// Modo demo: usa dados simulados (mock) e simula o minigame, sem back-end.
// Ligado explicitamente via VITE_USE_MOCK=true.
export const USE_MOCK = String(import.meta.env.VITE_USE_MOCK ?? '').toLowerCase() === 'true'

export const IS_DEV = import.meta.env.DEV
