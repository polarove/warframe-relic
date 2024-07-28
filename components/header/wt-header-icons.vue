<template>
  <el-row justify="space-around">
    <el-col :span="4">
      <client-only>
        <wt-theme :size="iconSize" />
      </client-only>
    </el-col>
    <el-col :span="4">
      <wt-github :size="iconSize" />
    </el-col>
    <el-col :span="4">
      <wt-bilibili :size="iconSize" />
    </el-col>
    <el-col :span="4">
      <el-dropdown @command="(e) => handleCommand(e)">
        <div class="fissure">
          <nuxt-icon name="playlist/fissure"></nuxt-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="/fissure/origin" active>
              始源星系
            </el-dropdown-item>
            <el-dropdown-item command="/fissure/steelpath">
              钢铁之路
            </el-dropdown-item>
            <el-dropdown-item command="/fissure/empyrean">
              九重天
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ iconSize?: string }>(), { iconSize: '1.7em' })

const handleCommand = (path: string) => navigateTo(path)
</script>

<style lang="scss" scoped>
.fissure:deep(.nuxt-icon svg) {
  width: 1.7em;
  height: 1.7em;
  cursor: pointer;
  &:hover {
    color: var(--el-color-primary);
  }
}
</style>
