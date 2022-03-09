import request from '@/utils/request'

export function agentSearch(data) {
  return request({
    url: '/agent/search',
    method: 'post',
    data: data
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

// 取得盤口
export function agentHandicap(data) {
  return request({
    url: '/agent/handicap',
    method: 'post',
    data: data
  })
}

export function agentModPassword(data) {
  return request({
    url: '/agent/modPassword',
    method: 'post',
    data: data
  })
}

export function agentTotalPlayerCount(data) {
  return request({
    url: '/agent/totalPlayerCount',
    method: 'post',
    data: data
  })
}

export function agentCommissionRateLog(data) {
  return request({
    url: '/agent/commissionRateLog',
    method: 'post',
    data: data
  })
}

export function agentRollingRateLog(data) {
  return request({
    url: '/agent/rollingRateLog',
    method: 'post',
    data: data
  })
}
