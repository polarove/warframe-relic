<template>
  <wt-context-menu-container>
    <h1 text="center">裂缝订阅功能仍在制作中</h1>
    <wt-fissure
      title="始源星系"
      :fissures="origin.fissure"
      class="min-h-50vh"
      v-loading="origin.loading"
      :is-empty="origin.empty"
      @finish="(expired: Fissure) => handleFinish(expired)"
      @finish-origin="(expired: Fissure) => cleanOrigin(expired)"
    />
    <el-divider />
    <wt-fissure
      title="钢铁之路"
      :fissures="steelPath.fissure"
      class="min-h-50vh"
      v-loading="steelPath.loading"
      :is-empty="steelPath.empty"
      @finish="(expired: Fissure) => handleFinish(expired)"
      @finish-steel="(expired: Fissure) => cleanSteel(expired)"
    />
    <el-divider />
    <wt-fissure
      title="九重天"
      :fissures="empyrean.fissure"
      class="min-h-50vh"
      v-loading="empyrean.loading"
      :is-empty="empyrean.empty"
      @finish="(expired: Fissure) => handleFinish(expired)"
      @finish-empyrean="(expired: Fissure) => cleanEmpyrean(expired)"
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
import { timestamp } from '@vueuse/core'

useHead({
  title: '裂缝 | warframe-team',
  link: [{ rel: 'shortcut icon', href: './fissure-logo-white.svg' }]
})

interface FissureState {
  loading: boolean
  empty: boolean
  fissure: Fissure[]
}

const origin = reactive<FissureState>({
  loading: true,
  empty: false,
  fissure: []
})

const steelPath = reactive<FissureState>({
  loading: true,
  empty: false,
  fissure: []
})

const empyrean = reactive<FissureState>({
  loading: true,
  empty: false,
  fissure: []
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
  if (ListUtil.isEmpty(fissures)) steelPath.empty = true
  fissures
    .filter((fissure) => fissure.isHard)
    .forEach((hard) => steelPath.fissure.push(hard))
  steelPath.loading = false
  return Promise.resolve(fissures)
}

const fillEmpyrean = (fissures: Fissure[]) => {
  if (ListUtil.isEmpty(fissures)) empyrean.empty = true
  fissures
    .filter((fissure) => fissure.isStorm)
    .forEach((hard) => empyrean.fissure.push(hard))
  empyrean.loading = false
  return Promise.resolve(fissures)
}

const fillOrigin = (fissures: Fissure[]) => {
  if (ListUtil.isEmpty(fissures)) origin.empty = true
  fissures
    .filter((fissure) => !fissure.isStorm)
    .filter((fissure) => !fissure.isHard)
    .forEach((normal) => origin.fissure.push(normal))
  origin.loading = false
}

const hasIntersection = (source: string[], target: string[]): string[] => {
  return source.filter((item) => target.includes(item))
}
const indicator = ref<NodeJS.Timeout | undefined>()

const { expiredFissureIdQueue, addExpiredFissureId, dropExpiredFissureIds } =
  useFissureStore()

const handleError = (err: string | undefined) => {
  ElMessage.error(
    err ? err : '[数据错误]：处理裂缝数据时发生意外错误，请刷新页面'
  )
}

const prepareRequest = (
  platform: PLATFORM = PLATFORM.PC,
  language: LANGUAGE = LANGUAGE.ZH
) => {
  const handleServerSideRequest = (res: any) => {
    if (res.error.value) {
      console.error(res.error.value?.cause)
      return Promise.reject(`[请求失败]: ${res.error.value?.data.error}`)
    } else return Promise.resolve(unref(res.data))
  }

  const url = API.concat('/').concat(platform).concat('/').concat('fissures')
  const data = {
    query: { language }
  }
  return { handleServerSideRequest, url, data }
}

const cleanOrigin = (expired: Fissure) => {
  origin.fissure = origin.fissure.filter((fissure) => fissure.id !== expired.id)
}

const cleanSteel = (expired: Fissure) => {
  steelPath.fissure = steelPath.fissure.filter(
    (fissure) => fissure.id !== expired.id
  )
}

const cleanEmpyrean = (expired: Fissure) => {
  empyrean.fissure = empyrean.fissure.filter(
    (fissure) => fissure.id !== expired.id
  )
}

const checkDuplications = (fissures: Fissure[]) => {
  if (fissures) {
    const intersection = hasIntersection(
      fissures.map((fissure) => fissure.id),
      expiredFissureIdQueue
    )
    if (ListUtil.isEmpty(intersection)) {
      clearInterval(indicator.value)
      dropExpiredFissureIds()
      ElNotification.success({
        title: '裂缝更新',
        message: '所有裂缝已更新至最新状态'
      })
      return Promise.resolve(fissures)
    } else {
      return Promise.reject('[裂缝更新]：获取的数据尚未更新，继续执行轮询')
    }
  } else {
    return Promise.reject('[裂缝更新]：获取到的裂缝数据为空，请刷新页面')
  }
}

const handleFinish = (expired: Fissure) => {
  const id = expired.id
  addExpiredFissureId(id)
  const { url, data } = prepareRequest()

  let times = 1
  const processData = () => {
    console.log(`[裂缝更新]：开始第${times}次轮询`)
    times++
    $fetch(url, data)
      .then((res) => checkDuplications(res as Fissure[]))
      .then((res) => pickValid(res))
      .then((res) => prepareFissures(res))
      .then((modified) => fillSteelPath(modified!))
      .then((leftover) => fillEmpyrean(leftover))
      .then((leftover) => fillOrigin(leftover))
      .catch((err) => handleError(err))
  }

  if (indicator.value) {
    return console.log('[裂缝更新]：仍有已过期的裂缝等待更新，不再新增interval')
  } else {
    indicator.value = setInterval(() => processData(), 10000)
    return console.log(`[裂缝更新]：开始轮询，interval：${indicator.value}`)
  }
}

const prepareData = () => {
  const { handleServerSideRequest, url, data } = prepareRequest()
  useFetch<Fissure[]>(url, data)
    .then((res) => handleServerSideRequest(res))
    .then((res) => pickValid(res))
    .then((res) => prepareFissures(res))
    .then((modified) => fillSteelPath(modified!))
    .then((leftover) => fillEmpyrean(leftover))
    .then((leftover) => fillOrigin(leftover))
    .catch((err) => handleError(err))
}
prepareData()

useHead({
  title: '裂缝 | warframe-team'
})
</script>

<style lang="scss" scoped></style>
