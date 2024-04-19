<template>
  <section>
    <h1>{{ title }}</h1>
    <el-empty v-if="isEmpty" description="空">
      <template #image>
        <nuxt-icon name="state/empty" />
      </template>
    </el-empty>
    <el-row :gutter="24" v-else>
      <el-col
        v-for="(fissure, index) in fissures"
        :xs="24"
        :sm="12"
        :md="8"
        :xl="6"
        pb="20px"
      >
        <el-card class="m-10px p-r">
          <template #header>
            <div class="flex-between">
              <span>{{ fissure.node }} - {{ fissure.missionType }}</span>
              <div
                class="i-ep:bell w-1.3em h-1.3em operation bell"
                :style="{
                  color: fissure.subscribed
                    ? 'var(--el-color-primary)'
                    : undefined
                }"
                @click="
                  (el: MouseEvent) => toggleSubscribe(el, fissure, index, title)
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
            <el-card v-if="fissure.panel" class="sub-panel__card">
              <template #header>
                <div class="flex-between items-center">
                  <span>订阅</span>
                  <div
                    class="i-ep:close w-1.3em h-1.3em operation"
                    @click="() => (fissure.panel = !fissure.panel)"
                  ></div>
                </div>
              </template>
              <span>{{ fissure.tier }}</span>
            </el-card>
          </el-collapse-transition>
        </el-card>
      </el-col>
    </el-row>
  </section>
</template>

<script setup lang="ts">
import { useFissureSubStore } from '~/store'
import type { Fissure } from '~/types/fissure'
defineProps<{
  title: string
  fissures: Fissure[]
  isEmpty: boolean
}>()

const getTimestamp = (dateStr: string) => new Date(dateStr).getTime()
const emits = defineEmits(['finish', 'settings', 'subscribe'])
const handleFinish = (fissure: Fissure) => {
  console.log(
    fissure.node.concat(' - ').concat(fissure.missionType).concat('已经过期')
  )
  emits('finish', fissure)
}

const toggleSubscribe = (
  e: MouseEvent,
  fissure: Fissure,
  index: number,
  title: string
) => {
  emits('subscribe', fissure, index, title)
  const { subs } = useFissureSubStore()
  const target = e.target as HTMLElement

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
</script>

<style lang="scss" scoped>
.sub-panel__overlay {
  background-color: var(--el-overlay-color-lighter);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.sub-panel__card {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.operation {
  cursor: pointer;
  &:hover {
    color: var(--el-color-primary);
  }
}
.operation.setting {
  &:hover {
    animation: rotate 2s linear infinite;
  }
  @keyframes rotate {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(360deg);
    }
  }
}
.operation.bell.subscribed {
  color: var(--el-color-primary);
}

.belling {
  animation: swing 167ms ease-in-out infinite;
  transform-origin: center top;

  @keyframes swing {
    from {
      transform: rotate(-10deg);
    }
    to {
      transform: rotate(10deg);
    }
  }
}
</style>
