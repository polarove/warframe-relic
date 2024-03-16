<template>
  <section class="wt-header" :class="{ shadow: fixed }">
    <el-row justify="space-between" items="center" h="100%">
      <el-col :span="4">
        <nuxt-link to="/" class="home">
          <wt-logo />
        </nuxt-link>
      </el-col>
      <el-col :span="4" flex="end" items="center">
        <wt-theme size="1.3rem" />
      </el-col>
    </el-row>
  </section>
</template>

<script setup lang="ts">
const fixed = computed(() => useWindowScroll().y.value > 0)
watchEffect(() => {
  console.log(fixed.value)
})
</script>

<style lang="scss" scoped>
.wt-header {
  padding: 0 2rem;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 999;
  height: 57px;
  .home {
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
