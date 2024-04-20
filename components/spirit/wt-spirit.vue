<template>
  <div
    class="spirit"
    :class="`${state} ${mood} ${action}`"
    :style="`--face-size: ${size}`"
  >
    <div
      class="face"
      @mouseenter="handleEnter()"
      @mouseleave="handleLeave()"
      @click="$emit('face-click')"
    >
      <div class="oda">
        <div class="eyes upper"></div>
        <div class="eyes bottom"></div>
      </div>
    </div>
    <div class="spirit-shadow"></div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
declare type State = 'awake' | 'asleep'
declare type Mood = 'tired' | 'angry' | 'happy' | 'normal'
declare type Action = 'none' | 'blink'

const props = withDefaults(
  defineProps<{ state?: State; mood?: Mood; action?: Action; size?: string }>(),
  {
    state: 'asleep',
    mood: 'normal',
    action: 'none',
    size: '67px'
  }
)

const state = ref<State>(props.state)
const mood = ref<Mood>(props.mood)
const action = ref<Action>(props.action)

const interval = ref<NodeJS.Timeout | undefined>()
const handleEnter = () => {
  state.value = 'awake'
  interval.value = setInterval(() => blink(), Math.random() * 1000 * 3)
}

const handleLeave = () => {
  state.value = 'asleep'
  clearInterval(interval.value)
}

const blink = async () => {
  if (state.value === 'asleep') return
  if (Math.random() > 0.5) action.value = 'blink'
  else action.value = 'none'
}
</script>

<style lang="scss" scoped>
.spirit {
  --face-right: 0px;
  --face-bottom: 0px;
  position: fixed;
  z-index: 5;
  cursor: pointer;
  transition: all 500ms cubic-bezier(0.165, 0.84, 0.44, 1);
  .face {
    position: relative;
    clip-path: circle();
    background-color: var(--el-color-primary);
    width: var(--face-size);
    height: var(--face-size);
    box-shadow: var(--el-box-shadow-light);
    animation: hovering 4s ease-in-out infinite;
    z-index: 6;
    @keyframes hovering {
      0%,
      100% {
        transform: translateY(0);
      }

      50% {
        transform: translateY(6.7%);
      }
    }
    .oda {
      position: absolute;
      top: calc(var(--face-size) / 3.5);
      height: calc((var(--face-size) + var(--face-size)) / 7);
      width: 100%;
      display: flex;
      justify-content: space-around;
      .eyes {
        transition: all 200ms cubic-bezier(0.215, 0.61, 0.355, 1);
        background-color: #fff;
        width: calc((var(--face-size) + var(--face-size)) / 7);
      }
    }
  }
  .spirit-shadow {
    position: absolute;
    bottom: 0;
    background-color: var(--el-text-color-disabled);
    box-shadow: inset var(--el-box-shadow-dark);
    height: 6px;
    border-radius: 45%;
    width: 50%;
    animation: scaling 4s ease-in-out infinite;
    z-index: 4;
    @keyframes scaling {
      0%,
      100% {
        transform: translate(50%, 177%) scale(0.67, 1.2);
      }

      50% {
        transform: translate(50%, 177%) scale(1.22, 1.2);
      }
    }
  }
}
.spirit.awake {
  opacity: 1;
  bottom: calc(var(--face-bottom) + var(--face-size) / 4);
  right: calc(var(--face-right) + var(--face-size) / 8);
  .face-shadow {
    height: 20px;
    background-color: var(--el-text-color-regular);
  }

  .eyes {
    position: relative;
    clip-path: circle();
  }

  &.tired {
    .eyes {
      &::before,
      &::after {
        content: '';
        position: absolute;
        background-color: var(--el-color-primary);
        width: 100%;
      }
      &::before {
        top: 0;
        animation: blink-upper 9s cubic-bezier(0.85, 0.085, 0.68, 0.53) infinite;
      }

      &::after {
        bottom: 0;
        animation: blink-bottom 8.5s cubic-bezier(0.85, 0.085, 0.68, 0.53)
          infinite;
      }

      @keyframes blink-upper {
        0%,
        100% {
          height: 5px;
        }

        50% {
          height: 70%;
        }
      }

      @keyframes blink-bottom {
        0%,
        100% {
          height: 5%;
        }

        50% {
          height: 10%;
        }
      }
    }
  }

  &.blink {
    .eyes {
      &::before,
      &::after {
        content: '';
        position: absolute;
        background-color: var(--el-color-primary);
      }
      &::before {
        top: 0;
        animation: blink-upper 500ms cubic-bezier(0.85, 0.085, 0.68, 0.53)
          forwards;
      }

      &::after {
        bottom: 0;
        animation: blink-bottom 500ms cubic-bezier(0.85, 0.085, 0.68, 0.53)
          forwards;
      }

      @keyframes blink-upper {
        0%,
        100% {
          height: 0;
          width: 100%;
        }

        50% {
          height: 50%;
        }
      }

      @keyframes blink-bottom {
        0%,
        100% {
          height: 0;
          width: 100%;
        }

        50% {
          height: 50%;
        }
      }
    }
  }
}

.spirit.asleep {
  opacity: 0.67;
  bottom: calc(var(--face-bottom) - var(--face-size) / 3.5);
  right: calc(var(--face-right) - var(--face-size) / 3.5);
  transform: rotate3d(0, 0, 1, -45deg);
  .eyes {
    border-radius: 20px;
    animation: nappingEyes 4s cubic-bezier(0.77, 0, 0.175, 1) infinite;
    @keyframes nappingEyes {
      0%,
      100% {
        height: calc(var(--face-size) / 10);
        transform: scale(0.88);
      }
      50% {
        height: 2px;
        transform: scale(1);
      }
    }
  }
}
</style>
