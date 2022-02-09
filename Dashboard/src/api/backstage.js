import request from '@/utils/request'

export function accountListPage(token) {
  return request({
    url: '/user/account_list',
    method: 'post',
    headers: { 'Authorization': 'token ' + token }
  })
}
export function getAgentRole(token) {
  return request({
    url: '/user/account_create',
    method: 'post',
    headers: { 'Authorization': 'token ' + token }
  })
}
export function createUser(token, body) {
  return request({
    url: '/user/create_user',
    method: 'post',
    data: body,
    headers: { 'Authorization': 'token ' + token }
  })
}
export function modifyPassword(token, body) {
  return request({
    url: '/user/modify_password',
    method: 'post',
    data: body,
    headers: { 'Authorization': 'token ' + token }
  })
}

export function update(token, body) {
  return request({
    url: '/user/update',
    method: 'post',
    data: body,
    headers: { 'Authorization': 'token ' + token }
  })
}

export function del(token, body) {
  return request({
    url: '/user/delete',
    method: 'post',
    data: body,
    headers: { 'Authorization': 'token ' + token }
  })
}

