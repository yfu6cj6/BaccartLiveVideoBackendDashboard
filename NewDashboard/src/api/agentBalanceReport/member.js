import request from '@/utils/request'

export function memberBalanceReportSearch(data) {
  return request({
    url: '/member/balance/report',
    method: 'post',
    data: data
  })
}
