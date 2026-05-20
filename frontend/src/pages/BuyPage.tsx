import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/buy.css'

import { useCart }  from '../hooks/useCart'
import { useAuth }  from '../hooks/useAuth'
import api          from '../lib/api'
import type { Order } from '../types'

import OrderSuccess   from '../components/OrderSuccess'
import TrackDrawer    from '../components/TrackDrawer'
import PhAddressForm  from '../components/PhAddressForm'

type DeliveryMethod = 'pickup' | 'delivery'
type PaymentMethod  = 'cash'   | 'gcash'

interface FormErrors {
  name?:    string
  phone?:   string
  email?:   string
  address?: string
}

interface AddressData {
  full_address: string
  street:       string
  barangay:     string
  municipality: string
  province:     string
  country:      string
  lat?:         number
  lng?:         number
}

const DELIVERY_FEE = 60
const STEP_LABELS  = ['Details', 'Delivery', 'Payment']

export default function BuyPage() {
  const { items, total: subtotal, clearCart } = useCart()
  const { user } = useAuth()

  const [name,     setName]     = useState(user?.fullname || '')
  const [email,    setEmail]    = useState(user?.email    || '')
  const [phone,    setPhone]    = useState('')
  const [notes,    setNotes]    = useState('')
  const [delivery, setDelivery] = useState<DeliveryMethod>('pickup')
  const [payment,  setPayment]  = useState<PaymentMethod>('cash')
  const [errors,   setErrors]   = useState<FormErrors>({})
  const [loading,  setLoading]  = useState(false)
  const [addressData, setAddressData] = useState<AddressData>({
    full_address: '', street: '', barangay: '', municipality: '', province: '', country: 'Philippines',
  })
  const [order,     setOrder]     = useState<Order | null>(null)
  const [showTrack, setShowTrack] = useState(false)
  const [trackCode, setTrackCode] = useState('')

  const deliveryFee = delivery === 'delivery' ? DELIVERY_FEE : 0
  const grandTotal  = subtotal + deliveryFee
  const currentStep = delivery === 'pickup' ? 1 : 2

  const validate = (): boolean => {
    const errs: FormErrors = {}
    if (!name.trim())  errs.name  = 'Full name is required.'
    if (!phone.trim()) errs.phone = 'Phone number is required.'
    if (phone.trim() && !/^[\d\s\+\-\(\)]{7,15}$/.test(phone.trim()))
      errs.phone = 'Enter a valid phone number.'
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.email = 'Enter a valid email address.'
    if (delivery === 'delivery' && !addressData.municipality)
      errs.address = 'Please select at least your City / Municipality.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handlePlaceOrder = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const { data } = await api.post('/api/orders', {
        user_id:          user?.id || null,
        customer_name:    name.trim(),
        customer_email:   email.trim() || null,
        customer_phone:   phone.trim(),
        customer_address: delivery === 'delivery' ? addressData.full_address : 'Pickup at store',
        city:             delivery === 'delivery' ? addressData.municipality : '',
        delivery_method:  delivery,
        notes:            notes.trim() || null,
        payment_method:   payment,
        delivery_fee:     deliveryFee,
        discount:         0,
        items: items.map(i => ({
          product_name: i.product_name,
          product_img:  i.product_img || null,
          size:         i.size,
          qty:          i.qty,
          price:        i.price,
        })),
      })
      clearCart()
      setOrder(data.order)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!items.length && !order) {
    return (
      <div className="buy-page">
        <div className="buy-empty">
          <i className="fas fa-bag-shopping" style={{ fontSize: '4rem', color: 'rgba(212,175,55,0.2)', display: 'block' }} />
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', color: '#fff', marginTop: '0.5rem' }}>
            Your cart is <em style={{ color: 'var(--gold)' }}>empty</em>
          </h2>
          <p style={{ color: 'rgba(245,237,216,0.45)', fontSize: '0.875rem' }}>
            Add some items from our menu before checking out.
          </p>
          <Link to="/menu" className="btn-gold" style={{ marginTop: '1rem' }}>Browse Menu</Link>
        </div>
      </div>
    )
  }

  if (order) {
    return (
      <>
        <OrderSuccess order={order} onTrackOrder={() => { setTrackCode(order.ref_code); setShowTrack(true) }} />
        {showTrack && <TrackDrawer onClose={() => setShowTrack(false)} initialCode={trackCode} />}
      </>
    )
  }

  return (
    <div className="buy-page">
      <div className="buy-hero">
        <div className="buy-hero-content" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-label" style={{ display: 'block', textAlign: 'center' }}>Checkout</span>
          <h1 className="section-title" style={{ textAlign: 'center', marginBottom: '1.75rem' }}>Almost <em>There</em></h1>
          <div className="buy-steps">
            {STEP_LABELS.map((label, i) => {
              const idx   = i + 1
              const state = idx < currentStep ? 'done' : idx === currentStep ? 'active' : 'pending'
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="step-item">
                    <div className={`step-dot ${state}`}>
                      {state === 'done' ? <i className="fas fa-check" style={{ fontSize: '0.65rem' }} /> : idx}
                    </div>
                    <span className={`step-label ${state}`}>{label}</span>
                  </div>
                  {i < STEP_LABELS.length - 1 && <div className={`step-line ${state === 'done' ? 'done' : ''}`} />}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="buy-container">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Customer Details */}
          <div className="buy-card">
            <div className="buy-card-header">
              <i className="fas fa-user" />
              <h2>Customer Details</h2>
              {user && <span style={{ fontSize: '0.7rem', color: 'var(--gold)', background: 'rgba(212,175,55,0.1)', padding: '0.2rem 0.6rem', borderRadius: '999px', fontWeight: 600 }}>Signed in</span>}
            </div>
            <div className="buy-card-body">
              <div className="field-group cols-2">
                <div className="form-field">
                  <label className="form-label">Full Name <span className="required">*</span></label>
                  <input type="text" className={`form-input ${errors.name ? 'error' : ''}`} placeholder="Juan Dela Cruz" value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })) }} />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>
                <div className="form-field">
                  <label className="form-label">Phone Number <span className="required">*</span></label>
                  <input type="tel" className={`form-input ${errors.phone ? 'error' : ''}`} placeholder="+63 912 345 6789" value={phone} onChange={e => { setPhone(e.target.value); setErrors(p => ({ ...p, phone: '' })) }} />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
              </div>
              <div className="field-group">
                <div className="form-field">
                  <label className="form-label">Email Address</label>
                  <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="juan@email.com (optional)" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }} />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
              </div>
              <div className="form-field">
                <label className="form-label">Special Instructions</label>
                <textarea className="form-input" placeholder="Any notes for your order? (allergies, preferences, etc.)" value={notes} onChange={e => setNotes(e.target.value)} rows={2} />
              </div>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="buy-card">
            <div className="buy-card-header">
              <i className="fas fa-truck" />
              <h2>Delivery Method</h2>
            </div>
            <div className="buy-card-body">
              <div className="delivery-toggle">
                <div className={`delivery-option ${delivery === 'pickup' ? 'selected' : ''}`} onClick={() => setDelivery('pickup')}>
                  <div className="delivery-option-icon"><i className="fas fa-store" /></div>
                  <div>
                    <div className="delivery-option-label">Pick Up</div>
                    <div className="delivery-option-sub">Free · Ready in ~15 min</div>
                  </div>
                  {delivery === 'pickup' && <i className="fas fa-circle-check" style={{ marginLeft: 'auto', color: 'var(--gold)', fontSize: '1rem' }} />}
                </div>
                <div className={`delivery-option ${delivery === 'delivery' ? 'selected' : ''}`} onClick={() => setDelivery('delivery')}>
                  <div className="delivery-option-icon"><i className="fas fa-motorcycle" /></div>
                  <div>
                    <div className="delivery-option-label">Delivery</div>
                    <div className="delivery-option-sub">+&#8369;{DELIVERY_FEE} · ~30–45 min</div>
                  </div>
                  {delivery === 'delivery' && <i className="fas fa-circle-check" style={{ marginLeft: 'auto', color: 'var(--gold)', fontSize: '1rem' }} />}
                </div>
              </div>

              {delivery === 'pickup' && (
                <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.12)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <i className="fas fa-map-marker-alt" style={{ color: 'var(--gold)', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', marginBottom: 3 }}>Velvet Roast — Tagbilaran (Main Branch)</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(245,237,216,0.5)', lineHeight: 1.5 }}>Rizal Street, Tagbilaran City, Bohol<br />Mon–Fri: 7:00 AM – 9:00 PM · Sat–Sun: 9:00 AM – 10:00 PM</div>
                  </div>
                </div>
              )}

              {delivery === 'delivery' && (
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(212,175,55,0.8)', display: 'block', marginBottom: 0 }}>
                      Delivery Address <span style={{ color: '#f87171', marginLeft: 2 }}>*</span>
                    </label>
                    <p style={{ fontSize: '0.72rem', color: 'rgba(245,237,216,0.35)', marginTop: '0.25rem' }}>
                      Select your region → province → city → barangay, then enter your street address.
                    </p>
                  </div>
                  <PhAddressForm
                    onChange={data => {
                      setAddressData(data)
                      if (data.municipality) setErrors(p => ({ ...p, address: '' }))
                    }}
                    error={errors.address}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="buy-card">
            <div className="buy-card-header">
              <i className="fas fa-credit-card" />
              <h2>Payment Method</h2>
            </div>
            <div className="buy-card-body">
              <div className="payment-options">
                <div className={`payment-option ${payment === 'cash' ? 'selected' : ''}`} onClick={() => setPayment('cash')}>
                  <span className="payment-icon">&#128181;</span>
                  <div><div className="payment-label">Cash</div><div className="payment-sub">Pay on pickup / delivery</div></div>
                  {payment === 'cash' && <i className="fas fa-circle-check" style={{ marginLeft: 'auto', color: 'var(--gold)' }} />}
                </div>
                <div className={`payment-option ${payment === 'gcash' ? 'selected' : ''}`} onClick={() => setPayment('gcash')}>
                  <span className="payment-icon">&#128241;</span>
                  <div><div className="payment-label">GCash</div><div className="payment-sub">Send to 0994-311-5286</div></div>
                  {payment === 'gcash' && <i className="fas fa-circle-check" style={{ marginLeft: 'auto', color: 'var(--gold)' }} />}
                </div>
              </div>
              {payment === 'gcash' && (
                <div style={{ marginTop: '0.75rem', padding: '0.85rem 1rem', borderRadius: '8px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', fontSize: '0.78rem', color: 'rgba(245,237,216,0.7)', lineHeight: 1.6 }}>
                  <i className="fas fa-circle-info" style={{ color: '#818cf8', marginRight: 6 }} />
                  After placing your order, send <strong style={{ color: '#fff' }}>&#8369;{grandTotal.toFixed(2)}</strong> to GCash number <strong style={{ color: 'var(--gold)' }}>0994-311-5286</strong> with your order code as the reference. Screenshot and send to us on Facebook.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary-card">
          <div className="summary-header">
            <i className="fas fa-receipt" />
            Order Summary
            <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'rgba(245,237,216,0.4)', fontFamily: 'var(--sans)' }}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div className="summary-items">
            {items.map(item => (
              <div key={`${item.product_id}-${item.size}`} className="summary-item">
                {item.product_img
                  ? <img src={item.product_img} alt={item.product_name} className="summary-item-img" />
                  : <div className="summary-item-img-ph"><i className="fas fa-mug-hot" style={{ color: 'rgba(212,175,55,0.3)', fontSize: '1rem' }} /></div>}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="summary-item-name">{item.product_name}</div>
                  <div className="summary-item-meta">{item.size} · &#215;{item.qty}</div>
                </div>
                <div className="summary-item-price">&#8369;{(item.price * item.qty).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <div className="summary-totals">
            <div className="summary-row"><span className="label">Subtotal</span><span className="value">&#8369;{subtotal.toFixed(2)}</span></div>
            <div className="summary-row">
              <span className="label">Delivery Fee{delivery === 'pickup' && <span style={{ marginLeft: 6, fontSize: '0.65rem', color: '#34d399', background: 'rgba(52,211,153,0.1)', padding: '0.1rem 0.4rem', borderRadius: '999px' }}>FREE</span>}</span>
              <span className="value">{delivery === 'pickup' ? <span style={{ color: '#34d399' }}>{'₱'}0.00</span> : <>{'₱'}{deliveryFee.toFixed(2)}</>}</span>
            </div>
            <div className="summary-row"><span className="label">Discount</span><span className="value">&#8369;0.00</span></div>
            <div className="summary-row total-row"><span className="label">Total</span><span className="value">&#8369;{grandTotal.toFixed(2)}</span></div>
          </div>

          {delivery === 'delivery' && addressData.municipality && (
            <div style={{ margin: '0 1.4rem 0.75rem', padding: '0.6rem 0.85rem', borderRadius: '8px', background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.18)', fontSize: '0.73rem', color: 'rgba(245,237,216,0.65)', display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
              <i className="fas fa-location-dot" style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 2 }} />
              <span style={{ lineHeight: 1.5 }}>{addressData.full_address}</span>
            </div>
          )}

          <div style={{ margin: '0 1.4rem 0.75rem', padding: '0.55rem 0.85rem', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'rgba(245,237,216,0.5)' }}>
            <i className={`fas fa-${payment === 'gcash' ? 'mobile-screen' : 'money-bill-wave'}`} style={{ color: 'var(--gold)' }} />
            {payment === 'gcash' ? 'Paying via GCash' : 'Paying with Cash'}
            <span style={{ marginLeft: 'auto' }}>{delivery === 'delivery' ? <>{'₱'} &#128757; Delivery</> : <>{'₱'} &#127968; Pick Up</>}</span>
          </div>

          <button className="place-order-btn" onClick={handlePlaceOrder} disabled={loading}>
            {loading
              ? <><div className="loader" style={{ width: 18, height: 18, borderTopColor: 'var(--ink)', borderColor: 'rgba(26,14,8,0.3)' }} />Placing Order…</>
              : <><i className="fas fa-bag-shopping" />Place Order · &#8369;{grandTotal.toFixed(2)}</>}
          </button>
        </div>
      </div>
    </div>
  )
}
