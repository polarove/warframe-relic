<template>
  <client-only>
    <wt-header>
      <wt-header-icons>
        <el-col :span="4">
          <div
            class="i-ep:refresh"
            @click="updateFissure()"
            :class="pageState.reload"
            w="1.7em"
            h="1.7em"
            color="~ hover:$el-color-primary"
            cursor="pointer"
          ></div>
        </el-col>
      </wt-header-icons>
    </wt-header>
  </client-only>
  <wt-context-menu-container>
    <h1 text="center">裂缝订阅功能仍在制作中</h1>
    <wt-fissure
      title="始源星系"
      :fissures="origin.fissure"
      class="min-h-50vh"
      v-loading="origin.loading"
      :is-empty="origin.empty"
      @finish-origin="(expired: Fissure) => cleanOrigin(expired)"
    >
      <div class="flex-center">
        <span
          mr="5px"
          w="1.2em"
          h="1.2em"
          class="state-icon"
          :class="`${origin.state.icon} ${origin.state.className}`"
        />
        <span> {{ origin.state.tip }}</span>
      </div>
    </wt-fissure>
    <el-divider />
    <wt-fissure
      title="钢铁之路"
      :fissures="steelPath.fissure"
      class="min-h-50vh"
      v-loading="steelPath.loading"
      :is-empty="steelPath.empty"
      @finish-steel="(expired: Fissure) => cleanSteel(expired)"
    >
      <div class="flex-center">
        <span
          mr="5px"
          w="1.2em"
          h="1.2em"
          class="state-icon"
          :class="`${steelPath.state.icon} ${steelPath.state.className}`"
        />
        <span>{{ steelPath.state.tip }}</span>
      </div>
    </wt-fissure>
    <el-divider />
    <wt-fissure
      title="九重天"
      :fissures="empyrean.fissure"
      class="min-h-50vh"
      v-loading="empyrean.loading"
      :is-empty="empyrean.empty"
      @finish-empyrean="(expired: Fissure) => cleanEmpyrean(expired)"
    >
      <div class="flex-center">
        <span
          mr="5px"
          w="1.2em"
          h="1.2em"
          class="state-icon"
          :class="`${empyrean.state.icon} ${empyrean.state.className}`"
        />
        <span>{{ empyrean.state.tip }}</span>
      </div>
    </wt-fissure>
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

const DATA_CLEAN = {
  icon: 'i-ep:circle-check',
  tip: '已是最新',
  className: 'checked'
}
const DATA_OUTDATED = {
  icon: 'i-ep:warning',
  tip: '需要更新',
  className: 'outdated'
}
const DATA_UPDATING = {
  icon: 'i-ep:loading',
  tip: '正在更新',
  className: 'updating'
}
const DATA_UPDATE_FAILED = {
  icon: 'i-ep:close-bold',
  tip: '更新失败',
  className: 'failed'
}

const pageState = reactive({
  reload: ''
})

const updateFissure = () => {
  console.log(2)
}

useHead({
  title: '裂缝 | warframe-team',
  link: [{ rel: 'shortcut icon', href: './fissure-logo-white.svg' }]
})

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

const isValidFissure = (fissure: Fissure) => {
  return (
    new Date().getTime() < new Date(fissure.expiry).getTime() || fissure.active
  )
}

interface FissureState {
  loading: boolean
  empty: boolean
  fissure: Fissure[]
  state: FissureDataState
}

interface FissureDataState {
  icon?: string
  tip?: string
  className?: string
}

const origin = reactive<FissureState>({
  loading: true,
  empty: false,
  fissure: [],
  state: {
    icon: '',
    tip: '',
    className: ''
  }
})

const steelPath = reactive<FissureState>({
  loading: true,
  empty: false,
  fissure: [],
  state: {
    icon: '',
    tip: '',
    className: ''
  }
})

const empyrean = reactive<FissureState>({
  loading: true,
  empty: false,
  fissure: [],
  state: {
    icon: '',
    tip: '',
    className: ''
  }
})

const pickValid = (fissures: Fissure[]) => {
  return Promise.resolve(
    fissures.filter(
      (fissure) =>
        new Date().getTime() < new Date(fissure.expiry).getTime() ||
        fissure.active
    )
  )
}

const checkDataState = (fissures: Fissure[]) => {
  const originDataState = origin.fissure.every((fissure) =>
    isValidFissure(fissure)
  )
  origin.state = originDataState ? DATA_CLEAN : DATA_OUTDATED
  const steelPathDataState = steelPath.fissure.every((fissure) =>
    isValidFissure(fissure)
  )
  steelPath.state = steelPathDataState ? DATA_CLEAN : DATA_OUTDATED
  const empyreanDataState = empyrean.fissure.every((fissure) =>
    isValidFissure(fissure)
  )
  empyrean.state = empyreanDataState ? DATA_CLEAN : DATA_OUTDATED
  return Promise.resolve(fissures)
}

const prepareFissures = (fissures: Fissure[]) => {
  // todo：检测裂缝订阅状态
  let isSub = false
  return fissures
    .sort((a, b) => a.tierNum - b.tierNum)
    .map((fissure) => {
      return { ...fissure, subscribed: isSub, panel: false, valid: true }
    })
}

const fillSteelPath = (fissures: Fissure[]) => {
  if (ListUtil.isEmpty(fissures)) steelPath.empty = true
  steelPath.fissure = fissures.filter((fissure) => fissure.isHard)
  steelPath.loading = false
  return Promise.resolve(fissures)
}

const fillEmpyrean = (fissures: Fissure[]) => {
  if (ListUtil.isEmpty(fissures)) empyrean.empty = true
  empyrean.fissure = fissures.filter((fissure) => fissure.isStorm)
  empyrean.loading = false
  return Promise.resolve(fissures)
}

const fillOrigin = (fissures: Fissure[]) => {
  if (ListUtil.isEmpty(fissures)) origin.empty = true
  origin.fissure = fissures
    .filter((fissure) => !fissure.isStorm)
    .filter((fissure) => !fissure.isHard)

  origin.loading = false
}

// 处理倒计时结束时的任务
const indicator = ref<NodeJS.Timeout | undefined>()

const { expiredFissureIdQueue, addExpiredFissureId, dropExpiredFissureIds } =
  useFissureStore()

const processUpdate = (
  expired: Fissure,
  setState: (state: FissureDataState) => void
) => {
  const id = expired.id
  addExpiredFissureId(id)
  const { url, data } = prepareRequest()
  const parseLog = (message: string) => {
    return `[裂缝更新]：${message}`
  }

  const parseState = (defaultState: FissureDataState, newMessage?: string) => {
    if (newMessage) defaultState.tip = newMessage
    return defaultState
  }

  // 检查请求的数据是否已经更新完毕
  const checkOutdates = (fissures: Fissure[]) => {
    if (fissures) {
      const intersection = fissures
        .map((fissure) => fissure.id)
        .filter((id) => expiredFissureIdQueue.includes(id))

      if (ListUtil.isEmpty(intersection)) {
        clearInterval(indicator.value)
        dropExpiredFissureIds()
        console.log(DATA_CLEAN.tip)
        setState(DATA_CLEAN)
        return Promise.resolve(fissures)
      } else {
        const message = parseLog('获取的数据尚未更新，继续执行轮询')
        setState(parseState(DATA_UPDATING, message))
        console.log(parseLog('待更新的裂缝为'), expiredFissureIdQueue)
        return Promise.reject(message)
      }
    } else {
      const message = parseLog('获取到的裂缝数据为空，请刷新页面')
      setState(parseState(DATA_UPDATE_FAILED, message))
      return Promise.reject(message)
    }
  }

  // 过滤出新裂缝
  const checkUpdates = (fissures: Fissure[]) => {
    const currentFissures = origin.fissure
      .concat(steelPath.fissure)
      .concat(empyrean.fissure)
    const updates = fissures.filter((item) => !currentFissures.includes(item))
    console.log('[当前裂缝]：', currentFissures)
    console.log('[新裂缝]：', updates)
    return updates
  }

  let times = 1
  const processData = () => {
    setState(parseState(DATA_UPDATING, parseLog(`开始第${times}次轮询`)))
    times++
    $fetch(url, data)
      .then((res) => checkOutdates(res as Fissure[]))
      .then((res) => checkUpdates(res))
      .then((res) => pickValid(res))
      .then((res) => prepareFissures(res))
      .then((modified) => fillSteelPath(modified!))
      .then((leftover) => fillEmpyrean(leftover))
      .then((leftover) => fillOrigin(leftover))
      .catch((err) => console.warn(err))
  }

  if (indicator.value) {
    return console.log(parseLog('仍有已过期的裂缝等待更新，不再新增interval'))
  } else {
    indicator.value = setInterval(() => processData(), 10000)
    return console.log(parseLog(`开始轮询，interval：${indicator.value}`))
  }
}
/** ---------------------------------  */

// 倒计时结束时清除过期的裂缝
const cleanOrigin = (expired: Fissure) => {
  origin.fissure = origin.fissure.filter((fissure) => fissure.id !== expired.id)
  origin.state = DATA_UPDATING
  processUpdate(expired, (state: FissureDataState) => (origin.state = state))
}

const cleanSteel = (expired: Fissure) => {
  steelPath.fissure = steelPath.fissure.filter(
    (fissure) => fissure.id !== expired.id
  )
  steelPath.state = DATA_UPDATING
  processUpdate(expired, (state: FissureDataState) => (steelPath.state = state))
}

const cleanEmpyrean = (expired: Fissure) => {
  empyrean.fissure = empyrean.fissure.filter(
    (fissure) => fissure.id !== expired.id
  )
  empyrean.state = DATA_UPDATING
  processUpdate(expired, (state: FissureDataState) => (empyrean.state = state))
}
/** ---------------------------------  */
const prepareData = () => {
  const { handleServerSideRequest, url, data } = prepareRequest()
  useFetch<Fissure[]>(url, data)
    .then((res) => handleServerSideRequest(res))
    .then((res) => pickValid(res))
    .then((res) => checkDataState(res))
    .then((res) => prepareFissures(res))
    .then((modified) => fillSteelPath(modified!))
    .then((leftover) => fillEmpyrean(leftover))
    .then((leftover) => fillOrigin(leftover))
    .catch((err) => handleError(err))
}
prepareData()

const sortOrigin = () => {
  origin.fissure = origin.fissure.sort((a, b) => a.tierNum - b.tierNum)
}

const sortSteelPath = () => {
  steelPath.fissure = steelPath.fissure.sort((a, b) => a.tierNum - b.tierNum)
}

const sortEmpyrean = () => {
  empyrean.fissure = empyrean.fissure.sort((a, b) => a.tierNum - b.tierNum)
}

const handleError = (err: string | undefined) => {
  ElMessage.error(
    err ? err : '[数据错误]：处理裂缝数据时发生意外错误，请刷新页面'
  )
}
useHead({
  title: '裂缝 | warframe-team'
})
</script>

<style lang="scss" scoped>
.state-icon {
  transition: all 200ms ease-in-out;
}
.state-icon.checked {
  color: var(--el-color-success);
}
.state-icon.outdated {
  color: var(--el-color-warning);
}
.state-icon.updating {
  color: var(--el-color-info);
  animation: update 2s linear infinite;
  @keyframes update {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
.state-icon.failed {
  color: var(--el-color-danger);
}
</style>
