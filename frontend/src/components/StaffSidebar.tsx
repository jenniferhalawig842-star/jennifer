import { useAuth }    from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

interface Props {
  active:  string
  onNav:   (panel: string) => void
  counts: {
    total:     number
    pending:   number
    preparing: number
    done:      number
    cancelled: number
    mine:      number
  }
}

const NAV = [
  {
    section: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    ],
  },
  {
    section: 'Manage Orders',
    items: [
      { id: 'all-orders',       label: 'All Orders',    icon: 'fa-receipt',      badge: 'total',     badgeColor: 'blue'   },
      { id: 'pending-orders',   label: 'Pending',       icon: 'fa-clock',        badge: 'pending',   badgeColor: 'orange' },
      { id: 'preparing-orders', label: 'Preparing',     icon: 'fa-mug-hot',      badge: 'preparing', badgeColor: 'blue'   },
      { id: 'done-orders',      label: 'Done',          icon: 'fa-circle-check'                                           },
      { id: 'cancelled-orders', label: 'Cancelled',     icon: 'fa-circle-xmark'                                          },
    ],
  },
  {
    section: 'My Activity',
    items: [
      { id: 'my-orders', label: 'My Handled Orders', icon: 'fa-hand', badge: 'mine', badgeColor: 'orange' },
    ],
  },
]

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function StaffSidebar({ active, onNav, counts }: Props) {
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
    <aside className="staff-sidebar">
      {/* Brand */}
      <div className="staff-brand">
        <div className="staff-logo">
          <i className="fas fa-mug-hot" />
          VELVET<span style={{ color: '#fff' }}>ROAST</span>
        </div>
        <div className="staff-panel-tag">Staff Panel</div>
      </div>

      {/* User chip */}
      <div className="staff-user-chip">
        <div className="staff-avatar">{initials(user?.fullname || 'S')}</div>
        <div>
          <div className="staff-uname">{user?.username || 'staff'}</div>
          <div className="staff-urole">Staff Member</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1 }}>
        {NAV.map(group => (
          <div key={group.section}>
            <div className="staff-section">{group.section}</div>
            {group.items.map(item => {
              const badgeVal = getBadge((item as any).badge)
              const color    = (item as any).badgeColor || 'orange'
              return (
                <button
                  key={item.id}
                  className={`staff-nav-item ${active === item.id ? 'active' : ''}`}
                  onClick={() => onNav(item.id)}
                >
                  <i className={`fas ${item.icon}`} />
                  {item.label}
                  {badgeVal !== null && (
                    <span className={`staff-badge ${color}`}>{badgeVal > 99 ? '99+' : badgeVal}</span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="staff-sidebar-footer">
        <a
          href="/"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            color: 'rgba(245,237,216,0.4)', fontSize: '0.78rem',
            textDecoration: 'none', marginBottom: '0.75rem',
            transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(245,237,216,0.7)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(245,237,216,0.4)')}
        >
          <i className="fas fa-store" />
          Back to Cafe
        </a>
        <button className="staff-logout-btn" onClick={handleLogout}>
          <i className="fas fa-arrow-right-from-bracket" />
          Log Out
        </button>
      </div>
    </aside>
  )
}
