<template>
  <span class="wt-logo">
    <nuxt-icon name="warframe-team-logo-black" />
  </span>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.wt-logo {
  &::v-deep(.nuxt-icon) {
    svg {
      width: 2.5rem;
      height: 2.5rem;
    }
    &:hover {
      color: var(--el-color-primary);
    }
  }
}
</style>
