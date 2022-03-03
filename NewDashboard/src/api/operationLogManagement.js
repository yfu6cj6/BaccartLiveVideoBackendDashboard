import request from '@/utils/request'

export function operationLogSearch(data) {
  return request({
    url: '/operationLog/search',
    method: 'post',
    data: data
  })
}

export function operationLogExport(data) {
  return request({
    url: '/operationLog/export',
    method: 'post',
    data: data
  })
}
