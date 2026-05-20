import { Router, Request, Response } from 'express'
import { supabase } from '../lib/supabase'
import { authMiddleware, staffOrAdmin, AuthRequest } from '../middleware/auth'

const router = Router()

// ── Generate unique ref_code ──
function genRefCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

// ── POST /api/orders ── (public — any guest can order)
router.post('/', async (req: Request, res: Response) => {
  const {
    user_id, customer_name, customer_email, customer_phone,
    customer_address, city, delivery_method, notes,
    payment_method, delivery_fee, discount, items,
  } = req.body

  if (!customer_name || !items?.length) {
    return res.status(400).json({ message: 'Customer name and items required.' })
  }

  // Generate unique ref_code
  let ref_code = genRefCode()
  let attempts = 0
  while (attempts < 5) {
    const { data: existing } = await supabase
      .from('orders').select('id').eq('ref_code', ref_code).maybeSingle()
    if (!existing) break
    ref_code = genRefCode()
    attempts++
  }

  // Compute total from items
  const itemTotal = (items as any[]).reduce(
    (s: number, i: any) => s + Number(i.price) * Number(i.qty), 0
  )
  const total = itemTotal + Number(delivery_fee || 0) - Number(discount || 0)

  // Insert order
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      user_id:          user_id || null,
      customer_name,
      customer_email:   customer_email || null,
      customer_phone:   customer_phone || null,
      customer_address: customer_address || null,
      city:             city || null,
      delivery_method:  delivery_method || 'pickup',
      notes:            notes || null,
      payment_method:   payment_method || 'cash',
      total,
      delivery_fee:     Number(delivery_fee || 0),
      discount:         Number(discount || 0),
      ref_code,
      status:           'pending',
    })
    .select()
    .single()

  if (orderErr || !order) {
    return res.status(500).json({ message: orderErr?.message || 'Failed to create order.' })
  }

  // Insert order items
  const orderItems = (items as any[]).map((item: any) => ({
    order_id:     order.id,
    product_name: item.product_name,
    product_img:  item.product_img || null,
    size:         item.size || null,
    qty:          Number(item.qty),
    price:        Number(item.price),
  }))

  const { error: itemsErr } = await supabase.from('order_items').insert(orderItems)
  if (itemsErr) {
    // Rollback order
    await supabase.from('orders').delete().eq('id', order.id)
    return res.status(500).json({ message: 'Failed to save order items.' })
  }

  res.status(201).json({ order, ref_code })
})

// ── GET /api/orders ── (staff/admin)
router.get('/', authMiddleware, staffOrAdmin, async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      managed_by_user:users!orders_managed_by_fkey(fullname),
      order_items(*)
    `)
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ message: error.message })

  const mapped = (data || []).map((o: any) => ({
    ...o,
    managed_by_name: o.managed_by_user?.fullname || null,
    managed_by_user: undefined,
  }))

  res.json(mapped)
})

// ── GET /api/orders/track/:ref_code ── (public)
router.get('/track/:ref_code', async (req: Request, res: Response) => {
  const { data: order, error } = await supabase
    .from('orders')
    .select('id, customer_name, ref_code, status, created_at, delivery_method, payment_method, total')
    .eq('ref_code', req.params.ref_code.toUpperCase())
    .maybeSingle()

  if (error || !order) return res.status(404).json({ message: 'Order not found.' })

  const { data: items } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', order.id)

  res.json({ ...order, order_items: items || [] })
})

// ── GET /api/orders/:id ── (staff/admin)
router.get('/:id', authMiddleware, staffOrAdmin, async (req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', req.params.id)
    .maybeSingle()

  if (error || !data) return res.status(404).json({ message: 'Order not found.' })
  res.json(data)
})

// ── PATCH /api/orders/:id/status ── (staff/admin)
router.patch('/:id/status', authMiddleware, staffOrAdmin, async (req: AuthRequest, res: Response) => {
  const { status } = req.body
  const allowed = ['pending', 'preparing', 'done', 'cancelled']
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: 'Invalid status.' })
  }

  const { data, error } = await supabase
    .from('orders')
    .update({ status, managed_by: req.userId })
    .eq('id', req.params.id)
    .select()
    .single()

  if (error || !data) return res.status(404).json({ message: 'Order not found.' })
  res.json(data)
})

export default router
