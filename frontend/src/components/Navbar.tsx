import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../hooks/useCart'
import CartDrawer  from './CartDrawer'
import TrackDrawer from './TrackDrawer'

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [showCart,    setShowCart]    = useState(false)
  const [showTrack,   setShowTrack]   = useState(false)
  const { user, logout } = useAuth()
  const { count }        = useCart()
  const location         = useLocation()
  const navigate         = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close profile dropdown on outside click
  useEffect(() => {
    if (!profileOpen) return
    const handler = () => setProfileOpen(false)
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [profileOpen])

  const handleLogout = () => {
    logout()
    navigate('/')
    setProfileOpen(false)
  }

  const isActive = (path: string) => location.pathname === path ? 'active' : ''
  const isMenu   = location.pathname === '/menu'

  const initials = (name: string) =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} style={{ top: 'var(--ribbon-h)' }}>
        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2 no-underline group">
          <i className="fas fa-mug-hot text-2xl" style={{ color: 'var(--gold)' }} />
          <span
            className="text-2xl font-bold tracking-wider text-white"
            style={{ fontFamily: 'var(--serif)' }}
          >
            VELVET<span style={{ color: 'var(--gold)' }}>ROAST</span>
          </span>
        </Link>

        {/* ── Desktop Links ── */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/"      className={`nav-link ${isActive('/')}`}>Home</Link>
          <Link to="/menu"  className={`nav-link ${isActive('/menu')}`}>Menu</Link>
          <a href="/#about"     className="nav-link">Our Story</a>
          <a href="/#about-us"  className="nav-link">About Us</a>
          <a href="/#locations" className="nav-link">Locations</a>
        </div>

        {/* ── Right Side ── */}
        <div className="flex items-center gap-3">

          {/* Track Order icon — always visible */}
          <button
            onClick={() => setShowTrack(true)}
            className="hidden md:flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: 'rgba(245,237,216,0.55)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)' }}
            title="Track your order"
          >
            <i className="fas fa-location-dot" style={{ color: 'var(--gold)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em' }}>Track</span>
          </button>

          {/* Cart icon — always visible */}
          <button
            onClick={() => setShowCart(true)}
            className="nav-cart-btn"
            title="Your cart"
            style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', color: 'rgba(245,237,216,0.8)', fontSize: '1.15rem', padding: '0.4rem' }}
          >
            <i className="fas fa-bag-shopping" />
            {count > 0 && (
              <span className="nav-cart-badge">{count > 9 ? '9+' : count}</span>
            )}
          </button>

          {/* Auth section */}
          {user ? (
            <div className="relative">
              <button
                onClick={e => { e.stopPropagation(); setProfileOpen(v => !v) }}
                className="flex items-center gap-2 focus:outline-none"
                aria-expanded={profileOpen}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all"
                  style={{
                    background: 'var(--roast)',
                    borderColor: profileOpen ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
                    color: profileOpen ? 'var(--gold)' : '#fff',
                    fontFamily: 'var(--lato)',
                  }}
                >
                  {initials(user.fullname)}
                </div>
              </button>

              {/* Profile Dropdown */}
              <div
                className="absolute right-0 mt-3 w-56 rounded-xl overflow-hidden shadow-2xl transition-all duration-200"
                style={{
                  top: '100%',
                  background: 'rgba(26,14,8,0.98)',
                  border: '1px solid rgba(212,175,55,0.2)',
                  opacity: profileOpen ? 1 : 0,
                  transform: profileOpen ? 'translateY(0)' : 'translateY(-8px)',
                  pointerEvents: profileOpen ? 'auto' : 'none',
                  zIndex: 200,
                }}
              >
                <div
                  className="px-4 py-3 border-b"
                  style={{ background: 'rgba(212,175,55,0.08)', borderColor: 'rgba(212,175,55,0.15)' }}
                >
                  <p className="font-semibold text-sm text-white">{user.fullname}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--gold)' }}>@{user.username}</p>
                  <span
                    className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
                    style={{ background: 'rgba(212,175,55,0.2)', color: 'var(--gold)' }}
                  >
                    {user.role}
                  </span>
                </div>

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors no-underline"
                    style={{ color: 'var(--cream)' }}
                    onClick={() => setProfileOpen(false)}
                  >
                    <i className="fas fa-shield-halved w-4" style={{ color: 'var(--gold)' }} />
                    Admin Panel
                  </Link>
                )}
                {(user.role === 'staff' || user.role === 'admin') && (
                  <Link
                    to="/staff"
                    className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors no-underline"
                    style={{ color: 'var(--cream)' }}
                    onClick={() => setProfileOpen(false)}
                  >
                    <i className="fas fa-mug-saucer w-4" style={{ color: 'var(--gold)' }} />
                    Staff Panel
                  </Link>
                )}
                <button
                  onClick={() => { setShowTrack(true); setProfileOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors"
                  style={{ color: 'var(--cream)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', textAlign: 'left' }}
                >
                  <i className="fas fa-location-dot w-4" style={{ color: 'var(--gold)' }} />
                  Track Order
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors border-t"
                  style={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.06)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', textAlign: 'left', borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <i className="fas fa-arrow-right-from-bracket w-4" style={{ color: 'var(--gold)' }} />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:block px-5 py-2 border font-bold tracking-wider transition-all duration-300 text-sm no-underline"
              style={{
                borderColor: 'var(--gold)',
                color: 'var(--gold)',
                fontFamily: 'var(--serif)',
                fontStyle: 'italic',
                fontSize: '1rem',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.background = 'var(--gold)'
                ;(e.currentTarget as HTMLElement).style.color = 'var(--ink)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                ;(e.currentTarget as HTMLElement).style.color = 'var(--gold)'
              }}
            >
              Sign In
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setMenuOpen(v => !v)}
          >
            <i className={`fas fa-${menuOpen ? 'times' : 'bars'}`} />
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        {menuOpen && (
          <div
            className="absolute left-0 right-0 md:hidden px-6 py-4 flex flex-col gap-4"
            style={{
              top: '100%',
              background: 'rgba(26,14,8,0.98)',
              backdropFilter: 'blur(16px)',
              borderTop: '1px solid rgba(212,175,55,0.15)',
              zIndex: 150,
            }}
          >
            <Link to="/"     onClick={() => setMenuOpen(false)} className="nav-link">Home</Link>
            <Link to="/menu" onClick={() => setMenuOpen(false)} className="nav-link">Menu</Link>
            <a href="/#about"    onClick={() => setMenuOpen(false)} className="nav-link">Our Story</a>
            <a href="/#locations" onClick={() => setMenuOpen(false)} className="nav-link">Locations</a>
            <button
              onClick={() => { setShowTrack(true); setMenuOpen(false) }}
              className="nav-link text-left"
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--sans)', padding: 0 }}
            >
              Track Order
            </button>
            {!user && (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-gold text-center">Sign In</Link>
            )}
          </div>
        )}
      </nav>

      {/* ── Drawers (rendered at navbar level so they're always accessible) ── */}
      {showCart  && <CartDrawer  onClose={() => setShowCart(false)} />}
      {showTrack && <TrackDrawer onClose={() => setShowTrack(false)} />}
    </>
  )
}
