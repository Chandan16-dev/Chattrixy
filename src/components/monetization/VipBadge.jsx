import React from 'react'
import { Crown } from 'lucide-react'

function VipBadge({ small = false }) {
  return (
    <span
      className="vip-badge"
      role="img"
      aria-label="VIP member"
      style={small ? { padding: '0.15rem 0.5rem', fontSize: '0.65rem' } : {}}
    >
      <Crown
        size={small ? 10 : 12}
        style={{ display: 'inline', marginRight: '3px', verticalAlign: 'middle' }}
        aria-hidden="true"
      />
      VIP
    </span>
  )
}

export default VipBadge
