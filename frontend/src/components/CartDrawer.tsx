import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'

interface Props {
  onClose: () => void
}

export default function CartDrawer({ onClose }: Props) {
  const { items, count, total, removeItem, updateQty, clearCart } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!items.length) return
    onClose()
    navigate('/buy')
  }

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />

      <div className="cart-drawer">
        {/* Header */}
        <div className="cart-header">
          <div className="cart-title">
            <i className="fas fa-bag-shopping" style={{ color: 'var(--gold)', fontSize: '1.1rem' }} />
            Your Cart
            {count > 0 && (
              <span className="cart-count-badge">{count} {count === 1 ? 'item' : 'items'}</span>
            )}
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close cart">
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Body */}
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <i className="fas fa-bag-shopping" />
              <p style={{ fontFamily: 'var(--serif)', fontSize: '1.05rem', color: 'rgba(245,237,216,0.4)' }}>
                Your cart is empty
              </p>
              <p>Add some items from the menu to get started.</p>
              <button
                onClick={onClose}
                style={{
                  marginTop: '1rem',
                  padding: '0.55rem 1.4rem',
                  background: 'rgba(212,175,55,0.12)',
                  border: '1px solid rgba(212,175,55,0.25)',
                  color: 'var(--gold)',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'var(--sans)',
                  letterSpacing: '0.08em',
                }}
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div>
              {items.map(item => (
                <div key={`${item.product_id}-${item.size}`} className="cart-item">
                  {/* Image */}
                  {item.product_img ? (
                    <img
                      src={item.product_img}
                      alt={item.product_name}
                      className="cart-item-img"
                    />
                  ) : (
                    <div className="cart-item-img-placeholder">
                      <i className="fas fa-mug-hot" style={{ color: 'rgba(212,175,55,0.3)', fontSize: '1.1rem' }} />
                    </div>
                  )}

                  {/* Info */}
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.product_name}</div>
                    <div className="cart-item-size">{item.size}</div>
                    <div className="cart-item-price">₱{item.price.toFixed(2)} each</div>

                    <div className="cart-qty-row">
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.product_id, item.size, item.qty - 1)}
                        aria-label="Decrease quantity"
                      >
                        <i className="fas fa-minus" style={{ fontSize: '0.6rem' }} />
                      </button>
                      <span className="qty-num">{item.qty}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQty(item.product_id, item.size, item.qty + 1)}
                        aria-label="Increase quantity"
                      >
                        <i className="fas fa-plus" style={{ fontSize: '0.6rem' }} />
                      </button>
                      <span style={{ fontSize: '0.72rem', color: 'var(--gold)', marginLeft: 4 }}>
                        ₱{(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    className="cart-item-del"
                    onClick={() => removeItem(item.product_id, item.size)}
                    aria-label="Remove item"
                  >
                    <i className="fas fa-trash-can" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            {/* Delivery fee note */}
            <div
              style={{
                fontSize: '0.72rem',
                color: 'rgba(245,237,216,0.35)',
                marginBottom: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <i className="fas fa-circle-info" style={{ color: 'rgba(212,175,55,0.4)' }} />
              Delivery fee calculated at checkout
            </div>

            <div className="cart-subtotal">
              <span className="cart-subtotal-label">Subtotal</span>
              <span className="cart-subtotal-value">₱{total.toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              <i className="fas fa-bag-shopping" style={{ marginRight: 8 }} />
              Proceed to Checkout
            </button>

            <button className="clear-cart-btn" onClick={clearCart}>
              <i className="fas fa-trash-can" style={{ marginRight: 6 }} />
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}
