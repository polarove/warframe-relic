<template>
  <component
    :is="block"
    :style="`--underline-text-height:${height}`"
    class="underline-text"
    :class="classes"
  >
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    block?: 'div' | 'span'
    text?: string
    animated?: boolean
    height?: string
    visible?: 'hover' | 'always'
  }>(),
  {
    block: 'span',
    text: '默认字符',
    animated: true,
    height: '2px',
    visible: 'hover'
  }
)

const classes = computed(() => {
  const e = props.animated ? 'animated' : 'static'
  return e.concat(' ').concat(props.visible)
})
</script>

<style lang="scss" scoped>
.underline-text.always {
  position: relative;
  &::before,
  &::after {
    content: '';
    position: absolute;
    height: var(--underline-text-height);
    bottom: 0;
    display: inline-block;
    transform-origin: left;
  }
}

.underline-text.hover {
  position: relative;
  &:hover::before,
  &:hover::after {
    content: '';
    position: absolute;
    height: var(--underline-text-height);
    bottom: 0;
    display: inline-block;
    transform-origin: left;
  }
}

.underline-text.animated {
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

.underline-text.static {
  &::after {
    left: 0;
    width: 100%;
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
