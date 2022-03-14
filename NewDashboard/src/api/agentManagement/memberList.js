import request from '@/utils/request'

export function memberSearch(data) {
  return request({
    url: '/member/search',
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
