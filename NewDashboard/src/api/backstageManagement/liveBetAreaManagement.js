import request from '@/utils/request'

export function liveBetAreaSearch(data) {
  return request({
    url: '/liveBetArea/search',
    method: 'post',
    data: data
  })
}

export function liveBetAreaCreate(data) {
  return request({
    url: '/liveBetArea/create',
    method: 'post',
    data: data
  })
}

export function liveBetAreaEdit(data) {
  return request({
    url: '/liveBetArea/edit',
    method: 'post',
    data: data
  })
}

export function liveBetAreaDelete(id) {
  return request({
    url: '/liveBetArea/destroy/' + id,
    method: 'delete'
  })
}
