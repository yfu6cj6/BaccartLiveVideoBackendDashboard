import request from '@/utils/request'
import { getLanguage } from '@/lang/lang'

const lang = getLanguage()

export function timezoneSearch(data) {
  return request({
    url: '/timezone/search',
    method: 'post',
    data: data
  })
}

export function timezoneCreate(data) {
  return request({
    url: '/timezone/create',
    method: 'post',
    data: data
  })
}

export function timezoneEdit(data) {
  return request({
    url: '/timezone/edit',
    method: 'post',
    data: data
  })
}

export function timezoneDelete(id) {
  return request({
    url: '/timezone/destroy/' + id,
    method: 'delete'
  })
}

export function roleSearch(data) {
  return request({
    url: '/role/search',
    method: 'post',
    data: data
  })
}

export function roleCreate(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data: data
  })
}

export function roleEdit(data) {
  return request({
    url: '/role/edit',
    method: 'post',
    data: data
  })
}

export function roleDelete(id) {
  return request({
    url: '/role/destroy/' + id,
    method: 'delete'
  })
}

export function getPermissions(data) {
  return request({
    url: '/role/getPermissions',
    method: 'post',
    data: data
  })
}

export function setPermissions(data) {
  return request({
    url: '/role/setPermissions',
    method: 'post',
    data: data
  })
}

export function permissionSearch(data) {
  return request({
    url: '/permission/search',
    method: 'post',
    data: data
  })
}

export function permissionCreate(data) {
  return request({
    url: '/permission/create',
    method: 'post',
    data: data
  })
}

export function permissionEdit(data) {
  return request({
    url: '/permission/edit',
    method: 'post',
    data: data
  })
}

export function permissionDelete(id) {
  return request({
    url: '/permission/destroy/' + id,
    method: 'delete'
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

export function getAgentLevelInfo(token) {
  return request({
    url: '/agent_day_report/agent_level_info',
    method: 'get',
    headers: { 'Authorization': 'token ' + token, 'Accept-Language': lang }
  })
}

export function accountListPage(token) {
  return request({
    url: '/user/account_list',
    method: 'post',
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
