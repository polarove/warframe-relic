<template>
  <component :is="block" class="animated-text"> <slot></slot> </component>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ block?: 'div' | 'span'; text?: string }>(), {
  block: 'span',
  text: '默认字符'
})
</script>

<style lang="scss" scoped>
.animated-text {
  position: relative;
  &::before,
  &::after {
    content: '';
    position: absolute;
    height: 1px;
    bottom: 0;
    display: inline-block;
    transform-origin: left;
  }
  &::before {
    left: 0;
    width: 0;
    animation: grow 3s infinite;
    background-color: transparent;
  }

  &::after {
    right: 0;
    width: 100%;
    animation: grow-reverse 3s infinite;
    background-color: var(--el-color-primary);
  }
}

@keyframes grow {
  to {
    width: 100%;
    opacity: 1;
    background-color: var(--el-color-primary);
  }
}
@keyframes grow-reverse {
  to {
    width: 0;
    opacity: 0;
    background-color: transparent;
  }
}
</style>
