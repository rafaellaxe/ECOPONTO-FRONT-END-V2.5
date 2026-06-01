import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './components/Toast.jsx'
import { AppShell } from './components/AppShell.jsx'
import { ProtectedRoute, PublicOnlyRoute } from './routes/ProtectedRoute.jsx'

import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import RecoverEmail from './pages/auth/RecoverEmail.jsx'
import RecoverCode from './pages/auth/RecoverCode.jsx'
import RecoverReset from './pages/auth/RecoverReset.jsx'

import Home from './pages/Home.jsx'
import Ranking from './pages/Ranking.jsx'
import Rewards from './pages/Rewards.jsx'
import Activities from './pages/Activities.jsx'
import Points from './pages/Points.jsx'
import PointsExplained from './pages/PointsExplained.jsx'
import Profile from './pages/Profile.jsx'
import ProfileEdit from './pages/ProfileEdit.jsx'
import NotFound from './pages/NotFound.jsx'

import Scan from './pages/scan/Scan.jsx'
import FindMachine from './pages/scan/FindMachine.jsx'
import Session from './pages/scan/Session.jsx'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* raiz → home (redireciona para login se deslogado) */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* públicas (apenas deslogado) */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route path="/recover/email" element={<RecoverEmail />} />
        <Route path="/recover/code" element={<RecoverCode />} />
        <Route path="/recover/reset" element={<RecoverReset />} />

        {/* autenticadas */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/ranking" element={<ProtectedRoute><Ranking /></ProtectedRoute>} />
        <Route path="/ranking/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
        <Route path="/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
        <Route path="/points" element={<ProtectedRoute><Points /></ProtectedRoute>} />
        <Route path="/points/explained" element={<ProtectedRoute><PointsExplained /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />

        {/* scan / sessão (tela cheia) */}
        <Route path="/scan" element={<ProtectedRoute><Scan /></ProtectedRoute>} />
        <Route path="/scan/find" element={<ProtectedRoute><FindMachine /></ProtectedRoute>} />
        <Route path="/session/:sessionId" element={<ProtectedRoute><Session /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell>
          <ToastProvider>
            <AnimatedRoutes />
          </ToastProvider>
        </AppShell>
      </AuthProvider>
    </BrowserRouter>
  )
}
