import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: '#0D0704', borderTop: '1px solid #2C1E12' }} className="text-coffee-200 py-16">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <i className="fas fa-mug-hot text-xl" style={{ color: 'var(--gold)' }} />
            <span className="text-xl font-bold tracking-wider text-white" style={{ fontFamily: 'var(--serif)' }}>
              VELVET<span style={{ color: 'var(--gold)' }}>ROAST</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed opacity-70">
            Crafting moments of joy through the perfect brew. Join us in our pursuit of coffee excellence.
          </p>
          <div className="flex gap-4 mt-6">
            <a href="#" className="opacity-50 hover:opacity-100 transition-opacity" style={{ color: 'var(--gold)' }}>
              <i className="fab fa-instagram text-xl" />
            </a>
            <a href="#" className="opacity-50 hover:opacity-100 transition-opacity" style={{ color: 'var(--gold)' }}>
              <i className="fab fa-facebook text-xl" />
            </a>
            <a href="#" className="opacity-50 hover:opacity-100 transition-opacity" style={{ color: 'var(--gold)' }}>
              <i className="fab fa-tiktok text-xl" />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-white text-lg mb-6" style={{ fontFamily: 'var(--serif)' }}>Explore</h4>
          <ul className="space-y-3 text-sm opacity-70">
            <li><a href="/#about"     className="hover:opacity-100 hover:text-yellow-400 transition-all">Our Story</a></li>
            <li><a href="/#locations" className="hover:opacity-100 hover:text-yellow-400 transition-all">Locations</a></li>
            <li><Link to="/menu"      className="hover:opacity-100 hover:text-yellow-400 transition-all">Our Menu</Link></li>
            <li><Link to="/track"     className="hover:opacity-100 hover:text-yellow-400 transition-all">Track Order</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white text-lg mb-6" style={{ fontFamily: 'var(--serif)' }}>Contact</h4>
          <ul className="space-y-3 text-sm opacity-70">
            <li className="flex items-start gap-3">
              <i className="fas fa-map-marker-alt w-5 mt-0.5" style={{ color: 'var(--gold)' }} />
              Rizal Street, Tagbilaran City
            </li>
            <li className="flex items-center gap-3">
              <i className="fas fa-phone w-5" style={{ color: 'var(--gold)' }} />
              +63 994 311 5286
            </li>
            <li className="flex items-center gap-3">
              <i className="fas fa-envelope w-5" style={{ color: 'var(--gold)' }} />
              hello@velvetroast.com
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-white text-lg mb-6" style={{ fontFamily: 'var(--serif)' }}>Newsletter</h4>
          <p className="text-xs mb-4 opacity-70">Subscribe for brewing tips and exclusive offers.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Email Address"
              className="flex-1 px-4 py-2 text-sm text-white focus:outline-none"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRight: 'none',
              }}
            />
            <button
              className="px-4 py-2 font-bold transition-colors"
              style={{ background: 'var(--gold)', color: 'var(--ink)' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--gold)')}
            >
              <i className="fas fa-arrow-right" />
            </button>
          </div>
        </div>
      </div>

      <div
        className="max-w-7xl mx-auto px-6 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-40"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <p>&copy; {new Date().getFullYear()} Velvet Roast Coffee. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
          <a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}
