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
        <rotate-card>
          <el-card class="m-10px">
            <template #header>
              <div class="flex-between">
                <span>{{ fissure.node }} - {{ fissure.missionType }}</span>
                <span>{{ fissure.tier }}</span>
              </div>
            </template>

            <div>{{ fissure.expiry }}</div>
            <div>active: {{ fissure.active }}</div>
            <div>subscribed: {{ fissure.subscribed }}</div>
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
</script>

<style lang="scss" scoped></style>
