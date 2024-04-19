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
  <el-dialog></el-dialog>
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

const fetchData = (url: string, data: any) => {
  useFetch(url, data)
    .then((res) => {
      if (res.error.value) {
        console.error(res.error.value?.cause)
        return Promise.reject(`[请求失败]: ${res.error.value?.data.error}`)
      } else return Promise.resolve(unref(res.data) as Fissure[])
    })
    .then((res) => addProperty(res))
    .then((modified) => fillSteelPath(modified))
    .then((leftover) => fillEmpyrean(leftover))
    .then((leftover) => fillOrigin(leftover))
    .catch((err) => handleError(err))
}

const addProperty = (fissure: Fissure[]) => {
  return fissure
    .sort((a, b) => a.tierNum - b.tierNum)
    .map((fissure) => {
      return { ...fissure, subscribed: false }
    })
}

const fillSteelPath = (fissure: Fissure[]) => {
  if (ListUtil.isEmpty(fissure)) {
    steelPathState.empty = true
    return []
  }
  fissure
    .filter((fissure) => fissure.isHard)
    .forEach((hard) => steelPath.push(hard))
  steelPathState.loading = false
  return fissure
}

const fillEmpyrean = (fissure: Fissure[]) => {
  if (ListUtil.isEmpty(fissure)) {
    empyreanState.empty = true
    return []
  }
  fissure
    .filter((fissure) => fissure.isStorm)
    .forEach((hard) => empyrean.push(hard))
  empyreanState.loading = false
  return fissure
}

const fillOrigin = (fissure: Fissure[]) => {
  if (ListUtil.isEmpty(fissure)) {
    originState.empty = true
    return []
  }
  fissure
    .filter((fissure) => !fissure.isStorm)
    .filter((fissure) => !fissure.isHard)
    .forEach((normal) => origin.push(normal))
  originState.loading = false
}

const handleError = (_: unknown) =>
  ElMessage.error('[数据错误]：处理裂缝数据时发生意外错误')

const initData = (
  platform: PLATFORM = PLATFORM.PC,
  language: LANGUAGE = LANGUAGE.ZH
) => {
  const url = API.concat('/').concat(platform).concat('/').concat('fissures')
  const data = {
    query: { language }
  }
  fetchData(url, data)
}
initData()

useHead({
  title: '裂缝 | warframe-team'
})
</script>

<style lang="scss" scoped></style>
