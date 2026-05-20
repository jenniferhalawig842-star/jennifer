import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Order } from '../types'

interface Props {
  order: Order
  onTrackOrder: () => void
}

const CONFETTI_COLORS = ['#D4AF37', '#fff', '#f59e0b', '#34d399', '#60a5fa']

export default function OrderSuccess({ order, onTrackOrder }: Props) {
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  const handleCopy = () => {
    navigator.clipboard.writeText(`VR-${order.ref_code}`).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Confetti dots
  const dots = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left:  `${8 + (i * 7.5) % 84}%`,
    delay: `${(i * 0.25) % 3}s`,
    size:  `${5 + (i % 4)}px`,
  }))

  return (
    <div className="success-screen">
      <div className="success-card">

        {/* Confetti */}
        {dots.map(d => (
          <div
            key={d.id}
            className="confetti-dot"
            style={{
              background:       d.color,
              left:             d.left,
              top:              '-10px',
              width:            d.size,
              height:           d.size,
              animationDelay:   d.delay,
              animationDuration: `${2.5 + (d.id % 3) * 0.5}s`,
            }}
          />
        ))}

        {/* Check icon */}
        <div className="success-icon-ring">
          <i className="fas fa-check" />
        </div>

        <h2
          style={{
            fontFamily: 'var(--serif)',
            fontSize: '1.9rem',
            color: '#fff',
            marginBottom: '0.4rem',
          }}
        >
          Order <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Placed!</em>
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(245,237,216,0.55)', lineHeight: 1.6 }}>
          Thank you, <strong style={{ color: 'rgba(245,237,216,0.85)' }}>{order.customer_name}</strong>!
          Your order has been received and our team will start preparing it shortly.
        </p>

        {/* Order code box */}
        <div className="success-ref-box">
          <div className="success-ref-label">Your Order Code</div>
          <div className="success-ref-code">VR-{order.ref_code}</div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(245,237,216,0.35)', marginTop: '0.4rem' }}>
            Save this code to track your order anytime
          </div>
          <button className="copy-btn" onClick={handleCopy}>
            <i className={`fas fa-${copied ? 'check' : 'copy'}`} style={{ marginRight: 6 }} />
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        {/* Order details chips */}
        <div className="success-status-row">
          <div className="status-chip">
            <i className={`fas fa-${order.delivery_method === 'delivery' ? 'motorcycle' : 'store'}`} />
            {order.delivery_method === 'delivery' ? 'Delivery' : 'Pick Up'}
          </div>
          <div className="status-chip">
            <i className={`fas fa-${order.payment_method === 'gcash' ? 'mobile-screen' : 'money-bill-wave'}`} />
            {order.payment_method === 'gcash' ? 'GCash' : 'Cash'}
          </div>
          <div className="status-chip">
            <i className="fas fa-peso-sign" />
            {Number(order.total).toFixed(2)} Total
          </div>
        </div>

        {/* Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.65rem 1rem',
            borderRadius: '8px',
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.2)',
            fontSize: '0.8rem',
            color: '#fbbf24',
            fontWeight: 600,
          }}
        >
          <i className="fas fa-clock" />
          Status: Pending — We'll start preparing your order soon
        </div>

        {/* Actions */}
        <div className="success-actions">
          <button
            className="place-order-btn"
            style={{ borderRadius: '8px' }}
            onClick={onTrackOrder}
          >
            <i className="fas fa-location-dot" />
            Track This Order
          </button>

          <Link
            to="/menu"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              border: '1px solid rgba(212,175,55,0.25)',
              borderRadius: '8px',
              color: 'var(--gold)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(212,175,55,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <i className="fas fa-mug-hot" />
            Order More
          </Link>

          <Link
            to="/"
            style={{
              fontSize: '0.75rem',
              color: 'rgba(245,237,216,0.3)',
              textDecoration: 'none',
              textAlign: 'center',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,237,216,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,237,216,0.3)')}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
