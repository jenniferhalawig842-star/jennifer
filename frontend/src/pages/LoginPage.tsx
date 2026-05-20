import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import api from '../lib/api'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/login', { username, password })
      login(data.token, data.user)
      if (data.user.role === 'admin')      navigate('/admin')
      else if (data.user.role === 'staff') navigate('/staff')
      else                                 navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: 'var(--ink)',
        paddingTop: 'calc(var(--ribbon-h) + var(--nav-h))',
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <i className="fas fa-mug-hot text-4xl mb-4" style={{ color: 'var(--gold)' }} />
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--serif)' }}>
            VELVET<span style={{ color: 'var(--gold)' }}>ROAST</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'rgba(245,237,216,0.55)', letterSpacing: '0.1em' }}>
            WELCOME BACK
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-xl p-8"
          style={{
            background: 'rgba(43,24,18,0.75)',
            border: '1px solid rgba(212,175,55,0.15)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {error && (
            <div
              className="mb-5 px-4 py-3 rounded-lg text-sm flex items-center gap-2"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}
            >
              <i className="fas fa-circle-exclamation" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold mb-2 tracking-widest uppercase" style={{ color: 'var(--gold)' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="your_username"
                className="w-full px-4 py-3 rounded-lg text-sm text-white focus:outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(212,175,55,0.2)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(212,175,55,0.2)')}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 tracking-widest uppercase" style={{ color: 'var(--gold)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg text-sm text-white focus:outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(212,175,55,0.2)',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(212,175,55,0.2)')}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-bold tracking-wider transition-all text-sm disabled:opacity-50"
              style={{ background: 'var(--gold)', color: 'var(--ink)' }}
            >
              {loading ? <><i className="fas fa-circle-notch fa-spin mr-2" />Signing In…</> : 'SIGN IN'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm" style={{ color: 'rgba(245,237,216,0.5)' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--gold)' }} className="font-semibold hover:underline">
              Create one
            </Link>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs hover:opacity-100 transition-opacity" style={{ color: 'rgba(245,237,216,0.35)' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
