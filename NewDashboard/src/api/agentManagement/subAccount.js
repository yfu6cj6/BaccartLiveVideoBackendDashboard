import request from '@/utils/request'

export function subAccountSearch(data) {
  return request({
    url: '/agent/subAccount/search',
    method: 'post',
    data: data
  })
}

export function subAccountCreate(data) {
  return request({
    url: '/agent/subAccount/create',
    method: 'post',
    data: data
  })
}

export function subAccountEdit(data) {
  return request({
    url: '/agent/subAccount/edit',
    method: 'post',
    data: data
  })
}

export function subAccountModPassword(data) {
  return request({
    url: '/agent/subAccount/modPassword',
    method: 'post',
    data: data
  })
}

export function subAccountCreateAccount() {
  return request({
    url: '/agent/subAccount/createAccount',
    method: 'post'
  })
}
