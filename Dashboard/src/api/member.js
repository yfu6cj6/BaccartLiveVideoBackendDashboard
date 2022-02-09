import request from '@/utils/request'

// - 會員信息
export function apiMemberInfo(token, data) {
  return request({
    url: '/member_info/search',
    method: 'post',
    headers: { 'Authorization': 'token ' + token },
    data: data
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

// - 額度記錄
// - 代理列表、幣種、交易類型下拉選單值
export function apiBalanceRecordSelect(token) {
  return request({
    url: '/member_balance_record/select_menu',
    method: 'get',
    headers: { 'Authorization': 'token ' + token }
  })
}
export function apiBalanceRecordSearch(token, data) {
  return request({
    url: '/member_balance_record/search',
    method: 'post',
    headers: { 'Authorization': 'token ' + token },
    data: data
  })
}

// - 遊戲結果
export function apiGameResultSelect(token) {
  return request({
    url: 'game_result_record/select_menu',
    method: 'get',
    headers: { 'Authorization': 'token ' + token }
  })
}
export function apiGameResultSearch(token, data) {
  return request({
    url: 'game_result_record/search',
    method: 'post',
    headers: { 'Authorization': 'token ' + token },
    data: data
  })
}
