import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)

  // Auto-redirect after 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { navigate('/'); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [navigate])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--ink)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 'calc(var(--ribbon-h) + var(--nav-h))',
        padding: 'calc(var(--ribbon-h) + var(--nav-h) + 2rem) 1.5rem 4rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(212,175,55,0.05) 0%, transparent 70%)',
      }} />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1, maxWidth: '480px' }}>
        {/* Big 404 */}
        <div
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(6rem, 20vw, 10rem)',
            fontWeight: 700,
            color: 'var(--gold)',
            lineHeight: 1,
            opacity: 0.15,
            userSelect: 'none',
            marginBottom: '-1.5rem',
          }}
        >
          404
        </div>

        {/* Icon */}
        <div
          style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(212,175,55,0.1)',
            border: '1.5px solid rgba(212,175,55,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <i className="fas fa-mug-hot" style={{ color: 'var(--gold)', fontSize: '1.75rem' }} />
        </div>

        {/* Heading */}
        <h1
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            color: '#fff',
            marginBottom: '0.75rem',
            lineHeight: 1.2,
          }}
        >
          Looks Like This Cup<br />
          <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Ran Empty</em>
        </h1>

        <p style={{ color: 'rgba(245,237,216,0.45)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2rem' }}>
          The page you're looking for doesn't exist or has been moved.
          Let's get you back to something warm.
        </p>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <Link
            to="/"
            className="btn-gold"
            style={{ padding: '0.75rem 1.75rem', fontSize: '0.8rem' }}
          >
            <i className="fas fa-house" style={{ marginRight: 8 }} />
            Back to Home
          </Link>

          <Link
            to="/menu"
            className="btn-outline-gold"
            style={{
              padding: '0.75rem 1.75rem', fontSize: '0.8rem',
              color: 'rgba(245,237,216,0.7)', borderColor: 'rgba(245,237,216,0.2)',
            }}
          >
            <i className="fas fa-mug-hot" style={{ marginRight: 8 }} />
            Browse Menu
          </Link>
        </div>

        {/* Quick links */}
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {[
            { to: '/track',  label: 'Track Order',  icon: 'fa-location-dot' },
            { to: '/login',  label: 'Sign In',       icon: 'fa-user'         },
            { to: '/#about', label: 'Our Story',     icon: 'fa-book-open'    },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontSize: '0.78rem', color: 'rgba(245,237,216,0.4)',
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem',
                transition: 'color 0.15s',
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'var(--gold)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(245,237,216,0.4)')}
            >
              <i className={`fas ${link.icon}`} style={{ fontSize: '0.72rem' }} />
              {link.label}
            </Link>
          ))}
        </div>

        {/* Countdown */}
        <p style={{ fontSize: '0.72rem', color: 'rgba(245,237,216,0.2)' }}>
          Redirecting to home in{' '}
          <span style={{ color: 'rgba(212,175,55,0.5)', fontWeight: 600 }}>{countdown}s</span>
        </p>
      </div>
    </div>
  )
}
