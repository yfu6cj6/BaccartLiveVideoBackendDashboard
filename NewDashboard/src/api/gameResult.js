import request from '@/utils/request'

export function gameResultSearch(data) {
  return request({
    url: '/game/result/search',
    method: 'post',
    data: data
  })
}
