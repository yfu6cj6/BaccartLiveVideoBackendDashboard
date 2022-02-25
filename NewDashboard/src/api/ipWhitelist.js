import request from '@/utils/request'

export function whitelistSearch(data) {
  return request({
    url: '/whitelist/search',
    method: 'post',
    data: data
  })
}

export function whitelistCreate(data) {
  return request({
    url: '/whitelist/create',
    method: 'post',
    data: data
  })
}

export function whitelistEdit(data) {
  return request({
    url: '/whitelist/edit',
    method: 'post',
    data: data
  })
}

export function whitelistDelete(id) {
  return request({
    url: '/whitelist/destroy/' + id,
    method: 'delete'
  })
}
