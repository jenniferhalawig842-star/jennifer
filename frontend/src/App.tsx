import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { CartProvider } from './hooks/useCart'

import Ribbon          from './components/Ribbon'
import Navbar          from './components/Navbar'
import Footer          from './components/Footer'
import ProtectedRoute  from './components/ProtectedRoute'

import HomePage   from './pages/HomePage'
import LoginPage  from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MenuPage   from './pages/MenuPage'
import BuyPage    from './pages/BuyPage'
import AdminPage  from './pages/AdminPage'
import StaffPage      from './pages/StaffPage'
import TrackPage      from './pages/TrackPage'
import NotFoundPage   from './pages/NotFoundPage'

// Pages that show the public Navbar + Footer
const FOOTER_ROUTES = ['/', '/login', '/signup', '/buy', '/track']

function Layout() {
  const location = useLocation()
  const path = location.pathname

  // Admin/Staff pages use their own sidebars — no public nav/footer
  const isDashboard = path.startsWith('/admin') || path.startsWith('/staff')

  return (
    <>
      <Ribbon />

      {!isDashboard && <Navbar />}

      <Routes>
        <Route path="/"       element={<HomePage />} />
        <Route path="/menu"   element={<MenuPage />} />
        <Route path="/buy"    element={<BuyPage />} />
        <Route path="/track"  element={<TrackPage />} />
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/staff/*"
          element={
            <ProtectedRoute requiredRole={['admin', 'staff']}>
              <StaffPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Show footer only on specific public pages */}
      {!isDashboard && FOOTER_ROUTES.includes(path) && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Layout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
