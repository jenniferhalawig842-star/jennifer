import { useEffect, useRef } from 'react'
import { usePhAddressForm } from '../lib/usePhAddressForm'

interface Props {
  onChange: (address: {
    full_address: string
    street:       string
    barangay:     string
    municipality: string
    province:     string
    country:      string
    lat?:         number
    lng?:         number
  }) => void
  error?: string
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.7rem 0.9rem',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(212,175,55,0.15)',
  borderRadius: 8,
  color: '#fff',
  fontSize: '0.875rem',
  fontFamily: 'var(--sans)',
  outline: 'none',
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23D4AF37' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.75rem center',
  paddingRight: '2rem',
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.68rem',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'rgba(212,175,55,0.8)',
  marginBottom: '0.4rem',
  display: 'block',
}

const reqStyle: React.CSSProperties = { color: '#f87171', marginLeft: 2 }

export default function PhAddressForm({ onChange, error }: Props) {
  const form = usePhAddressForm()
  const mapRef   = useRef<HTMLDivElement>(null)
  const leafletRef = useRef<any>(null)
  const markerRef  = useRef<any>(null)

  // Notify parent whenever address changes
  useEffect(() => {
    onChange({
      full_address: form.fullAddress,
      street:       form.street,
      barangay:     form.barangay,
      municipality: form.municipality,
      province:     form.province,
      country:      'Philippines',
      lat:          form.mapLat ?? undefined,
      lng:          form.mapLng ?? undefined,
    })
  }, [form.fullAddress, form.mapLat, form.mapLng])

  // ── Initialize Leaflet map ──
  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return

    // Dynamically load Leaflet CSS
    const link = document.createElement('link')
    link.rel  = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(link)

    // Dynamically load Leaflet JS
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => {
      const L = (window as any).L
      if (!L || !mapRef.current) return

      const map = L.map(mapRef.current, {
        center: [11.8029, 122.5648], // Center of Philippines
        zoom: 6,
        zoomControl: true,
        attributionControl: true,
      })

      // OpenStreetMap tiles — completely free
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Custom gold marker icon
      const goldIcon = L.divIcon({
        className: '',
        html: `<div style="
          width:32px;height:40px;position:relative;
        ">
          <svg viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
            <path d="M16 0 C7.16 0 0 7.16 0 16 C0 28 16 40 16 40 C16 40 32 28 32 16 C32 7.16 24.84 0 16 0Z"
              fill="#D4AF37" stroke="#1A0E08" stroke-width="1.5"/>
            <circle cx="16" cy="15" r="6" fill="#1A0E08"/>
            <circle cx="16" cy="15" r="3.5" fill="#D4AF37"/>
          </svg>
        </div>`,
        iconSize:   [32, 40],
        iconAnchor: [16, 40],
        popupAnchor:[0, -40],
      })

      markerRef.current = L.marker([11.8029, 122.5648], { icon: goldIcon, opacity: 0 }).addTo(map)
      leafletRef.current = map
    }
    document.head.appendChild(script)

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove()
        leafletRef.current = null
        markerRef.current  = null
      }
    }
  }, [])

  // ── Update map when coords change ──
  useEffect(() => {
    const map    = leafletRef.current
    const marker = markerRef.current
    if (!map || !marker) return
    if (form.mapLat !== null && form.mapLng !== null) {
      const latlng = [form.mapLat, form.mapLng]
      marker.setLatLng(latlng).setOpacity(1)
      map.setView(latlng, form.municipality ? 14 : 10, { animate: true })
    }
  }, [form.mapLat, form.mapLng, form.municipality])

  return (
    <div>
      {/* ── Grid of dropdowns ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>

        {/* Region */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Region</label>
          <select
            style={selectStyle}
            value={form.region}
            onChange={e => form.handleRegionChange(e.target.value)}
            onFocus={e  => (e.target.style.borderColor = 'var(--gold)')}
            onBlur={e   => (e.target.style.borderColor = 'rgba(212,175,55,0.15)')}
          >
            <option value="">— Select Region —</option>
            {form.regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        {/* Province */}
        <div>
          <label style={labelStyle}>Province <span style={reqStyle}>*</span></label>
          <select
            style={{ ...selectStyle, opacity: form.regions.length && !form.region ? 0.5 : 1 }}
            value={form.province}
            disabled={!form.region}
            onChange={e => form.handleProvinceChange(e.target.value)}
            onFocus={e  => (e.target.style.borderColor = 'var(--gold)')}
            onBlur={e   => (e.target.style.borderColor = 'rgba(212,175,55,0.15)')}
          >
            <option value="">— Select Province —</option>
            {form.provinces.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* City / Municipality */}
        <div>
          <label style={labelStyle}>City / Municipality <span style={reqStyle}>*</span></label>
          <select
            style={{ ...selectStyle, opacity: !form.province ? 0.5 : 1 }}
            value={form.municipality}
            disabled={!form.province}
            onChange={e => form.handleMunicipalityChange(e.target.value)}
            onFocus={e  => (e.target.style.borderColor = 'var(--gold)')}
            onBlur={e   => (e.target.style.borderColor = 'rgba(212,175,55,0.15)')}
          >
            <option value="">— Select City / Municipality —</option>
            {form.municipalities.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Barangay */}
        <div>
          <label style={labelStyle}>Barangay</label>
          <select
            style={{ ...selectStyle, opacity: !form.municipality ? 0.5 : 1 }}
            value={form.barangay}
            disabled={!form.municipality}
            onChange={e => form.setBarangay(e.target.value)}
            onFocus={e  => (e.target.style.borderColor = 'var(--gold)')}
            onBlur={e   => (e.target.style.borderColor = 'rgba(212,175,55,0.15)')}
          >
            <option value="">— Select Barangay —</option>
            {form.barangays.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Country (read-only) */}
        <div>
          <label style={labelStyle}>Country</label>
          <div
            style={{
              ...selectStyle,
              opacity: 0.55,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'default',
            }}
          >
            <span>🇵🇭</span> Philippines
          </div>
        </div>
      </div>

      {/* Street / House Number with Nominatim autocomplete */}
      <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
        <label style={labelStyle}>
          House No. / Street / Landmark
        </label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.05)',
          border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(212,175,55,0.15)'}`,
          borderRadius: 8,
          overflow: 'visible',
          position: 'relative',
        }}>
          <i className="fas fa-magnifying-glass" style={{
            position: 'absolute', left: '0.9rem',
            color: 'rgba(212,175,55,0.5)', fontSize: '0.78rem', pointerEvents: 'none', zIndex: 1,
          }} />
          <input
            type="text"
            value={form.street}
            onChange={e => form.setStreet(e.target.value)}
            placeholder="e.g. 123 Rizal Street, near SM City"
            style={{
              flex: 1, padding: '0.7rem 0.9rem 0.7rem 2.5rem',
              background: 'none', border: 'none', outline: 'none',
              color: '#fff', fontSize: '0.875rem', fontFamily: 'var(--sans)',
            }}
          />
          {form.streetLoading && (
            <div className="loader" style={{ width: 16, height: 16, marginRight: '0.7rem', flexShrink: 0 }} />
          )}
          {form.street && !form.streetLoading && (
            <button
              onClick={() => { form.setStreet(''); form.setStreetSuggestions([]) }}
              style={{ background: 'none', border: 'none', color: 'rgba(245,237,216,0.35)', cursor: 'pointer', padding: '0 0.7rem', fontSize: '0.75rem' }}
            >
              <i className="fas fa-times" />
            </button>
          )}
        </div>

        {/* Nominatim suggestions dropdown */}
        {form.streetSuggestions.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
            background: 'rgba(26,14,8,0.98)',
            border: '1px solid rgba(212,175,55,0.2)',
            borderRadius: '0 0 8px 8px',
            maxHeight: 200, overflowY: 'auto',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          }}>
            {form.streetSuggestions.map((s, i) => {
              const addr  = s.address
              const main  = [addr.road, addr.suburb].filter(Boolean).join(', ') || s.display_name.split(',')[0]
              const sub   = s.display_name.split(',').slice(1, 3).join(',').trim()
              return (
                <div
                  key={i}
                  onClick={() => form.selectStreetSuggestion(s)}
                  style={{
                    padding: '0.65rem 1rem', cursor: 'pointer',
                    borderBottom: i < form.streetSuggestions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                    transition: 'background 0.12s',
                  }}
                  onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = 'rgba(212,175,55,0.1)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                >
                  <i className="fas fa-location-dot" style={{ color: 'var(--gold)', fontSize: '0.72rem', marginTop: 3, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>{main}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(245,237,216,0.4)', marginTop: 1 }}>{sub}</div>
                  </div>
                </div>
              )
            })}
            <div style={{ padding: '0.4rem 1rem', fontSize: '0.62rem', color: 'rgba(245,237,216,0.25)', textAlign: 'right', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              Powered by <span style={{ color: 'rgba(212,175,55,0.5)' }}>OpenStreetMap Nominatim</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p style={{ fontSize: '0.7rem', color: '#f87171', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <i className="fas fa-circle-exclamation" /> {error}
        </p>
      )}

      {/* Full address preview */}
      {form.fullAddress && (
        <div style={{
          padding: '0.65rem 0.9rem', borderRadius: 8, marginBottom: '0.75rem',
          background: 'rgba(212,175,55,0.07)', border: '1px solid rgba(212,175,55,0.18)',
          fontSize: '0.78rem', color: 'rgba(245,237,216,0.75)',
          display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
        }}>
          <i className="fas fa-location-dot" style={{ color: 'var(--gold)', flexShrink: 0, marginTop: 1 }} />
          <span>{form.fullAddress}</span>
        </div>
      )}

      {/* ── Leaflet Map ── */}
      <div style={{
        borderRadius: 10, overflow: 'hidden',
        border: '1px solid rgba(212,175,55,0.15)',
        position: 'relative',
      }}>
        <div
          ref={mapRef}
          style={{ height: 220, width: '100%', background: '#1a2a3a' }}
        />

        {/* Overlay when no location selected */}
        {form.mapLat === null && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(26,14,8,0.55)', pointerEvents: 'none', zIndex: 10,
            gap: '0.5rem',
          }}>
            <i className="fas fa-map-location-dot" style={{ fontSize: '2rem', color: 'rgba(212,175,55,0.35)' }} />
            <span style={{ fontSize: '0.75rem', color: 'rgba(245,237,216,0.4)' }}>
              Select a city/municipality to see it on the map
            </span>
          </div>
        )}

        {/* Attribution overlay */}
        <div style={{
          position: 'absolute', bottom: 0, right: 0, zIndex: 20,
          background: 'rgba(26,14,8,0.75)', padding: '2px 6px',
          fontSize: '0.6rem', color: 'rgba(245,237,216,0.4)',
          pointerEvents: 'none',
        }}>
          © OpenStreetMap
        </div>
      </div>

      {/* OSM credit note */}
      <p style={{ fontSize: '0.65rem', color: 'rgba(245,237,216,0.25)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <i className="fas fa-circle-info" style={{ color: 'rgba(212,175,55,0.4)' }} />
        Map data © OpenStreetMap contributors — 100% free, no API key required
      </p>
    </div>
  )
}
