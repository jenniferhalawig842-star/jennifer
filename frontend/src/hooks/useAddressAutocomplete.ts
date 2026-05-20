import { useState, useEffect, useRef, useCallback } from 'react'

interface Suggestion {
  place_id: string
  description: string
  main_text: string
  secondary_text: string
}

interface AddressResult {
  full_address: string
  city: string
  lat?: number
  lng?: number
}

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY as string | undefined

// Philippine cities list for fallback autocomplete
const PH_CITIES = [
  'Manila', 'Quezon City', 'Caloocan', 'Davao City', 'Cebu City',
  'Zamboanga City', 'Antipolo', 'Pasig', 'Taguig', 'Valenzuela',
  'Dasmariñas', 'Bacoor', 'San Jose del Monte', 'Imus', 'Marikina',
  'Parañaque', 'Las Piñas', 'Muntinlupa', 'Makati', 'Malabon',
  'Tagbilaran City', 'Bohol', 'Iloilo City', 'Bacolod', 'Cagayan de Oro',
  'General Santos', 'Lapu-Lapu City', 'Mandaue City', 'Butuan',
  'Cotabato City', 'Iligan', 'Tacloban', 'Olongapo', 'Angeles',
  'San Fernando', 'Legazpi', 'Naga', 'Puerto Princesa', 'Cabanatuan',
  'San Pablo', 'Lucena', 'Lipa', 'Batangas City', 'Tarlac City',
]

export function useAddressAutocomplete() {
  const [query,       setQuery]       = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [selected,    setSelected]    = useState<AddressResult | null>(null)
  const [loading,     setLoading]     = useState(false)
  const [mapUrl,      setMapUrl]      = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Google Maps Places autocomplete ──
  const fetchGoogleSuggestions = useCallback(async (input: string) => {
    if (!GOOGLE_MAPS_KEY || !input.trim()) return false
    try {
      // Use the Places Autocomplete API via fetch (no SDK needed)
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&components=country:ph&types=geocode&key=${GOOGLE_MAPS_KEY}`
      const res  = await fetch(url)
      const data = await res.json()
      if (data.status === 'OK') {
        const items: Suggestion[] = data.predictions.map((p: any) => ({
          place_id:       p.place_id,
          description:    p.description,
          main_text:      p.structured_formatting?.main_text    || p.description,
          secondary_text: p.structured_formatting?.secondary_text || '',
        }))
        setSuggestions(items)
        return true
      }
    } catch { /* fall through to local */ }
    return false
  }, [])

  // ── Local fallback suggestions (no API key) ──
  const fetchLocalSuggestions = useCallback((input: string) => {
    const q = input.toLowerCase()
    const filtered = PH_CITIES
      .filter(c => c.toLowerCase().includes(q))
      .slice(0, 5)
      .map(c => ({
        place_id:       c,
        description:    `${c}, Philippines`,
        main_text:      c,
        secondary_text: 'Philippines',
      }))

    // Also add the raw input as first option
    const raw: Suggestion = {
      place_id:       '_raw',
      description:    input,
      main_text:      input,
      secondary_text: 'Custom address',
    }
    setSuggestions([raw, ...filtered])
  }, [])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); return }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      const usedGoogle = await fetchGoogleSuggestions(query)
      if (!usedGoogle) fetchLocalSuggestions(query)
      setLoading(false)
    }, 300)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query, fetchGoogleSuggestions, fetchLocalSuggestions])

  // ── Select a suggestion ──
  const selectSuggestion = useCallback(async (s: Suggestion) => {
    setSuggestions([])
    setQuery(s.description)

    // Extract city from description
    const parts = s.description.split(',').map(p => p.trim())
    const city  = parts.find(p =>
      PH_CITIES.some(c => c.toLowerCase() === p.toLowerCase())
    ) || parts[1] || ''

    const result: AddressResult = {
      full_address: s.description,
      city,
    }

    // Try to get lat/lng for map if we have a place_id and API key
    if (GOOGLE_MAPS_KEY && s.place_id !== '_raw') {
      try {
        const url  = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${s.place_id}&fields=geometry&key=${GOOGLE_MAPS_KEY}`
        const res  = await fetch(url)
        const data = await res.json()
        if (data.result?.geometry?.location) {
          result.lat = data.result.geometry.location.lat
          result.lng = data.result.geometry.location.lng
          setMapUrl(
            `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY}&q=${result.lat},${result.lng}&zoom=16`
          )
        }
      } catch { /* ignore */ }
    }

    // Fallback map embed using address string
    if (!result.lat && GOOGLE_MAPS_KEY) {
      setMapUrl(
        `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY}&q=${encodeURIComponent(s.description)}&zoom=15`
      )
    } else if (!GOOGLE_MAPS_KEY) {
      // Open Street Map fallback (no key needed)
      setMapUrl(
        `https://www.openstreetmap.org/export/embed.html?bbox=117,4,127,21&layer=mapnik&marker=12.8797,121.7740`
      )
    }

    setSelected(result)
  }, [])

  const clearSelection = useCallback(() => {
    setSelected(null)
    setQuery('')
    setSuggestions([])
    setMapUrl('')
  }, [])

  return {
    query, setQuery,
    suggestions, setSuggestions,
    selected, selectSuggestion, clearSelection,
    loading, mapUrl,
    hasGoogleKey: !!GOOGLE_MAPS_KEY,
  }
}
