import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'
// @ts-ignore: allow importing CSS side-effect in TS project without type declarations
import jenImg from '../assets/jen.jpg';

const LOCATIONS = [
  {
    name: 'BGC Flagship',
    img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80&auto=format&fit=crop',
    address: '9th Ave, Bonifacio Global City, Taguig',
    phone: '+63 2 8888 1234',
    email: 'bgc@velvetroast.ph',
    weekday: '7:00 AM – 10:00 PM',
    weekend: '8:00 AM – 11:00 PM',
  },
  {
    name: 'Tagbilaran (Main Branch)',
    img: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80&auto=format&fit=crop',
    address: 'Rizal Street, Tagbilaran City, Bohol',
    phone: '+63 994 311 5286',
    email: 'bohol@velvetroast.ph',
    weekday: '7:00 AM – 9:00 PM',
    weekend: '9:00 AM – 10:00 PM',
  },
  {
    name: 'Cebu Ayala',
    img: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=600&q=80&auto=format&fit=crop',
    address: 'Cebu Business Park, Cebu City',
    phone: '+63 32 234 5678',
    email: 'cebu@velvetroast.ph',
    weekday: '7:30 AM – 9:30 PM',
    weekend: '8:00 AM – 10:00 PM',
  },
]

export default function HomePage() {
  useReveal()
  const navigate = useNavigate()

  // Recalculate reveal on mount (for anchor links)
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div style={{ background: 'var(--ink)' }}>
      {/* ════════════════════════════
          HERO
      ════════════════════════════ */}
      <header
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: '100vh', paddingTop: 'calc(var(--ribbon-h) + var(--nav-h))' }}
      >
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Coffee background"
            className="w-full h-full object-cover opacity-55"
            style={{ transform: 'scale(1.05)' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(26,14,8,0.75) 0%, rgba(26,14,8,0.35) 50%, rgba(26,14,8,1) 100%)',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <p
            className="animate-fade-in-up tracking-widest uppercase text-sm mb-4"
            style={{ animationDelay: '0.1s', color: 'var(--gold)', letterSpacing: '0.3em' }}
          >
            Est. 2004
          </p>
          <h1
            className="animate-fade-in-up text-white font-bold leading-tight mb-6"
            style={{
              animationDelay: '0.3s',
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(3rem, 9vw, 6rem)',
            }}
          >
            Awaken Your <br />
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Senses</em>
          </h1>
          <p
            className="animate-fade-in-up mb-10 max-w-2xl mx-auto font-light"
            style={{
              animationDelay: '0.5s',
              color: 'rgba(245,237,216,0.8)',
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              lineHeight: 1.7,
            }}
          >
            Experience the artistry of single-origin beans, meticulously roasted to perfection.
            A sanctuary for the coffee connoisseur.
          </p>
          <div
            className="animate-fade-in-up flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animationDelay: '0.7s' }}
          >
            <Link to="/menu" className="btn-gold">View Menu</Link>
            <Link to="/login" className="btn-outline-gold" style={{ color: '#fff', borderColor: '#fff' }}>
              Join Club
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <i className="fas fa-chevron-down text-2xl text-white" />
        </div>
      </header>

      
      <section className="py-20 px-6 lg:px-20" style={{ background: 'var(--ink)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=90',
                tag: 'Best Seller Teaser',
                title: 'Signature Velvet Latte',
                desc: 'Smooth espresso, creamy texture, and the crowd favorite in every cup.',
                delay: '0ms',
              },
              {
                img: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                tag: 'Origin',
                title: 'Single Origin',
                desc: 'Ethically sourced from the world\'s best farms.',
                delay: '100ms',
              },
              {
                img: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                tag: 'Ambience',
                title: 'Velvet Ambience',
                desc: 'A space designed for comfort and connection.',
                delay: '200ms',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="reveal group relative overflow-hidden cursor-pointer"
                style={{
                  height: '384px',
                  transitionDelay: card.delay,
                  borderRadius: '2px',
                }}
                onClick={() => navigate('/menu')}
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div
                  className="absolute inset-0 transition-colors duration-500"
                  style={{ background: 'rgba(0,0,0,0.4)' }}
                />
                <div
                  className="absolute bottom-0 left-0 w-full p-8"
                  style={{ background: 'linear-gradient(to top, rgba(26,14,8,1) 0%, transparent 100%)' }}
                >
                  <span
                    className="inline-block text-xs font-bold mb-2"
                    style={{ color: 'var(--gold)', letterSpacing: '0.18em', textTransform: 'uppercase' }}
                  >
                    {card.tag}
                  </span>
                  <h3 className="text-white text-2xl mb-2" style={{ fontFamily: 'var(--serif)' }}>
                    {card.title}
                  </h3>
                  <p
                    className="text-sm transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0"
                    style={{ color: 'rgba(245,237,216,0.8)' }}
                  >
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          PRODUCTS PREVIEW
      ════════════════════════════ */}
      <section
        id="products"
        className="py-24 relative"
        style={{ background: '#221209' }}
      >
        <div
          className="absolute top-0 left-0 w-full h-20"
          style={{ background: 'linear-gradient(to bottom, var(--ink), transparent)' }}
        />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <span className="section-label">Products</span>
            <h2 className="section-title">Featured <em>Categories</em></h2>
            <p style={{ color: 'rgba(245,237,216,0.6)', maxWidth: '36rem', margin: '0 auto' }}>
              Browse highlights first. Visit the full menu to see everything we offer.
            </p>
            <div className="section-divider centered" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=90',
                tag: 'Top Picks',
                title: 'Best Sellers',
                desc: 'Our most-loved classics prepared daily.',
                delay: '0ms',
              },
              {
                img: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=90',
                tag: 'Fresh',
                title: 'New Products',
                desc: 'New arrivals and seasonal specials to try.',
                delay: '100ms',
              },
              {
                img: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=90',
                tag: 'More',
                title: 'Other Selections',
                desc: 'Explore coffee favorites, sweets, and more.',
                delay: '200ms',
              },
            ].map((card, i) => (
              <article
                key={i}
                className="reveal"
                style={{
                  background: 'rgba(43,24,18,0.6)',
                  border: '1px solid rgba(212,175,55,0.12)',
                  borderRadius: '8px',
                  padding: '2rem',
                  transitionDelay: card.delay,
                }}
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="w-full object-cover rounded mb-5"
                  style={{ height: '160px' }}
                />
                <span
                  className="text-xs font-bold"
                  style={{ color: 'var(--gold)', letterSpacing: '0.2em', textTransform: 'uppercase' }}
                >
                  {card.tag}
                </span>
                <h3 className="text-white mt-3 mb-4 text-2xl" style={{ fontFamily: 'var(--serif)' }}>
                  {card.title}
                </h3>
                <p className="text-sm mb-6" style={{ color: 'rgba(245,237,216,0.6)' }}>
                  {card.desc}
                </p>
                <Link
                  to="/menu"
                  className="btn-gold text-xs"
                  style={{ padding: '0.6rem 1.25rem' }}
                >
                  View Full Products
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          ABOUT / OUR STORY
      ════════════════════════════ */}
      <section
        id="about"
        className="py-24 overflow-hidden"
        style={{ background: 'var(--ink)' }}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
          {/* Image */}
          <div className="w-full md:w-1/2 reveal">
            <div className="relative">
              <div
                className="absolute -top-4 -left-4 w-full h-full"
                style={{ border: '2px solid rgba(212,175,55,0.3)', borderRadius: '2px' }}
              />
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Barista pouring coffee"
                className="relative shadow-2xl w-full object-cover"
                style={{ height: '500px', borderRadius: '2px' }}
              />
            </div>
          </div>

          {/* Text */}
          <div className="w-full md:w-1/2 reveal">
            <span className="section-label">Our Philosophy</span>
            <h2 className="section-title">From Crop <em>to Cup</em></h2>
            <p className="mb-6 leading-relaxed" style={{ color: 'rgba(245,237,216,0.75)' }}>
              At Velvet Roast, we believe coffee is more than just caffeine—it's a ritual. We travel to
              the equatorial belt to source the finest Arabica beans, building direct relationships with
              farmers who share our passion for quality.
            </p>
            <p className="mb-8 leading-relaxed" style={{ color: 'rgba(245,237,216,0.75)' }}>
              Our small-batch roasting process highlights the unique terroir of each origin, ensuring
              every sip tells a story of its homeland.
            </p>
            <div className="flex gap-10">
              {[
                { num: '15+', label: 'Origins' },
                { num: '100%', label: 'Ethical' },
                { num: '0', label: 'Compromise' },
              ].map(stat => (
                <div key={stat.label}>
                  <h4 className="text-3xl font-bold" style={{ fontFamily: 'var(--serif)', color: 'var(--gold)' }}>
                    {stat.num}
                  </h4>
                  <p
                    className="text-xs mt-1"
                    style={{ textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(245,237,216,0.5)' }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link to="/menu" className="btn-gold">
                Explore Our Menu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          ABOUT US
      ════════════════════════════ */}
      <section id="about-us" className="py-24" style={{ background: 'var(--ink)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <span className="section-label">About Us</span>
            <h2 className="section-title">Meet the <em>Team</em></h2>
            <div className="section-divider centered" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
            {/* Person 1 */}
            <div className="flex flex-col items-center text-center p-10 rounded-2xl shadow-xl group transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(43,24,18,0.85) 100%)', border: '1.5px solid rgba(212,175,55,0.18)', position: 'relative' }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-tr from-yellow-200/30 to-yellow-400/10 w-36 h-36 rounded-full blur-2xl opacity-40 -z-10" />
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Founder" className="w-32 h-32 rounded-full mb-5 shadow-lg border-4" style={{ borderColor: 'var(--gold)' }} />
              <h3 className="text-2xl font-extrabold mb-1 tracking-tight" style={{ color: 'var(--gold)', fontFamily: 'var(--serif)' }}>Alex Rivera</h3>
              <div style={{ width: '40px', height: '3px', background: 'var(--gold)', borderRadius: '2px', margin: '0.5rem auto 0.7rem auto' }} />
              <p 
                className="text-lg mb-2 font-bold tracking-wide"
                style={{ 
                  color: 'var(--gold)',
                  letterSpacing: '0.06em',
                  fontFamily: 'var(--serif)',
                  fontWeight: 700,
                  marginBottom: '1.1rem'
                }}
              >
                Founder & Head Roaster
              </p>
              <p className="mb-4" style={{ color: 'rgba(245,237,216,0.7)', fontSize: '0.92rem', fontFamily: 'Georgia, Times, "Times New Roman", serif', fontStyle: 'italic', letterSpacing: '0.01em' }}>
                Alex brings 15+ years of coffee expertise, sourcing beans and perfecting the Velvet Roast signature blends. His passion for quality and community is at the heart of every cup.
              </p>
              <div className="flex flex-col gap-2 justify-center mt-2 items-center text-center w-full">
                <div className="flex flex-row gap-4 items-center justify-center">
                  <a href="https://www.facebook.com/jennxfear" target="_blank" rel="noopener noreferrer" title="Facebook" className="hover:text-yellow-300 transition-colors flex items-center gap-2">
                    <i className="fab fa-facebook fa-lg" style={{ color: '#1877F3' }} />
                    <span className="text-xs md:text-sm" style={{ color: 'rgba(245,237,216,0.85)' }}>Zar Kenneth</span>
                  </a>
                  <span className="text-xs md:text-sm" style={{ color: 'rgba(245,237,216,0.5)' }}>|</span>
                  <a href="mailto:alex.rivera@velvetroast.ph" title="Gmail" className="hover:text-yellow-300 transition-colors flex items-center gap-2">
                    <i className="fas fa-envelope fa-lg" style={{ color: '#EA4335' }} />
                    <span className="text-xs md:text-sm" style={{ color: 'rgba(245,237,216,0.85)' }}>zarkenneth@gmail.com</span>
                  </a>
                </div>
                <div className="flex flex-row gap-4 items-center justify-center mt-1">
                  <a href="#" title="LinkedIn" className="hover:text-yellow-300 transition-colors flex items-center gap-2">
                    <i className="fab fa-linkedin fa-lg" style={{ color: '#0A66C2' }} />
                    <span className="text-xs md:text-sm" style={{ color: 'rgba(245,237,216,0.7)' }}>zar kenneth</span>
                  </a>
                  <span className="text-xs md:text-sm" style={{ color: 'rgba(245,237,216,0.5)' }}>|</span>
                  <a href="#" title="Instagram" className="hover:text-yellow-300 transition-colors flex items-center gap-2">
                    <i className="fab fa-instagram fa-lg" style={{ color: '#E4405F' }} />
                    <span className="text-xs md:text-sm" style={{ color: 'rgba(245,237,216,0.7)' }}>@zarkenneth_samijon</span>
                  </a>
                </div>
              </div>
            </div>
            {/* Divider for desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-yellow-200/10 to-yellow-400/10 rounded-full" style={{ transform: 'translateX(-50%)' }} />
            {/* Person 2 */}
            <div className="flex flex-col items-center text-center p-10 rounded-2xl shadow-xl group transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(43,24,18,0.85) 100%)', border: '1.5px solid rgba(212,175,55,0.18)', position: 'relative' }}>
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-tr from-yellow-200/30 to-yellow-400/10 w-36 h-36 rounded-full blur-2xl opacity-40 -z-10" />
              <img src={jenImg} alt="Manager" className="w-20 h-20 md:w-28 md:h-28 rounded-full mb-4 shadow-lg border-4 object-cover" style={{ borderColor: 'var(--gold)' }} />
              <h3 className="text-2xl font-extrabold mb-1 tracking-tight" style={{ color: 'var(--gold)', fontFamily: 'var(--serif)' }}>Jamie Cruz</h3>
              <div style={{ width: '40px', height: '3px', background: 'var(--gold)', borderRadius: '2px', margin: '0.5rem auto 0.7rem auto' }} />
              <p 
                className="text-lg mb-2 font-bold tracking-wide"
                style={{ 
                  color: 'var(--gold)',
                  letterSpacing: '0.06em',
                  fontFamily: 'var(--serif)',
                  fontWeight: 700,
                  marginBottom: '1.1rem'
                }}
              >
                Operations Manager
              </p>
              <p className="mb-4" style={{ color: 'rgba(245,237,216,0.7)', fontSize: '0.92rem', fontFamily: 'Georgia, Times, \"Times New Roman\", serif', fontStyle: 'italic', letterSpacing: '0.01em' }}>
                Jamie ensures every guest feels at home, leading the team with warmth and dedication. She oversees daily operations and customer experience at all branches.
              </p>
              <div className="flex flex-col gap-2 justify-center mt-2 items-center text-center w-full">
                <div className="flex flex-row gap-4 items-center justify-center">
                  <a href="https://www.facebook.com/jennxfear" target="_blank" rel="noopener noreferrer" title="Facebook" className="hover:text-yellow-300 transition-colors flex items-center gap-2">
                    <i className="fab fa-facebook fa-lg" style={{ color: '#1877F3' }} />
                    <span className="text-xs md:text-sm" style={{ color: 'rgba(245,237,216,0.85)' }}>Jennifer Halawig</span>
                  </a>
                  <span className="text-xs md:text-sm" style={{ color: 'rgba(245,237,216,0.5)' }}></span>
                  <a href="mailto:jamie.cruz@velvetroast.ph" title="Gmail" className="hover:text-yellow-300 transition-colors flex items-center gap-2">
                    <i className="fas fa-envelope fa-lg" style={{ color: '#EA4335' }} />
                    <span className="text-xs md:text-sm" style={{ color: 'rgba(245,237,216,0.85)' }}>jenniferhalawig@gmail.com</span>
                  </a>
                </div>
                <div className="flex flex-row gap-4 items-center justify-center mt-1">
                  <a href="#" title="LinkedIn" className="hover:text-yellow-300 transition-colors flex items-center gap-2">
                    <i className="fab fa-linkedin fa-lg" style={{ color: '#0A66C2' }} />
                    <span className="text-xs md:text-sm" style={{ color: 'rgba(245,237,216,0.7)' }}>jennifer-halawig</span>
                  </a>
                  <span className="text-xs md:text-sm" style={{ color: 'rgba(245,237,216,0.5)' }}></span>
                  <a href="#" title="Instagram" className="hover:text-yellow-300 transition-colors flex items-center gap-2">
                    <i className="fab fa-instagram fa-lg" style={{ color: '#E4405F' }} />
                    <span className="text-xs md:text-sm" style={{ color: 'rgba(245,237,216,0.7)' }}>@jennifer_halawig</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          LOCATIONS
      ════════════════════════════ */}
      <section id="locations" style={{ background: 'var(--ink)', paddingTop: '5rem', paddingBottom: '5rem' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 reveal">
            <span className="section-label">Find Us</span>
            <h2 className="section-title">Our <em>Locations</em></h2>
            <div className="section-divider centered" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {LOCATIONS.map((loc, i) => (
              <div
                key={i}
                className="location-card reveal"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="location-img">
                  <img src={loc.img} alt={loc.name} />
                </div>
                <div style={{ padding: '28px', background: 'var(--roast)' }}>
                  <div
                    className="text-xl mb-3 text-white"
                    style={{ fontFamily: 'var(--serif)', fontSize: '1.35rem' }}
                  >
                    {loc.name}
                  </div>
                  {[
                    { icon: 'fa-map-marker-alt', text: loc.address },
                    { icon: 'fa-phone',          text: loc.phone },
                    { icon: 'fa-envelope',       text: loc.email },
                  ].map(item => (
                    <div
                      key={item.icon}
                      className="flex items-start gap-3 mb-2 text-sm"
                      style={{ color: 'var(--muted)', lineHeight: 1.5 }}
                    >
                      <i
                        className={`fas ${item.icon} text-xs mt-0.5 w-4 flex-shrink-0`}
                        style={{ color: 'var(--gold)' }}
                      />
                      {item.text}
                    </div>
                  ))}
                  <div
                    className="mt-4 pt-4"
                    style={{ borderTop: '1px solid rgba(245,237,216,0.07)' }}
                  >
                    {[
                      { day: 'Mon – Fri', hours: loc.weekday },
                      { day: 'Sat – Sun', hours: loc.weekend },
                    ].map(row => (
                      <div
                        key={row.day}
                        className="flex justify-between text-xs mb-1"
                      >
                        <span style={{ color: 'var(--muted)' }}>{row.day}</span>
                        <span style={{ color: 'var(--cream)' }}>{row.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════
          CTA BANNER
      ════════════════════════════ */}
      <section
        className="relative overflow-hidden py-24 text-center"
        style={{ background: '#0D0704' }}
      >
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1600&q=60&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-6 reveal">
          <span className="section-label" style={{ display: 'block', textAlign: 'center' }}>
            Ready to Order?
          </span>
          <h2 className="section-title" style={{ textAlign: 'center' }}>
            Your Perfect Cup <em>Awaits</em>
          </h2>
          <p className="mb-8" style={{ color: 'rgba(245,237,216,0.65)', maxWidth: '28rem', margin: '0 auto 2rem' }}>
            Browse our full menu, customize your order, and enjoy premium coffee delivered to your door
            or ready for pickup.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu"  className="btn-gold">Order Now</Link>
            <Link to="/track" className="btn-outline-gold" style={{ color: 'rgba(245,237,216,0.8)', borderColor: 'rgba(245,237,216,0.3)' }}>
              Track Order
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
