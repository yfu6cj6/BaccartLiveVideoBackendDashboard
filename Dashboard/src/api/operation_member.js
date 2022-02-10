import request from '@/utils/request'
import { getLanguage } from '@/lang/lang'

const lang = getLanguage()

// - 會員信息
export function apiMemberInfo(token, data) {
  return request({
    url: '/member_info/search',
    method: 'post',
    headers: { 'Authorization': 'token ' + token },
    data: data
  })
}

export function getSelectMenu(token) {
  return request({
    url: '/member_info/select_menu',
    method: 'get',
    headers: { 'Authorization': 'token ' + token, 'Accept-Language': lang }
  })
}

// - 下注紀錄
// - 臺號、遊戲類型、幣種、代理列表、時區下拉選單值
export function apiBetRecordSelect(token) {
  return request({
    url: '/member_bet_record/select_menu',
    method: 'get',
    headers: { 'Authorization': 'token ' + token }
  })
}

export function apiBetRecordSearch(token, data) {
  return request({
    url: '/member_bet_record/search',
    method: 'post',
    headers: { 'Authorization': 'token ' + token },
    data: data
  })
}
