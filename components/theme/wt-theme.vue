<template>
  <span
    class="theme-icon"
    :class="icon"
    @click="toggleTheme($colorMode.value)"
    :style="{ fontSize: size }"
  ></span>
</template>

<script setup lang="ts">
import { THEMES } from '~/enums'
withDefaults(defineProps<{ size?: string }>(), {
  size: '1rem'
})
const theme = useColorMode()
const icon = computed(() => {
  return theme.value === THEMES.DARK
    ? 'i-mdi:weather-night'
    : 'i-mdi:white-balance-sunny'
})
const toggleTheme = (current_theme: string) => {
  if (current_theme === THEMES.DARK) return (theme.preference = THEMES.LIGHT)
  else return (theme.preference = THEMES.DARK)
}
</script>

<style lang="scss" scoped>
.theme-icon {
  min-width: 1em;
  cursor: pointer;
  &:hover {
    color: var(--el-color-primary);
  }
}
</style>
