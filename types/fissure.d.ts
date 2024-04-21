import { RELIC_TIER, RELIC_TIER_NUMBER } from '~/apis/enums'

export interface _FissureBase {
  subscribed: boolean
  panel: boolean
  valid: boolean
}

export interface Fissure extends _FissureBase {
  activation: string
  active: boolean
  enemy: string
  enemyKey: string
  eta: string
  expired: boolean
  expiry: string
  id: string
  isHard: boolean
  isStorm: boolean
  missionKey: string
  missionType: string
  node: string
  nodeKey: string
  startString: string
  tier: RELIC_TIER
  tierNum: RELIC_TIER_NUMBER
}

export interface FissureState {
  loading: boolean
  empty: boolean
  fissure: Fissure[]
  state: FissureDataState
}

export interface FissureDataState {
  icon?: string
  tip?: string
  className?: string
  updating?: boolean
}
