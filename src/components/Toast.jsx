import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IconCheck, IconAlert, IconX } from './Icons.jsx'

const ToastContext = createContext(null)

let _id = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    if (timers.current[id]) {
      clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }, [])

  const push = useCallback(
    (message, type = 'default', duration = 3200) => {
      const id = ++_id
      setToasts((list) => [...list, { id, message, type }])
      timers.current[id] = setTimeout(() => dismiss(id), duration)
      return id
    },
    [dismiss]
  )

  const toast = {
    show: (m, d) => push(m, 'default', d),
    success: (m, d) => push(m, 'ok', d),
    error: (m, d) => push(m, 'err', d),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-host">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className={`toast ${t.type === 'ok' ? 'ok' : t.type === 'err' ? 'err' : ''}`}
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => dismiss(t.id)}
            >
              {t.type === 'ok' ? (
                <IconCheck size={18} />
              ) : t.type === 'err' ? (
                <IconAlert size={18} />
              ) : (
                <IconX size={16} style={{ opacity: 0 }} />
              )}
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de <ToastProvider>')
  return ctx
}
