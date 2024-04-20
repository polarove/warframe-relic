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
        <div class="context-menu__list">
          <div
            @click="handleClick(option.fn)"
            class="context-menu__item"
            :class="option.type"
            v-for="option in menu"
          >
            {{ option.label }}
          </div>
        </div>
      </div>
    </teleport>
  </section>
</template>

<script lang="ts" setup>
import type { ContextMenu } from '~/types/context-menu'
import { useContextMenu } from './useContextMenu'
import { useZIndex } from 'element-plus'
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
  .context-menu__list {
    .context-menu__item {
      font-size: 0.88em;
    }
    .context-menu__item.option {
      cursor: pointer;
      padding: 4px 10px 4px 10px;
      &:hover {
        background-color: var(--el-color-primary);
        color: var(--el-color-white);
      }
    }
    .context-menu__item.title {
      --context-menu-item-border: 1px solid var(--el-border-color-light);
      padding: 4px 10px 4px 10px;
      text-align: right;
      border-bottom: var(--context-menu-item-border);
    }
    .context-menu__item.title:not(:first-child) {
      --context-menu-item-border: 1px solid var(--el-border-color-light);
      padding: 4px 10px 4px 10px;
      text-align: right;
      border-top: var(--context-menu-item-border);
      border-bottom: var(--context-menu-item-border);
    }
  }
}
</style>
