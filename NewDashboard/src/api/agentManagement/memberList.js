import request from '@/utils/request'

export function memberSearch(data) {
  return request({
    url: '/member/search',
    method: 'post',
    data: data
  })
}

export function memberModPassword(data) {
  return request({
    url: '/member/modPassword',
    method: 'post',
    data: data
  })
}
