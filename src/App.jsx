import React, { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useChatStore from './store/useChatStore'

// Lazy load pages for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage'))
const ChatPage = lazy(() => import('./pages/ChatPage'))

function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--c-muted)',
        gap: '0.75rem',
        flexDirection: 'column',
      }}
    >
      <div className="spinner" style={{ width: 28, height: 28, borderWidth: 2.5 }} />
      <p style={{ fontSize: '0.875rem' }}>Loading…</p>
    </div>
  )
}

function App() {
  const initTheme = useChatStore((s) => s.initTheme)

  // Initialize theme from localStorage on mount
  useEffect(() => {
    initTheme()
  }, []) // eslint-disable-line

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
