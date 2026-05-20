import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

import authRoutes     from './routes/auth'
import productRoutes  from './routes/products'
import orderRoutes    from './routes/orders'
import userRoutes     from './routes/users'

const app  = express()
const PORT = process.env.PORT || 4000

// ── Middleware ──
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Velvet Roast API', time: new Date().toISOString() })
})

// ── Routes ──
app.use('/api/auth',     authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders',   orderRoutes)
app.use('/api/users',    userRoutes)

// ── 404 handler ──
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found.' })
})

// ── Error handler ──
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Server error:', err)
  res.status(500).json({ message: 'Internal server error.' })
})

app.listen(PORT, () => {
  console.log(`\n☕  Velvet Roast API running on http://localhost:${PORT}`)
  console.log(`    Health: http://localhost:${PORT}/api/health\n`)
})

export default app
