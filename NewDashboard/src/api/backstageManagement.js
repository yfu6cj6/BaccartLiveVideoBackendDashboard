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

export function timezoneDelete(id) {
  return request({
    url: '/timezone/destroy/' + id,
    method: 'delete'
  })
}

export function timezoneDataEdit(data) {
  return request({
    url: '/timezone/edit',
    method: 'post',
    data: data
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
