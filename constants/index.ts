export const API = 'https://api.warframestat.us'

export const DATA_CLEAN = {
  icon: 'i-ep:circle-check',
  tip: '已是最新',
  className: 'checked',
  updating: false
}
export const DATA_OUTDATED = {
  icon: 'i-ep:warning',
  tip: '需要更新',
  className: 'outdated',
  updating: false
}
export const DATA_UPDATING = {
  icon: 'i-ep:loading',
  tip: '正在更新',
  className: 'updating',
  updating: true
}
export const DATA_UPDATE_FAILED = {
  icon: 'i-ep:close-bold',
  tip: '更新失败',
  className: 'failed',
  updating: false
}
