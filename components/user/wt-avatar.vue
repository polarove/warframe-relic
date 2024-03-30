<template>
  <div v-if="value">
    <el-avatar v-if="avatarUrl" />
    <nuxt-link
      to="/user/login"
      class="i-mdi:account-box text-size-[2.8em] c-p"
      hover="color-primary"
      v-else
    ></nuxt-link>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    avatarUrl?: string
  }>(),
  {
    avatarUrl: undefined
  }
)

const value =
  useSessionStorage('validSession', JSON.stringify(true)) &&
  !useRouter().currentRoute.value.fullPath.includes('register')
</script>

<style lang="scss" scoped></style>
