import type { ContextMenuItem } from '~/components/context-menu/types'
export interface ContextMenuOptions extends ContextMenuItem {
  label: string
  fn?: Function
}
