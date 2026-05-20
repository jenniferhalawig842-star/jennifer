import { useState } from 'react'
import type { Product } from '../types'
import { useCart } from '../hooks/useCart'

interface Props {
  product: Product
  onClose: () => void
  onAdded: () => void
}

const SIZES = ['Small', 'Medium', 'Large']

// Products that don't have size options
const NO_SIZE_CATEGORIES = ['pastry', 'food', 'snack', 'bread', 'cake']

export default function ProductModal({ product, onClose, onAdded }: Props) {
  const { addItem } = useCart()
  const hasSize = !NO_SIZE_CATEGORIES.includes(product.category.toLowerCase())

  const [size, setSize]   = useState(hasSize ? 'Medium' : '')
  const [qty,  setQty]    = useState(1)

  // Price adjustment by size
  const priceFor = (s: string) => {
    if (s === 'Small')  return product.price - 20
    if (s === 'Large')  return product.price + 20
    return product.price
  }

  const currentPrice = hasSize ? priceFor(size) : product.price
  const lineTotal    = currentPrice * qty

  const handleAdd = () => {
    addItem({
      product_id:   product.id,
      product_name: product.name,
      product_img:  product.image_path,
      category:     product.category,
      size:         size || 'Regular',
      qty,
      price:        currentPrice,
    })
    onAdded()
    onClose()
  }

  return (
    <div className="product-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="product-modal">
        {/* Image */}
        {product.image_path ? (
          <div className="modal-img">
            <img src={product.image_path} alt={product.name} />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(30,15,8,0.6) 0%, transparent 60%)' }}
            />
          </div>
        ) : (
          <div className="modal-img-placeholder">
            <i className="fas fa-mug-hot text-5xl" style={{ color: 'rgba(212,175,55,0.25)' }} />
          </div>
        )}

        <div className="modal-body">
          <div className="modal-category">{product.category}</div>
          <h2 className="modal-name">{product.name}</h2>

          {product.description && (
            <p className="modal-desc">{product.description}</p>
          )}

          <div className="modal-price">
            <span style={{ fontSize: '0.9rem', color: 'rgba(245,237,216,0.4)', marginRight: 2 }}>₱</span>
            {currentPrice.toFixed(2)}
          </div>

          {/* Size selector */}
          {hasSize && (
            <>
              <div className="modal-label">Size</div>
              <div className="size-options">
                {SIZES.map(s => (
                  <button
                    key={s}
                    className={`size-btn ${size === s ? 'selected' : ''}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                    <span style={{ fontSize: '0.65rem', opacity: 0.75, marginLeft: 4 }}>
                      {s === 'Small' ? `₱${(product.price - 20).toFixed(0)}` :
                       s === 'Large' ? `₱${(product.price + 20).toFixed(0)}` :
                       `₱${product.price.toFixed(0)}`}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Quantity */}
          <div className="modal-label">Quantity</div>
          <div className="modal-qty-row">
            <button
              className="modal-qty-btn"
              onClick={() => setQty(q => Math.max(1, q - 1))}
            >
              <i className="fas fa-minus" style={{ fontSize: '0.7rem' }} />
            </button>
            <span className="modal-qty-num">{qty}</span>
            <button
              className="modal-qty-btn"
              onClick={() => setQty(q => Math.min(20, q + 1))}
            >
              <i className="fas fa-plus" style={{ fontSize: '0.7rem' }} />
            </button>
            <span style={{ fontSize: '0.78rem', color: 'rgba(245,237,216,0.4)', marginLeft: '0.5rem' }}>
              = <span style={{ color: 'var(--gold)', fontWeight: 600 }}>₱{lineTotal.toFixed(2)}</span>
            </span>
          </div>

          {/* Actions */}
          <button className="modal-add-btn" onClick={handleAdd}>
            <i className="fas fa-bag-shopping" style={{ marginRight: 8 }} />
            Add to Cart — ₱{lineTotal.toFixed(2)}
          </button>

          <button
            onClick={onClose}
            style={{
              width: '100%',
              marginTop: '0.6rem',
              padding: '0.6rem',
              background: 'none',
              border: 'none',
              color: 'rgba(245,237,216,0.3)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
