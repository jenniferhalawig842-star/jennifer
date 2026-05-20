import { Router, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { supabase } from '../lib/supabase'
import { authMiddleware, adminOnly } from '../middleware/auth'

const router = Router()

// ── GET /api/users ── (admin)
router.get('/', authMiddleware, adminOnly, async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, fullname, email, username, role, date_registered, password_needs_reset')
    .order('date_registered', { ascending: false })

  if (error) return res.status(500).json({ message: error.message })
  res.json(data)
})

// ── GET /api/users/staff ── (admin)
router.get('/staff', authMiddleware, adminOnly, async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, fullname, email, username, role, date_registered')
    .eq('role', 'staff')
    .order('date_registered', { ascending: false })

  if (error) return res.status(500).json({ message: error.message })
  res.json(data)
})

// ── POST /api/users ── create user/staff (admin)
router.post('/', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  const { fullname, email, username, password } = req.body;
  if (!fullname || !email || !username || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .or(`email.eq.${email},username.eq.${username}`)
    .maybeSingle();

  if (existing) return res.status(409).json({ message: 'Email or username already exists.' });

  const hashed = await bcrypt.hash(password, 10);
  // Always set role to 'staff' for this endpoint
  const { data, error } = await supabase
    .from('users')
    .insert({ fullname, email, username, password: hashed, role: 'staff' })
    .select('id, fullname, email, username, role, date_registered')
    .single();

  if (error) return res.status(500).json({ message: error.message });
  res.status(201).json(data);
})

// ── PUT /api/users/:id ── (admin)
router.put('/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  const { fullname, email, username, role, password } = req.body
  const updates: any = {}
  if (fullname)  updates.fullname  = fullname
  if (email)     updates.email     = email
  if (username)  updates.username  = username
  if (role)      updates.role      = role
  if (password)  updates.password  = await bcrypt.hash(password, 10)

  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', req.params.id)
    .select('id, fullname, email, username, role, date_registered')
    .single()

  if (error || !data) return res.status(404).json({ message: 'User not found.' })
  res.json(data)
})

// ── DELETE /api/users/:id ── (admin)
router.delete('/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  const { error } = await supabase.from('users').delete().eq('id', req.params.id)
  if (error) return res.status(500).json({ message: error.message })
  res.json({ message: 'User deleted.' })
})

export default router
