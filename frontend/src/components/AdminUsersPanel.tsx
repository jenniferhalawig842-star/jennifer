import { useState } from 'react'
import type { User } from '../types'
import api from '../lib/api'

/* ═══════════════════════════
   USERS PANEL
═══════════════════════════ */
interface UsersPanelProps {
  users: User[]
  onRefresh: () => void
  roleFilter?: 'staff' | 'user'
  showAddModal?: boolean
  onCloseAddModal?: () => void
}

interface UserForm {
  fullname: string; email: string; username: string
  password: string; role: string
}

const EMPTY_USER: UserForm = { fullname: '', email: '', username: '', password: '', role: 'user' }

function roleBadge(role: string) {
  const cls: Record<string, string> = {
    admin: 'badge-admin',
    staff: 'badge-staff',
    user:  'badge-user',
  }
  return `badge ${cls[role] || 'badge-user'}`
}

export function AdminUsersPanel({ users, onRefresh, roleFilter, showAddModal, onCloseAddModal }: UsersPanelProps) {
  const [search,  setSearch]  = useState('')
  const [modal,   setModal]   = useState(showAddModal ?? false)
  const [editing, setEditing] = useState<User | null>(null)
  const [form,    setForm]    = useState<UserForm>(EMPTY_USER)
  const [loading, setLoading] = useState(false)
  const [flash,   setFlash]   = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const filtered = users.filter(u => {
    const matchRole = !roleFilter || u.role === roleFilter
    const matchQ    = !search ||
      u.fullname.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchQ
  })

  const openAdd = () => {
    setEditing(null)
    setForm({ ...EMPTY_USER, role: roleFilter || 'user' })
    setModal(true)
  }

  const openEdit = (u: User) => {
    setEditing(u)
    setForm({ fullname: u.fullname, email: u.email, username: u.username, password: '', role: u.role })
    setModal(true)
  }

  const closeModal = () => {
    setModal(false)
    setEditing(null)
    setForm(EMPTY_USER)
    onCloseAddModal?.()
  }

  const set = (k: keyof UserForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSave = async () => {
    if (!form.fullname || !form.email || !form.username) {
      setFlash('Name, email and username are required.')
      return
    }
    if (!editing && !form.password) {
      setFlash('Password is required for new users.')
      return
    }
    setLoading(true)
    try {
      const payload: any = { fullname: form.fullname, email: form.email, username: form.username, role: form.role }
      if (form.password) payload.password = form.password
      if (editing) {
        await api.put(`/api/users/${editing.id}`, payload)
        setFlash('User updated.')
      } else {
        await api.post('/api/users', payload)
        setFlash('User created.')
      }
      closeModal()
      onRefresh()
    } catch (err: any) {
      setFlash(err.response?.data?.message || 'Failed to save user.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return
    setDeleting(id)
    try {
      await api.delete(`/api/users/${id}`)
      onRefresh()
    } catch { alert('Failed to delete user.') }
    finally { setDeleting(null) }
  }

  const title = roleFilter === 'staff' ? 'Staff Members' : roleFilter === 'user' ? 'Customers' : 'All Users'

  return (
    <>
      {flash && (
        <div className={`admin-flash ${flash.includes('updated') || flash.includes('created') ? 'ok' : 'err'}`}>
          <i className={`fas fa-${flash.includes('updated') || flash.includes('created') ? 'circle-check' : 'circle-exclamation'}`} />
          {flash}
          <button onClick={() => setFlash('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }}>✕</button>
        </div>
      )}

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h2>{title} <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 400 }}>({filtered.length})</span></h2>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <div className="admin-search">
              <i className="fas fa-magnifying-glass" />
              <input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={openAdd}>
              <i className="fas fa-plus" />
              {roleFilter === 'staff' ? 'Add Staff' : 'Add User'}
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="admin-empty">
            <i className="fas fa-users" />
            <p>No users found.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id}>
                    <td style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{i + 1}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: '50%', background: '#ede9fe', color: '#5b21b6',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                        }}>
                          {u.fullname.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{u.fullname}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#4f46e5', fontWeight: 600 }}>@{u.username}</td>
                    <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>{u.email}</td>
                    <td><span className={roleBadge(u.role)}>{u.role}</span></td>
                    <td style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{u.date_registered?.slice(0, 10)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn-secondary" onClick={() => openEdit(u)} style={{ padding: '0.3rem 0.7rem' }}>
                          <i className="fas fa-pen" />
                        </button>
                        <button
                          className="btn-danger"
                          onClick={() => handleDelete(u.id)}
                          disabled={deleting === u.id}
                          style={{ padding: '0.3rem 0.7rem' }}
                        >
                          {deleting === u.id
                            ? <i className="fas fa-circle-notch fa-spin" />
                            : <i className="fas fa-trash" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editing ? `Edit ${editing.fullname}` : (roleFilter === 'staff' ? 'Add Staff Member' : 'Add User')}</h3>
              <button className="admin-modal-close" onClick={closeModal}><i className="fas fa-times" /></button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-grid cols-2">
                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="admin-label">Full Name *</label>
                  <input className="admin-input" placeholder="Juan Dela Cruz" value={form.fullname} onChange={set('fullname')} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Username *</label>
                  <input className="admin-input" placeholder="juan123" value={form.username} onChange={set('username')} />
                </div>
                {roleFilter !== 'staff' && (
                  <div className="admin-field">
                    <label className="admin-label">Role</label>
                    <select className="admin-input" value={form.role} onChange={set('role')}>
                      <option value="user">User</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                )}
                {roleFilter === 'staff' && (
                  <div className="admin-field">
                    <label className="admin-label">Role</label>
                    <div className="admin-input" style={{ background: '#f3f4f6', color: '#6b7280', cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-id-badge" style={{ color: '#4f46e5' }} />
                      Staff (fixed)
                    </div>
                  </div>
                )}
                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="admin-label">Email *</label>
                  <input className="admin-input" type="email" placeholder="juan@email.com" value={form.email} onChange={set('email')} />
                </div>
                <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                  <label className="admin-label">{editing ? 'New Password (leave blank to keep)' : 'Password *'}</label>
                  <input className="admin-input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} />
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn-primary" onClick={handleSave} disabled={loading}>
                {loading
                  ? <><i className="fas fa-circle-notch fa-spin" /> Saving…</>
                  : <><i className="fas fa-check" /> {editing ? 'Save Changes' : 'Create'}</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ═══════════════════════════
   INVENTORY PANEL (product stock view)
═══════════════════════════ */
interface InventoryProps {
  products: Product[]
  orders: any[]
}

export function AdminInventoryPanel({ products, orders }: InventoryProps) {
  // Build sales summary from orders
  const salesMap: Record<string, { units: number; revenue: number }> = {}
  orders.forEach(o => {
    ;(o.order_items || []).forEach((item: any) => {
      if (!salesMap[item.product_name]) salesMap[item.product_name] = { units: 0, revenue: 0 }
      salesMap[item.product_name].units   += Number(item.qty)
      salesMap[item.product_name].revenue += Number(item.price) * Number(item.qty)
    })
  })

  const rows = products.map(p => ({
    ...p,
    units:   salesMap[p.name]?.units   ?? 0,
    revenue: salesMap[p.name]?.revenue ?? 0,
  })).sort((a, b) => b.revenue - a.revenue)

  const totalRevenue = rows.reduce((s, r) => s + r.revenue, 0)
  const totalUnits   = rows.reduce((s, r) => s + r.units, 0)

  return (
    <div className="admin-table-card">
      <div className="admin-table-header">
        <h2>Inventory & Sales</h2>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
          <span style={{ color: '#6b7280' }}>
            Total Revenue: <strong style={{ color: '#065f46' }}>₱{totalRevenue.toFixed(2)}</strong>
          </span>
          <span style={{ color: '#6b7280' }}>
            Units Sold: <strong style={{ color: '#1e40af' }}>{totalUnits}</strong>
          </span>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Units Sold</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p, i) => (
              <tr key={p.id}>
                <td style={{ color: '#9ca3af', fontSize: '0.75rem' }}>{i + 1}</td>
                <td>
                  <div className="inventory-product-cell">
                    {p.image_path ? (
                      <img src={p.image_path} alt={p.name} className="inventory-thumb" />
                    ) : (
                      <div className="inventory-thumb-ph">
                        <i className="fas fa-mug-hot" style={{ color: '#d1d5db' }} />
                      </div>
                    )}
                    <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{p.name}</span>
                  </div>
                </td>
                <td style={{ fontSize: '0.78rem', color: '#4f46e5', fontWeight: 600 }}>{p.category}</td>
                <td style={{ fontWeight: 600 }}>₱{Number(p.price).toFixed(2)}</td>
                <td><span className={`badge ${p.status === 'available' ? 'badge-available' : 'badge-unavailable'}`}>{p.status}</span></td>
                <td>
                  <span style={{
                    fontWeight: 700,
                    color: p.units > 0 ? '#1e40af' : '#9ca3af',
                  }}>
                    {p.units}
                  </span>
                </td>
                <td style={{ fontWeight: 700, color: p.revenue > 0 ? '#065f46' : '#9ca3af' }}>
                  ₱{p.revenue.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
