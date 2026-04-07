/**
 * queue.js — In-memory user matching system
 *
 * Responsibilities:
 *  - Maintain a FIFO waiting queue
 *  - Track paired users (socketId ↔ partnerId)
 *  - Expose clean match / pair / unpair API
 *
 * Exported as a singleton — one shared instance per server process.
 */

class MatchingQueue {
  constructor() {
    /** @type {string[]} FIFO queue of waiting socket IDs */
    this._waiting = []

    /**
     * Bidirectional pair map.
     * If A is paired with B: _pairs.get(A) === B && _pairs.get(B) === A
     * @type {Map<string, string>}
     */
    this._pairs = new Map()
  }

  // ── Queue Operations ─────────────────────────────

  /**
   * Add a socket to the waiting queue (idempotent).
   * @param {string} socketId
   */
  enqueue(socketId) {
    if (!this._waiting.includes(socketId)) {
      this._waiting.push(socketId)
    }
  }

  /**
   * Remove a socket from the waiting queue.
   * @param {string} socketId
   */
  dequeue(socketId) {
    const i = this._waiting.indexOf(socketId)
    if (i !== -1) this._waiting.splice(i, 1)
  }

  /**
   * Try to find a match for socketId.
   * Returns the partner's socketId if found (and removes both from queue),
   * or null if no one is waiting.
   * @param {string} socketId
   * @returns {string | null}
   */
  tryMatch(socketId) {
    // Find first waiting user that isn't the caller
    const i = this._waiting.findIndex((id) => id !== socketId)
    if (i === -1) return null

    const partnerId = this._waiting.splice(i, 1)[0]
    // Also remove the caller from the queue if they were in it
    this.dequeue(socketId)
    return partnerId
  }

  /** @param {string} socketId */
  isWaiting(socketId) {
    return this._waiting.includes(socketId)
  }

  // ── Pair Operations ──────────────────────────────

  /**
   * Record a bidirectional pair.
   * @param {string} a
   * @param {string} b
   */
  pair(a, b) {
    this._pairs.set(a, b)
    this._pairs.set(b, a)
  }

  /**
   * Remove the pair and return the partner's ID (or null).
   * Safe to call even if not paired.
   * @param {string} socketId
   * @returns {string | null}
   */
  unpair(socketId) {
    const partner = this._pairs.get(socketId) ?? null
    this._pairs.delete(socketId)
    if (partner) this._pairs.delete(partner)
    return partner
  }

  /**
   * Get the current partner of a socket.
   * @param {string} socketId
   * @returns {string | null}
   */
  getPartner(socketId) {
    return this._pairs.get(socketId) ?? null
  }

  /** @param {string} socketId */
  isPaired(socketId) {
    return this._pairs.has(socketId)
  }

  // ── Diagnostics ──────────────────────────────────

  get stats() {
    return {
      waiting: this._waiting.length,
      activePairs: this._pairs.size / 2,
    }
  }
}

// Export a singleton so all socket handlers share state
module.exports = new MatchingQueue()
