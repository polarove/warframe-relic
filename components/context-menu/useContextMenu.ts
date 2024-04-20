import type { Nullable } from '@polaris_liu/toolcat'
import { useZIndex } from 'element-plus'

export const useContextMenu = (
  target: Ref<Nullable<HTMLElement>>,
  self: Ref<Nullable<HTMLElement>>,
  menuId: number
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

  onMounted(() => {
    if (!target.value) return

    target.value.addEventListener('contextmenu', handleContextMenu)
  })

  onUnmounted(() => {
    if (!target.value) return
    target.value.removeEventListener('contextmenu', handleContextMenu)
  })

  return {
    x,
    y,
    visible,
    showMenu,
    closeMenu
  }
}
