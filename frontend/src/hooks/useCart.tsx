import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { CartItem } from '../types'

interface CartContextType {
  items: CartItem[]
  count: number
  total: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string, size: string) => void
  updateQty: (productId: string, size: string, qty: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('vr_cart')
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('vr_cart', JSON.stringify(items))
  }, [items])

  const count = items.reduce((s, i) => s + i.qty, 0)
  const total = items.reduce((s, i) => s + i.price * i.qty, 0)

  const addItem = (item: CartItem) => {
    setItems(prev => {
      const idx = prev.findIndex(
        i => i.product_id === item.product_id && i.size === item.size
      )
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = { ...updated[idx], qty: updated[idx].qty + item.qty }
        return updated
      }
      return [...prev, item]
    })
  }

  const removeItem = (productId: string, size: string) => {
    setItems(prev => prev.filter(i => !(i.product_id === productId && i.size === size)))
  }

  const updateQty = (productId: string, size: string, qty: number) => {
    if (qty <= 0) { removeItem(productId, size); return }
    setItems(prev =>
      prev.map(i =>
        i.product_id === productId && i.size === size ? { ...i, qty } : i
      )
    )
  }

  const clearCart = () => setItems([])

  return (
    <CartContext.Provider value={{ items, count, total, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
