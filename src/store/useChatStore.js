import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

const useChatStore = create(
  subscribeWithSelector((set, get) => ({
    // ── Connection ──────────────────────────────────
    // Status lifecycle:
    // 'disconnected' → startChat() → 'connecting' → setConnected() [backend] → 'connected'
    // 'connected'    → nextStranger() → 'disconnected' → 'connecting'
    // 'connected'    → strangerLeft() → 'disconnected'
    status: 'disconnected',

    // ── Messages ────────────────────────────────────
    messages: [],
    isTyping: false,

    // ── Session ─────────────────────────────────────
    sessionId: null,
    nextPressCount: 0,
    strangerDisconnected: false,

    // ── User Preferences ────────────────────────────
    userPrefs: {
      gender: null,    // null | 'male' | 'female' | 'any'
      ageGroup: null,  // null | '18-25' | '26-35' | '36+'
    },

    // ── Monetization ────────────────────────────────
    isVip: false,
    showUpgradeModal: false,

    // ── Theme ───────────────────────────────────────
    theme: 'dark',

    // ── Actions ─────────────────────────────────────
    setPrefs: (prefs) => set((s) => ({ userPrefs: { ...s.userPrefs, ...prefs } })),

    /**
     * Called from landing page / pre-chat modal.
     * Transitions: disconnected → connecting
     */
    startChat: () => {
      set({
        status: 'connecting',
        messages: [],
        isTyping: false,
        strangerDisconnected: false,
        sessionId: Math.random().toString(36).slice(2),
      })
    },

    /**
     * Called by real backend when a match is found.
     * Transitions: connecting → connected
     */
    setConnected: () => set({ status: 'connected' }),

    /**
     * Called by real backend when the session ends unexpectedly.
     * Transitions: connected → disconnected
     */
    setDisconnected: () => set({ status: 'disconnected', isTyping: false }),

    /** Called by real backend to show/hide typing indicator */
    setStrangerTyping: (v) => set({ isTyping: v }),

    /**
     * Called by real backend when the peer closes the chat.
     * Transitions: connected → disconnected
     */
    strangerLeft: () =>
      set({
        status: 'disconnected',
        isTyping: false,
        strangerDisconnected: true,
      }),

    // Keep legacy alias for compatibility
    setStrangerDisconnected: (v) =>
      set(v
        ? { status: 'disconnected', isTyping: false, strangerDisconnected: true }
        : { strangerDisconnected: false }
      ),

    /** Append a message sent by the local user */
    sendMessage: (text) => {
      if (!text.trim()) return
      const msg = {
        id: Date.now() + Math.random(),
        sender: 'you',
        text: text.trim(),
        timestamp: new Date(),
      }
      set((s) => ({ messages: [...s.messages, msg] }))
    },

    /** Append a message received from the remote peer (called by backend adapter) */
    receiveMessage: (text) => {
      const msg = {
        id: Date.now() + Math.random(),
        sender: 'stranger',
        text,
        timestamp: new Date(),
      }
      set((s) => ({ messages: [...s.messages, msg], isTyping: false }))
    },

    /**
     * Skip current stranger and look for the next one.
     * Transitions: any → disconnected → connecting
     * The brief 'disconnected' flash gives visual feedback before searching again.
     */
    nextStranger: () => {
      const { nextPressCount, isVip } = get()
      const newCount = nextPressCount + 1

      // Flash disconnected first so the status bar is accurate
      set({
        status: 'disconnected',
        messages: [],
        isTyping: false,
        strangerDisconnected: false,
        nextPressCount: newCount,
      })

      // Show upgrade modal every 3 skips for non-VIP
      const shouldShowUpgrade = !isVip && newCount > 0 && newCount % 3 === 0

      // Move to connecting on the next tick so the 'disconnected' state
      // is rendered at least one frame before the spinner appears.
      // This is pure UI timing — NOT fake backend simulation.
      requestAnimationFrame(() => {
        set({
          status: 'connecting',
          sessionId: Math.random().toString(36).slice(2),
          showUpgradeModal: shouldShowUpgrade,
        })
      })
    },

    /**
     * Go back to landing page — full reset.
     * Transitions: any → disconnected
     */
    disconnect: () => {
      set({
        status: 'disconnected',
        messages: [],
        isTyping: false,
        strangerDisconnected: false,
        sessionId: null,
      })
    },

    upgradeVip: () => set({ isVip: true, showUpgradeModal: false }),
    closeUpgradeModal: () => set({ showUpgradeModal: false }),
    openUpgradeModal: () => set({ showUpgradeModal: true }),

    toggleTheme: () => {
      const next = get().theme === 'dark' ? 'light' : 'dark'
      document.documentElement.setAttribute('data-theme', next)
      localStorage.setItem('chattrixy-theme', next)
      set({ theme: next })
    },

    initTheme: () => {
      const saved = localStorage.getItem('chattrixy-theme') || 'dark'
      document.documentElement.setAttribute('data-theme', saved)
      set({ theme: saved })
    },
  }))
)

export default useChatStore
