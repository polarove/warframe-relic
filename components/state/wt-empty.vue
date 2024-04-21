<template>
  <el-empty :description="description">
    <template #image>
      <nuxt-icon :name="icon" />
    </template>
  </el-empty>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ description?: string; icon?: string }>(), {
  description: '空',
  icon: 'state/empty'
})
</script>

<style lang="scss" scoped></style>
