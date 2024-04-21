<template>
  <wt-header>
    <wt-header-icons />
  </wt-header>
  <section flex="col" justify="center" items="center" h="70vh">
    <wt-empty description="我们来到了一个没有 tenno 的虚空" />
    <div text="center">
      <el-button type="primary" @click="clearError({ redirect: '/' })">
        返回首页
      </el-button>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped></style>
