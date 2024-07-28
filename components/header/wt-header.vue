<template>
  <div style="--el-card-padding: 0" class="el-card wt-header" shadow="never">
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
  </div>
</template>

<script setup lang="ts"></script>

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
</style>
