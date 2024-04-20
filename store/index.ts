import type { Fissure } from '~/types/fissure'

export const useFissureStore = defineStore(
  'fissure-sub',
  () => {
    const expiredFissureIdQueue = reactive<string[]>([])
    const addExpiredFissureId = (id: string) => expiredFissureIdQueue.push(id)
    const dropExpiredFissureIds = () =>
      expiredFissureIdQueue.splice(expiredFissureIdQueue.length)

    const subs = ref<Fissure[]>([])
    const isSubbed = (target: Fissure) => subs.value.includes(target)
    const removeSub = (target: Fissure) => {
      subs.value = subs.value.filter((fissure) => fissure.id === target.id)
    }

    return {
      dropExpiredFissureIds,
      expiredFissureIdQueue,
      addExpiredFissureId,
      subs,
      isSubbed,
      removeSub
    }
  },
  { persist: { storage: persistedState.localStorage } }
)
