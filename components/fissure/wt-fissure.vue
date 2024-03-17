<template>
  <section>
    <h1>{{ title }}</h1>
    <el-row :gutter="24">
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
                <span>{{ fissure.tier }}</span>
              </div>
            </template>
            <div class="font-small">
              {{ fissure.subscribed ? '已订阅' : '未订阅' }}
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
defineProps<{
  title: string
  fissures: Fissure[]
}>()

const getTimestamp = (dateStr: string) => new Date(dateStr).getTime()
const emits = defineEmits(['finish'])
const handleFinish = (fissure: Fissure) => {
  console.log(
    fissure.node.concat(' - ').concat(fissure.missionType).concat('已经过期')
  )
  emits('finish', fissure)
}
</script>

<style lang="scss" scoped></style>
