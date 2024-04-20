<template>
  <section ref="contextMenuRef">
    <slot></slot>
    <teleport :to="target()">
      <div
        v-if="visible"
        ref="contextMenuSelf"
        class="context-menu"
        :style="{
          left: x + 'px',
          top: y + 'px'
        }"
      >
        <slot name="menu"></slot>
      </div>
    </teleport>
  </section>
</template>

<script lang="ts" setup>
import type { ContextMenu } from '~/types/context-menu'
import { useContextMenu } from './useContextMenu'

withDefaults(
  defineProps<{
    menu?: ContextMenu[]
  }>(),
  {
    menu: () => [
      { label: '选项', type: 'title' },
      { label: '选项一', type: 'option' },
      { label: '选项二', type: 'option' }
    ]
  }
)

const emit = defineEmits(['select'])
const target = () => document.getElementById('wt-context-menu-container')
const contextMenuRef = ref<HTMLElement | null>(null)
const contextMenuSelf = ref<HTMLElement | null>(null)

const { x, y, visible, closeMenu } = useContextMenu(
  contextMenuRef,
  contextMenuSelf
)

const handleClick = (callback: (() => void) | undefined) => {
  emit('select')
  if (callback) callback()
  closeMenu()
}
</script>

<style lang="scss" scoped>
.context-menu {
  position: absolute;
  background-color: var(--el-bg-color);
  box-shadow: var(--el-box-shadow-light);
  border-radius: 3px;
  min-width: 267px;
  line-height: 1.8;
  white-space: nowrap;
  overflow: hidden;
  padding: 6px 0;
  z-index: 888;
}
</style>
