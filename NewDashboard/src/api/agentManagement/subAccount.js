import request from '@/utils/request'

export function subAccountSearch(data) {
  return request({
    url: '/subAccount/search',
    method: 'post',
    data: data
  })
}

export function subAccountModPassword(data) {
  return request({
    url: '/subAccount/modPassword',
    method: 'post',
    data: data
  })
}
