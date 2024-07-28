<template>
  <el-row :gutter="14">
    <el-col
      :xs="24"
      :sm="12"
      :md="8"
      :xl="6"
      class="item"
      :key="index"
      v-for="(feature, index) in features"
    >
      <nuxt-link :to="feature.path" style="text-decoration: none">
        <el-card>
          <h1>{{ feature.name }}</h1>
        </el-card>
      </nuxt-link>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
const features = [
  { name: '始源星系 - 裂缝', path: '/fissure/origin' },
  { name: '钢铁之路 - 裂缝', path: '/fissure/steelpath' },
  { name: '九重天 - 裂缝', path: '/fissure/empyrean' }
]
</script>

<style lang="scss" scoped>
.item {
  padding-bottom: 16px;
  &::v-deep(.el-card) {
    cursor: pointer;
    &:hover {
      border: 1px solid var(--el-color-primary);
    }
  }
}
</style>
