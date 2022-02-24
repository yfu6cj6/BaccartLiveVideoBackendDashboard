import request from '@/utils/request'

export function announcementSearch(data) {
  return request({
    url: '/announcement/search',
    method: 'post',
    data: data
  })
}

export function announcementCreate(data) {
  return request({
    url: '/announcement/create',
    method: 'post',
    data: data
  })
}

export function announcementEdit(data) {
  return request({
    url: '/announcement/edit',
    method: 'post',
    data: data
  })
}

export function announcementDelete(id) {
  return request({
    url: '/announcement/destroy/' + id,
    method: 'delete'
  })
}
