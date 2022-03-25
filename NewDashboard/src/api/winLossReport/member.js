import request from '@/utils/request'

export function memberWinLossReportSearch(data) {
  return request({
    url: '/member/winLoss',
    method: 'post',
    data: data
  })
}
