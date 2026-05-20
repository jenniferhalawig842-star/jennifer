import { useState, useEffect, useCallback } from 'react'
import '../styles/staff.css'

import { useAuth }       from '../hooks/useAuth'
import api               from '../lib/api'
import type { Order }    from '../types'

import Ribbon            from '../components/Ribbon'
import StaffSidebar      from '../components/StaffSidebar'
import StaffOrdersTable  from '../components/StaffOrdersTable'

type Panel =
  | 'dashboard'
  | 'all-orders'
  | 'pending-orders'
  | 'preparing-orders'
  | 'done-orders'
  | 'cancelled-orders'
  | 'my-orders'

const PANEL_TITLES: Record<Panel, string> = {
  'dashboard':         'Dashboard',
  'all-orders':        'All Orders',
  'pending-orders':    'Pending Orders',
  'preparing-orders':  'Preparing Orders',
  'done-orders':       'Done Orders',
  'cancelled-orders':  'Cancelled Orders',
  'my-orders':         'My Handled Orders',
}

/* ── Stat card ── */
function StatCard({
  label, value, sub, color,
}: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className={`staff-stat-card ${color || ''}`}>
      <div className="staff-stat-label">{label}</div>
      <div className="staff-stat-value">{value}</div>
      {sub && <div className="staff-stat-sub">{sub}</div>}
    </div>
  )
}

export default function StaffPage() {
  const { user }    = useAuth()
  const [panel,     setPanel]   = useState<Panel>('dashboard')
  const [orders,    setOrders]  = useState<Order[]>([])
  const [loading,   setLoading] = useState(true)
  const [clock,     setClock]   = useState('')
  const [flashMsg,  setFlashMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const staffId = user?.id || ''

  // Live clock
  useEffect(() => {
    const tick = () => setClock(
      new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Check for flash from URL params (status update redirect)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ok  = params.get('success')
    const err = params.get('error')
    if (ok)  setFlashMsg({ type: 'ok',  text: ok })
    if (err) setFlashMsg({ type: 'err', text: err })
    if (ok || err) {
      const url = new URL(window.location.href)
      url.searchParams.delete('success')
      url.searchParams.delete('error')
      window.history.replaceState({}, '', url.toString())
    }
  }, [])

  // Auto-dismiss flash
  useEffect(() => {
    if (!flashMsg) return
    const t = setTimeout(() => setFlashMsg(null), 4000)
    return () => clearTimeout(t)
  }, [flashMsg])

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/api/orders')
      setOrders(data)
    } catch (err) {
      console.error('Failed to load orders:', err)
      setFlashMsg({ type: 'err', text: 'Failed to load orders. Please refresh.' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  // Derived counts
  const total     = orders.length
  const pending   = orders.filter(o => o.status === 'pending').length
  const preparing = orders.filter(o => o.status === 'preparing').length
  const done      = orders.filter(o => o.status === 'done').length
  const cancelled = orders.filter(o => o.status === 'cancelled').length
  const mine      = orders.filter(o => o.managed_by === staffId).length

  // Filtered order lists
  const byStatus = (status: string) => orders.filter(o => o.status === status)
  const myOrders = orders.filter(o => o.managed_by === staffId)
  const active   = orders.filter(o => o.status === 'pending' || o.status === 'preparing')

  const handleRefresh = useCallback(() => {
    fetchOrders()
    setFlashMsg({ type: 'ok', text: 'Orders refreshed successfully.' })
  }, [fetchOrders])

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0eb' }}>
      <Ribbon />

      <div className="staff-root">
        {/* Sidebar */}
        <StaffSidebar
          active={panel}
          onNav={p => setPanel(p as Panel)}
          counts={{ total, pending, preparing, done, cancelled, mine }}
        />

        {/* Main */}
        <div className="staff-main">
          {/* Topbar */}
          <div className="staff-topbar">
            <span className="staff-topbar-title">{PANEL_TITLES[panel]}</span>
            <div className="staff-topbar-right">
              <span className="staff-clock">{clock}</span>
              <button
                onClick={handleRefresh}
                style={{
                  fontSize: '0.72rem', padding: '0.3rem 0.75rem',
                  borderRadius: '999px', background: 'rgba(212,175,55,0.1)',
                  color: 'var(--roast)', border: '1px solid rgba(212,175,55,0.25)',
                  fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center',
                  gap: '0.35rem', fontFamily: 'var(--sans)',
                }}
              >
                <i className="fas fa-rotate-right" />
                Refresh
              </button>
              <a className="staff-back-btn" href="/">
                <i className="fas fa-arrow-left" style={{ fontSize: '0.65rem' }} />
                Back to Cafe
              </a>
            </div>
          </div>

          {/* Content */}
          <div className="staff-content">
            {/* Flash */}
            {flashMsg && (
              <div className={`staff-flash ${flashMsg.type}`}>
                <i className={`fas fa-${flashMsg.type === 'ok' ? 'circle-check' : 'circle-exclamation'}`} />
                {flashMsg.text}
                <button
                  onClick={() => setFlashMsg(null)}
                  style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6, fontSize: '0.85rem' }}
                >
                  ✕
                </button>
              </div>
            )}

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
                <div className="loader" style={{ width: 34, height: 34, borderTopColor: 'var(--gold)', borderColor: 'rgba(212,175,55,0.15)' }} />
              </div>
            ) : (
              <>

                {/* ══════════════════════════════
                    DASHBOARD
                ══════════════════════════════ */}
                {panel === 'dashboard' && (
                  <div>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(59,26,13,0.55)', marginBottom: '1.5rem' }}>
                      Welcome back, <strong style={{ color: 'var(--ink)' }}>{user?.fullname || user?.username}</strong>. Here is your shift overview.
                    </p>

                    {/* Stat cards */}
                    <div className="staff-stats">
                      <StatCard label="Total Orders"  value={total}     sub="All time"     />
                      <StatCard label="Pending"        value={pending}   sub="Need action"  color="orange" />
                      <StatCard label="Preparing"      value={preparing} sub="In progress"  color="blue"   />
                      <StatCard label="Done"           value={done}      sub="Completed"    color="green"  />
                      <StatCard label="Cancelled"      value={cancelled} sub="Cancelled"    color="red"    />
                      <StatCard label="I Handled"      value={mine}      sub="By me"        color="sienna" />
                    </div>

                    {/* Active orders quick action */}
                    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--ink)' }}>
                        ⚡ Active Orders — Quick Action
                      </h2>
                      {active.length > 6 && (
                        <button
                          onClick={() => setPanel('all-orders')}
                          style={{
                            fontSize: '0.75rem', color: 'var(--roast)', background: 'none', border: 'none',
                            cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3, fontFamily: 'var(--sans)',
                          }}
                        >
                          View all {active.length} active →
                        </button>
                      )}
                    </div>

                    {active.length === 0 ? (
                      <div className="staff-table-card">
                        <div className="staff-empty">
                          <i className="fas fa-mug-hot" style={{ fontSize: '2.5rem' }} />
                          <p style={{ fontFamily: 'var(--serif)', fontSize: '1rem', marginBottom: 4 }}>
                            🎉 All caught up!
                          </p>
                          <p>No active orders right now.</p>
                        </div>
                      </div>
                    ) : (
                      <StaffOrdersTable
                        orders={active.slice(0, 8)}
                        staffId={staffId}
                        onRefresh={fetchOrders}
                        emptyMsg="No active orders."
                      />
                    )}

                    {/* My recent handled */}
                    {myOrders.length > 0 && (
                      <div style={{ marginTop: '2rem' }}>
                        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', color: 'var(--ink)' }}>
                            🙋 Recently Handled by Me
                          </h2>
                          <button
                            onClick={() => setPanel('my-orders')}
                            style={{
                              fontSize: '0.75rem', color: 'var(--roast)', background: 'none', border: 'none',
                              cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3, fontFamily: 'var(--sans)',
                            }}
                          >
                            See all {myOrders.length} →
                          </button>
                        </div>
                        <StaffOrdersTable
                          orders={myOrders.slice(0, 4)}
                          staffId={staffId}
                          onRefresh={fetchOrders}
                          emptyMsg="You haven't handled any orders yet."
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* ══════════════════════════════
                    ALL ORDERS
                ══════════════════════════════ */}
                {panel === 'all-orders' && (
                  <>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(59,26,13,0.5)', marginBottom: '1.25rem' }}>
                      All orders. Click any order code to expand full details and update status.
                    </p>
                    <StaffOrdersTable
                      orders={orders}
                      staffId={staffId}
                      onRefresh={fetchOrders}
                      emptyMsg="No orders found."
                    />
                  </>
                )}

                {/* ══════════════════════════════
                    PENDING
                ══════════════════════════════ */}
                {panel === 'pending-orders' && (
                  <>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(59,26,13,0.5)', marginBottom: '1.25rem' }}>
                      Orders waiting to be started. Click a code to expand, then set to <strong>Preparing</strong>.
                    </p>
                    <StaffOrdersTable
                      orders={byStatus('pending')}
                      staffId={staffId}
                      onRefresh={fetchOrders}
                      emptyMsg="No pending orders. All clear! ☕"
                    />
                  </>
                )}

                {/* ══════════════════════════════
                    PREPARING
                ══════════════════════════════ */}
                {panel === 'preparing-orders' && (
                  <>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(59,26,13,0.5)', marginBottom: '1.25rem' }}>
                      Orders currently in progress. Set to <strong>Done</strong> when ready for pickup or delivery.
                    </p>
                    <StaffOrdersTable
                      orders={byStatus('preparing')}
                      staffId={staffId}
                      onRefresh={fetchOrders}
                      emptyMsg="No orders currently being prepared."
                    />
                  </>
                )}

                {/* ══════════════════════════════
                    DONE
                ══════════════════════════════ */}
                {panel === 'done-orders' && (
                  <>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(59,26,13,0.5)', marginBottom: '1.25rem' }}>
                      Completed orders.
                    </p>
                    <StaffOrdersTable
                      orders={byStatus('done')}
                      staffId={staffId}
                      onRefresh={fetchOrders}
                      emptyMsg="No completed orders yet."
                    />
                  </>
                )}

                {/* ══════════════════════════════
                    CANCELLED
                ══════════════════════════════ */}
                {panel === 'cancelled-orders' && (
                  <>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(59,26,13,0.5)', marginBottom: '1.25rem' }}>
                      Cancelled orders.
                    </p>
                    <StaffOrdersTable
                      orders={byStatus('cancelled')}
                      staffId={staffId}
                      onRefresh={fetchOrders}
                      emptyMsg="No cancelled orders."
                    />
                  </>
                )}

                {/* ══════════════════════════════
                    MY HANDLED ORDERS
                ══════════════════════════════ */}
                {panel === 'my-orders' && (
                  <>
                    <p style={{ fontSize: '0.85rem', color: 'rgba(59,26,13,0.5)', marginBottom: '1.25rem' }}>
                      Orders you have personally handled or updated their status.
                    </p>
                    <StaffOrdersTable
                      orders={myOrders}
                      staffId={staffId}
                      onRefresh={fetchOrders}
                      emptyMsg="You haven't handled any orders yet."
                    />
                  </>
                )}

              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
