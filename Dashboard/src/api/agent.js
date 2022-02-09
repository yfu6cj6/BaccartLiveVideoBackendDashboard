import request from '@/utils/request'
import { getLanguage } from '@/lang/lang'

const lang = getLanguage()

// -> 新增代理商
export function getAgentCreateSelect(token) {
  return request({
    url: '/agent/select_menu',
    method: 'get',
    headers: { 'Authorization': 'token ' + token, 'Accept-Language': lang }
  })
}
export function createAgent(token, data) {
  return request({
    url: '/agent/create',
    method: 'post',
    headers: { 'Authorization': 'token ' + token },
    data
  })
}

// -> 代理商報表
export function getAgentReportSelect(token) {
  return request({
    url: '/agent_day_report/select_menu',
    method: 'get',
    headers: { 'Authorization': 'token ' + token, 'Accept-Language': lang }
  })
}
export function getAgentLevelInfo(token) {
  return request({
    url: '/agent_day_report/agent_level_info',
    method: 'get',
    headers: { 'Authorization': 'token ' + token, 'Accept-Language': lang }
  })
}
export function getAgentDayReportSearch(token, data) {
  return request({
    url: '/agent_day_report/search',
    method: 'post',
    headers: { 'Authorization': 'token ' + token },
    data: data
  })
}

// -> 代理商管理
export function getAgentManageSelect(token) {
  return request({
    url: '/agent_manage/select_menu',
    method: 'get',
    headers: { 'Authorization': 'token ' + token, 'Accept-Language': lang }
  })
}
export function getAgentManageSearch(token, data) {
  return request({
    url: '/agent_manage/search',
    method: 'post',
    headers: { 'Authorization': 'token ' + token },
    data: data
  })
}

