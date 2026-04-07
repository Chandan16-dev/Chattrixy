import React, { useEffect, useRef, useCallback, Suspense, lazy } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Crown, Sun, Moon } from 'lucide-react'
import useChatStore from '../store/useChatStore'
import { useSocket } from '../hooks/useSocket'
import ChatBubble from '../components/chat/ChatBubble'
import TypingIndicator from '../components/chat/TypingIndicator'
import ConnectionStatus from '../components/chat/ConnectionStatus'
import MessageInput from '../components/chat/MessageInput'
import AdBanner from '../components/monetization/AdBanner'
import VipBadge from '../components/monetization/VipBadge'
import { MessageCircle } from 'lucide-react'

const UpgradeModal = lazy(() => import('../components/modals/UpgradeModal'))

function ChatPage() {
  const navigate = useNavigate()
  const scrollRef = useRef(null)

  // ── Store slices ─────────────────────────────────
  const status            = useChatStore((s) => s.status)
  const messages          = useChatStore((s) => s.messages)
  const isTyping          = useChatStore((s) => s.isTyping)
  const isVip             = useChatStore((s) => s.isVip)
  const theme             = useChatStore((s) => s.theme)
  const strangerDisconnected = useChatStore((s) => s.strangerDisconnected)
  const sendMessage       = useChatStore((s) => s.sendMessage)
  const nextStranger      = useChatStore((s) => s.nextStranger)
  const disconnect        = useChatStore((s) => s.disconnect)
  const toggleTheme       = useChatStore((s) => s.toggleTheme)
  const openUpgradeModal  = useChatStore((s) => s.openUpgradeModal)

  // Redirect to landing if no session has been started
  // (e.g. user navigates directly to /chat)
  useEffect(() => {
    if (status === 'disconnected' && !useChatStore.getState().sessionId) {
      navigate('/', { replace: true })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const sessionId         = useChatStore((s) => s.sessionId)

  const { startSearch, sendMessage: emitMessage, skip: emitSkip } = useSocket()

  // Whenever a new session starts (initial connect or skip), trigger a search on the backend
  useEffect(() => {
    if (sessionId && startSearch) {
      startSearch(useChatStore.getState().userPrefs)
    }
    // EXTREMELY CRITICAL: do NOT add startSearch to dependencies, otherwise it restarts search on EVERY state change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  // Auto-scroll to the latest message / typing indicator
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  // Only allow sending when connected and stranger is still present
  const isInputDisabled = status !== 'connected' || strangerDisconnected

  const handleSend = useCallback(
    (text) => {
      if (!isInputDisabled) {
        sendMessage(text)
        emitMessage(text)
      }
    },
    [isInputDisabled, sendMessage, emitMessage]
  )

  const handleHome = () => {
    disconnect()
    navigate('/')
  }

  const handleNext = useCallback(() => {
    emitSkip()
    nextStranger()
  }, [emitSkip, nextStranger])

  return (
    <>
      <div className="mesh-bg" aria-hidden="true" />

      <Suspense fallback={null}>
        <UpgradeModal />
      </Suspense>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          maxWidth: '900px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {/* ── Header ──────────────────────────────────── */}
        <header
          className="glass"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            borderRadius: 0,
            borderLeft: 'none',
            borderRight: 'none',
            borderTop: 'none',
            flexShrink: 0,
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageCircle size={20} style={{ color: 'var(--c-primary)' }} aria-hidden="true" />
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: '1.1rem',
                letterSpacing: '-0.02em',
              }}
            >
              Chatt<span className="text-gradient">rixy</span>
            </span>
            {isVip && (
              <span style={{ marginLeft: '0.25rem' }}>
                <VipBadge small />
              </span>
            )}
          </div>

          {/* Right-side controls — Next button is now in the input bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Connection status pill */}
            <ConnectionStatus
              status={status}
              strangerDisconnected={strangerDisconnected}
            />

            {/* VIP upgrade button (non-VIP only) */}
            {!isVip && (
              <button
                className="btn"
                onClick={openUpgradeModal}
                aria-label="Upgrade to VIP"
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.8rem',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 12px rgba(245,158,11,0.35)',
                }}
              >
                <Crown size={14} aria-hidden="true" />
                VIP
              </button>
            )}

            {/* Dark / light toggle */}
            <button
              className="btn btn-ghost"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{ padding: '0.5rem', borderRadius: '50%' }}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Home */}
            <button
              className="btn btn-ghost"
              onClick={handleHome}
              aria-label="Go to home"
              style={{ padding: '0.5rem', borderRadius: '50%' }}
            >
              <Home size={16} />
            </button>
          </div>
        </header>

        {/* ── Ad Banner (non-VIP) ──────────────────────── */}
        {!isVip && (
          <div style={{ padding: '0.5rem 1rem 0', flexShrink: 0 }}>
            <AdBanner height={52} />
          </div>
        )}

        {/* ── Chat Area ────────────────────────────────── */}
        <main
          ref={scrollRef}
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem 1rem 0.5rem',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Empty state — shown while there are no messages */}
          <AnimatePresence mode="wait">
            {messages.length === 0 && (
              <motion.div
                key={status}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  gap: '1rem',
                  color: 'var(--c-muted)',
                  textAlign: 'center',
                }}
              >
                {status === 'connecting' && (
                  <>
                    <div
                      className="spinner"
                      style={{ width: 28, height: 28, borderWidth: 2.5 }}
                      aria-hidden="true"
                    />
                    <p style={{ fontSize: '1rem', fontWeight: 500 }}>Finding a stranger…</p>
                    <p style={{ fontSize: '0.8rem' }}>Looking around the world for you</p>
                  </>
                )}

                {status === 'connected' && (
                  <>
                    <div style={{ fontSize: '2.5rem' }} aria-hidden="true">👋</div>
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--c-text)' }}>
                      You're connected!
                    </p>
                    <p style={{ fontSize: '0.875rem' }}>Say hi to your stranger.</p>
                  </>
                )}

                {status === 'disconnected' && (
                  <>
                    <div style={{ fontSize: '2.5rem' }} aria-hidden="true">💬</div>
                    <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--c-text)' }}>
                      Ready to chat
                    </p>
                    <p style={{ fontSize: '0.875rem' }}>
                      Press <strong style={{ color: 'var(--c-next)' }}>Next</strong> to find a stranger.
                    </p>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Message bubbles */}
          <div role="list" aria-label="Messages">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
          </div>

          {/* Typing indicator */}
          <TypingIndicator isVisible={isTyping} />

          {/* Stranger-left notice */}
          <AnimatePresence>
            {strangerDisconnected && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                role="alert"
                style={{
                  textAlign: 'center',
                  padding: '0.75rem',
                  marginTop: '0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--c-muted)',
                  background: 'var(--c-surface2)',
                  borderRadius: '0.75rem',
                  border: '1px solid var(--c-border)',
                }}
              >
                🚪 Stranger has disconnected.{' '}
                <button
                  onClick={nextStranger}
                  style={{
                    color: 'var(--c-next)',
                    fontWeight: 600,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                  }}
                >
                  Find someone new
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* ── Bottom Input Bar: [ Next ] [ textarea ] [ Send ] ── */}
        <MessageInput
          onSend={handleSend}
          onNext={handleNext}
          disabled={isInputDisabled}
          status={status}
        />
      </div>
    </>
  )
}

export default ChatPage
