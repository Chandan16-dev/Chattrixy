/**
 * server.js — Chattrixy anonymous chat backend
 *
 * Stack: Express + Socket.IO
 * Port:  3001 (configurable via PORT env var)
 */

require('dotenv').config()

const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const { registerSocketEvents } = require('./socket')

const PORT = process.env.PORT || 3001

// ── Express App ──────────────────────────────────────
const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', process.env.CLIENT_ORIGIN].filter(Boolean),
  methods: ['GET', 'POST'],
  credentials: true,
}))

app.use(express.json())

// Health check — useful for deployment uptime monitors
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
  })
})

// ── HTTP + Socket.IO Server ──────────────────────────
const httpServer = http.createServer(app)

const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', process.env.CLIENT_ORIGIN].filter(Boolean),
    methods: ['GET', 'POST'],
    credentials: true,
  },
  // Prefer WebSocket, fall back to polling for restrictive networks
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000,
})

// ── Register all socket event handlers ───────────────
registerSocketEvents(io)

// ── Start Server ─────────────────────────────────────
httpServer.listen(PORT, () => {
  console.log(`\n🚀 Chattrixy server running on http://localhost:${PORT}`)
  console.log(`   Health check: http://localhost:${PORT}/health`)
  console.log(`   Accepting connections from: localhost:5173, localhost:5174\n`)
})

// ── Graceful shutdown ─────────────────────────────────
process.on('SIGTERM', () => {
  console.log('SIGTERM received — shutting down gracefully')
  httpServer.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})
