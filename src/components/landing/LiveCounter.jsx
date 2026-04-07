import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLiveCounter } from '../../hooks/useLiveCounter'
import { Users } from 'lucide-react'

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

function LiveCounter() {
  const count = useLiveCounter(49250, 1800)
  const [prevCount, setPrevCount] = useState(count)
  const [dir, setDir] = useState(1)

  useEffect(() => {
    setDir(count > prevCount ? 1 : -1)
    setPrevCount(count)
  }, [count]) // eslint-disable-line

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1.125rem',
        borderRadius: '2rem',
        background: 'rgba(34,197,94,0.08)',
        border: '1px solid rgba(34,197,94,0.2)',
        marginBottom: '1.5rem',
        fontSize: '0.9rem',
      }}
      aria-live="polite"
      aria-label={`${formatCount(count)} users online`}
    >
      {/* Pulsing green dot */}
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: 'var(--c-next)',
          boxShadow: '0 0 8px var(--c-next-glow)',
          display: 'inline-block',
          animation: 'pulse 2s ease-in-out infinite',
        }}
        aria-hidden="true"
      />
      <Users size={14} color="var(--c-next)" aria-hidden="true" />
      <span style={{ fontWeight: 700, color: 'var(--c-next)' }}>
        {formatCount(count)}
      </span>
      <span style={{ color: 'var(--c-muted)', fontSize: '0.85rem' }}>online now</span>
    </div>
  )
}

export default LiveCounter
