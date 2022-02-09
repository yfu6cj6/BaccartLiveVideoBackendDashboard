import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data: data
  })
}

export function getInfo(token, account) {
  return request({
    url: '/user/info',
    method: 'post',
    data: { 'UserName': account },
    headers: { 'Authorization': 'token ' + token }
  })
}

export function logout(token) {
  return request({
    url: '/user/logout',
    method: 'post',
    data: { 'token': token },
    headers: { 'Authorization': 'token ' + token }
  })
}
