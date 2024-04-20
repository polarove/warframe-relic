export interface ContextMenu {
  label: string
  fn?: () => void
  icon?: string | Component
  type?: 'title' | 'option'
}
