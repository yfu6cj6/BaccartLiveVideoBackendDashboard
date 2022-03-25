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

export function subAccountModStatus(data) {
  return request({
    url: '/agent/subAccount/modStatus',
    method: 'post',
    data: data
  })
}

export function subAccountModEffectAgentLine(data) {
  return request({
    url: '/agent/subAccount/modEffectAgentLine',
    method: 'post',
    data: data
  })
}

export function subAccountGetAgentLine(data) {
  return request({
    url: '/agent/subAccount/getAgentLine',
    method: 'post',
    data: data
  })
}

export function subAccountSetHasAgents(data) {
  return request({
    url: '/agent/subAccount/setHasAgents',
    method: 'post',
    data: data
  })
}
