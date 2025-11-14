# Recommendation Engine

This module provides a pure, client-side recommendation engine for matching users to events based on multiple scoring factors.

## Core Function

### `recommendCandidates`

```typescript
recommendCandidates(
  requestingPref: RequestingPref,
  eventSlug: string,
  candidates: User[],
  config?: Weights
): RankedCandidate[]
```

A pure function that ranks candidate users based on their compatibility with the requesting user's preferences and the target event.

**Parameters:**

- `requestingPref`: User preferences including gender preference, age range, max distance, and location
- `eventSlug`: The event identifier to match against candidate interests
- `candidates`: Array of user objects to evaluate
- `config`: Optional custom weights for scoring components

**Returns:**
An array of ranked candidates sorted by score (highest first), each including:

- All original user properties
- `score`: Overall compatibility score (0-1)
- `distanceKm`: Physical distance in kilometers
- `breakdown`: Individual component scores for transparency

## Scoring Components

The recommendation engine evaluates candidates across five dimensions:

1. **Distance Score** (default weight: 0.35)
   - Formula: `1 - min(distanceKm / maxDistanceKm, 1)`
   - Closer candidates score higher

2. **Gender Score** (default weight: 0.20)
   - Returns 1 if candidate matches gender preference or preference is 'any'
   - Returns 0 otherwise

3. **Age Score** (default weight: 0.15)
   - Returns 1 if candidate age is within [ageMin, ageMax]
   - Declines linearly outside range: `max(0, 1 - distanceYearsFromRange / (ageMax - ageMin + 1))`

4. **Interest Score** (default weight: 0.25)
   - Returns 1 if eventSlug is in candidate's interests array
   - Returns 0 otherwise

5. **Activity Score** (default weight: 0.05)
   - Normalized recency: active now = 1, 30 days ago = 0
   - Formula: `max(0, 1 - daysSinceActive / 30)`

**Final Score:**

```
score = w_distance × distanceScore + w_gender × genderScore +
        w_age × ageScore + w_interest × interestScore +
        w_activity × activityScore
```

## Default Weights

```typescript
{
  w_distance: 0.35,
  w_gender: 0.20,
  w_age: 0.15,
  w_interest: 0.25,
  w_activity: 0.05
}
```

These weights sum to 1.0 and can be customized by passing a `config` object.

## Usage from UI Code

### Simple Usage

```typescript
import { getRecommendations } from '@/lib/useRecommendations'

const recommendations = getRecommendations(
  {
    genderPref: 'any',
    ageMin: 25,
    ageMax: 35,
    maxDistanceKm: 50,
    location: { lat: 37.7749, lon: -122.4194 },
  },
  'tech-conference',
  10 // Get top 10 recommendations
)

console.log(recommendations)
```

### Custom Weights

```typescript
import { getRecommendations } from '@/lib/useRecommendations'

const recommendations = getRecommendations(
  {
    genderPref: 'female',
    ageMin: 20,
    ageMax: 30,
    maxDistanceKm: 25,
    location: { lat: 37.7749, lon: -122.4194 },
  },
  'music-festival',
  20,
  {
    w_distance: 0.5, // Prioritize proximity
    w_gender: 0.1,
    w_age: 0.1,
    w_interest: 0.25,
    w_activity: 0.05,
  }
)
```

### Accessing Score Breakdown

```typescript
recommendations.forEach(candidate => {
  console.log(`${candidate.name}: ${candidate.score.toFixed(2)}`)
  console.log(`  Distance: ${candidate.distanceKm.toFixed(1)}km`)
  console.log(`  Breakdown:`, candidate.breakdown)
})
```

## Type Definitions

```typescript
interface RequestingPref {
  genderPref: 'male' | 'female' | 'any'
  ageMin: number
  ageMax: number
  maxDistanceKm: number
  location: { lat: number; lon: number }
}

interface Weights {
  w_distance: number
  w_gender: number
  w_age: number
  w_interest: number
  w_activity: number
}

interface RankedCandidate extends User {
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
```

## Notes

- This is a pure, client-side implementation using mock data
- No server APIs, authentication, or database calls
- Deterministic results for the same inputs
- All calculations performed in-browser
