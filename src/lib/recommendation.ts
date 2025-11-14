import { User } from '@/mocks/users'

export interface RequestingPref {
  genderPref: 'male' | 'female' | 'any'
  ageMin: number
  ageMax: number
  maxDistanceKm: number
  location: {
    lat: number
    lon: number
  }
}

export interface Weights {
  w_distance: number
  w_gender: number
  w_age: number
  w_interest: number
  w_activity: number
}

export interface RankedCandidate extends User {
  score: number
  distanceKm: number
  breakdown: {
    distanceScore: number
    genderScore: number
    ageScore: number
    interestScore: number
    activityScore: number
  }
}

const DEFAULT_WEIGHTS: Weights = {
  w_distance: 0.35,
  w_gender: 0.2,
  w_age: 0.15,
  w_interest: 0.25,
  w_activity: 0.05,
}

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function calculateDistanceScore(
  distanceKm: number,
  maxDistanceKm: number
): number {
  return 1 - Math.min(distanceKm / maxDistanceKm, 1)
}

function calculateGenderScore(
  candidateGender: 'male' | 'female' | 'other',
  genderPref: 'male' | 'female' | 'any'
): number {
  if (genderPref === 'any') {
    return 1
  }
  return candidateGender === genderPref ? 1 : 0
}

function calculateAgeScore(
  candidateAge: number,
  ageMin: number,
  ageMax: number
): number {
  if (candidateAge >= ageMin && candidateAge <= ageMax) {
    return 1
  }

  let distanceYearsFromRange: number
  if (candidateAge < ageMin) {
    distanceYearsFromRange = ageMin - candidateAge
  } else {
    distanceYearsFromRange = candidateAge - ageMax
  }

  const ageRange = ageMax - ageMin + 1
  const ageScore = Math.max(0, 1 - distanceYearsFromRange / ageRange)
  return ageScore
}

function calculateInterestScore(
  candidateInterests: string[],
  eventSlug: string
): number {
  return candidateInterests.includes(eventSlug) ? 1 : 0
}

function calculateActivityScore(lastActiveAt: string): number {
  const now = Date.now()
  const lastActive = new Date(lastActiveAt).getTime()
  const diffMs = now - lastActive
  const diffDays = diffMs / (1000 * 60 * 60 * 24)

  const maxDays = 30
  if (diffDays >= maxDays) {
    return 0
  }

  return 1 - diffDays / maxDays
}

export function recommendCandidates(
  requestingPref: RequestingPref,
  eventSlug: string,
  candidates: User[],
  config?: Weights
): RankedCandidate[] {
  const weights = config || DEFAULT_WEIGHTS
  const currentYear = new Date().getFullYear()

  const rankedCandidates: RankedCandidate[] = candidates.map(candidate => {
    const distanceKm = haversineDistance(
      requestingPref.location.lat,
      requestingPref.location.lon,
      candidate.latitude,
      candidate.longitude
    )

    const candidateAge = currentYear - candidate.birthYear

    const distanceScore = calculateDistanceScore(
      distanceKm,
      requestingPref.maxDistanceKm
    )
    const genderScore = calculateGenderScore(
      candidate.gender,
      requestingPref.genderPref
    )
    const ageScore = calculateAgeScore(
      candidateAge,
      requestingPref.ageMin,
      requestingPref.ageMax
    )
    const interestScore = calculateInterestScore(candidate.interests, eventSlug)
    const activityScore = calculateActivityScore(candidate.lastActiveAt)

    const score =
      weights.w_distance * distanceScore +
      weights.w_gender * genderScore +
      weights.w_age * ageScore +
      weights.w_interest * interestScore +
      weights.w_activity * activityScore

    return {
      ...candidate,
      score,
      distanceKm,
      breakdown: {
        distanceScore,
        genderScore,
        ageScore,
        interestScore,
        activityScore,
      },
    }
  })

  return rankedCandidates.sort((a, b) => b.score - a.score)
}
