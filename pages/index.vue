<template>
  <wt-header>
    <wt-header-icons />
  </wt-header>
  <section transition="all">
    <div class="title">
      <animated-underline :animated="true" visible="always" pb="3px">
        <el-text>不仅仅是组队</el-text>
      </animated-underline>
      <h1 class="title-primary">Warframe Team</h1>
    </div>
    <wt-features class="pt-67px" />
  </section>
  <teleport to="body">
    <div class="i-ep:circle-check display-none"></div>
    <div class="i-ep:warning display-none"></div>
    <div class="i-ep:loading display-none"></div>
    <div class="i-ep:close-bold display-none"></div>
  </teleport>
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
