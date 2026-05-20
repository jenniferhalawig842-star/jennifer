import { useState, useEffect, useCallback } from 'react'
import '../styles/admin.css'

import { useAuth }   from '../hooks/useAuth'
import api           from '../lib/api'
import type { Product, Order, User } from '../types'

import AdminSidebar        from '../components/AdminSidebar'
import AdminOrdersPanel    from '../components/AdminOrdersPanel'
import AdminProductsPanel  from '../components/AdminProductsPanel'
import { AdminUsersPanel, AdminInventoryPanel } from '../components/AdminUsersPanel'

type Panel =
  | 'dashboard'
  | 'users' | 'staff' | 'add-staff'
  | 'orders' | 'pending'
  | 'products' | 'add-product' | 'inventory'

const PANEL_TITLES: Record<Panel, string> = {
  dashboard:    'Dashboard',
  users:        'Users',
  staff:        'Staff Members',
  'add-staff':  'Add Staff',
  orders:       'All Orders',
  pending:      'Pending Orders',
  products:     'Menu / Products',
  'add-product':'Add Product',
  inventory:    'Inventory & Sales',
}

export default function AdminPage() {
  const { user }  = useAuth()
  const [panel,   setPanel]    = useState<Panel>('dashboard')
  const [products, setProducts] = useState<Product[]>([])
  const [orders,   setOrders]   = useState<Order[]>([])
  const [users,    setUsers]    = useState<User[]>([])
  const [loading,  setLoading]  = useState(true)
  const [clock,    setClock]    = useState('')

  // Live clock
  useEffect(() => {
    const tick = () => setClock(
      new Date().toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    )
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Fetch all data
  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [pRes, oRes, uRes] = await Promise.all([
        api.get('/api/products'),
        api.get('/api/orders'),
        api.get('/api/users'),
      ])
      setProducts(pRes.data)
      setOrders(oRes.data)
      setUsers(uRes.data)
    } catch (err) {
      console.error('Failed to load admin data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Derived counts
  const nonAdminUsers = users.filter(u => u.role !== 'admin')
  const staffUsers    = users.filter(u => u.role === 'staff')
  const customerUsers = users.filter(u => u.role === 'user')
  const pendingOrders = orders.filter(o => o.status === 'pending')
  const doneOrders    = orders.filter(o => o.status === 'done')
  const cancelledOrders = orders.filter(o => o.status === 'cancelled')
  const preparingOrders = orders.filter(o => o.status === 'preparing')

  // Total revenue from done orders
  const totalRevenue = doneOrders.reduce((s, o) => s + Number(o.total), 0)

  const counts = {
    users:    nonAdminUsers.length,
    staff:    staffUsers.length,
    orders:   orders.length,
    pending:  pendingOrders.length,
    products: products.length,
  }

  const navTo = (p: string) => setPanel(p as Panel)

  // ── Dashboard quick stats ──
  const StatCard = ({
    label, value, sub, color,
  }: { label: string; value: string | number; sub?: string; color?: string }) => (
    <div className={`admin-stat-card ${color || ''}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <div className="admin-root">
        {/* Sidebar */}
        <AdminSidebar active={panel} onNav={navTo} counts={counts} />

        {/* Main */}
        <div className="admin-main">
          {/* Topbar */}
          <div className="admin-topbar">
            <span className="admin-topbar-title">{PANEL_TITLES[panel]}</span>
            <div className="admin-topbar-right">
              <span className="admin-clock">{clock}</span>
              <a
                href="/"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.35rem 0.9rem',
                  borderRadius: '999px',
                  background: '#ede9fe',
                  color: '#4f46e5',
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: '1px solid #c4b5fd',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <i className="fas fa-arrow-left" style={{ fontSize: '0.65rem' }} />
                Back to Site
              </a>
            </div>
          </div>

          {/* Content */}
          <div className="admin-content">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
                <div className="loader" style={{ width: 36, height: 36, borderTopColor: '#4f46e5', borderColor: '#e5e7eb' }} />
              </div>
            ) : (
              <>

                {/* ══════════════════════════════
                    DASHBOARD
                ══════════════════════════════ */}
                {panel === 'dashboard' && (
                  <div>
                    <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                      Welcome back, <strong style={{ color: '#1e1b4b' }}>{user?.fullname}</strong>. Here's your store overview.
                    </p>

                    {/* Stats */}
                    <div className="admin-stats">
                      <StatCard label="Total Orders"  value={orders.length}         sub="All time"        />
                      <StatCard label="Pending"        value={pendingOrders.length}  sub="Need action"     color="orange" />
                      <StatCard label="Preparing"      value={preparingOrders.length} sub="In progress"   color="blue"   />
                      <StatCard label="Done"           value={doneOrders.length}     sub="Completed"       color="green"  />
                      <StatCard label="Cancelled"      value={cancelledOrders.length} sub="Cancelled"      color="red"    />
                      <StatCard label="Products"       value={products.length}       sub="In catalog"      color="gold"   />
                      <StatCard label="Staff"          value={staffUsers.length}     sub="Members"                        />
                      <StatCard label="Revenue"        value={`₱${totalRevenue.toFixed(0)}`} sub="From done orders" color="green" />
                    </div>

                    {/* Recent orders quick view */}
                    <div className="admin-table-card" style={{ marginBottom: '1.5rem' }}>
                      <div className="admin-table-header">
                        <h2>⚡ Active Orders</h2>
                        <button
                          className="btn-secondary"
                          onClick={() => navTo('orders')}
                          style={{ fontSize: '0.75rem' }}
                        >
                          View All Orders
                        </button>
                      </div>
                      {pendingOrders.length === 0 && preparingOrders.length === 0 ? (
                        <div className="admin-empty">
                          <i className="fas fa-mug-hot" />
                          <p>No active orders right now — all caught up!</p>
                        </div>
                      ) : (
                        <AdminOrdersPanel
                          orders={[...pendingOrders, ...preparingOrders].slice(0, 8)}
                          onRefresh={fetchAll}
                        />
                      )}
                    </div>

                    {/* Top products */}
                    <div className="admin-table-card">
                      <div className="admin-table-header">
                        <h2>📦 Top Products by Revenue</h2>
                        <button className="btn-secondary" onClick={() => navTo('inventory')} style={{ fontSize: '0.75rem' }}>
                          View Inventory
                        </button>
                      </div>
                      {(() => {
                        const salesMap: Record<string, { units: number; revenue: number }> = {}
                        orders.forEach(o =>
                          (o.order_items || []).forEach((item: any) => {
                            if (!salesMap[item.product_name]) salesMap[item.product_name] = { units: 0, revenue: 0 }
                            salesMap[item.product_name].units   += Number(item.qty)
                            salesMap[item.product_name].revenue += Number(item.price) * Number(item.qty)
                          })
                        )
                        const top = Object.entries(salesMap)
                          .sort((a, b) => b[1].revenue - a[1].revenue)
                          .slice(0, 5)
                        if (!top.length) return (
                          <div className="admin-empty">
                            <i className="fas fa-boxes-stacking" />
                            <p>No sales data yet.</p>
                          </div>
                        )
                        return (
                          <div style={{ overflowX: 'auto' }}>
                            <table className="admin-table">
                              <thead>
                                <tr>
                                  <th>Rank</th>
                                  <th>Product</th>
                                  <th>Units Sold</th>
                                  <th>Revenue</th>
                                </tr>
                              </thead>
                              <tbody>
                                {top.map(([name, data], i) => (
                                  <tr key={name}>
                                    <td style={{ fontWeight: 700, color: i === 0 ? '#D4AF37' : '#6b7280', fontSize: '1rem', fontFamily: 'var(--serif)' }}>
                                      #{i + 1}
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{name}</td>
                                    <td style={{ color: '#1e40af', fontWeight: 600 }}>{data.units}</td>
                                    <td style={{ color: '#065f46', fontWeight: 700 }}>₱{data.revenue.toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                )}

                {/* ══════════════════════════════
                    USERS
                ══════════════════════════════ */}
                {panel === 'users' && (
                  <AdminUsersPanel
                    users={nonAdminUsers}
                    onRefresh={fetchAll}
                  />
                )}

                {/* ══════════════════════════════
                    STAFF
                ══════════════════════════════ */}
                {panel === 'staff' && (
                  <AdminUsersPanel
                    users={staffUsers}
                    onRefresh={fetchAll}
                    roleFilter="staff"
                  />
                )}

                {/* ══════════════════════════════
                    ADD STAFF (opens modal immediately)
                ══════════════════════════════ */}
                {panel === 'add-staff' && (
                  <AdminUsersPanel
                    users={staffUsers}
                    onRefresh={fetchAll}
                    roleFilter="staff"
                    showAddModal
                    onCloseAddModal={() => navTo('staff')}
                  />
                )}

                {/* ══════════════════════════════
                    ALL ORDERS
                ══════════════════════════════ */}
                {panel === 'orders' && (
                  <AdminOrdersPanel orders={orders} onRefresh={fetchAll} />
                )}

                {/* ══════════════════════════════
                    PENDING ORDERS
                ══════════════════════════════ */}
                {panel === 'pending' && (
                  <AdminOrdersPanel
                    orders={orders}
                    filterStatus="pending"
                    onRefresh={fetchAll}
                  />
                )}

                {/* ══════════════════════════════
                    PRODUCTS
                ══════════════════════════════ */}
                {panel === 'products' && (
                  <AdminProductsPanel products={products} onRefresh={fetchAll} />
                )}

                {/* ══════════════════════════════
                    ADD PRODUCT (opens modal)
                ══════════════════════════════ */}
                {panel === 'add-product' && (
                  <AdminProductsPanel
                    products={products}
                    onRefresh={fetchAll}
                    openAddModal
                    onCloseAddModal={() => navTo('products')}
                  />
                )}

                {/* ══════════════════════════════
                    INVENTORY
                ══════════════════════════════ */}
                {panel === 'inventory' && (
                  <AdminInventoryPanel products={products} orders={orders} />
                )}

              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
