import request from '@/utils/request'

export function accountSearch(data) {
  return request({
    url: '/user/search',
    method: 'post',
    data: data
  })
}

export function accountCreate(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data: data
  })
}

export function accountEdit(data) {
  return request({
    url: '/user/edit',
    method: 'post',
    data: data
  })
}

export function resetPassword(data) {
  return request({
    url: '/user/resetPassword',
    method: 'post',
    data: data
  })
}
