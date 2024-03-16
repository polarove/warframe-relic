<template>
  <section class="wt-header">
    <el-row justify="space-between" items="center" h="100%">
      <el-col :span="4">
        <el-text size="large">平台</el-text>
      </el-col>
      <el-col :span="4" flex="end">
        <wt-theme size="1.5rem" />
      </el-col>
    </el-row>
  </section>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.wt-header {
  padding: 0 2rem;
  height: 57px;
}
</style>
