<template>
  <div class="lg:px-8rem lg:py-4rem lt-lg:px-2em lt-lg:py-4em">
    <el-config-provider :message="config">
      <nuxt-page />
    </el-config-provider>
  </div>
</template>

<script setup lang="ts">
const config = reactive({
  max: 3
})
</script>

<style lang="scss" scoped></style>
