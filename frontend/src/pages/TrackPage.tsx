import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Order } from '../types'
import api from '../lib/api'

const STATUS_STEPS = [
  {
    key:   'placed',
    label: 'Order Placed',
    sub:   'We received your order successfully',
    icon:  'fa-receipt',
  },
  {
    key:   'pending',
    label: 'Confirmed',
    sub:   'Your order is confirmed and queued',
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
    sub:   'Your order is complete — enjoy!',
    icon:  'fa-circle-check',
  },
]

const STATUS_ORDER = ['placed', 'pending', 'preparing', 'done']

type DotState = 'done' | 'current' | 'upcoming' | 'cancelled'

function getStepState(stepKey: string, orderStatus: string): DotState {
  if (orderStatus === 'cancelled') {
    return stepKey === 'placed' ? 'done' : 'cancelled'
  }
  const orderIdx = STATUS_ORDER.indexOf(
    orderStatus === 'done' ? 'done' : orderStatus
  )
  const stepIdx = STATUS_ORDER.indexOf(stepKey)
  if (stepKey === 'placed') return 'done'
  if (stepIdx < orderIdx)   return 'done'
  if (stepIdx === orderIdx) return 'current'
  return 'upcoming'
}

const STATUS_COLOR: Record<string, string> = {
  pending:   '#f59e0b',
  preparing: '#60a5fa',
  done:      '#34d399',
  cancelled: '#f87171',
}

const STATUS_LABEL: Record<string, string> = {
  pending:   'Confirmed',
  preparing: 'Preparing',
  done:      'Ready / Delivered',
  cancelled: 'Cancelled',
}

export default function TrackPage() {
  const [searchParams]  = useSearchParams()
  const [code,  setCode]    = useState(searchParams.get('code')?.toUpperCase() || '')
  const [order, setOrder]   = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error,  setError]   = useState('')
  const [copied, setCopied]  = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-search if code is in URL
  useEffect(() => {
    if (code.trim()) handleSearch(code.trim())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = async (searchCode?: string) => {
    const q = (searchCode || code).trim().toUpperCase().replace(/^VR-/, '')
    if (!q) { inputRef.current?.focus(); return }
    setError('')
    setOrder(null)
    setLoading(true)
    try {
      const { data } = await api.get(`/api/orders/track/${q}`)
      setOrder(data)
      // Update URL without reload
      const url = new URL(window.location.href)
      url.searchParams.set('code', q)
      window.history.replaceState({}, '', url.toString())
    } catch {
      setError('Order not found. Please double-check your code and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const progressPct = order
    ? order.status === 'cancelled' ? 0
    : order.status === 'done'      ? 100
    : order.status === 'preparing' ? 66
    : order.status === 'pending'   ? 33
    : 10
    : 0

  return (
    <div
      style={{
        background: 'var(--ink)',
        minHeight: '100vh',
        paddingTop: 'calc(var(--ribbon-h) + var(--nav-h))',
      }}
    >
      {/* ── Hero ── */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          padding: '3rem 1.5rem 2.5rem',
          textAlign: 'center',
        }}
      >
        {/* Radial glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(212,175,55,0.07) 0%, transparent 70%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(212,175,55,0.12)',
              border: '1.5px solid rgba(212,175,55,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <i className="fas fa-location-dot" style={{ color: 'var(--gold)', fontSize: '1.5rem' }} />
          </div>

          <span className="section-label" style={{ display: 'block', textAlign: 'center' }}>
            Order Tracking
          </span>
          <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            Track Your <em>Order</em>
          </h1>
          <p style={{ color: 'rgba(245,237,216,0.45)', fontSize: '0.875rem', maxWidth: '28rem', margin: '0 auto' }}>
            Enter your order code to see real-time status updates on your Velvet Roast order.
          </p>
        </div>
      </div>

      {/* ── Search box ── */}
      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 1.5rem 2rem' }}>
        <div
          style={{
            background: 'rgba(43,24,18,0.7)',
            border: '1px solid rgba(212,175,55,0.18)',
            borderRadius: 14,
            padding: '1.5rem',
            backdropFilter: 'blur(12px)',
          }}
        >
          <label
            style={{
              display: 'block', fontSize: '0.68rem', fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(212,175,55,0.75)', marginBottom: '0.6rem',
            }}
          >
            Order Code
          </label>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span
                style={{
                  position: 'absolute', left: '0.9rem', top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '0.8rem', fontWeight: 700,
                  color: 'rgba(212,175,55,0.5)',
                  pointerEvents: 'none', fontFamily: 'var(--serif)',
                }}
              >
                VR-
              </span>
              <input
                ref={inputRef}
                type="text"
                value={code.replace(/^VR-/, '')}
                onChange={e => setCode(e.target.value.toUpperCase().replace(/^VR-/, ''))}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="XXXXXXXX"
                maxLength={12}
                style={{
                  width: '100%', padding: '0.75rem 0.9rem 0.75rem 2.5rem',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  borderRadius: 8, color: '#fff',
                  fontSize: '1rem', fontFamily: 'var(--serif)',
                  fontWeight: 700, letterSpacing: '0.12em',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e  => (e.target.style.borderColor = 'var(--gold)')}
                onBlur={e   => (e.target.style.borderColor = 'rgba(212,175,55,0.2)')}
              />
            </div>

            <button
              onClick={() => handleSearch()}
              disabled={loading}
              style={{
                padding: '0.75rem 1.4rem',
                background: 'var(--gold)', color: 'var(--ink)',
                border: 'none', borderRadius: 8,
                fontWeight: 700, fontSize: '0.82rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s', fontFamily: 'var(--sans)',
                letterSpacing: '0.08em', whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}
              onMouseEnter={e => !loading && ((e.currentTarget as HTMLElement).style.background = '#fff')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'var(--gold)')}
            >
              {loading
                ? <><i className="fas fa-circle-notch fa-spin" /> Searching…</>
                : <><i className="fas fa-magnifying-glass" /> Track</>
              }
            </button>
          </div>

          <p style={{ fontSize: '0.7rem', color: 'rgba(245,237,216,0.3)', marginTop: '0.6rem' }}>
            Your order code was shown on the confirmation screen and starts with <span style={{ color: 'var(--gold)' }}>VR-</span>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.85rem 1rem',
              borderRadius: 10, fontSize: '0.82rem',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#fca5a5',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
            }}
          >
            <i className="fas fa-circle-exclamation" />
            {error}
          </div>
        )}
      </div>

      {/* ── Order result ── */}
      {order && (
        <div style={{ maxWidth: '620px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>

          {/* Order card */}
          <div
            style={{
              background: 'rgba(43,24,18,0.75)',
              border: '1px solid rgba(212,175,55,0.18)',
              borderRadius: 16,
              overflow: 'hidden',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Card header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid rgba(212,175,55,0.1)',
                background: 'rgba(212,175,55,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: '0.75rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(212,175,55,0.6)', marginBottom: 4 }}>
                  Order Code
                </div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.06em' }}>
                  VR-{order.ref_code}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={() => handleCopy(`VR-${order.ref_code}`)}
                  style={{
                    padding: '0.35rem 0.85rem', borderRadius: 999,
                    background: 'rgba(212,175,55,0.12)',
                    border: '1px solid rgba(212,175,55,0.25)',
                    color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 600,
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem',
                    fontFamily: 'var(--sans)', transition: 'all 0.15s',
                  }}
                >
                  <i className={`fas fa-${copied ? 'check' : 'copy'}`} />
                  {copied ? 'Copied!' : 'Copy'}
                </button>

                <div
                  style={{
                    padding: '0.3rem 0.8rem', borderRadius: 999,
                    background: `${STATUS_COLOR[order.status] || '#f59e0b'}20`,
                    border: `1px solid ${STATUS_COLOR[order.status] || '#f59e0b'}50`,
                    color: STATUS_COLOR[order.status] || '#f59e0b',
                    fontSize: '0.72rem', fontWeight: 700,
                  }}
                >
                  {STATUS_LABEL[order.status] || order.status}
                </div>
              </div>
            </div>

            {/* Order meta row */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.85rem' }}>
                {[
                  { label: 'Customer', value: order.customer_name, icon: 'fa-user' },
                  { label: 'Total',    value: `₱${Number(order.total).toFixed(2)}`, icon: 'fa-peso-sign' },
                  {
                    label: 'Delivery',
                    value: order.delivery_method === 'delivery' ? 'Delivery' : 'Pick Up',
                    icon: order.delivery_method === 'delivery' ? 'fa-motorcycle' : 'fa-store',
                  },
                  {
                    label: 'Payment',
                    value: order.payment_method?.toUpperCase() || 'CASH',
                    icon: order.payment_method === 'gcash' ? 'fa-mobile-screen' : 'fa-money-bill-wave',
                  },
                ].map(row => (
                  <div key={row.label}>
                    <div style={{ fontSize: '0.6rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,237,216,0.3)', marginBottom: 4 }}>
                      {row.label}
                    </div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <i className={`fas ${row.icon}`} style={{ color: 'var(--gold)', fontSize: '0.75rem' }} />
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Progress bar (non-cancelled) ── */}
            {order.status !== 'cancelled' && (
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,237,216,0.3)', marginBottom: '0.85rem' }}>
                  Progress
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 999, height: 6, marginBottom: '1.5rem', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%', borderRadius: 999,
                      background: 'linear-gradient(90deg, var(--gold), #fff8dc)',
                      width: `${progressPct}%`,
                      transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                      boxShadow: '0 0 12px rgba(212,175,55,0.5)',
                    }}
                  />
                </div>

                {/* Timeline */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {STATUS_STEPS.map((step, i) => {
                    const state = getStepState(step.key, order!.status)
                    const isLast = i === STATUS_STEPS.length - 1

                    const dotColors: Record<DotState, { bg: string; border: string; color: string }> = {
                      done:     { bg: 'rgba(52,211,153,0.15)',  border: '#34d399', color: '#34d399' },
                      current:  { bg: 'rgba(212,175,55,0.18)',  border: 'var(--gold)', color: 'var(--gold)' },
                      upcoming: { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.18)' },
                      cancelled:{ bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.3)', color: 'rgba(248,113,113,0.4)' },
                    }

                    const dc = dotColors[state]

                    return (
                      <div key={step.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem', paddingBottom: isLast ? 0 : '1.1rem', position: 'relative' }}>
                        {/* Connector line */}
                        {!isLast && (
                          <div style={{
                            position: 'absolute', left: 14, top: 30, bottom: 0, width: 2,
                            background: state === 'done' ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.06)',
                            zIndex: 0,
                          }} />
                        )}

                        {/* Dot */}
                        <div
                          style={{
                            width: 30, height: 30, borderRadius: '50%', flexShrink: 0, zIndex: 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.72rem',
                            background: dc.bg, border: `2px solid ${dc.border}`, color: dc.color,
                            boxShadow: state === 'current' ? '0 0 14px rgba(212,175,55,0.3)' : 'none',
                            transition: 'all 0.3s',
                          }}
                        >
                          <i className={`fas ${step.icon}`} style={{ fontSize: '0.7rem' }} />
                        </div>

                        {/* Text */}
                        <div style={{ paddingTop: 6 }}>
                          <div
                            style={{
                              fontSize: '0.85rem', fontWeight: 600,
                              color: state === 'current'  ? 'var(--gold)'
                                   : state === 'done'     ? '#34d399'
                                   : state === 'cancelled'? '#f87171'
                                   : 'rgba(245,237,216,0.25)',
                              display: 'flex', alignItems: 'center', gap: '0.5rem',
                            }}
                          >
                            {step.label}
                            {state === 'current' && (
                              <span style={{
                                fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.1em',
                                background: 'rgba(212,175,55,0.18)', color: 'var(--gold)',
                                padding: '0.1rem 0.45rem', borderRadius: 999, border: '1px solid rgba(212,175,55,0.3)',
                              }}>
                                NOW
                              </span>
                            )}
                            {state === 'done' && (
                              <i className="fas fa-check" style={{ fontSize: '0.6rem', color: '#34d399' }} />
                            )}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'rgba(245,237,216,0.35)', marginTop: 2 }}>
                            {step.sub}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Cancelled banner */}
            {order.status === 'cancelled' && (
              <div style={{
                margin: '1rem 1.5rem', padding: '1rem 1.1rem',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 10, display: 'flex', alignItems: 'center', gap: '0.85rem',
              }}>
                <i className="fas fa-circle-xmark" style={{ color: '#f87171', fontSize: '1.5rem', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#f87171', fontSize: '0.9rem', marginBottom: 2 }}>Order Cancelled</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(245,237,216,0.4)', lineHeight: 1.5 }}>
                    This order has been cancelled. Please contact us if you need assistance.
                  </div>
                </div>
              </div>
            )}

            {/* ── Order items ── */}
            {order.order_items && order.order_items.length > 0 && (
              <div style={{ padding: '1rem 1.5rem 0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(245,237,216,0.3)', marginBottom: '0.75rem' }}>
                  Items Ordered
                </div>
                {order.order_items.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '0.6rem 0',
                      borderBottom: i < order.order_items!.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      {item.product_img ? (
                        <img src={item.product_img} alt={item.product_name}
                          style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div style={{
                          width: 36, height: 36, borderRadius: 6, flexShrink: 0,
                          background: 'rgba(59,26,13,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <i className="fas fa-mug-hot" style={{ color: 'rgba(212,175,55,0.3)', fontSize: '0.85rem' }} />
                        </div>
                      )}
                      <div>
                        <div style={{ fontSize: '0.83rem', fontWeight: 600, color: '#fff' }}>{item.product_name}</div>
                        <div style={{ fontSize: '0.68rem', color: 'rgba(245,237,216,0.35)' }}>
                          {item.size && `${item.size} · `}×{item.qty}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--gold)' }}>
                        ₱{(Number(item.price) * Number(item.qty)).toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'rgba(245,237,216,0.3)' }}>
                        ₱{Number(item.price).toFixed(2)} each
                      </div>
                    </div>
                  </div>
                ))}

                {/* Total */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.85rem 0 0.5rem',
                  borderTop: '1px solid rgba(212,175,55,0.12)',
                  marginTop: '0.25rem',
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'rgba(245,237,216,0.45)' }}>Order Total</span>
                  <span style={{ fontFamily: 'var(--serif)', fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>
                    ₱{Number(order.total).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ padding: '1rem 1.5rem 1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => { setOrder(null); setCode(''); setError(''); inputRef.current?.focus() }}
                style={{
                  flex: 1, padding: '0.7rem',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, color: 'rgba(245,237,216,0.6)',
                  fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                  fontFamily: 'var(--sans)', transition: 'all 0.15s', letterSpacing: '0.06em',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.09)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)')}
              >
                <i className="fas fa-magnifying-glass" style={{ marginRight: 6 }} />
                Track Another
              </button>

              <Link
                to="/menu"
                style={{
                  flex: 1, padding: '0.7rem',
                  background: 'var(--gold)', border: 'none',
                  borderRadius: 8, color: 'var(--ink)',
                  fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'var(--sans)', transition: 'all 0.15s', letterSpacing: '0.06em',
                  textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#fff')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'var(--gold)')}
              >
                <i className="fas fa-mug-hot" />
                Order More
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Idle state: tips ── */}
      {!order && !loading && !error && (
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { icon: 'fa-receipt',       title: 'Find Your Code',  desc: 'Your order code was shown on the success screen after checkout.'           },
              { icon: 'fa-clock',         title: 'Live Updates',    desc: 'Refresh any time to see the latest status from our team.'                   },
              { icon: 'fa-mug-hot',       title: 'Preparation',     desc: 'Hot drinks typically take 5–10 minutes. Cold drinks are prepped quickly.'   },
              { icon: 'fa-motorcycle',    title: 'Delivery Time',   desc: 'Delivery orders arrive in 30–45 minutes depending on your location.'        },
            ].map(tip => (
              <div
                key={tip.title}
                style={{
                  background: 'rgba(43,24,18,0.5)',
                  border: '1px solid rgba(212,175,55,0.1)',
                  borderRadius: 10, padding: '1rem 1.1rem',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <i
                  className={`fas ${tip.icon}`}
                  style={{ color: 'rgba(212,175,55,0.5)', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'block' }}
                />
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'rgba(245,237,216,0.8)', marginBottom: '0.3rem' }}>
                  {tip.title}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(245,237,216,0.35)', lineHeight: 1.6 }}>
                  {tip.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
