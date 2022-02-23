import request from '@/utils/request'

export function timezoneSearch(data) {
  return request({
    url: '/timezone/search',
    method: 'post',
    data: data
  })
}

export function timezoneCreate(data) {
  return request({
    url: '/timezone/create',
    method: 'post',
    data: data
  })
}

export function timezoneEdit(data) {
  return request({
    url: '/timezone/edit',
    method: 'post',
    data: data
  })
}

export function timezoneDelete(id) {
  return request({
    url: '/timezone/destroy/' + id,
    method: 'delete'
  })
}
