import request from '@/utils/request'

export function currencySearch(data) {
  return request({
    url: '/currency/search',
    method: 'post',
    data: data
  })
}

export function currencyCreate(data) {
  return request({
    url: '/currency/create',
    method: 'post',
    data: data
  })
}

export function currencyEdit(data) {
  return request({
    url: '/currency/edit',
    method: 'post',
    data: data
  })
}

export function currencyDelete(id) {
  return request({
    url: '/currency/destroy/' + id,
    method: 'delete'
  })
}
