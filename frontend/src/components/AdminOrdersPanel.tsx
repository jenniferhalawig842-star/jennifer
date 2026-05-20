import { useState } from 'react'
import type { Order } from '../types'
import api from '../lib/api'

interface Props {
  orders: Order[]
  filterStatus?: string
  onRefresh: () => void
}

const STATUS_LIST = ['pending', 'preparing', 'done', 'cancelled']

function statusBadge(status: string) {
  const cls: Record<string, string> = {
    pending:   'badge-pending',
    preparing: 'badge-preparing',
    done:      'badge-done',
    cancelled: 'badge-cancelled',
  }
  return `badge ${cls[status] || 'badge-pending'}`
}

export default function AdminOrdersPanel({ orders, filterStatus, onRefresh }: Props) {
  const [openId,   setOpenId]   = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [search,   setSearch]   = useState('')

  const filtered = orders.filter(o => {
    const matchStatus = !filterStatus || o.status === filterStatus
    const matchSearch = !search ||
      o.ref_code.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const toggle = (id: string) => setOpenId(prev => prev === id ? null : id)

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId)
    try {
      await api.patch(`/api/orders/${orderId}/status`, { status })
      onRefresh()
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status.')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div className="admin-table-card">
      <div className="admin-table-header">
        <h2>
          {filterStatus
            ? `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Orders`
            : 'All Orders'}
          <span style={{ marginLeft: 8, fontSize: '0.75rem', color: '#9ca3af', fontWeight: 400 }}>
            ({filtered.length})
          </span>
        </h2>
        <div className="admin-search">
          <i className="fas fa-magnifying-glass" />
          <input
            placeholder="Search code or name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty">
          <i className="fas fa-receipt" />
          <p>No orders found.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Code</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Method</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, idx) => {
                const isOpen = openId === o.id
                const isFinal = o.status === 'done' || o.status === 'cancelled'
                const itemCount = o.order_items?.length ?? 0
                const orderTotal = o.order_items?.reduce(
                  (s, i) => s + Number(i.price) * Number(i.qty), 0
                ) ?? Number(o.total)

                return (
                  <>
                    <tr
                      key={o.id}
                      className={`admin-order-row ${isOpen ? 'open' : ''}`}
                      onClick={() => toggle(o.id)}
                    >
                      <td style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{idx + 1}</td>
                      <td>
                        <span style={{
                          fontWeight: 700,
                          color: '#4f46e5',
                          fontSize: '0.8rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}>
                          VR-{o.ref_code}
                          <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}
                            style={{ fontSize: '0.55rem', opacity: 0.5 }} />
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{o.customer_name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{o.customer_phone}</div>
                      </td>
                      <td>
                        <span style={{
                          background: '#f3f4f6', padding: '0.15rem 0.55rem',
                          borderRadius: 999, fontSize: '0.72rem', fontWeight: 600,
                        }}>
                          {itemCount}x
                        </span>
                      </td>
                      <td style={{ textTransform: 'capitalize', fontSize: '0.8rem' }}>
                        {o.delivery_method === 'delivery'
                          ? <><i className="fas fa-motorcycle" style={{ marginRight: 4, color: '#6b7280' }} />Delivery</>
                          : <><i className="fas fa-store" style={{ marginRight: 4, color: '#6b7280' }} />Pickup</>
                        }
                      </td>
                      <td style={{ textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 600 }}>
                        {o.payment_method}
                      </td>
                      <td style={{ fontWeight: 600 }}>₱{Number(orderTotal).toFixed(2)}</td>
                      <td>
                        <span className={statusBadge(o.status)}>{o.status}</span>
                      </td>
                      <td style={{ fontSize: '0.72rem', color: '#9ca3af' }}>
                        {o.created_at?.slice(0, 16).replace('T', ' ')}
                      </td>
                    </tr>

                    {/* Expand row */}
                    <tr key={`exp-${o.id}`} className={`admin-expand-row ${isOpen ? 'open' : ''}`}>
                      <td colSpan={9} className="admin-expand-td">
                        <div className="admin-expand-inner">
                          <div className="admin-expand-grid">

                            {/* Customer info */}
                            <div className="admin-expand-section">
                              <h4>Customer</h4>
                              {[
                                ['Name',    o.customer_name],
                                ['Phone',   o.customer_phone],
                                ['Email',   o.customer_email],
                                ['Address', o.customer_address],
                                ['City',    o.city],
                              ].filter(([, v]) => v).map(([l, v]) => (
                                <div key={l} className="admin-detail-row">
                                  <span className="admin-detail-lbl">{l}</span>
                                  <span className="admin-detail-val">{v}</span>
                                </div>
                              ))}
                            </div>

                            {/* Order info */}
                            <div className="admin-expand-section">
                              <h4>Order Info</h4>
                              {[
                                ['Code',     `VR-${o.ref_code}`],
                                ['Delivery', o.delivery_method],
                                ['Payment',  o.payment_method?.toUpperCase()],
                                ['Fee',      `₱${Number(o.delivery_fee).toFixed(2)}`],
                                ['Handled',  o.managed_by_name || '—'],
                                ['Placed',   o.created_at?.slice(0, 16).replace('T', ' ')],
                              ].map(([l, v]) => (
                                <div key={l} className="admin-detail-row">
                                  <span className="admin-detail-lbl">{l}</span>
                                  <span className="admin-detail-val">{v}</span>
                                </div>
                              ))}
                            </div>

                            {/* Status update */}
                            <div className="admin-expand-section">
                              <h4>Update Status</h4>
                              <div className="admin-status-btns">
                                {STATUS_LIST.map(s => (
                                  <button
                                    key={s}
                                    className={`admin-st-btn ${o.status === s ? `sel-${s}` : ''}`}
                                    disabled={isFinal || updating === o.id}
                                    onClick={e => {
                                      e.stopPropagation()
                                      updateStatus(o.id, s)
                                    }}
                                  >
                                    {updating === o.id && o.status !== s
                                      ? <i className="fas fa-circle-notch fa-spin" style={{ marginRight: 4 }} />
                                      : null
                                    }
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                  </button>
                                ))}
                              </div>
                              {isFinal && (
                                <p style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                                  Order is finalized. Status cannot be changed.
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Items */}
                          {o.order_items && o.order_items.length > 0 && (
                            <div>
                              <h4 style={{
                                fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em',
                                color: '#6b7280', marginBottom: '0.6rem', paddingBottom: '0.4rem',
                                borderBottom: '1px solid #e5e7eb', fontWeight: 700,
                              }}>
                                Ordered Items
                              </h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                {o.order_items.map((item, i) => (
                                  <div key={i} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '0.5rem 0.75rem', borderRadius: 8,
                                    background: '#fff', border: '1px solid #f3f4f6',
                                  }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                      <div style={{
                                        width: 22, height: 22, borderRadius: '50%',
                                        background: '#ede9fe', color: '#5b21b6',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '0.65rem', fontWeight: 700, flexShrink: 0,
                                      }}>
                                        {i + 1}
                                      </div>
                                      <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.82rem' }}>{item.product_name}</div>
                                        <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{item.size}</div>
                                      </div>
                                    </div>
                                    <div style={{ textAlign: 'right', fontSize: '0.8rem' }}>
                                      <div style={{ fontWeight: 600 }}>
                                        ₱{(Number(item.price) * Number(item.qty)).toFixed(2)}
                                      </div>
                                      <div style={{ color: '#9ca3af', fontSize: '0.7rem' }}>
                                        ×{item.qty} · ₱{Number(item.price).toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div style={{
                                display: 'flex', justifyContent: 'flex-end',
                                marginTop: '0.75rem', paddingTop: '0.75rem',
                                borderTop: '1px solid #e5e7eb', gap: '0.75rem',
                                fontSize: '0.82rem', color: '#6b7280',
                              }}>
                                <span>Total</span>
                                <span style={{ fontWeight: 700, color: '#374151', fontSize: '0.95rem' }}>
                                  ₱{Number(orderTotal).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}

                          {o.notes && (
                            <div style={{
                              marginTop: '0.75rem', padding: '0.6rem 0.85rem',
                              background: '#fffbf0', border: '1px solid #f0e5c8',
                              borderRadius: 8, fontSize: '0.78rem', color: '#7c5a00',
                            }}>
                              <strong>Note:</strong> {o.notes}
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
      )}
    </div>
  )
}
