/**
 * socket.js — All Socket.IO event logic
 *
 * Event contract (client → server):
 *   start_search  { gender?, ageGroup? }   → enter queue / find match
 *   message       { text: string }          → relay to partner
 *   typing        boolean                   → relay typing state to partner
 *   skip                                    → drop partner, search again
 *
 * Event contract (server → client):
 *   waiting                                → user is in queue
 *   matched       { roomId: string }        → paired with a stranger
 *   message       { text, timestamp }       → received a message
 *   partner_typing  boolean                 → partner typing state
 *   partner_disconnected                    → partner left the chat
 *   error         { message: string }       → something went wrong
 */

const queue = require('./queue')

/**
 * Internal helper — runs the full search flow for one socket:
 *  1. Remove from queue (safety)
 *  2. Try to match with a waiting user
 *  3a. Match found  → pair, emit "matched" to both
 *  3b. No match     → enqueue, emit "waiting"
 *
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
function handleSearch(io, socket) {
  // Un-queue if already waiting (idempotent)
  queue.dequeue(socket.id)

  const partnerId = queue.tryMatch(socket.id)

  if (partnerId) {
    // ── Matched ──────────────────────────────────────
    queue.pair(socket.id, partnerId)

    const roomId = [socket.id, partnerId].sort().join('_')

    socket.emit('matched', { roomId })
    io.to(partnerId).emit('matched', { roomId })

    console.log(`[Match] ${socket.id} ↔ ${partnerId} (room: ${roomId})`)
  } else {
    // ── Waiting ───────────────────────────────────────
    queue.enqueue(socket.id)
    socket.emit('waiting')

    console.log(`[Queue] ${socket.id} is waiting (queue size: ${queue.stats.waiting})`)
  }
}

/**
 * Register all socket events on the given Socket.IO server.
 * @param {import('socket.io').Server} io
 */
function registerSocketEvents(io) {
  io.on('connection', (socket) => {
    console.log(`[Connect] ${socket.id}`)

    // ── start_search ─────────────────────────────────
    // Client emits this when user clicks "Start Chatting" or "Next"
    socket.on('start_search', (prefs = {}) => {
      console.log(`[Search] ${socket.id}`, prefs)

      // If already paired, silently drop the old partner first
      const oldPartner = queue.unpair(socket.id)
      if (oldPartner) {
        io.to(oldPartner).emit('partner_disconnected')
      }

      handleSearch(io, socket)
    })

    // ── message ──────────────────────────────────────
    // Relay text message to paired partner
    socket.on('message', ({ text } = {}) => {
      if (typeof text !== 'string' || !text.trim()) return

      const partnerId = queue.getPartner(socket.id)
      if (!partnerId) {
        socket.emit('error', { message: 'Not connected to a partner.' })
        return
      }

      io.to(partnerId).emit('message', {
        text: text.trim(),
        timestamp: Date.now(),
      })
    })

    // ── typing ───────────────────────────────────────
    // Relay typing indicator to paired partner
    socket.on('typing', (isTyping) => {
      const partnerId = queue.getPartner(socket.id)
      if (partnerId) {
        io.to(partnerId).emit('partner_typing', Boolean(isTyping))
      }
    })

    // ── skip ─────────────────────────────────────────
    // Drop current partner and search for a new one
    socket.on('skip', () => {
      console.log(`[Skip] ${socket.id}`)

      const partnerId = queue.unpair(socket.id)

      if (partnerId) {
        // Notify the old partner
        io.to(partnerId).emit('partner_disconnected')
      }
      
      // Stop automatic self-queue - the client will manually emit 'start_search' via the Next button
    })

    // ── disconnect ───────────────────────────────────
    // Browser closed / network dropped — cleanup everything
    socket.on('disconnect', (reason) => {
      console.log(`[Disconnect] ${socket.id} — reason: ${reason}`)

      // Remove from queue if waiting
      queue.dequeue(socket.id)

      // Notify partner if existed
      const partnerId = queue.unpair(socket.id)
      if (partnerId) {
        io.to(partnerId).emit('partner_disconnected')
      }

      // Log current server state
      console.log(`[Stats]`, queue.stats)
    })
  })
}

module.exports = { registerSocketEvents }
