import request from '@/utils/request'

export function agentSearch() {
  return request({
    url: '/agent/search',
    method: 'post'
  })
}

export function agentCreate(data) {
  return request({
    url: '/agent/create',
    method: 'post',
    data: data
  })
}

export function agentEdit(data) {
  return request({
    url: '/agent/edit',
    method: 'post',
    data: data
  })
}

export function agentCreateAccount() {
  return request({
    url: '/agent/createAccount',
    method: 'post'
  })
}

export function agentHandicap(data) {
  return request({
    url: '/agent/handicap',
    method: 'post',
    data: data
  })
}
