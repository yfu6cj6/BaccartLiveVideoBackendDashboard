import request from '@/utils/request'

export function agentWinLossReportSearch(data) {
  return request({
    url: '/agent/winLoss',
    method: 'post',
    data: data
  })
}

export function agentWinLossReportExport(data) {
  return request({
    url: '/agent/winLoss/export',
    method: 'post',
    data: data
  })
}
