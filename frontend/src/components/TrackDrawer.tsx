import { useState } from 'react'
import type { Order } from '../types'
import api from '../lib/api'

interface Props {
  onClose: () => void
  initialCode?: string
}

const STATUS_STEPS = [
  {
    key:   'placed',
    label: 'Order Placed',
    sub:   'We received your order',
    icon:  'fa-receipt',
  },
  {
    key:   'pending',
    label: 'Confirmed',
    sub:   'Your order is queued',
    icon:  'fa-clock',
  },
  {
    key:   'preparing',
    label: 'Preparing',
    sub:   'Our baristas are crafting your order',
    icon:  'fa-mug-hot',
  },
  {
    key:   'done',
    label: 'Ready / Delivered',
    sub:   'Your order is complete!',
    icon:  'fa-circle-check',
  },
]

const STATUS_ORDER = ['placed', 'pending', 'preparing', 'done']

function stepState(stepKey: string, orderStatus: string): 'done' | 'current' | 'pending-dot' | 'cancelled' {
  if (orderStatus === 'cancelled') {
    if (stepKey === 'placed') return 'done'
    return 'cancelled'
  }
  const orderIdx = STATUS_ORDER.indexOf(orderStatus === 'done' ? 'done' : orderStatus)
  const stepIdx  = STATUS_ORDER.indexOf(stepKey)
  if (stepKey === 'placed') return 'done'
  if (stepIdx < orderIdx)   return 'done'
  if (stepIdx === orderIdx) return 'current'
  return 'pending-dot'
}

export default function TrackDrawer({ onClose, initialCode = '' }: Props) {
  const [code,    setCode]    = useState(initialCode.toUpperCase())
  const [loading, setLoading] = useState(false)
  const [order,   setOrder]   = useState<Order | null>(null)
  const [error,   setError]   = useState('')

  const handleSearch = async () => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return
    setError('')
    setOrder(null)
    setLoading(true)
    try {
      const { data } = await api.get(`/api/orders/track/${trimmed}`)
      setOrder(data)
    } catch {
      setError('Order not found. Double-check your order code and try again.')
    } finally {
      setLoading(false)
    }
  }

  const statusLabel = (s: string) => {
    const map: Record<string, string> = {
      pending:    'Confirmed',
      preparing:  'Preparing',
      done:       'Ready / Delivered',
      cancelled:  'Cancelled',
    }
    return map[s] || s
  }

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      pending:   '#f59e0b',
      preparing: '#60a5fa',
      done:      '#34d399',
      cancelled: '#f87171',
    }
    return map[s] || '#fff'
  }

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />

      <div className="track-drawer">
        {/* Header */}
        <div className="cart-header">
          <div className="cart-title">
            <i className="fas fa-location-dot" style={{ color: 'var(--gold)', fontSize: '1.1rem' }} />
            Track Order
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close">
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Body */}
        <div className="cart-body" style={{ padding: '1.5rem' }}>
          {/* Search */}
          <p style={{ fontSize: '0.8rem', color: 'rgba(245,237,216,0.45)', marginBottom: '1rem', lineHeight: 1.6 }}>
            Enter your order code (e.g. <span style={{ color: 'var(--gold)' }}>VR-ABCD1234</span>) to check the status.
          </p>

          <div className="track-search-box">
            <input
              type="text"
              className="track-input"
              placeholder="VR-XXXXXXXX"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              maxLength={16}
            />
            <button
              className="track-search-btn"
              onClick={handleSearch}
              disabled={loading || !code.trim()}
            >
              {loading
                ? <i className="fas fa-circle-notch fa-spin" />
                : <i className="fas fa-magnifying-glass" />
              }
            </button>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#fca5a5',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <i className="fas fa-circle-exclamation" />
              {error}
            </div>
          )}

          {/* Order result */}
          {order && (
            <div style={{ marginTop: '1.5rem' }}>
              {/* Order summary card */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(212,175,55,0.15)',
                  borderRadius: '10px',
                  padding: '1rem 1.2rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '0.2rem' }}>
                      Order Code
                    </div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>
                      VR-{order.ref_code}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '999px',
                      background: `${statusColor(order.status)}20`,
                      border: `1px solid ${statusColor(order.status)}50`,
                      color: statusColor(order.status),
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    {statusLabel(order.status)}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  {[
                    { label: 'Customer', value: order.customer_name },
                    { label: 'Total',    value: `₱${Number(order.total).toFixed(2)}` },
                    { label: 'Delivery', value: order.delivery_method === 'delivery' ? 'Delivery' : 'Pickup' },
                    { label: 'Payment',  value: order.payment_method?.toUpperCase() },
                  ].map(row => (
                    <div key={row.label}>
                      <div style={{ fontSize: '0.62rem', color: 'rgba(245,237,216,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        {row.label}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#fff', marginTop: '1px', fontWeight: 500 }}>
                        {row.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              {order.status !== 'cancelled' ? (
                <>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(245,237,216,0.35)', marginBottom: '1rem' }}>
                    Order Progress
                  </div>
                  <div className="order-timeline">
                    {STATUS_STEPS.map(step => {
                      const state = stepState(step.key, order.status)
                      return (
                        <div key={step.key} className="timeline-step">
                          <div className={`timeline-dot ${state}`}>
                            <i className={`fas ${step.icon}`} style={{ fontSize: '0.72rem' }} />
                          </div>
                          <div className="timeline-text">
                            <div className="timeline-label" style={{
                              color: state === 'current' ? 'var(--gold)' :
                                     state === 'done'    ? '#34d399' :
                                     state === 'cancelled' ? '#f87171' :
                                     'rgba(245,237,216,0.3)',
                            }}>
                              {step.label}
                              {state === 'current' && (
                                <span style={{
                                  marginLeft: '0.5rem',
                                  fontSize: '0.6rem',
                                  background: 'rgba(212,175,55,0.15)',
                                  color: 'var(--gold)',
                                  padding: '0.1rem 0.4rem',
                                  borderRadius: '999px',
                                  fontWeight: 700,
                                  verticalAlign: 'middle',
                                }}>
                                  NOW
                                </span>
                              )}
                            </div>
                            <div className="timeline-sub">{step.sub}</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              ) : (
                <div
                  style={{
                    padding: '1rem',
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                  }}
                >
                  <i className="fas fa-circle-xmark text-2xl" style={{ color: '#f87171' }} />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f87171' }}>Order Cancelled</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(245,237,216,0.4)', marginTop: 2 }}>
                      This order has been cancelled. Please contact us for assistance.
                    </div>
                  </div>
                </div>
              )}

              {/* Items */}
              {order.order_items && order.order_items.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(245,237,216,0.35)', marginBottom: '0.75rem' }}>
                    Items Ordered
                  </div>
                  {order.order_items.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.55rem 0',
                        borderBottom: i < order.order_items!.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        fontSize: '0.82rem',
                      }}
                    >
                      <div>
                        <span style={{ color: '#fff', fontWeight: 500 }}>{item.product_name}</span>
                        {item.size && (
                          <span style={{ color: 'rgba(245,237,216,0.35)', marginLeft: 6, fontSize: '0.72rem' }}>
                            {item.size}
                          </span>
                        )}
                        <span style={{ color: 'rgba(245,237,216,0.35)', marginLeft: 6, fontSize: '0.72rem' }}>
                          ×{item.qty}
                        </span>
                      </div>
                      <span style={{ color: 'var(--gold)', fontWeight: 600 }}>
                        ₱{(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Idle state */}
          {!order && !error && !loading && (
            <div
              style={{
                marginTop: '2.5rem',
                textAlign: 'center',
                opacity: 0.35,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <i className="fas fa-mug-hot text-5xl" style={{ color: 'var(--gold)' }} />
              <p style={{ fontSize: '0.8rem', color: 'rgba(245,237,216,0.5)' }}>
                Enter your order code above to track your order in real time.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
