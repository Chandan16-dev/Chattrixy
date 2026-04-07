/**
 * useChatSimulator — REMOVED
 *
 * All fake/simulated chat logic has been stripped.
 * This module is kept as a no-op stub so that any stale imports
 * don't cause build errors during the transition period.
 *
 * To wire up real-time chat, connect a Socket.IO (or WebSocket) adapter
 * that calls the following store actions:
 *
 *   useChatStore.getState().setConnected()          // peer matched
 *   useChatStore.getState().receiveMessage(text)    // peer sent text
 *   useChatStore.getState().setStrangerTyping(true) // peer started typing
 *   useChatStore.getState().setStrangerTyping(false)// peer stopped typing
 *   useChatStore.getState().strangerLeft()          // peer disconnected
 *
 * The store exposes sessionId which you can send to the backend
 * as a correlation ID when a new session starts.
 */
export function useChatSimulator() {
  // no-op — real backend handles all events
}
