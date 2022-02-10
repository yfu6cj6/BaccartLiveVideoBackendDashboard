import request from '@/utils/request'

export function customerServiceList(token) {
  return request({
    url: '/user/customer_service_list',
    method: 'post',
    headers: { 'Authorization': 'token ' + token }
  })
}
