import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageTransition } from '../components/PageTransition.jsx'
import { Button } from '../components/Button.jsx'
import { LogoMark } from '../components/Logo.jsx'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <PageTransition>
      <div className="nf-screen">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 18 }}
        >
          <LogoMark size={58} />
        </motion.div>
        <div className="nf-big">404</div>
        <h2>Página não encontrada</h2>
        <p className="muted small" style={{ maxWidth: 280 }}>
          O endereço que você tentou acessar não existe ou foi movido.
        </p>
        <div style={{ width: '100%', maxWidth: 280, marginTop: 18 }}>
          <Button onClick={() => navigate('/home')}>Voltar ao início</Button>
        </div>
      </div>
    </PageTransition>
  )
}
