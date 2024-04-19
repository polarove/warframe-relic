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
        v-for="fissure in fissures"
        :xs="24"
        :sm="12"
        :md="8"
        :xl="6"
        pb="20px"
      >
        <rotate-card :intensity="5">
          <el-card class="m-10px">
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
                  @click="(el: MouseEvent) => toggleSubscribe(el, fissure)"
                ></div>
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
          </el-card>
        </rotate-card>
      </el-col>
    </el-row>
  </section>
</template>

<script setup lang="ts">
import type { Fissure } from '~/types/fissure'
import { useElementTransform } from '@vueuse/motion'
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

const toggleSubscribe = (el: MouseEvent, fissure: Fissure) => {
  emits('subscribe', fissure)
}
</script>

<style lang="scss" scoped>
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
</style>
