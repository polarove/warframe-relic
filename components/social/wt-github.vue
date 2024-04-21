<template>
  <a
    href="https://github.com/polarove/warframe-team-nuxt"
    color="$el-text-color-primary"
  >
    <div
      class="i-mdi:github"
      color="~ hover:$el-color-primary"
      :w="size"
      :h="size"
    ></div>
  </a>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: string }>(), { size: '1.7em' })
</script>

<style lang="scss" scoped></style>
