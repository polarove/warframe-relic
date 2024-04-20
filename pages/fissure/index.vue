<template>
  <wt-context-menu-container>
    <h1 text="center">裂缝订阅功能仍在制作中</h1>
    <wt-fissure
      title="始源星系"
      :fissures="origin"
      class="min-h-50vh"
      v-loading="originState.loading"
      :is-empty="originState.empty"
      @finish="(expired: Fissure) => handleFinish(expired)"
    />
    <el-divider />
    <wt-fissure
      title="钢铁之路"
      :fissures="steelPath"
      class="min-h-50vh"
      v-loading="steelPathState.loading"
      :is-empty="steelPathState.empty"
      @finish="(expired: Fissure) => handleFinish(expired)"
    />
    <el-divider />
    <wt-fissure
      title="九重天"
      :fissures="empyrean"
      class="min-h-50vh"
      v-loading="empyreanState.loading"
      :is-empty="empyreanState.empty"
      @finish="(expired: Fissure) => handleFinish(expired)"
    />
  </wt-context-menu-container>
  <wt-spirit />
</template>

<script setup lang="ts">
import { API } from '~/constants'
import { ElMessage } from 'element-plus'
import type { Fissure } from '~/types/fissure'
import { LANGUAGE, PLATFORM } from '~/enums'
import { ListUtil } from '@polaris_liu/toolcat'
import { useFissureStore } from '~/store'

useHead({
  title: '裂缝 | warframe-team',
  link: [{ rel: 'shortcut icon', href: './fissure-logo-white.svg' }]
})

const origin = reactive<Fissure[]>([])
const steelPath = reactive<Fissure[]>([])
const empyrean = reactive<Fissure[]>([])

const originState = reactive({
  loading: true,
  empty: false
})

const steelPathState = reactive({
  loading: true,
  empty: false
})

const empyreanState = reactive({
  loading: true,
  empty: false
})

const prepareFissures = (fissures: Fissure[]) => {
  // todo：检测裂缝订阅状态
  let isSub = false
  return fissures
    .sort((a, b) => a.tierNum - b.tierNum)
    .map((fissure) => {
      return { ...fissure, subscribed: isSub, panel: false }
    })
}

const pickValid = (fissures: Fissure[]) => {
  return Promise.resolve(
    fissures.filter(
      (fissure) =>
        new Date().getTime() < new Date(fissure.expiry).getTime() ||
        fissure.active
    )
  )
}

const fillSteelPath = (fissures: Fissure[]) => {
  if (ListUtil.isEmpty(fissures)) steelPathState.empty = true
  fissures
    .filter((fissure) => fissure.isHard)
    .forEach((hard) => steelPath.push(hard))
  steelPathState.loading = false
  return Promise.resolve(fissures)
}

const fillEmpyrean = (fissures: Fissure[]) => {
  if (ListUtil.isEmpty(fissures)) empyreanState.empty = true
  fissures
    .filter((fissure) => fissure.isStorm)
    .forEach((hard) => empyrean.push(hard))
  empyreanState.loading = false
  return Promise.resolve(fissures)
}

const fillOrigin = (fissures: Fissure[]) => {
  if (ListUtil.isEmpty(fissures)) originState.empty = true
  fissures
    .filter((fissure) => !fissure.isStorm)
    .filter((fissure) => !fissure.isHard)
    .forEach((normal) => origin.push(normal))
  originState.loading = false
}

const hasIntersection = (source: string[], target: string[]): string[] => {
  return source.filter((item) => target.includes(item))
}
const indicator = ref<NodeJS.Timeout | undefined>()

const { expiredFissureIdQueue, addExpiredFissureId, dropExpiredFissureIds } =
  useFissureStore()

const handleError = (err: string | undefined) => {
  err = err ? err : '[数据错误]：处理裂缝数据时发生意外错误，请刷新页面'
  ElMessage.error(err)
}

const handleFinish = (expired: Fissure) => {
  const id = expired.id
  addExpiredFissureId(id)
  const handleReload = () => {
    prepareData()
      .then((res) => {
        if (res) {
          const intersection = hasIntersection(
            res.map((fissure) => fissure.id),
            expiredFissureIdQueue
          )
          if (ListUtil.isEmpty(intersection)) {
            clearInterval(indicator.value)
            dropExpiredFissureIds()
            console.log('[裂缝更新]：更新完毕')
          } else {
            console.log('[裂缝更新]：获取的数据尚未更新，继续执行')
          }
          return Promise.resolve(res)
        } else {
          return Promise.reject('[裂缝更新]：获取到的裂缝数据为空，请刷新页面')
        }
      })
      .then((modified) => fillSteelPath(modified!))
      .then((leftover) => fillEmpyrean(leftover))
      .then((leftover) => fillOrigin(leftover))
      .catch((err) => handleError(err))
  }

  if (indicator.value) {
    return Promise.reject('[裂缝更新]：仍有已过期的裂缝等待更新，跳过本次刷新')
  } else {
    indicator.value = setInterval(() => handleReload(), 10000)
    return Promise.resolve(indicator.value)
  }
}

const prepareData = async (
  platform: PLATFORM = PLATFORM.PC,
  language: LANGUAGE = LANGUAGE.ZH
) => {
  const handleRequest = (res: any) => {
    if (res.error.value) {
      console.error(res.error.value?.cause)
      return Promise.reject(`[请求失败]: ${res.error.value?.data.error}`)
    } else return Promise.resolve(unref(res.data))
  }

  const url = API.concat('/').concat(platform).concat('/').concat('fissures')
  const data = {
    query: { language }
  }

  return useFetch<Fissure[]>(url, data)
    .then((res) => handleRequest(res))
    .then((res) => pickValid(res))
    .then((res) => prepareFissures(res))
    .then((res) => res)
    .catch((err) => handleError(err))
}

prepareData()
  .then((modified) => fillSteelPath(modified!))
  .then((leftover) => fillEmpyrean(leftover))
  .then((leftover) => fillOrigin(leftover))
  .catch((err) => handleError(err))

useHead({
  title: '裂缝 | warframe-team'
})
</script>

<style lang="scss" scoped></style>
