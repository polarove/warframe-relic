export interface ContextMenu {
  label: string
  fn?: () => void
  icon?: string
  type?: 'title' | 'option'
}
