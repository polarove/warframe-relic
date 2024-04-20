<template>
  <section>
    <div class="flex-between items-center">
      <h1>{{ title }}</h1>
      <slot></slot>
    </div>
    <el-empty v-if="isEmpty" description="空">
      <template #image>
        <nuxt-icon name="state/empty" />
      </template>
    </el-empty>
    <el-row v-else>
      <el-col
        v-for="(fissure, index) in fissures"
        :xs="24"
        :sm="12"
        :md="8"
        :xl="6"
      >
        <lazy-wt-context-menu>
          <el-card class="fissure-card">
            <template #header>
              <div class="flex-between">
                <span>{{ fissure.node }} - {{ fissure.missionType }}</span>
                <div
                  class="i-ep:bell bell"
                  w="1.3em"
                  h="1.3em"
                  cursor="pointer"
                  color="~ hover:$el-color-primary"
                  :style="{
                    color: fissure.subscribed
                      ? 'var(--el-color-primary)'
                      : undefined
                  }"
                  @click="toggleSubscribe(fissure)"
                />
              </div>
            </template>
            <div>
              {{ fissure.tier }}
            </div>
            <el-countdown
              title="剩余时间"
              :value="getTimestamp(fissure.expiry)"
              @finish="handleFinish(fissure)"
            />
            <transition name="el-fade-in-linear">
              <div class="sub-panel__overlay" v-if="fissure.panel"></div>
            </transition>
            <el-collapse-transition>
              <el-card
                v-if="fissure.panel"
                class="sub-panel__card"
                ref="subPanelCardRefs"
              >
                <template #header>
                  <div class="flex-between items-center">
                    <span>符合的订阅规则</span>
                    <div
                      class="i-ep:close"
                      w="1.3em"
                      h="1.3em"
                      cursor="pointer"
                      color="~ hover:$el-color-primary"
                      @click="() => (fissure.panel = !fissure.panel)"
                    ></div>
                  </div>
                </template>
                <div class="sub-panel__operations">
                  {{ fissure.tier }} - {{ getNodeName(fissure.node) }} -
                  {{ fissure.missionType }} -
                  {{ getNodeNameEn(fissure.node) }}
                </div>
              </el-card>
            </el-collapse-transition>
          </el-card>

          <template #menu>
            <wt-context-menu-item
              @select="handleMenuSelect(menu)"
              :type="menu.type"
              v-for="menu in generateMenu(fissure)"
            >
              {{ menu.label }}
              <nuxt-icon v-if="menu.type === 'title'" name="playlist/fissure" />
            </wt-context-menu-item>
          </template>
        </lazy-wt-context-menu>
      </el-col>
    </el-row>
  </section>
</template>

<script setup lang="ts">
import { useFissureStore } from '~/store'
import type { ContextMenuOptions } from '~/types/context-menu'
import type { Fissure } from '~/types/fissure'
defineProps<{
  title: string
  fissures: Fissure[]
  isEmpty: boolean
}>()

const subPanelCardRefs = reactive<HTMLElement[] | []>([])

const getTimestamp = (dateStr: string) => new Date(dateStr).getTime()

const getNodeName = (node: string) => {
  const name = node.match(/(?<=\().+?(?=\))/g)
  return name ? name[0] : ''
}

const getNodeNameEn = (node: string) => node.replace(/\([^)]*\)/g, '')

const emits = defineEmits([
  'finish',
  'select-menu',
  'finish-origin',
  'finish-empyrean',
  'finish-steel'
])
const handleFinish = (fissure: Fissure) => {
  emits('finish', fissure)
  if (fissure.isHard) return emits('finish-steel', fissure)
  else if (fissure.isStorm) return emits('finish-empyrean', fissure)
  else return emits('finish-origin', fissure)
}

// todo 还没想好这个面板要干什么
const toggleSubscribe = (fissure: Fissure) => {
  fissure.panel = true
}

const handleMenuSelect = (menu: ContextMenuOptions) => {
  emits('select-menu')
  const callback = menu.fn
  if (callback) callback()
}

const generateMenu = (fissure: Fissure): ContextMenuOptions[] => {
  const subscribeNode = () => {
    console.log('test')
  }

  const subscribeTier = () => {}

  const subscribeMission = () => {}

  const subscribeTierBindNode = () => {}

  const subscribeTierBindMissionType = () => {}

  const subscribeAll = () => {}

  const subscribeNodeBindType = () => {}

  return [
    { label: '订阅', type: 'title' },
    { label: fissure.node, type: 'option', fn: subscribeNode },
    { label: fissure.tier, type: 'option', fn: subscribeTier },
    { label: fissure.missionType, type: 'option', fn: subscribeMission },
    { label: '组合订阅', type: 'title' },
    {
      label: `${fissure.tier} - ${fissure.node}`,
      type: 'option',
      fn: subscribeTierBindNode
    },
    {
      label: `${fissure.tier} - ${fissure.missionType}`,
      type: 'option',
      fn: subscribeTierBindMissionType
    },
    {
      label: `${fissure.tier} - ${fissure.node} - ${fissure.missionType}`,
      type: 'option',
      fn: subscribeAll
    },
    {
      label: `${fissure.node} - ${fissure.missionType}`,
      type: 'option',
      fn: subscribeNodeBindType
    }
  ]
}
</script>

<style lang="scss" scoped>
.fissure-card {
  margin: 10px;
  position: relative;
  .sub-panel__overlay {
    background-color: var(--el-overlay-color-lighter);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 4;
  }
  .sub-panel__card {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 5;
    .sub-panel__operations {
      display: flex;
      width: 100%;
      justify-content: center;
    }
  }
}

// .belling {
//   animation: swing 167ms ease-in-out infinite;
//   transform-origin: center top;

//   @keyframes swing {
//     from {
//       transform: rotate(-10deg);
//     }
//     to {
//       transform: rotate(10deg);
//     }
//   }
// }
</style>
