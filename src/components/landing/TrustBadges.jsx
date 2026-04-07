import React from 'react'
import { Lock, Zap, Globe } from 'lucide-react'

const BADGES = [
  { icon: Lock,  label: 'Anonymous',  desc: 'No account needed' },
  { icon: Zap,   label: 'Instant',    desc: 'Connect in seconds' },
  { icon: Globe, label: 'Global',     desc: '190+ countries' },
]

function TrustBadges() {
  return (
    <div
      role="list"
      style={{
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: '2.5rem',
      }}
    >
      {BADGES.map(({ icon: Icon, label, desc }) => (
        <div
          key={label}
          role="listitem"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--c-muted)',
          }}
        >
          <Icon
            size={16}
            aria-hidden="true"
            style={{ color: 'var(--c-accent)', flexShrink: 0 }}
          />
          <span style={{ fontWeight: 600, color: 'var(--c-text)' }}>{label}</span>
          <span aria-label={desc} style={{ display: 'none' }}>{desc}</span>
        </div>
      ))}
    </div>
  )
}

export default TrustBadges
