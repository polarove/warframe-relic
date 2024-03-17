<template>
  <section>
    <h1>{{ title }}</h1>
    <el-row :gutter="24">
      <el-col
        v-for="fissure in fissures"
        :xs="24"
        :sm="8"
        :md="6"
        :xl="6"
        pb="40px"
      >
        <el-card>
          <template #header>
            {{ fissure.node }} - {{ fissure.missionType }}
          </template>
          <div>{{ fissure.tier }}</div>
          <div>{{ fissure.expiry }}</div>
          <div>active: {{ fissure.active }}</div>
          <div>subscribed: {{ fissure.subscribed }}</div>
        </el-card>
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
