import React, { useState, useRef, useCallback } from 'react'
import { Send, SkipForward } from 'lucide-react'

/**
 * Bottom input bar layout:
 * [ Next ] [ textarea ] [ Send ]
 *
 * Props:
 *  onSend(text)  — called when user submits a message
 *  onNext()      — called when user clicks Next / skip
 *  disabled      — disables the textarea + send (not Next)
 *  status        — connection status string for placeholder copy
 */
function MessageInput({ onSend, onNext, disabled, status }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const handleSend = useCallback(() => {
    if (!value.trim() || disabled) return
    onSend(value)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.focus()
    }
  }, [value, disabled, onSend])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e) => {
    const el = e.currentTarget
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
    setValue(el.value)
  }

  const placeholder =
    status === 'connecting'
      ? 'Finding a stranger…'
      : status === 'disconnected'
      ? 'Press Next to start chatting'
      : 'Type a message… (Enter to send)'

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.625rem',
        alignItems: 'flex-end',
        padding: '0.75rem 0.875rem',
        borderTop: '1px solid var(--c-border)',
        background: 'var(--c-surface)',
        flexShrink: 0,
      }}
    >
      {/* ── Next Button (left) ─────────────────────── */}
      <button
        className="btn btn-next"
        onClick={onNext}
        aria-label="Skip to next stranger"
        style={{
          padding: '0 1rem',
          fontSize: '0.875rem',
          height: '44px',
          flexShrink: 0,
          borderRadius: '0.75rem',
          gap: '0.375rem',
          whiteSpace: 'nowrap',
        }}
      >
        <SkipForward size={15} aria-hidden="true" />
        Next
      </button>

      {/* ── Message Textarea (center) ─────────────── */}
      <label htmlFor="message-input" className="sr-only">
        Type your message
      </label>
      <textarea
        id="message-input"
        ref={textareaRef}
        className="chat-input"
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        aria-label="Chat message input"
        aria-disabled={disabled}
        style={{ minHeight: '44px', flex: 1 }}
      />

      {/* ── Send Button (right) ───────────────────── */}
      <button
        className="btn btn-primary"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        style={{
          padding: '0',
          width: '44px',
          height: '44px',
          borderRadius: '0.75rem',
          flexShrink: 0,
          opacity: disabled || !value.trim() ? 0.4 : 1,
          cursor: disabled || !value.trim() ? 'not-allowed' : 'pointer',
          transition: 'opacity 0.2s, transform 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Send size={17} aria-hidden="true" />
      </button>
    </div>
  )
}

export default React.memo(MessageInput)
