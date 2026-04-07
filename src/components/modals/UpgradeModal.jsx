import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Crown, Zap, Shield, Star, SkipForward } from 'lucide-react'
import useChatStore from '../../store/useChatStore'
import VipBadge from '../monetization/VipBadge'

const PLANS = [
  {
    id: 'weekly',
    label: 'Weekly',
    price: '$2.99',
    period: '/week',
    perks: ['No ads', 'Gender filter', 'Priority matching'],
    featured: false,
  },
  {
    id: 'monthly',
    label: 'Monthly',
    price: '$7.99',
    period: '/month',
    perks: ['No ads', 'Gender filter', 'Priority matching', 'VIP badge', 'Unlimited skips'],
    featured: true,
    badge: 'Most Popular',
  },
  {
    id: 'annual',
    label: 'Annual',
    price: '$49.99',
    period: '/year',
    perks: ['Everything in Monthly', '+ Early features', '+ 2 months free'],
    featured: false,
  },
]

const PERK_ICONS = {
  'No ads': Shield,
  'Gender filter': Star,
  'Priority matching': Zap,
  'VIP badge': Crown,
  'Unlimited skips': SkipForward,
}

function UpgradeModal() {
  const showUpgradeModal = useChatStore((s) => s.showUpgradeModal)
  const closeUpgradeModal = useChatStore((s) => s.closeUpgradeModal)
  const upgradeVip = useChatStore((s) => s.upgradeVip)

  return (
    <AnimatePresence>
      {showUpgradeModal && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeUpgradeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Upgrade to VIP"
          style={{ alignItems: 'center' }}
        >
          <motion.div
            className="glass"
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '2rem',
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Close */}
            <button
              className="btn btn-ghost"
              onClick={closeUpgradeModal}
              aria-label="Close upgrade modal"
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                padding: '0.4rem',
                borderRadius: '50%',
              }}
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: '0 4px 24px rgba(245,158,11,0.4)',
                }}
              >
                <Crown size={24} color="white" aria-hidden="true" />
              </div>
              <h2 className="heading-lg" style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>
                Unlock <span className="text-gradient">VIP Access</span>
              </h2>
              <p style={{ color: 'var(--c-muted)', fontSize: '0.9rem' }}>
                Better matches, no interruptions, premium features.
              </p>
            </div>

            {/* Plans */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.75rem',
                marginBottom: '1.5rem',
              }}
            >
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`plan-card ${plan.featured ? 'featured' : ''}`}
                  onClick={upgradeVip}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select ${plan.label} plan at ${plan.price}${plan.period}`}
                  onKeyDown={(e) => e.key === 'Enter' && upgradeVip()}
                >
                  {plan.badge && (
                    <span
                      style={{
                        display: 'inline-block',
                        background: 'linear-gradient(135deg, var(--c-primary), var(--c-accent))',
                        color: 'white',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '2rem',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {plan.badge}
                    </span>
                  )}
                  <p
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--c-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '0.25rem',
                    }}
                  >
                    {plan.label}
                  </p>
                  <p
                    className="heading-lg"
                    style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'baseline', gap: '2px' }}
                  >
                    {plan.price}
                    <span style={{ fontSize: '0.75rem', color: 'var(--c-muted)', fontWeight: 400 }}>
                      {plan.period}
                    </span>
                  </p>
                  <ul
                    style={{
                      marginTop: '0.75rem',
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                    }}
                  >
                    {plan.perks.map((perk) => {
                      const Icon = PERK_ICONS[perk] || Star
                      return (
                        <li
                          key={perk}
                          style={{
                            fontSize: '0.78rem',
                            color: 'var(--c-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <Icon size={12} color="var(--c-accent)" aria-hidden="true" />
                          {perk}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              className="btn btn-cta"
              onClick={upgradeVip}
              style={{ width: '100%' }}
              aria-label="Upgrade to VIP"
            >
              <Crown size={18} aria-hidden="true" />
              Get VIP — Start Free Trial
            </button>

            <p
              style={{
                marginTop: '0.75rem',
                textAlign: 'center',
                fontSize: '0.75rem',
                color: 'var(--c-muted)',
              }}
            >
              Cancel anytime. Secure payment via Stripe.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default UpgradeModal
