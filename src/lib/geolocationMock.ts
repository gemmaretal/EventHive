export interface LocationParams {
  city?: string
  lat?: number
  lon?: number
}

export interface Location {
  lat: number
  lon: number
}

const CITY_COORDINATES: Record<string, Location> = {
  'san francisco': { lat: 37.7749, lon: -122.4194 },
  oakland: { lat: 37.8044, lon: -122.2712 },
  'san jose': { lat: 37.3382, lon: -121.8863 },
  'palo alto': { lat: 37.4419, lon: -122.143 },
  sacramento: { lat: 38.5816, lon: -121.4944 },
}

export function resolveLocation(params: LocationParams): Location {
  if (params.lat !== undefined && params.lon !== undefined) {
    return { lat: params.lat, lon: params.lon }
  }

  if (params.city) {
    const cityKey = params.city.toLowerCase().trim()
    const coords = CITY_COORDINATES[cityKey]
    if (coords) {
      return coords
    }
  }

  return { lat: 37.7749, lon: -122.4194 }
}
