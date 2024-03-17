<template>
  <el-row :gutter="14">
    <el-col :xs="24" :sm="12" :md="8" :xl="6" class="item" v-for="item in 2">
      <nuxt-link to="/fissure" style="text-decoration: none">
        <el-card>
          <p>裂缝</p>
          <p>始源星系 / 钢铁之路 / 九重天</p>
        </el-card>
      </nuxt-link>
    </el-col>
  </el-row>
</template>

<script setup lang="ts"></script>

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
