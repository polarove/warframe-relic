<template>
  <el-row justify="space-around">
    <el-col :span="4">
      <wt-theme size="1.7em" />
    </el-col>

    <el-col :span="4">
      <a
        href="https://github.com/polarove/warframe-team-nuxt"
        color="$el-text-color-primary"
      >
        <div
          class="i-mdi:github"
          color="~ hover:$el-color-primary"
          w="1.7em"
          h="1.7em"
        ></div>
      </a>
    </el-col>

    <el-col :span="4">
      <a
        class="bilibili"
        color="hover:#BC8F8F #BC4F4F"
        href="https://space.bilibili.com/471857522"
      >
        <nuxt-icon name="social/bilibili-filled"></nuxt-icon>
      </a>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: string }>(), { size: '1.7em' })
</script>

<style lang="scss" scoped>
.bilibili {
  &:deep(.nuxt-icon svg) {
    width: 1.7em;
    height: 1.7em;
  }
}
</style>
