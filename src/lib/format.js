// Helpers de formatacao (pt-BR).

export function formatNumber(n) {
  if (n == null || isNaN(n)) return '0'
  return new Intl.NumberFormat('pt-BR').format(Math.round(n))
}

export function formatKg(n) {
  if (n == null || isNaN(n)) return '0'
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(n)
}

export function formatDecimal(n, digits = 1) {
  if (n == null || isNaN(n)) return '0'
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  }).format(n)
}

// Data relativa amigavel: "agora", "há 5 min", "ontem", "20 mai"
export function relativeDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const now = new Date()
  const diff = (now - d) / 1000 // segundos
  if (diff < 60) return 'agora'
  if (diff < 3600) return `há ${Math.floor(diff / 60)} min`
  if (diff < 86400 && now.getDate() === d.getDate()) {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }
  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'ontem'
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')
}

export function formatBirthDate(iso) {
  if (!iso) return ''
  const [y, m, d] = String(iso).split('-')
  if (!y) return iso
  return `${d}/${m}/${y}`
}

// Metadados de material para UI.
export const MATERIALS = {
  plastic_bottle: { label: 'Garrafa PET', short: 'Plástico', iconClass: 'mat-plastic', emoji: '🧴' },
  metal_can: { label: 'Lata de Alumínio', short: 'Metal', iconClass: 'mat-metal', emoji: '🥫' },
  unknown: { label: 'Não identificado', short: '—', iconClass: 'mat-metal', emoji: '❓' },
}

export function materialMeta(key) {
  return MATERIALS[key] || MATERIALS.unknown
}

export function initialsOf(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '·'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
