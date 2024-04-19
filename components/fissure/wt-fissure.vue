<template>
  <section>
    <h1>{{ title }}</h1>
    <el-empty v-if="isEmpty" description="空">
      <template #image>
        <nuxt-icon name="state/empty" />
      </template>
    </el-empty>
    <el-row :gutter="24" v-else>
      <el-col
        v-for="(fissure, index) in fissures"
        :xs="24"
        :sm="12"
        :md="8"
        :xl="6"
        pb="20px"
      >
        <rotate-card :intensity="5">
          <el-card class="m-10px">
            <template #header>
              <div class="flex-between">
                <span>{{ fissure.node }} - {{ fissure.missionType }}</span>
                <div
                  class="i-ep:bell w-1.3em h-1.3em operation bell"
                  :style="{
                    color: fissure.subscribed
                      ? 'var(--el-color-primary)'
                      : undefined
                  }"
                  @click="
                    (el: MouseEvent) =>
                      toggleSubscribe(el, fissure, index, title)
                  "
                ></div>
              </div>
            </template>
            <div>
              {{ fissure.tier }}
            </div>
            <el-countdown
              title="剩余时间"
              :value="getTimestamp(fissure.expiry)"
              @finish="handleFinish(fissure)"
            />
          </el-card>
        </rotate-card>
      </el-col>
    </el-row>
  </section>
</template>

<script setup lang="ts">
import { useFissureSubStore } from '~/store'
import type { Fissure } from '~/types/fissure'
defineProps<{
  title: string
  fissures: Fissure[]
  isEmpty: boolean
}>()

const getTimestamp = (dateStr: string) => new Date(dateStr).getTime()
const emits = defineEmits(['finish', 'settings', 'subscribe'])
const handleFinish = (fissure: Fissure) => {
  console.log(
    fissure.node.concat(' - ').concat(fissure.missionType).concat('已经过期')
  )
  emits('finish', fissure)
}

const toggleSubscribe = (
  el: MouseEvent,
  fissure: Fissure,
  index: number,
  title: string
) => {
  emits('subscribe', fissure, index, title)
  const { subs } = useFissureSubStore()

  const shakingBell = async () => {
    const target = el.target as HTMLElement
    target.classList.add('belling')
    setTimeout(() => {
      target.classList.remove('belling')
    }, 835)
    return Promise.resolve()
  }

  const checkSubState = async () => {
    if (subs.includes(fissure)) return Promise.reject('已订阅该裂缝，进行修改')
    else return Promise.resolve('尚未订阅该裂缝，进行订阅')
  }

  const freshSub = async () => {
    ElMessageBox.confirm(h('div', '我去'), '订阅', {
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })
      .then(() => notifyAfterSubscribe())
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '订阅取消'
        })
      })
  }

  const modifySub = async () => {
    ElMessageBox.confirm('23', '修改订阅', {
      confirmButtonText: '修改',
      cancelButtonText: '取消',
      type: 'info'
    })
      .then(() => notifyAfterSubscribe())
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '订阅取消'
        })
      })
  }

  const notifyAfterSubscribe = async () => {
    ElNotification({
      title: '裂缝订阅',
      message: h('div', null, [
        '您已成功订阅',
        h(
          'div',
          { style: 'color:var(--el-color-primary)' },
          title
            .concat('-')
            .concat(fissure.tier)
            .concat('-')
            .concat(fissure.node)
        )
      ])
    })
    return Promise.resolve()
  }

  shakingBell()
    .then(() => checkSubState())
    .then(() => freshSub())
    .catch((err) => {
      console.log(err)
      modifySub()
    })
}
</script>

<style lang="scss" scoped>
.operation {
  cursor: pointer;
  &:hover {
    color: var(--el-color-primary);
  }
}
.operation.setting {
  &:hover {
    animation: rotate 2s linear infinite;
  }
  @keyframes rotate {
    from {
      transform: rotate(0);
    }

    to {
      transform: rotate(360deg);
    }
  }
}
.operation.bell.subscribed {
  color: var(--el-color-primary);
}

.belling {
  animation: swing 167ms ease-in-out infinite;
  transform-origin: center top;

  @keyframes swing {
    from {
      transform: rotate(-10deg);
    }
    to {
      transform: rotate(10deg);
    }
  }
}
</style>
