<template>
  <div class="context-menu__item" :class="type">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: 'title' | 'option'
}>()
</script>

<style lang="scss" scoped>
.context-menu__item {
  font-size: 0.88em;
  position: relative;
  .prepend {
    margin-right: 5px;
  }
}
.context-menu__item.option {
  cursor: pointer;
  padding: 5px 20px;
  &:hover {
    background-color: var(--el-color-primary);
    color: var(--el-color-white);
  }
}
.context-menu__item.title {
  --context-menu-item-border: 1px solid var(--el-border-color-light);
  padding: 5px 12px;
  text-align: right;
  border-bottom: var(--context-menu-item-border);
}
.context-menu__item.title:not(:first-child) {
  --context-menu-item-border: 1px solid var(--el-border-color-light);

  text-align: right;
  border-top: var(--context-menu-item-border);
  border-bottom: var(--context-menu-item-border);
}
</style>
