import React, { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const TypingIndicator = memo(({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="typing"
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 4, scale: 0.95 }}
          transition={{ duration: 0.18 }}
          style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.5rem' }}
          role="status"
          aria-label="Stranger is typing"
        >
          <div style={{ maxWidth: '70%' }}>
            <p
              style={{
                fontSize: '0.7rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                marginBottom: '0.25rem',
                color: 'var(--c-stranger)',
              }}
            >
              Stranger
            </p>
            <div
              className="bubble-stranger"
              style={{
                padding: '0.625rem 1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <span className="typing-dot" aria-hidden="true" />
              <span className="typing-dot" aria-hidden="true" />
              <span className="typing-dot" aria-hidden="true" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

TypingIndicator.displayName = 'TypingIndicator'
export default TypingIndicator
