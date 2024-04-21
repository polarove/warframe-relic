<template>
  <el-row justify="space-around">
    <el-col :span="4">
      <client-only>
        <wt-theme :size="iconSize" />
      </client-only>
    </el-col>
    <el-col :span="4">
      <wt-github :size="iconSize" />
    </el-col>
    <el-col :span="4">
      <wt-bilibili :size="iconSize" />
    </el-col>
    <slot></slot>
  </el-row>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ iconSize?: string }>(), { iconSize: '1.7em' })
</script>

<style lang="scss" scoped></style>
