import { useState, useCallback, useRef, useEffect } from 'react'
import { PH_REGIONS, getMunicipalities, getBarangays } from './phAddressData'

export interface NominatimResult {
  place_id:    number
  display_name: string
  lat:         string
  lon:         string
  address: {
    road?:       string
    suburb?:     string
    city?:       string
    town?:       string
    municipality?: string
    county?:     string
    province?:   string
    state?:      string
    country?:    string
    postcode?:   string
  }
}

export interface StructuredAddress {
  street:       string   // house number + street
  barangay:     string
  municipality: string   // city / municipality
  province:     string
  region:       string
  country:      string   // always Philippines
  // geocoords from Nominatim
  lat?:         number
  lng?:         number
}

export function usePhAddressForm() {
  // ── Structured dropdowns ──
  const [region,       setRegion]       = useState('')
  const [province,     setProvince]     = useState('')
  const [municipality, setMunicipality] = useState('')
  const [barangay,     setBarangay]     = useState('')
  const [street,       setStreet]       = useState('')  // house#, street, landmark

  // ── Nominatim autocomplete for street ──
  const [streetSuggestions, setStreetSuggestions] = useState<NominatimResult[]>([])
  const [streetLoading,     setStreetLoading]     = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Map state ──
  const [mapLat, setMapLat] = useState<number | null>(null)
  const [mapLng, setMapLng] = useState<number | null>(null)

  // Derived options
  const provinces     = PH_REGIONS.find(r => r.name === region)?.provinces.map(p => p.name).sort() || []
  const municipalities = province ? getMunicipalities(province) : []
  const barangays     = (province && municipality) ? getBarangays(province, municipality) : []

  // Reset downstream when parent changes
  const handleRegionChange = (val: string) => {
    setRegion(val)
    setProvince('')
    setMunicipality('')
    setBarangay('')
    setMapLat(null)
    setMapLng(null)
  }

  const handleProvinceChange = (val: string) => {
    setProvince(val)
    setMunicipality('')
    setBarangay('')
  }

  const handleMunicipalityChange = (val: string) => {
    setMunicipality(val)
    setBarangay('')
    // Geocode the municipality automatically
    geocodeMunicipality(val, province)
  }

  // ── Geocode municipality via Nominatim ──
  const geocodeMunicipality = useCallback(async (mun: string, prov: string) => {
    if (!mun) return
    try {
      const q   = encodeURIComponent(`${mun}, ${prov}, Philippines`)
      const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&countrycodes=ph&addressdetails=1`
      const res = await fetch(url, {
        headers: { 'Accept-Language': 'en', 'User-Agent': 'VelvetRoastApp/1.0' }
      })
      const data: NominatimResult[] = await res.json()
      if (data.length > 0) {
        setMapLat(parseFloat(data[0].lat))
        setMapLng(parseFloat(data[0].lon))
      }
    } catch { /* silent fail */ }
  }, [])

  // ── Street Nominatim autocomplete ──
  useEffect(() => {
    if (!street.trim() || street.length < 4) {
      setStreetSuggestions([])
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setStreetLoading(true)
      try {
        const locationBias = municipality ? `${municipality}, ${province}, ` : ''
        const q   = encodeURIComponent(`${street}, ${locationBias}Philippines`)
        const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=5&countrycodes=ph&addressdetails=1`
        const res = await fetch(url, {
          headers: { 'Accept-Language': 'en', 'User-Agent': 'VelvetRoastApp/1.0' }
        })
        const data: NominatimResult[] = await res.json()
        setStreetSuggestions(data)
      } catch {
        setStreetSuggestions([])
      } finally {
        setStreetLoading(false)
      }
    }, 500)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [street, municipality, province])

  const selectStreetSuggestion = useCallback((item: NominatimResult) => {
    // Extract short display (road + suburb)
    const addr  = item.address
    const short = [addr.road, addr.suburb].filter(Boolean).join(', ') || item.display_name.split(',')[0]
    setStreet(short)
    setStreetSuggestions([])

    // Update map to exact coords
    setMapLat(parseFloat(item.lat))
    setMapLng(parseFloat(item.lon))

    // Auto-fill dropdowns if they're empty
    if (!province && addr.province) {
      // try to match
      const matchedProv = PH_REGIONS.flatMap(r => r.provinces).find(
        p => p.name.toLowerCase().includes((addr.province || '').toLowerCase())
      )
      if (matchedProv) {
        const matchedReg = PH_REGIONS.find(r => r.provinces.includes(matchedProv))
        if (matchedReg) { setRegion(matchedReg.name); setProvince(matchedProv.name) }
      }
    }
  }, [province])

  // ── Assembled full address string ──
  const fullAddress = [
    street,
    barangay && `Brgy. ${barangay}`,
    municipality,
    province,
    'Philippines',
  ].filter(Boolean).join(', ')

  const isComplete = !!(municipality && province)

  return {
    // Dropdown state
    region, province, municipality, barangay, street,
    handleRegionChange, handleProvinceChange, handleMunicipalityChange,
    setBarangay, setStreet,

    // Dropdown options
    regions:       PH_REGIONS.map(r => r.name),
    provinces,
    municipalities,
    barangays,

    // Street autocomplete
    streetSuggestions, setStreetSuggestions,
    streetLoading, selectStreetSuggestion,

    // Map
    mapLat, mapLng,

    // Result
    fullAddress, isComplete,
  }
}
