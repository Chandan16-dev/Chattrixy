import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight } from 'lucide-react'
import useChatStore from '../../store/useChatStore'
import { useNavigate } from 'react-router-dom'

const GENDERS = [
  { id: 'any',    label: '🌍 Any' },
  { id: 'male',   label: '👦 Male' },
  { id: 'female', label: '👧 Female' },
]

const AGE_GROUPS = [
  { id: '18-25', label: '18–25' },
  { id: '26-35', label: '26–35' },
  { id: '36+',   label: '36+' },
]

function PreChatModal({ isOpen, onClose }) {
  const setPrefs = useChatStore((s) => s.setPrefs)
  const startChat = useChatStore((s) => s.startChat)
  const userPrefs = useChatStore((s) => s.userPrefs)
  const navigate = useNavigate()

  const [gender, setGender] = useState(userPrefs.gender || 'any')
  const [ageGroup, setAgeGroup] = useState(userPrefs.ageGroup)
  const [showError, setShowError] = useState(false)

  const handleStart = useCallback(() => {
    if (!ageGroup) {
      setShowError(true)
      return
    }
    setShowError(false)
    setPrefs({ gender, ageGroup })
    startChat()
    onClose()
    navigate('/chat')
  }, [gender, ageGroup, setPrefs, startChat, onClose, navigate])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Chat preferences"
        >
          <motion.div
            className="glass"
            initial={{ opacity: 0, y: 80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '480px',
              padding: '2rem',
              position: 'relative',
            }}
          >
            {/* Close */}
            <button
              className="btn btn-ghost"
              onClick={onClose}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '0.4rem',
                borderRadius: '50%',
              }}
            >
              <X size={18} aria-hidden="true" />
            </button>

            {/* Header */}
            <div style={{ marginBottom: '1.75rem' }}>
              <h2
                className="heading-lg"
                style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}
              >
                Quick setup
              </h2>
              <p style={{ color: 'var(--c-muted)', fontSize: '0.9rem' }}>
                Optional — we never store this.
              </p>
            </div>

            {/* Gender */}
            <section style={{ marginBottom: '1.5rem' }}>
              <p
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--c-muted)',
                  marginBottom: '0.75rem',
                }}
              >
                I am
              </p>
              <div
                role="group"
                aria-label="Gender selection"
                style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
              >
                {GENDERS.map((g) => (
                  <button
                    key={g.id}
                    className={`pill ${gender === g.id ? 'active' : ''}`}
                    onClick={() => setGender(g.id)}
                    aria-pressed={gender === g.id}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Age Group */}
            <section style={{ marginBottom: '2rem' }}>
              <p
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: 'var(--c-muted)',
                  marginBottom: '0.75rem',
                }}
              >
                Age group
              </p>
              <div
                role="group"
                aria-label="Age group selection"
                style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
              >
                {AGE_GROUPS.map((a) => (
                  <button
                    key={a.id}
                    className={`pill ${ageGroup === a.id ? 'active' : ''}`}
                    onClick={() => {
                      const next = ageGroup === a.id ? null : a.id
                      setAgeGroup(next)
                      if (next) setShowError(false)
                    }}
                    aria-pressed={ageGroup === a.id}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Validation message */}
            {showError && (
              <p
                role="alert"
                style={{
                  marginBottom: '0.625rem',
                  fontSize: '0.78rem',
                  color: '#f87171',
                  textAlign: 'center',
                }}
              >
                ⚠️ Please select an age group to continue.
              </p>
            )}

            {/* CTA */}
            <button
              className="btn btn-cta"
              onClick={handleStart}
              aria-label="Start chatting"
              aria-disabled={!ageGroup}
              style={{
                width: '100%',
                fontSize: '1rem',
                opacity: ageGroup ? 1 : 0.55,
                cursor: ageGroup ? 'pointer' : 'not-allowed',
              }}
            >
              Start Chatting <ArrowRight size={18} aria-hidden="true" />
            </button>

            <p
              style={{
                marginTop: '1rem',
                textAlign: 'center',
                fontSize: '0.75rem',
                color: 'var(--c-muted)',
              }}
            >
              By continuing you agree to our{' '}
              <a href="#" style={{ color: 'var(--c-accent)', textDecoration: 'none' }}>
                Terms
              </a>
              . You must be 18+.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PreChatModal
