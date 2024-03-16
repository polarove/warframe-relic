<template>
  <section transition="all">
    <div class="title">
      <animated-underline pb="3px">
        <el-text>不仅仅是组队</el-text>
      </animated-underline>
      <h1 class="title-primary">Warframe Team</h1>
    </div>
    <div><el-button type="primary">开始</el-button></div>
    <wt-features class="pt-67px" />
  </section>
</template>

<script setup lang="ts">
useHead({
  title: '主页 | warframe-team',
  link: [{ rel: 'shortcut icon', href: './warframe-team-logo-white.svg' }]
})
</script>

<style lang="scss" scoped>
.title {
  padding: 60px 0 35px 0;

  .title-primary {
    font-size: 3rem;
    margin: 0;
  }
}
</style>
