import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageTransition } from '../components/PageTransition.jsx'
import { TopBar, Avatar } from '../components/Chrome.jsx'
import { Spinner } from '../components/Button.jsx'
import { IconGift, IconTrophy } from '../components/Icons.jsx'
import { useAsync } from '../lib/useAsync.js'
import { api } from '../lib/api.js'
import { formatNumber } from '../lib/format.js'
import { useAuth } from '../context/AuthContext.jsx'

const PAGE = 8

export default function Ranking() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data: summary, loading: loadingSummary } = useAsync(() => api.rankingSummary(), [])

  const [items, setItems] = useState([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const loadingRef = useRef(false)
  const sentinel = useRef(null)

  const selfId = summary?.current_user?.user_id || user?.id

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setLoadingMore(true)
    try {
      const res = await api.rankingList(PAGE, offset)
      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.user_id))
        const fresh = (res.items || []).filter((it) => !seen.has(it.user_id))
        return [...prev, ...fresh]
      })
      setOffset(offset + PAGE)
      setHasMore(!!res.has_more)
    } catch {
      setHasMore(false)
    } finally {
      loadingRef.current = false
      setLoadingMore(false)
    }
  }, [offset, hasMore])

  // primeira página
  useEffect(() => {
    loadMore()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // scroll infinito
  useEffect(() => {
    const el = sentinel.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { rootMargin: '120px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [loadMore])

  const podium = summary?.podium || []
  const p1 = podium.find((p) => p.position === 1)
  const p2 = podium.find((p) => p.position === 2)
  const p3 = podium.find((p) => p.position === 3)

  return (
    <PageTransition>
      <div className="screen-scroll">
        <div className="rank-hero">
          <TopBar
            title="Ranking"
            right={
              <motion.button
                className="icon-btn"
                style={{ background: 'rgba(255,255,255,0.16)', border: 'none', color: '#fff' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/ranking/rewards')}
                aria-label="Recompensas"
              >
                <IconGift size={20} />
              </motion.button>
            }
          />

          {loadingSummary ? (
            <div className="center" style={{ height: 150 }}>
              <span className="spin" style={{ color: '#fff' }}>
                <Spinner size={28} color="#fff" />
              </span>
            </div>
          ) : (
            <Podium p1={p1} p2={p2} p3={p3} />
          )}
        </div>

        <div className="rank-list">
          {items.map((it, i) => (
            <RankRow key={it.user_id} item={it} me={it.user_id === selfId} index={i} />
          ))}

          {/* sentinela do scroll infinito */}
          <div ref={sentinel} />

          {loadingMore && (
            <div className="center" style={{ padding: 14, color: 'var(--green-500)' }}>
              <span className="spin">
                <Spinner size={22} />
              </span>
            </div>
          )}

          {!hasMore && items.length > 0 && (
            <div className="center-text tiny muted" style={{ padding: '10px 0 4px' }}>
              Você chegou ao fim do ranking 🌱
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}

function Podium({ p1, p2, p3 }) {
  return (
    <div className="podium">
      <PodiumCol entry={p2} place="2" badge="silver" stand="p2" delay={0.15} />
      <PodiumCol entry={p1} place="1" badge="gold" stand="p1" delay={0} crown />
      <PodiumCol entry={p3} place="3" badge="bronze" stand="p3" delay={0.25} />
    </div>
  )
}

function PodiumCol({ entry, place, badge, stand, delay, crown }) {
  if (!entry) return <div className="podium-col" />
  const size = place === '1' ? 72 : 58
  return (
    <motion.div
      className="podium-col"
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + delay, type: 'spring', stiffness: 220, damping: 20 }}
    >
      <div className="podium-ava-wrap">
        {crown && <div className="podium-crown">👑</div>}
        <Avatar className="podium-ava" name={entry.name} src={entry.avatar_url} size={size} />
        <div className={`podium-badge ${badge}`}>{place}</div>
      </div>
      <div className="podium-name">{entry.name}</div>
      <div className="podium-pts">{formatNumber(entry.points)} pts</div>
      <div className={`podium-stand ${stand}`}>{place}</div>
    </motion.div>
  )
}

function RankRow({ item, me, index }) {
  return (
    <motion.div
      className={`rank-row ${me ? 'me' : ''}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
    >
      <div className="rr-pos">
        {item.position <= 3 ? ['🥇', '🥈', '🥉'][item.position - 1] : item.position}
      </div>
      <Avatar name={item.name} src={item.avatar_url} size={38} />
      <div className="rr-name">
        {item.name}
        {me && <IconTrophy size={13} style={{ marginLeft: 6, verticalAlign: '-2px', color: 'var(--green-600)' }} />}
      </div>
      <div className="rr-pts">
        {formatNumber(item.points)}
        <small>pts</small>
      </div>
    </motion.div>
  )
}
