import request from '@/utils/request'

export function tableLimitSearch(data) {
  return request({
    url: '/tableLimit/search',
    method: 'post',
    data: data
  })
}

export function tableLimitCreate(data) {
  return request({
    url: '/tableLimit/create',
    method: 'post',
    data: data
  })
}

export function tableLimitEdit(data) {
  return request({
    url: '/tableLimit/edit',
    method: 'post',
    data: data
  })
}
