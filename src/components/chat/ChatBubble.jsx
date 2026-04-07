import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { formatTime } from '../../utils/cn'

const ChatBubble = memo(({ message }) => {
  const isYou = message.sender === 'you'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={`flex ${isYou ? 'justify-end' : 'justify-start'} mb-2`}
      role="listitem"
    >
      <div style={{ maxWidth: '70%' }}>
        {/* Sender label */}
        <p
          style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: '0.25rem',
            color: isYou ? 'var(--c-you)' : 'var(--c-stranger)',
            textAlign: isYou ? 'right' : 'left',
          }}
        >
          {isYou ? 'You' : 'Stranger'}
        </p>

        {/* Bubble */}
        <div
          className={isYou ? 'bubble-you' : 'bubble-stranger'}
          style={{ padding: '0.625rem 0.875rem', wordBreak: 'break-word' }}
        >
          <p style={{ fontSize: '0.9375rem', lineHeight: 1.5 }}>{message.text}</p>
        </div>

        {/* Timestamp */}
        <p
          style={{
            fontSize: '0.65rem',
            color: 'var(--c-muted)',
            marginTop: '0.25rem',
            textAlign: isYou ? 'right' : 'left',
          }}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </motion.div>
  )
})

ChatBubble.displayName = 'ChatBubble'
export default ChatBubble
