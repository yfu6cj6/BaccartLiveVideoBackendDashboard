import request from '@/utils/request'

export function roleSearch(data) {
  return request({
    url: '/role/search',
    method: 'post',
    data: data
  })
}

export function roleCreate(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data: data
  })
}

export function roleEdit(data) {
  return request({
    url: '/role/edit',
    method: 'post',
    data: data
  })
}

export function roleDelete(id) {
  return request({
    url: '/role/destroy/' + id,
    method: 'delete'
  })
}

export function getPermissions(data) {
  return request({
    url: '/role/getPermissions',
    method: 'post',
    data: data
  })
}

export function setPermissions(data) {
  return request({
    url: '/role/setPermissions',
    method: 'post',
    data: data
  })
}
