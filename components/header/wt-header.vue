<template>
  <section class="wt-header" :class="{ shadow: scrolled }">
    <el-row justify="space-between" items="center" h="100%">
      <el-col :md="20" :lg="22">
        <nuxt-link to="/" class="logo">
          <wt-logo />
        </nuxt-link>
      </el-col>
      <el-col :md="4" :lg="2">
        <slot></slot>
      </el-col>
    </el-row>
  </section>
</template>

<script setup lang="ts">
const scrolled = computed(() => useWindowScroll().y.value > 0)
</script>

<style lang="scss" scoped>
.wt-header {
  padding: 0 2rem;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 2001;
  height: 57px;
  .logo {
    color: var(--el-text-color-regular);
    text-decoration: none;
    text-wrap: nowrap;
    margin-right: 1.2rem;
    &:hover {
      color: var(--el-color-primary);
    }
  }
}

.wt-header.shadow {
  transition: all 200ms ease-in-out;
  background-color: var(--el-bg-color);
}
</style>
