import request from '@/utils/request'

export function permissionSearch(data) {
  return request({
    url: '/permission/search',
    method: 'post',
    data: data
  })
}

export function permissionCreate(data) {
  return request({
    url: '/permission/create',
    method: 'post',
    data: data
  })
}

export function permissionEdit(data) {
  return request({
    url: '/permission/edit',
    method: 'post',
    data: data
  })
}

export function permissionDelete(id) {
  return request({
    url: '/permission/destroy/' + id,
    method: 'delete'
  })
}
