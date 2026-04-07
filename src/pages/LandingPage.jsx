import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, MessageCircle } from 'lucide-react'
import LiveCounter from '../components/landing/LiveCounter'
import TrustBadges from '../components/landing/TrustBadges'
import PreChatModal from '../components/modals/PreChatModal'

const features = [
  { emoji: '🎭', title: 'Anonymous', desc: 'Zero sign-up. No traces. Just conversation.' },
  { emoji: '⚡', title: 'Instant', desc: 'Connect with someone in under 2 seconds.' },
  { emoji: '💬', title: 'Real Talk', desc: 'No bots, no filters. Real people, raw conversations.' },
]

function LandingPage() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      {/* Mesh gradient background */}
      <div className="mesh-bg" aria-hidden="true" />

      {/* Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MessageCircle size={24} style={{ color: 'var(--c-primary)' }} aria-hidden="true" />
          <span
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: '1.25rem',
              letterSpacing: '-0.02em',
            }}
          >
            Chatt<span className="text-gradient">rixy</span>
          </span>
        </div>

        <button
          className="btn btn-ghost"
          onClick={() => setShowModal(true)}
          aria-label="Start chatting"
          style={{ fontSize: '0.875rem' }}
        >
          Start Chatting
        </button>
      </header>

      {/* Main */}
      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '6rem 1.5rem 3rem',
          textAlign: 'center',
        }}
      >
        {/* Hero section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          style={{ maxWidth: '720px', width: '100%' }}
        >
          <LiveCounter />

          <h1 className="heading-xl" style={{ marginBottom: '1.25rem' }}>
            Meet{' '}
            <span className="text-gradient">Strangers.</span>
            <br />
            Have Real{' '}
            <span
              style={{
                position: 'relative',
                display: 'inline-block',
              }}
            >
              Conversations.
              <motion.span
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, var(--c-primary), var(--c-accent))',
                  borderRadius: '2px',
                }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
              />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: 'var(--c-muted)',
              maxWidth: '480px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.7,
            }}
          >
            No signup. No profiles. Just you and a random stranger — talk, laugh,
            connect, or move on. It's that simple.
          </motion.p>

          <motion.button
            className="btn btn-cta"
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            aria-label="Start chatting anonymously"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            Start Chatting <ArrowRight size={20} aria-hidden="true" />
          </motion.button>

          <TrustBadges />
        </motion.section>

        {/* Feature cards */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            maxWidth: '760px',
            width: '100%',
            marginTop: '5rem',
          }}
          aria-label="Features"
        >
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              className="glass"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              whileHover={{ y: -4, boxShadow: '0 12px 40px var(--c-primary-glow)' }}
              style={{ padding: '1.5rem', textAlign: 'left', cursor: 'default' }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }} aria-hidden="true">
                {f.emoji}
              </div>
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.05rem',
                  marginBottom: '0.4rem',
                }}
              >
                {f.title}
              </h2>
              <p style={{ color: 'var(--c-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </motion.article>
          ))}
        </motion.section>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: '1.5rem',
          textAlign: 'center',
          color: 'var(--c-muted)',
          fontSize: '0.8rem',
          borderTop: '1px solid var(--c-border)',
        }}
      >
        © {new Date().getFullYear()} Chattrixy · Talk to strangers, safely.

        <div style={{ marginTop: '0.5rem' }}>
          <Link to="/terms" style={{ marginRight: '10px' }}>Terms</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
      </footer>

      {/* Pre-chat modal */}
      <PreChatModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  )
}

export default LandingPage