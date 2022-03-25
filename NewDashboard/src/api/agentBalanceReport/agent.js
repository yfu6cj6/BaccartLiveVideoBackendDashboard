import request from '@/utils/request'

export function agentBalanceReportSearch(data) {
  return request({
    url: '/agent/balance/report',
    method: 'post',
    data: data
  })
}

export function agentBalanceReportExport(data) {
  return request({
    url: '/agent/balance/report/export',
    method: 'post',
    data: data
  })
}
