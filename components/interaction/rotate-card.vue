<template>
  <div
    class="rotate-card"
    :class="type"
    @mouseleave="reset"
    @mousemove="rotate($event)"
  >
    <div class="rotate-card-item" :class="type" ref="target">
      <slot> </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useElementTransform } from '@vueuse/motion'

const props = withDefaults(
  defineProps<{
    scale?: number
    type?: 'square' | 'circle'
  }>(),
  {
    scale: 15,
    type: 'square'
  }
)

const target = ref<HTMLElement | null>(null)
const { width, height } = useElementBounding(target)
const { transform } = useElementTransform(target)

const rotate = (event: any) => {
  let X = event.offsetX / width.value
  let Y = event.offsetY / height.value
  let rX = (X - 0.5) * props.scale
  let rY = -(Y - 0.5) * props.scale

  transform.rotateX = rY
  transform.rotateY = rX
}

const init = () => {
  transform.rotateX = 0
  transform.rotateY = 0
  transform.rotateZ = 0
}
init()

const reset = () => {
  transform.rotateX = 0
  transform.rotateY = 0
}
</script>

<style lang="scss">
.rotate-card {
  transform-style: preserve-3d;
  perspective: 700px;
  user-select: none;
  white-space: nowrap;
  display: inline-block;
  width: 100%;
  overflow: hidden;
  .rotate-card-item {
    width: 100%;
    transition: transform 0.25s ease-out;
  }
}
.rotate-card.square,
.rotate-card-item.square {
  border-radius: 12px;
  & > * {
    border-radius: 12px;
  }
}
.rotate-card.circle,
.rotate-card-item.square {
  border-radius: 50%;
}
</style>
