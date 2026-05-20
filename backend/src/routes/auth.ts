import { Router, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { supabase } from '../lib/supabase'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()

// ── POST /api/auth/register ──
router.post('/register', async (req: Request, res: Response) => {
  const { fullname, email, username, password } = req.body

  if (!fullname || !email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required.' })
  }

  // Check existing
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .or(`email.eq.${email},username.eq.${username}`)
    .maybeSingle()

  if (existing) {
    return res.status(409).json({ message: 'Email or username already taken.' })
  }

  const hashed = await bcrypt.hash(password, 10)

  const { data: user, error } = await supabase
    .from('users')
    .insert({ fullname, email, username, password: hashed, role: 'user' })
    .select('id, fullname, email, username, role, date_registered, password_needs_reset')
    .single()

  if (error || !user) {
    return res.status(500).json({ message: 'Registration failed. Try again.' })
  }

  res.status(201).json({ message: 'Account created successfully.' })
})

// ── POST /api/auth/login ──
router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required.' })
  }

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .maybeSingle()

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password.' })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return res.status(401).json({ message: 'Invalid username or password.' })
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )

  const { password: _pw, ...safeUser } = user
  res.json({ token, user: safeUser })
})

// ── GET /api/auth/me ──
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  const { data: user } = await supabase
    .from('users')
    .select('id, fullname, email, username, role, date_registered, password_needs_reset')
    .eq('id', req.userId!)
    .maybeSingle()

  if (!user) return res.status(404).json({ message: 'User not found.' })
  res.json(user)
})

export default router
