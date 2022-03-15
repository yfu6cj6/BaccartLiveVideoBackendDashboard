import request from '@/utils/request'

export function subAccountSearch(data) {
  return request({
    url: '/agent/subAccount/search',
    method: 'post',
    data: data
  })
}

export function subAccountModPassword(data) {
  return request({
    url: '/agent/subAccount/modPassword',
    method: 'post',
    data: data
  })
}
