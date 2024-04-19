import type { Fissure } from '~/types/fissure'

export const useFissureSubStore = defineStore(
  'fissure-sub',
  () => {
    const subs = ref<Fissure[]>([])
    const isSubbed = (target: Fissure) => subs.value.includes(target)
    const removeSub = (target: Fissure) => {
      subs.value = subs.value.filter((fissure) => fissure.id === target.id)
    }

    return { subs, isSubbed, removeSub }
  },
  { persist: { storage: persistedState.localStorage } }
)
