<template>
  <el-row :gutter="14">
    <el-col :xs="24" :sm="12" :md="10" :xl="6" class="item">
      <el-card class="p-r box">
        <h1 class="title flex-center">
          <nuxt-icon name="playlist/fissure"></nuxt-icon>
          虚空裂缝
        </h1>
        <div
          class="p-a top-50% w-100% left-50% transform display-none text-center option"
          style="--un-translate-x: -50%; --un-translate-y: -50%"
        >
          <nuxt-link
            to="/fissure/origin"
            class="hover-color-primary lg:px-6 md:px-3 lt-md:px-2 select-none decoration-none color-inherit"
          >
            <span class="text-2xl"> 始源星系 </span>
          </nuxt-link>
          <nuxt-link
            to="/fissure/steel-path"
            class="hover-color-primary lg:px-6 md:px-3 lt-md:px-2 select-none decoration-none color-inherit"
          >
            <span class="text-2xl"> 钢铁之路 </span>
          </nuxt-link>
          <nuxt-link
            to="/fissure/empyrean"
            class="hover-color-primary lg:px-6 md:px-3 lt-md:px-2 select-none decoration-none color-inherit"
          >
            <span class="text-2xl"> 九重天 </span>
          </nuxt-link>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.title:deep(.nuxt-icon svg) {
  width: 2em;
  height: 2em;
  cursor: pointer;
  &:hover {
    color: var(--el-color-primary);
  }
}
.box {
  min-height: 120px;
  &:hover {
    .title {
      display: none;
    }
    .option {
      display: block;
    }
  }
}

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
