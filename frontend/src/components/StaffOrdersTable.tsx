import { useState } from 'react'
import type { Order } from '../types'
import api from '../lib/api'

interface Props {
  orders:    Order[]
  staffId:   string
  onRefresh: () => void
  emptyMsg?: string
}

const STATUS_LIST = ['pending', 'preparing', 'done', 'cancelled'] as const

const DELIVERY_PILL: Record<string, React.CSSProperties> = {
  delivery: { background: '#e0f2fe', color: '#075985' },
  pickup:   { background: '#f5f3ff', color: '#4c1d95' },
}

const PAYMENT_PILL: Record<string, React.CSSProperties> = {
  cash:   { background: '#f0fdf4', color: '#14532d' },
  gcash:  { background: '#eef2ff', color: '#1e3a8a' },
}

const STATUS_PILL: Record<string, string> = {
  pending:   'badge-pending',
  preparing: 'badge-preparing',
  done:      'badge-done',
  cancelled: 'badge-cancelled',
}

export default function StaffOrdersTable({ orders, staffId, onRefresh, emptyMsg }: Props) {
  const [openId,   setOpenId]   = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [search,   setSearch]   = useState('')

  const filtered = orders.filter(o =>
    !search ||
    o.ref_code.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (id: string) => setOpenId(prev => prev === id ? null : id)

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId + status)
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status })
      onRefresh()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status.')
    } finally {
      setUpdating(null)
    }
  }

  if (filtered.length === 0) {
    return (
      <div className="staff-table-card">
        <div className="staff-table-header">
          <h2>Orders <span style={{ fontSize: '0.75rem', color: 'rgba(59,26,13,0.4)', fontWeight: 400 }}>({filtered.length})</span></h2>
          <div className="staff-search">
            <i className="fas fa-magnifying-glass" />
            <input placeholder="Search code or name…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="staff-empty">
          <i className="fas fa-mug-hot" />
          <p>{emptyMsg || 'No orders in this category.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="staff-table-card">
      <div className="staff-table-header">
        <h2>
          Orders
          <span style={{ fontSize: '0.75rem', color: 'rgba(59,26,13,0.4)', fontWeight: 400, marginLeft: 6 }}>
            ({filtered.length})
          </span>
        </h2>
        <div className="staff-search">
          <i className="fas fa-magnifying-glass" />
          <input
            placeholder="Search code or name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="staff-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Order Code</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Delivery</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o, idx) => {
              const isOpen  = openId === o.id
              const isFinal = o.status === 'done' || o.status === 'cancelled'
              const items   = o.order_items || []
              const total   = items.reduce((s, i) => s + Number(i.price) * Number(i.qty), 0) || Number(o.total)
              const deliv   = (o.delivery_method || 'pickup').toLowerCase()
              const pay     = (o.payment_method  || 'cash').toLowerCase()
              const managedByMe = o.managed_by === staffId

              return (
                <>
                  {/* Main row */}
                  <tr
                    key={o.id}
                    className={isOpen ? 'row-open' : ''}
                    onClick={() => toggle(o.id)}
                  >
                    <td style={{ color: 'rgba(59,26,13,0.4)', fontSize: '0.73rem' }}>{idx + 1}</td>

                    <td>
                      <span className="order-code-chip">
                        VR-{o.ref_code}
                        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}
                          style={{ fontSize: '0.52rem', opacity: 0.55, marginLeft: 2 }} />
                      </span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{o.customer_name}</div>
                      {o.customer_phone && (
                        <div style={{ fontSize: '0.7rem', color: 'rgba(59,26,13,0.4)' }}>{o.customer_phone}</div>
                      )}
                    </td>

                    <td>
                      <span style={{
                        background: '#f5ede3', padding: '0.15rem 0.55rem',
                        borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, color: 'var(--roast)',
                      }}>
                        {items.length}×
                      </span>
                    </td>

                    <td>
                      <span className="pill" style={DELIVERY_PILL[deliv] || DELIVERY_PILL.pickup}>
                        {deliv === 'delivery' ? '🛵 Delivery' : '🏠 Pickup'}
                      </span>
                    </td>

                    <td>
                      <span className="pill" style={PAYMENT_PILL[pay] || PAYMENT_PILL.cash}>
                        {pay.toUpperCase()}
                      </span>
                    </td>

                    <td style={{ fontWeight: 700, fontSize: '0.88rem' }}>₱{total.toFixed(2)}</td>

                    <td>
                      <span className={`badge ${STATUS_PILL[o.status] || 'badge-pending'}`}>
                        {o.status}
                      </span>
                    </td>

                    <td style={{ fontSize: '0.7rem', color: 'rgba(59,26,13,0.4)' }}>
                      {o.created_at?.slice(0, 16).replace('T', ' ')}
                    </td>
                  </tr>

                  {/* Expand row */}
                  <tr key={`exp-${o.id}`} className={`staff-expand-row ${isOpen ? 'open' : ''}`}>
                    <td colSpan={9} className="staff-expand-td">
                      <div className="staff-expand-inner">

                        {/* 3-col info grid */}
                        <div className="staff-expand-grid">

                          {/* Customer */}
                          <div className="staff-expand-section">
                            <h4>Customer</h4>
                            {[
                              ['Name',    o.customer_name],
                              ['Phone',   o.customer_phone],
                              ['Email',   o.customer_email],
                              ['Address', o.customer_address],
                              ['City',    o.city],
                            ].filter(([, v]) => v).map(([l, v]) => (
                              <div key={l} className="staff-detail-row">
                                <span className="staff-detail-lbl">{l}</span>
                                <span className="staff-detail-val">{v}</span>
                              </div>
                            ))}
                          </div>

                          {/* Order info */}
                          <div className="staff-expand-section">
                            <h4>Order Info</h4>
                            {[
                              ['Code',     `VR-${o.ref_code}`],
                              ['Delivery', o.delivery_method],
                              ['Payment',  o.payment_method?.toUpperCase()],
                              ['Handled',  managedByMe
                                ? '✓ You'
                                : (o.managed_by_name || '—')],
                              ['Placed',   o.created_at?.slice(0, 16).replace('T', ' ')],
                            ].map(([l, v]) => (
                              <div key={l} className="staff-detail-row">
                                <span className="staff-detail-lbl">{l}</span>
                                <span
                                  className="staff-detail-val"
                                  style={l === 'Handled' && managedByMe ? { color: '#2d6a4f', fontWeight: 700 } : {}}
                                >
                                  {v}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Status update */}
                          <div className="staff-expand-section">
                            <h4>Update Status</h4>
                            <div className="staff-st-btns">
                              {STATUS_LIST.map(s => {
                                const isUpdating = updating === o.id + s
                                return (
                                  <button
                                    key={s}
                                    className={`staff-st-btn ${o.status === s ? `sel-${s}` : ''}`}
                                    disabled={isFinal || !!updating}
                                    onClick={e => { e.stopPropagation(); updateStatus(o.id, s) }}
                                  >
                                    {isUpdating
                                      ? <i className="fas fa-circle-notch fa-spin" style={{ marginRight: 4 }} />
                                      : null
                                    }
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                  </button>
                                )
                              })}
                            </div>
                            {isFinal && (
                              <p style={{ fontSize: '0.7rem', color: 'rgba(59,26,13,0.4)', marginTop: '0.5rem' }}>
                                Order is finalized and cannot be changed.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Items list */}
                        {items.length > 0 && (
                          <div>
                            <h4 style={{
                              fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.14em',
                              color: 'var(--roast)', marginBottom: '0.65rem', paddingBottom: '0.4rem',
                              borderBottom: '1px solid #ecddd0', fontWeight: 700,
                            }}>
                              Ordered Items
                            </h4>
                            {items.map((item, i) => (
                              <div key={i} className="staff-ei-row">
                                <div className="staff-ei-left">
                                  <div className="staff-ei-num">{i + 1}</div>
                                  <div>
                                    <div className="staff-ei-name">{item.product_name}</div>
                                    <div className="staff-ei-size">{item.size}</div>
                                  </div>
                                </div>
                                <div>
                                  <div className="staff-ei-price">
                                    ₱{(Number(item.price) * Number(item.qty)).toFixed(2)}
                                  </div>
                                  <div className="staff-ei-qty">
                                    ×{item.qty} · ₱{Number(item.price).toFixed(2)}
                                  </div>
                                </div>
                              </div>
                            ))}
                            <div className="staff-order-total">
                              <span>Order Total</span>
                              <strong>₱{total.toFixed(2)}</strong>
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {o.notes && (
                          <div style={{
                            marginTop: '0.75rem', padding: '0.6rem 0.85rem',
                            background: '#fffbf0', border: '1px solid #f0e5c8',
                            borderRadius: 8, fontSize: '0.78rem', color: '#7c5a00',
                          }}>
                            <strong>Note: </strong>{o.notes}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
