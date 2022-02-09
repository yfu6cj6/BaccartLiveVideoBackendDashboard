import request from '@/utils/request'
import { getLanguage } from '@/lang/lang'

const lang = getLanguage()

export function getSelectMenu(token) {
  return request({
    url: '/member_info/select_menu',
    method: 'get',
    headers: { 'Authorization': 'token ' + token, 'Accept-Language': lang }
  })
}
