import React, { memo } from 'react'
import { cn } from '../../utils/cn'

/**
 * Status pill shown in the chat header.
 *
 * Truth table:
 *  'disconnected' → red dot, "Disconnected"
 *  'connecting'   → spinner, "Connecting…"
 *  'connected'    → green dot, "Connected"
 *  strangerDisconnected overrides label to "Stranger left"
 */
const STATUS_CONFIG = {
  disconnected: { label: 'Disconnected', dot: 'disconnected', showSpinner: false },
  connecting:   { label: 'Connecting…',  dot: null,           showSpinner: true  },
  connected:    { label: 'Connected',    dot: 'connected',    showSpinner: false },
}

const ConnectionStatus = memo(({ status, strangerDisconnected }) => {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.disconnected

  const displayLabel = strangerDisconnected && status === 'disconnected'
    ? 'Stranger left'
    : config.label

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Connection status: ${displayLabel}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.4rem 0.875rem',
        borderRadius: '2rem',
        background: 'var(--c-surface2)',
        border: '1px solid var(--c-border)',
        fontSize: '0.8rem',
        fontWeight: 600,
        color: 'var(--c-muted)',
        transition: 'all 0.2s ease',
      }}
    >
      {config.showSpinner ? (
        <span
          className="spinner"
          aria-hidden="true"
          style={{ width: '12px', height: '12px', borderWidth: '1.5px' }}
        />
      ) : (
        <span className={cn('status-dot', config.dot)} aria-hidden="true" />
      )}
      {displayLabel}
    </div>
  )
})

ConnectionStatus.displayName = 'ConnectionStatus'
export default ConnectionStatus
