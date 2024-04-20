<template>
  <section>
    <h1>{{ title }}</h1>
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
        <lazy-wt-context-menu :menu="generateMenu(fissure)">
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
                  @click="
                    (e: MouseEvent) => toggleSubscribe(e, fissure, index, title)
                  "
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
                    <span> 订阅{{ getNodeName(fissure.node) }} </span>
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
                <div class="sub-panel__operations">符合xxx订阅规则</div>
              </el-card>
            </el-collapse-transition>
          </el-card>
        </lazy-wt-context-menu>
      </el-col>
    </el-row>
  </section>
</template>

<script setup lang="ts">
import { useFissureSubStore } from '~/store'
import type { ContextMenu } from '~/types/context-menu'
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
  return name ? ` - ${name}` : ''
}

const getNodeNameEn = (node: string) => node.replace(/\([^)]*\)/g, '')

const emits = defineEmits([
  'origin-finish',
  'steel-finish',
  'empyrean-finish',
  'settings',
  'subscribe'
])
const handleFinish = (fissure: Fissure) => {
  if (fissure.isHard) emits('steel-finish', fissure)
  else if (fissure.isStorm) emits('empyrean-finish', fissure)
  else emits('origin-finish', fissure)
}

const toggleSubscribe = (
  e: MouseEvent,
  fissure: Fissure,
  index: number,
  title: string
) => {
  emits('subscribe', fissure, index, title)
  const { subs } = useFissureSubStore()

  const shakingBell = async () => {
    fissure.panel = true
    return Promise.resolve()
  }

  const checkSubState = async () => {
    if (subs.includes(fissure)) return Promise.reject('已订阅该裂缝，进行修改')
    else return Promise.resolve('尚未订阅该裂缝，进行订阅')
  }

  shakingBell().then(() => checkSubState())
}

const generateMenu = (fissure: Fissure): ContextMenu[] => {
  return [
    { label: '订阅', type: 'title' },
    { label: fissure.node, type: 'option' },
    { label: fissure.tier, type: 'option' },
    { label: fissure.missionType, type: 'option' },
    { label: '组合订阅', type: 'title' },
    {
      label: `${fissure.tier} - ${fissure.node}`,
      type: 'option'
    },
    {
      label: `${fissure.tier} - ${fissure.missionType}`,
      type: 'option'
    },
    {
      label: `${fissure.tier} - ${fissure.node} - ${fissure.missionType}`,
      type: 'option'
    },
    {
      label: `${fissure.node} - ${fissure.missionType}`,
      type: 'option'
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
      .operation {
        flex: 1;
        padding: 0.2em;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }
      .operation:first-child {
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      .operation:last-child {
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
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
