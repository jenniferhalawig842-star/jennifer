import { Router, Request, Response } from 'express'
import { supabase } from '../lib/supabase'
import { authMiddleware, adminOnly } from '../middleware/auth'

const router = Router()

// ── GET /api/products ── (public)
router.get('/', async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('date_added', { ascending: false })
  if (error) return res.status(500).json({ message: error.message })
  res.json(data)
})

// ── GET /api/products/categories ── (public)
router.get('/categories', async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('products').select('category').eq('status', 'available')
  if (error) return res.status(500).json({ message: error.message })
  const cats = [...new Set((data || []).map((r: any) => r.category as string))].filter(Boolean).sort()
  res.json(cats)
})

// ── POST /api/products/upload-image ── (admin)
// Accepts base64 image, uploads to Supabase Storage bucket "product-images"
// Create this bucket in Supabase: Storage → New bucket → Name: product-images → Public: ON
router.post('/upload-image', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  const { base64, filename, mimeType } = req.body
  if (!base64 || !filename || !mimeType)
    return res.status(400).json({ message: 'base64, filename and mimeType are required.' })

  const allowed = ['image/jpeg','image/jpg','image/png','image/webp','image/gif']
  if (!allowed.includes(mimeType))
    return res.status(400).json({ message: 'Only JPG, PNG, WebP and GIF are allowed.' })

  try {
    const buffer = Buffer.from(base64, 'base64')
    if (buffer.length > 5 * 1024 * 1024)
      return res.status(400).json({ message: 'Image must be smaller than 5 MB.' })

    const ext      = (filename.split('.').pop() || 'jpg').toLowerCase()
    const safe     = filename.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9\-_]/g, '-').slice(0, 40)
    const path     = `products/${Date.now()}-${safe}.${ext}`

    const { error: upErr } = await supabase.storage
      .from('product-images')
      .upload(path, buffer, { contentType: mimeType, cacheControl: '3600', upsert: false })

    if (upErr) {
      if (upErr.message.toLowerCase().includes('bucket'))
        return res.status(500).json({ message: 'Storage bucket "product-images" not found. Go to Supabase → Storage → New bucket → name: product-images → toggle Public ON.' })
      return res.status(500).json({ message: `Upload failed: ${upErr.message}` })
    }

    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path)
    res.json({ url: urlData.publicUrl, path })
  } catch (err: any) {
    console.error('Image upload error:', err)
    res.status(500).json({ message: 'Failed to upload image.' })
  }
})

// ── GET /api/products/:id ── (public)
router.get('/:id', async (req: Request, res: Response) => {
  const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).maybeSingle()
  if (error || !data) return res.status(404).json({ message: 'Product not found.' })
  res.json(data)
})

// ── POST /api/products ── (admin)
router.post('/', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  const { name, category, price, status, description, image_path } = req.body
  if (!name || !category || !price)
    return res.status(400).json({ message: 'Name, category and price are required.' })
  const { data, error } = await supabase
    .from('products')
    .insert({ name, category, price: Number(price), status: status || 'available', description, image_path: image_path || null })
    .select().single()
  if (error) return res.status(500).json({ message: error.message })
  res.status(201).json(data)
})

// ── PUT /api/products/:id ── (admin)
router.put('/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  const { name, category, price, status, description, image_path } = req.body
  const u: Record<string,any> = {}
  if (name        !== undefined) u.name        = name
  if (category    !== undefined) u.category    = category
  if (price       !== undefined) u.price       = Number(price)
  if (status      !== undefined) u.status      = status
  if (description !== undefined) u.description = description
  if (image_path  !== undefined) u.image_path  = image_path
  const { data, error } = await supabase.from('products').update(u).eq('id', req.params.id).select().single()
  if (error || !data) return res.status(404).json({ message: 'Product not found.' })
  res.json(data)
})

// ── DELETE /api/products/:id ── (admin)
router.delete('/:id', authMiddleware, adminOnly, async (req: Request, res: Response) => {
  // Try to also delete the stored image
  const { data: prod } = await supabase.from('products').select('image_path').eq('id', req.params.id).maybeSingle()
  const { error } = await supabase.from('products').delete().eq('id', req.params.id)
  if (error) return res.status(500).json({ message: error.message })
  if (prod?.image_path?.includes('product-images/products/')) {
    const storagePath = prod.image_path.split('product-images/')[1]
    if (storagePath) await supabase.storage.from('product-images').remove([storagePath])
  }
  res.json({ message: 'Product deleted.' })
})

export default router
