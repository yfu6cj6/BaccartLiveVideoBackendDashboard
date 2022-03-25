import request from '@/utils/request'

export function agentBalanceRecordSearch(data) {
  return request({
    url: '/agent/balance/record/search',
    method: 'post',
    data: data
  })
}

export function agentBalanceRecordExport(data) {
  return request({
    url: '/agent/balance/record/export',
    method: 'post',
    data: data
  })
}
