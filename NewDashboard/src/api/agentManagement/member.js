import request from '@/utils/request'

export function memberSearch(data) {
  return request({
    url: '/member/search',
    method: 'post',
    data: data
  })
}

export function memberCreate(data) {
  return request({
    url: '/member/create',
    method: 'post',
    data: data
  })
}

export function memberEdit(data) {
  return request({
    url: '/member/edit',
    method: 'post',
    data: data
  })
}

export function memberModPassword(data) {
  return request({
    url: '/member/modPassword',
    method: 'post',
    data: data
  })
}

export function memberGetSetBalanceInfo(data) {
  return request({
    url: '/member/getSetBalanceInfo',
    method: 'post',
    data: data
  })
}

export function memberDepositBalance(data) {
  return request({
    url: '/member/depositBalance',
    method: 'post',
    data: data
  })
}

export function memberWithdrawBalance(data) {
  return request({
    url: '/member/withdrawBalance',
    method: 'post',
    data: data
  })
}

export function memberCreateAccount() {
  return request({
    url: '/member/createAccount',
    method: 'post'
  })
}

export function memberModStatus(data) {
  return request({
    url: '/member/modStatus',
    method: 'post',
    data: data
  })
}

export function memberModBetStatus(data) {
  return request({
    url: '/member/modBetStatus',
    method: 'post',
    data: data
  })
}

export function memberGetLastBetTime(data) {
  return request({
    url: '/member/bet/lastBetTime',
    method: 'post',
    data: data
  })
}

export function memberOneClickRecycling(data) {
  return request({
    url: '/member/balance/oneClickRecycling',
    method: 'post',
    data: data
  })
}
