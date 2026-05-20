import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  isAdmin: () => boolean
  isStaff: () => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('vr_token')
    const storedUser  = localStorage.getItem('vr_user')
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('vr_token')
        localStorage.removeItem('vr_user')
      }
    }
    setLoading(false)
  }, [])

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem('vr_token', newToken)
    localStorage.setItem('vr_user', JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('vr_token')
    localStorage.removeItem('vr_user')
    setToken(null)
    setUser(null)
  }

  const isAdmin = () => user?.role === 'admin'
  const isStaff = () => user?.role === 'staff' || user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAdmin, isStaff }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
