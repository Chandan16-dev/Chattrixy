/**
 * useSocket.js — Frontend Socket.IO adapter
 *
 * Responsibilities:
 *  - Manages a single socket connection per ChatPage mount
 *  - Bridges socket events → Zustand store actions
 *  - Exposes clean imperative methods for ChatPage to call
 *
 * Socket events (server → client):
 *   waiting              → user is in queue (status already 'connecting')
 *   matched { roomId }   → setConnected()
 *   message { text }     → receiveMessage(text)
 *   partner_typing bool  → setStrangerTyping(bool)
 *   partner_disconnected → strangerLeft()
 *   error { message }    → logged (non-fatal)
 *
 * Methods returned:
 *   startSearch(prefs)   → emit 'start_search'
 *   sendMessage(text)    → emit 'message'
 *   sendTyping(bool)     → emit 'typing'
 *   skip()               → emit 'skip'
 */

import { useEffect, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import useChatStore from '../store/useChatStore'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

export function useSocket() {
  /** @type {React.MutableRefObject<import('socket.io-client').Socket|null>} */
  const socketRef = useRef(null)

  useEffect(() => {
    // Create socket — does NOT auto-connect yet
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    socketRef.current = socket

    // ── Lifecycle ───────────────────────────────────
    socket.on('connect', () => {
      console.log('[Socket] Connected ✓', socket.id)
    })

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected —', reason)
    })

    socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message)
    })

    // ── Server → Store ───────────────────────────────
    // User is in queue — store status is already 'connecting', nothing extra needed
    socket.on('waiting', () => {
      console.log('[Socket] Waiting in queue…')
    })

    // Matched with a partner
    socket.on('matched', ({ roomId } = {}) => {
      console.log('[Socket] Matched! Room:', roomId)
      useChatStore.getState().setConnected()
    })

    // Received a message from partner
    socket.on('message', ({ text } = {}) => {
      if (text) useChatStore.getState().receiveMessage(text)
    })

    // Partner typing state
    socket.on('partner_typing', (isTyping) => {
      useChatStore.getState().setStrangerTyping(Boolean(isTyping))
    })

    // Partner left / disconnected / skipped us
    socket.on('partner_disconnected', () => {
      console.log('[Socket] Partner disconnected')
      useChatStore.getState().strangerLeft()
    })

    socket.on('error', ({ message } = {}) => {
      console.warn('[Socket] Server error:', message)
    })

    // Cleanup on unmount (user leaves chat page)
    return () => {
      socket.removeAllListeners()
      socket.disconnect()
      socketRef.current = null
    }
  }, []) // run once per ChatPage mount

  // ── Imperative methods for ChatPage ─────────────────

  /** Enter the matching queue */
  const startSearch = useCallback((prefs = {}) => {
    socketRef.current?.emit('start_search', prefs)
  }, [])

  /** Send a text message to the current partner */
  const sendMessage = useCallback((text) => {
    socketRef.current?.emit('message', { text })
  }, [])

  /**
   * Send typing state to partner.
   * Call with true when user starts typing, false when they stop.
   */
  const sendTyping = useCallback((isTyping) => {
    socketRef.current?.emit('typing', isTyping)
  }, [])

  /** Skip current partner and search for a new one */
  const skip = useCallback(() => {
    socketRef.current?.emit('skip')
  }, [])

  return { startSearch, sendMessage, sendTyping, skip }
}
