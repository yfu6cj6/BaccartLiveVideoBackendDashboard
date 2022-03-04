import request from '@/utils/request'

export function memberBetSearch(data) {
  return request({
    url: '/member/bet/search',
    method: 'post',
    data: data
  })
}

export function memberBetExport(data) {
  return request({
    url: '/member/bet/export',
    method: 'post',
    data: data
  })
}
