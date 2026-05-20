import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function SignupPage() {
  const [form, setForm] = useState({
    fullname: '', email: '', username: '', password: '', confirm: '',
  })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      await api.post('/api/auth/register', {
        fullname: form.fullname,
        email:    form.email,
        username: form.username,
        password: form.password,
      })
      navigate('/login?registered=1')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(212,175,55,0.2)',
  }

  const Field = ({
    label, type = 'text', field, placeholder,
  }: { label: string; type?: string; field: keyof typeof form; placeholder: string }) => (
    <div>
      <label className="block text-xs font-semibold mb-2 tracking-widest uppercase" style={{ color: 'var(--gold)' }}>
        {label}
      </label>
      <input
        type={type}
        value={form[field]}
        onChange={set(field)}
        required
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg text-sm text-white focus:outline-none transition-all"
        style={inputStyle}
        onFocus={e => (e.target.style.borderColor = 'var(--gold)')}
        onBlur={e  => (e.target.style.borderColor = 'rgba(212,175,55,0.2)')}
      />
    </div>
  )

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{
        background: 'var(--ink)',
        paddingTop: 'calc(var(--ribbon-h) + var(--nav-h) + 2rem)',
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <i className="fas fa-mug-hot text-4xl mb-4" style={{ color: 'var(--gold)' }} />
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--serif)' }}>
            Join <span style={{ color: 'var(--gold)' }}>Velvet Roast</span>
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'rgba(245,237,216,0.55)', letterSpacing: '0.1em' }}>
            CREATE YOUR ACCOUNT
          </p>
        </div>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full Name"  field="fullname" placeholder="Juan Dela Cruz" />
            <Field label="Email"      field="email"    type="email" placeholder="juan@email.com" />
            <Field label="Username"   field="username" placeholder="juan123" />
            <Field label="Password"   field="password" type="password" placeholder="••••••••" />
            <Field label="Confirm Password" field="confirm" type="password" placeholder="••••••••" />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-bold tracking-wider transition-all text-sm disabled:opacity-50 mt-2"
              style={{ background: 'var(--gold)', color: 'var(--ink)' }}
            >
              {loading ? <><i className="fas fa-circle-notch fa-spin mr-2" />Creating Account…</> : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm" style={{ color: 'rgba(245,237,216,0.5)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--gold)' }} className="font-semibold hover:underline">
              Sign in
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
