import { mockUsers } from '@/mocks/users'
import {
  recommendCandidates,
  RequestingPref,
  Weights,
  RankedCandidate,
} from './recommendation'

export function getRecommendations(
  requestingPref: RequestingPref,
  eventSlug: string,
  topN: number = 20,
  config?: Weights
): RankedCandidate[] {
  const allRanked = recommendCandidates(
    requestingPref,
    eventSlug,
    mockUsers,
    config
  )

  return allRanked.slice(0, topN)
}
