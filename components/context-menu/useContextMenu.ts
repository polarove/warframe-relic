import type { Nullable } from '@polaris_liu/toolcat'

export const useContextMenu = (
  target: Ref<Nullable<HTMLElement>>,
  self: Ref<Nullable<HTMLElement>>
) => {
  const x = ref(0)
  const y = ref(0)

  const visible = ref(false)
  const showMenu = () => (visible.value = true)
  const closeMenu = () => {
    visible.value = false
  }

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    x.value = e.pageX
    y.value = e.pageY
    showMenu()
  }

  onClickOutside(self, () => closeMenu())

  const { isMobile, isDesktop } = useDevice()

  const contextMenuWarn = (message: string) => {
    console.warn(`[context-menu]：${message}`)
  }

  if (isDesktop) {
    onMounted(() => {
      if (target.value) {
        target.value.addEventListener('contextmenu', handleContextMenu)
      } else {
        return contextMenuWarn(
          '添加 contextmenu 监听事件时发生错误，指定的元素不存在'
        )
      }
    })

    onUnmounted(() => {
      if (target.value) {
        target.value.removeEventListener('contextmenu', handleContextMenu)
      } else {
        return contextMenuWarn(
          '移除 contextmenu 监听事件时发生错误，指定的元素不存在'
        )
      }
    })
  } else if (isMobile) {
    let timeout: NodeJS.Timeout
    const timedContextMenu = () => {
      timeout = setTimeout(() => handleContextMenu, 1000)
    }
    onMounted(() => {
      if (target.value) {
        target.value.addEventListener('mousedown', timedContextMenu)
        target.value.addEventListener('mouseup', () => clearTimeout(timeout))
      } else {
        return contextMenuWarn(
          '添加 mousedown 和 mouseup 监听事件时发生错误，指定的元素不存在'
        )
      }
    })

    onUnmounted(() => {
      if (target.value) {
        target.value.removeEventListener('mousedown', timedContextMenu)
        target.value.removeEventListener('mouseup', () => clearTimeout(timeout))
      } else {
        return contextMenuWarn(
          '移除 mousedown 和 mouseup 监听事件时发生错误，指定的元素不存在'
        )
      }
    })
  }

  return {
    x,
    y,
    visible,
    showMenu,
    closeMenu
  }
}
