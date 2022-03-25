import request from '@/utils/request'

export function memberBalanceRecordSearch(data) {
  return request({
    url: '/member/balance/record/search',
    method: 'post',
    data: data
  })
}

export function memberBalanceRecordExport(data) {
  return request({
    url: '/member/balance/record/export',
    method: 'post',
    data: data
  })
}
