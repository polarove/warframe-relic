<template>
  <client-only>
    <wt-header>
      <wt-header-icons>
        <el-col :span="4">
          <el-dropdown>
            <div class="fissure">
              <nuxt-icon name="playlist/fissure"></nuxt-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item active> 始源星系 </el-dropdown-item>
                <el-dropdown-item> 钢铁之路 </el-dropdown-item>
                <el-dropdown-item> 九重天 </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
      @finish="(fissure: Fissure) => (fissure.valid = false)"
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
  </wt-context-menu-container>
  <wt-spirit />
</template>

<script setup lang="ts">
import { API } from '~/constants'
import { ElMessage } from 'element-plus'
import type { Fissure, FissureState, FissureDataState } from '~/types/fissure'
import { LANGUAGE, PLATFORM } from '~/enums'
import { ListUtil } from '@polaris_liu/toolcat'
import { useFissureStore } from '~/store'
import { VoidUtil } from '@polaris_liu/toolcat'

const DATA_CLEAN = {
  icon: 'i-ep:circle-check',
  tip: '已是最新',
  className: 'checked',
  updating: false
}
const DATA_OUTDATED = {
  icon: 'i-ep:warning',
  tip: '需要更新',
  className: 'outdated',
  updating: false
}
const DATA_UPDATING = {
  icon: 'i-ep:loading',
  tip: '正在更新',
  className: 'updating',
  updating: true
}
const DATA_UPDATE_FAILED = {
  icon: 'i-ep:close-bold',
  tip: '更新失败',
  className: 'failed',
  updating: false
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

const isValidFissure = (fissure: Fissure) => {
  return (
    new Date().getTime() < new Date(fissure.expiry).getTime() || fissure.active
  )
}

const origin = reactive<FissureState>({
  loading: true,
  empty: false,
  fissure: [],
  state: {
    icon: '',
    tip: '',
    className: '',
    updating: false
  }
})

const checkDataState = (fissures: Fissure[]) => {
  origin.state = origin.fissure.every((fissure) => isValidFissure(fissure))
    ? DATA_CLEAN
    : DATA_OUTDATED

  if (origin.state) return Promise.resolve(fissures)
  else return Promise.reject('[裂缝更新]：裂缝中含有过期裂缝')
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

const currentFissures = () => origin.fissure

const fillOrigin = (fissures: Fissure[]) => {
  if (ListUtil.isEmpty(fissures)) origin.empty = true
  updateOrigin(fissures)
}

const updateOrigin = (fissures: Fissure[]) => {
  const newFissure = fissures
    .filter((fissure) => !fissure.isStorm)
    .filter((fissure) => !fissure.isHard)
  console.log('即将更新至始源星系：', newFissure)
  newFissure.forEach((fissure) => origin.fissure.push(fissure))
  origin.fissure.sort((a, b) => a.tierNum - b.tierNum)
  origin.loading = false
}

const { expiredFissureIdQueue, addExpiredFissureId, dropExpiredFissureIds } =
  useFissureStore()

/** ---------------------------------  */

const pageState = reactive({
  updating: false
})

// 倒计时结束时清除过期的裂缝
const cleanOrigin = (expired: Fissure) => {
  origin.fissure = origin.fissure.filter((fissure) => fissure.id !== expired.id)
  if (pageState.updating) return
  pageState.updating = true
  logDivider()
  processUpdate(expired, '始源星系')
  logDivider()
}

const logDivider = () => {
  console.log(
    `----${new Date().toLocaleString()}-------------------------------------------------------------------------------------------------------------------------------------`
  )
}

const parseLog = (name: string, message: string) => {
  return `[裂缝更新]：${name} | ${message}`
}

const parseState = (defaultState: FissureDataState, newMessage?: string) => {
  if (newMessage) defaultState.tip = newMessage
  return defaultState
}

const updateState = (name: string, tip: string, state: FissureDataState) => {
  const log = parseLog(name, tip)
  console.log(log)
  origin.state = parseState(state, log)
  console.log(parseLog(name, JSON.stringify(origin.state)))
  logDivider()
  return log
}

const processUpdate = (expired: Fissure, name: string) => {
  const id = expired.id
  !expiredFissureIdQueue.includes(id) && addExpiredFissureId(id)
  const { url, data } = prepareRequest()

  const logFissure = (a: Fissure[], b: Fissure[], c: Fissure[]) => {
    console.log('当前：', a)
    console.log('获取的：', b)
    console.log('不同的', c)
  }

  // 检查请求的数据是否已经更新完毕
  const checkUpdates = async (fissures: Fissure[], times: number) => {
    if (fissures) {
      const intersection = fissures
        .map((fissure) => fissure.id)
        .filter((id) => expiredFissureIdQueue.includes(id))
      if (ListUtil.isEmpty(intersection)) {
        // 数据已是最新
        dropExpiredFissureIds()
        const updates = fissures.filter((item) =>
          VoidUtil.isVoid(
            currentFissures().find((exist) => exist.id === item.id)
          )
        )
        logFissure(currentFissures(), fissures, updates)
        return Promise.resolve({
          fissures: updates,
          message: '更新完毕',
          state: DATA_CLEAN
        })
      } else
        return Promise.reject({
          message: `第${times}次获取的数据已经过期，重新获取中...`,
          state: DATA_UPDATING
        })
    } else
      return Promise.reject({
        message: `第${times}次获取到的裂缝数据为空，请刷新页面`,
        state: DATA_UPDATE_FAILED
      })
  }

  const stopUpdate = (indicator: NodeJS.Timeout | undefined) => {
    if (indicator) clearTimeout(indicator)
    pageState.updating = false
  }

  const launch = (
    state: number = 1,
    indicator: NodeJS.Timeout | undefined = undefined
  ): NodeJS.Timeout | void => {
    $fetch<Fissure[]>(url, data)
      .then((fissures) => {
        updateState(name, `正在对第${state}次更新进行检查`, DATA_UPDATING)
        return fissures
      })
      .then((fissures) => checkUpdates(fissures, state))
      .then((updates) => {
        updateState(name, updates.message, updates.state)
        return updates.fissures
      })
      .then((prepared) => prepareFissures(prepared))
      .then((elected) => updateOrigin(elected))
      .then(() => stopUpdate(indicator))
      .catch((err) => {
        updateState(name, err.message, err.state)
        const reload = () => {
          indicator = setTimeout(
            () => launch((state += 1), indicator),
            30 * 1000
          )
        }
        return reload()
      })
  }

  launch()
}

/** ---------------------------------  */
const prepareData = () => {
  const { handleServerSideRequest, url, data } = prepareRequest()
  useFetch<Fissure[]>(url, data)
    .then((res) => handleServerSideRequest(res))
    .then((res) => prepareFissures(res))
    .then((res) => checkDataState(res))
    .then((leftover) => fillOrigin(leftover))
    .catch((err) =>
      ElMessage.error(
        err ? err : '[数据错误]：加载裂缝数据时发生意外错误，请刷新页面'
      )
    )
}
prepareData()

useHead({
  title: '裂缝 | warframe-team',
  link: [{ rel: 'shortcut icon', href: './fissure-logo-white.svg' }]
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

.fissure:deep(.nuxt-icon svg) {
  width: 1.7em;
  height: 1.7em;
  cursor: pointer;
  &:hover {
    color: var(--el-color-primary);
  }
}
</style>
