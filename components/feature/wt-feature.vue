<template>
  <nuxt-link :to="route" class="wt-feature-card">
    <el-card shadow="hover">
      <h2 class="title">{{ title }}</h2>
      <p class="details">{{ details }}</p>
    </el-card>
  </nuxt-link>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    details?: string
    route: string
  }>(),
  {
    title: '标题',
    details: '功能详情'
  }
)
</script>

<style lang="scss" scoped>
.wt-feature-card {
  text-decoration: none;
  color: var(--el-text-color-regular);
  &::v-deep(.el-card) {
    border-radius: 8px;
    &:hover {
      border: 1px solid var(--el-color-primary);
    }
  }
}
</style>
