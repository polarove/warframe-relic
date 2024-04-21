<template>
  <a
    class="bilibili"
    color="hover:#BC8F8F #BC4F4F"
    href="https://space.bilibili.com/471857522"
    :style="`--icon-size: ${size}`"
  >
    <nuxt-icon name="social/bilibili-filled"></nuxt-icon>
  </a>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: string }>(), { size: '1.7em' })
</script>

<style lang="scss" scoped>
.bilibili {
  &:deep(.nuxt-icon svg) {
    width: var(--icon-size);
    height: var(--icon-size);
  }
}
</style>
