import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

interface Props {
  active: string
  onNav: (panel: string) => void
  counts: {
    users:    number
    staff:    number
    orders:   number
    pending:  number
    products: number
  }
}

const NAV = [
  {
    section: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard',  icon: 'fa-chart-pie' },
    ],
  },
  {
    section: 'People',
    items: [
      { id: 'users',  label: 'Users',  icon: 'fa-users',      badge: 'users'  },
      { id: 'staff',  label: 'Staff',  icon: 'fa-id-badge',   badge: 'staff'  },
      { id: 'add-staff', label: 'Add Staff', icon: 'fa-user-plus' },
    ],
  },
  {
    section: 'Orders',
    items: [
      { id: 'orders',  label: 'All Orders',  icon: 'fa-receipt',    badge: 'orders'  },
      { id: 'pending', label: 'Pending',     icon: 'fa-clock',      badge: 'pending' },
    ],
  },
  {
    section: 'Products',
    items: [
      { id: 'products',    label: 'Menu / Products', icon: 'fa-mug-hot',    badge: 'products' },
      { id: 'add-product', label: 'Add Product',     icon: 'fa-circle-plus' },
      { id: 'inventory',   label: 'Inventory',        icon: 'fa-boxes-stacking' },
    ],
  },
]

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function AdminSidebar({ active, onNav, counts }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const getBadge = (badge?: string): number | null => {
    if (!badge) return null
    const v = counts[badge as keyof typeof counts] ?? 0
    return v > 0 ? v : null
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="admin-sidebar">
      {/* Brand */}
      <div className="sb-brand">
        <div className="sb-logo-text">
          <i className="fas fa-mug-hot" />
          VELVET<span style={{ color: '#fff' }}>ROAST</span>
        </div>
        <div className="sb-panel-label">Admin Panel</div>
      </div>

      {/* User */}
      <div className="sb-user">
        <div className="sb-avatar">{initials(user?.fullname || 'A')}</div>
        <div>
          <div className="sb-user-name">{user?.username || 'admin'}</div>
          <div className="sb-user-role">Administrator</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {NAV.map(group => (
          <div key={group.section}>
            <div className="sb-section">{group.section}</div>
            {group.items.map(item => {
              const badgeVal = getBadge((item as any).badge)
              return (
                <button
                  key={item.id}
                  className={`sb-nav-item ${active === item.id ? 'active' : ''}`}
                  onClick={() => onNav(item.id)}
                >
                  <i className={`fas ${item.icon}`} />
                  {item.label}
                  {badgeVal !== null && (
                    <span className={`sb-badge ${item.id === 'pending' ? '' : 'blue'}`}>
                      {badgeVal > 99 ? '99+' : badgeVal}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sb-footer">
        <button className="sb-logout" onClick={handleLogout}>
          <i className="fas fa-arrow-right-from-bracket" />
          Log Out
        </button>
      </div>
    </aside>
  )
}
