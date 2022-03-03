import request from '@/utils/request'

export function memberBetSearch(data) {
  return request({
    url: '/member/bet/search',
    method: 'post',
    data: data
  })
}
