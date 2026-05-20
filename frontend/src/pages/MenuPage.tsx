import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/menu.css'

import { useCart } from '../hooks/useCart'
import api from '../lib/api'
import type { Product } from '../types'

import ProductCard    from '../components/ProductCard'
import ProductModal   from '../components/ProductModal'
import CartDrawer     from '../components/CartDrawer'
import TrackDrawer    from '../components/TrackDrawer'
import Toast          from '../components/Toast'

const ALL_CAT = 'All'

export default function MenuPage() {
  const [products,   setProducts]   = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading,    setLoading]    = useState(true)
  const [activecat,  setActiveCat]  = useState(ALL_CAT)
  const [search,     setSearch]     = useState('')
  const [selected,   setSelected]   = useState<Product | null>(null)
  const [showCart,   setShowCart]   = useState(false)
  const [showTrack,  setShowTrack]  = useState(false)
  const [toast,      setToast]      = useState('')

  const { count, total: cartTotal } = useCart()
  const navigate  = useNavigate()
  const catBarRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // ── Load products ──
  useEffect(() => {
    setLoading(true)
    api.get('/api/products')
      .then(({ data }) => {
        setProducts(data)
        const cats: string[] = []
        ;(data as Product[]).forEach(p => {
          if (p.category && !cats.includes(p.category)) cats.push(p.category)
        })
        cats.sort()
        setCategories(cats)
      })
      .catch(() => {
        // Fallback demo products if backend not running
        setProducts(DEMO_PRODUCTS)
        const cats = [...new Set(DEMO_PRODUCTS.map(p => p.category))].sort()
        setCategories(cats)
      })
      .finally(() => setLoading(false))
  }, [])

  // ── Scroll category into view in the tab bar ──
  const scrollCatTab = (cat: string) => {
    const bar = catBarRef.current
    if (!bar) return
    const btn = bar.querySelector(`[data-cat="${cat}"]`) as HTMLElement | null
    if (btn) btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }

  const handleCatClick = (cat: string) => {
    setActiveCat(cat)
    setSearch('')
    scrollCatTab(cat)
    if (cat === ALL_CAT) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    // Scroll to the section
    setTimeout(() => {
      const el = sectionRefs.current[cat]
      if (el) {
        const offset = 140 // ribbon + nav + cat bar
        const top    = el.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }, 50)
  }

  // ── Intersection Observer to update active category on scroll ──
  useEffect(() => {
    if (!categories.length) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const cat = entry.target.getAttribute('data-section')
            if (cat) {
              setActiveCat(cat)
              scrollCatTab(cat)
            }
          }
        })
      },
      { rootMargin: '-140px 0px -60% 0px', threshold: 0 }
    )
    categories.forEach(cat => {
      const el = sectionRefs.current[cat]
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [categories])

  // ── Filtered products ──
  const filtered = products.filter(p => {
    const matchCat    = activecat === ALL_CAT || p.category === activecat
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  // Group by category for "All" view
  const grouped = categories.reduce<Record<string, Product[]>>((acc, cat) => {
    acc[cat] = filtered.filter(p => p.category === cat)
    return acc
  }, {})

  const showToast = useCallback((msg: string) => {
    setToast(msg)
  }, [])

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh' }}>

      {/* ── Hero Banner ── */}
      <div className="menu-hero">
        <div className="menu-hero-bg">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1600&q=80&auto=format&fit=crop"
            alt="Coffee"
          />
        </div>
        <div className="menu-hero-content">
          <span
            style={{
              display: 'block',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '0.5rem',
            }}
          >
            Our Menu
          </span>
          <h1
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: '#fff',
              lineHeight: 1.15,
              marginBottom: '0.75rem',
            }}
          >
            Crafted with <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Passion</em>
          </h1>
          <p style={{ color: 'rgba(245,237,216,0.6)', fontSize: '0.9rem', maxWidth: '420px' }}>
            Every cup tells a story. Browse our full selection of handcrafted beverages and treats.
          </p>
        </div>
      </div>

      {/* ── Sticky Category + Action Bar ── */}
      <div
        className="category-bar"
        ref={catBarRef}
        style={{ display: 'flex', alignItems: 'center', gap: 0 }}
      >
        {/* Category tabs */}
        <button
          data-cat={ALL_CAT}
          className={`cat-tab ${activecat === ALL_CAT ? 'active' : ''}`}
          onClick={() => handleCatClick(ALL_CAT)}
        >
          All
        </button>

        {categories.map(cat => (
          <button
            key={cat}
            data-cat={cat}
            className={`cat-tab ${activecat === cat ? 'active' : ''}`}
            onClick={() => handleCatClick(cat)}
          >
            {cat}
          </button>
        ))}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Search */}
        <div className="menu-search-wrap" style={{ marginRight: '0.75rem', flexShrink: 0 }}>
          <i className="fas fa-magnifying-glass menu-search-icon" />
          <input
            type="text"
            className="menu-search-input"
            placeholder="Search menu…"
            value={search}
            onChange={e => { setSearch(e.target.value); setActiveCat(ALL_CAT) }}
          />
        </div>

        {/* Track order button */}
        
        
      </div>

      {/* ── Products Body ── */}
      <div className="menu-body">

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
            <div className="loader" style={{ width: 36, height: 36 }} />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: '4rem', opacity: 0.45 }}>
            <i className="fas fa-mug-hot text-5xl" style={{ color: 'var(--gold)', display: 'block', marginBottom: '1rem', fontSize: '3rem' }} />
            <p style={{ color: 'rgba(245,237,216,0.5)' }}>No products found{search ? ` for "${search}"` : ''}.</p>
          </div>
        )}

        {!loading && (
          <>
            {/* Search results — flat grid */}
            {search && filtered.length > 0 && (
              <div>
                <div className="menu-section-title">
                  Search results for <em>"{search}"</em>
                  <span style={{ fontSize: '0.85rem', color: 'rgba(245,237,216,0.3)', fontFamily: 'var(--sans)', fontStyle: 'normal' }}>
                    &nbsp;— {filtered.length} found
                  </span>
                </div>
                <div className="menu-section-divider" />
                <div className="product-grid">
                  {filtered.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onClick={setSelected}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Grouped by category */}
            {!search && categories.map(cat => {
              const catProducts = grouped[cat] || []
              if (!catProducts.length) return null

              return (
                <div
                  key={cat}
                  ref={el => { sectionRefs.current[cat] = el }}
                  data-section={cat}
                  style={{ marginBottom: '3.5rem' }}
                >
                  <div className="menu-section-title">
                    {cat.split(' ')[0]} <em>{cat.split(' ').slice(1).join(' ') || ''}</em>
                  </div>
                  <div className="menu-section-divider" />
                  <div className="product-grid">
                    {catProducts.map(p => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        onClick={setSelected}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>

      {/* ── Floating Cart FAB (visible when cart has items) ── */}
      {count > 0 && !showCart && (
        <button
          onClick={() => setShowCart(true)}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 100,
            background: 'var(--gold)',
            color: 'var(--ink)',
            border: 'none',
            borderRadius: '999px',
            padding: '0.85rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontWeight: 700,
            fontSize: '0.82rem',
            cursor: 'pointer',
            boxShadow: '0 8px 28px rgba(212,175,55,0.4)',
            transition: 'all 0.2s ease',
            fontFamily: 'var(--sans)',
            letterSpacing: '0.08em',
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <i className="fas fa-bag-shopping" />
          {count} {count === 1 ? 'item' : 'items'} · ₱{cartTotal.toFixed(2)} →
        </button>
      )}

      {/* ── Product modal ── */}
      {selected && (
        <ProductModal
          product={selected}
          onClose={() => setSelected(null)}
          onAdded={() => showToast(`${selected.name} added to cart!`)}
        />
      )}

      {/* ── Cart drawer (menu-local) ── */}
      {showCart && <CartDrawer onClose={() => setShowCart(false)} />}

      {/* ── Track drawer (menu-local) ── */}
      {showTrack && <TrackDrawer onClose={() => setShowTrack(false)} />}

      {/* ── Toast ── */}
      {toast && (
        <Toast
          message={toast}
          icon="fa-circle-check"
          onDone={() => setToast('')}
        />
      )}
    </div>
  )
}

// ── Demo products (shown when backend is offline) ──
const DEMO_PRODUCTS: Product[] = [
  { id: '1', name: 'Signature Velvet Latte',   category: 'Hot Coffee',  price: 165, status: 'available',   description: 'Our signature espresso with velvety steamed milk and a hint of caramel.',                    image_path: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80', date_added: '' },
  { id: '2', name: 'Classic Americano',         category: 'Hot Coffee',  price: 135, status: 'available',   description: 'Bold espresso shots with hot water for a smooth, rich cup.',                                 image_path: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80', date_added: '' },
  { id: '3', name: 'Cappuccino',                category: 'Hot Coffee',  price: 155, status: 'available',   description: 'Equal parts espresso, steamed milk, and silky foam.',                                        image_path: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&q=80', date_added: '' },
  { id: '4', name: 'Flat White',                category: 'Hot Coffee',  price: 160, status: 'available',   description: 'Ristretto shots topped with velvety microfoam.',                                             image_path: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400&q=80', date_added: '' },
  { id: '5', name: 'Cold Brew Classic',         category: 'Cold Brew',   price: 175, status: 'available',   description: 'Steeped 12 hours for a smooth, low-acid concentrate served over ice.',                       image_path: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80', date_added: '' },
  { id: '6', name: 'Nitro Cold Brew',           category: 'Cold Brew',   price: 195, status: 'available',   description: 'Cold brew infused with nitrogen for a creamy, draft-like pour.',                             image_path: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=400&q=80', date_added: '' },
  { id: '7', name: 'Vanilla Sweet Cream',       category: 'Cold Brew',   price: 195, status: 'unavailable', description: 'Cold brew topped with house-made vanilla sweet cream.',                                      image_path: 'https://images.unsplash.com/photo-1542444256-164bd32461cd?w=400&q=80', date_added: '' },
  { id: '8', name: 'Mocha Frappe',              category: 'Frappe',      price: 185, status: 'available',   description: 'Rich chocolate and espresso blended with ice and topped with whipped cream.',                image_path: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&q=80', date_added: '' },
  { id: '9', name: 'Caramel Frappe',            category: 'Frappe',      price: 185, status: 'available',   description: 'Sweet caramel blended with espresso, milk, and ice.',                                        image_path: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80', date_added: '' },
  { id: '10', name: 'Matcha Frappe',            category: 'Frappe',      price: 185, status: 'available',   description: 'Premium ceremonial matcha blended smooth with oat milk.',                                    image_path: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80', date_added: '' },
  { id: '11', name: 'Jasmine Green Tea',        category: 'Tea',         price: 130, status: 'available',   description: 'Delicate jasmine-scented green tea, served hot or iced.',                                    image_path: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80', date_added: '' },
  { id: '12', name: 'Earl Grey Latte',          category: 'Tea',         price: 145, status: 'available',   description: 'Bergamot-forward Earl Grey steeped in steamed oat milk.',                                    image_path: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=400&q=80', date_added: '' },
  { id: '13', name: 'Butter Croissant',         category: 'Pastry',      price: 95,  status: 'available',   description: 'Flaky, buttery layers baked fresh every morning.',                                           image_path: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80', date_added: '' },
  { id: '14', name: 'Almond Kouign-Amann',      category: 'Pastry',      price: 115, status: 'available',   description: 'Caramelized Breton pastry with toasted almond crust.',                                       image_path: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&q=80', date_added: '' },
  { id: '15', name: 'Avocado Toast',            category: 'Food',        price: 195, status: 'available',   description: 'Smashed avocado on sourdough with chili flakes and sea salt.',                               image_path: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400&q=80', date_added: '' },
  { id: '16', name: 'Eggs Benedict',            category: 'Food',        price: 245, status: 'available',   description: 'Poached eggs on toasted English muffin with house hollandaise.',                             image_path: 'https://images.unsplash.com/photo-1608039858788-667850f129f6?w=400&q=80', date_added: '' },
]
