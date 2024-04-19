<template>
  <div transition="all">
    <wt-fissure
      title="始源星系"
      :fissures="origin"
      class="min-h-50vh"
      v-loading="originState.loading"
      :is-empty="originState.empty"
    />
    <el-divider />
    <wt-fissure
      title="钢铁之路"
      :fissures="steelPath"
      class="min-h-50vh"
      v-loading="steelPathState.loading"
      :is-empty="steelPathState.empty"
    />
    <el-divider />
    <wt-fissure
      title="九重天"
      :fissures="empyrean"
      class="min-h-50vh"
      v-loading="empyreanState.loading"
      :is-empty="empyreanState.empty"
    />
  </div>
  <client-only>
    <el-dialog></el-dialog>
  </client-only>
</template>

<script setup lang="ts">
import { API } from '~/constants'
import { ElMessage } from 'element-plus'
import type { Fissure } from '~/types/fissure'
import { LANGUAGE, PLATFORM } from '~/enums'
import { ListUtil } from '@polaris_liu/toolcat'

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

const fetchData = (url: string, data: FissureRequest) => {
  const handleRequest = (res: any) => {
    if (res.error.value) {
      console.error(res.error.value?.cause)
      return Promise.reject(`[请求失败]: ${res.error.value?.data.error}`)
    } else return Promise.resolve(unref(res.data))
  }

  const handleError = (_: unknown) => {
    ElMessage.error('[数据错误]：处理裂缝数据时发生意外错误')
  }

  useFetch<Fissure[]>(url, data)
    .then((res) => handleRequest(res))
    .then((res) => addProperty(res))
    .then((res) => pickValid(res))
    .then((modified) => fillSteelPath(modified))
    .then((leftover) => fillEmpyrean(leftover))
    .then((leftover) => fillOrigin(leftover))
    .catch((err) => handleError(err))
}

const addProperty = (fissures: Fissure[]) => {
  return fissures
    .sort((a, b) => a.tierNum - b.tierNum)
    .map((fissure) => {
      return { ...fissure, subscribed: false, panel: false }
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

interface FissureRequest {
  query: { language: string }
}

const initData = (
  platform: PLATFORM = PLATFORM.PC,
  language: LANGUAGE = LANGUAGE.ZH
) => {
  const url = API.concat('/').concat(platform).concat('/').concat('fissures')
  fetchData(url, {
    query: { language }
  })
}
initData()

useHead({
  title: '裂缝 | warframe-team'
})
</script>

<style lang="scss" scoped></style>
