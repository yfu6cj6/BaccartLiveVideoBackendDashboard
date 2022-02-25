import request from '@/utils/request'

export function operationLogSearch(data) {
  return request({
    url: '/operationLog/search',
    method: 'post',
    data: data
  })
}
