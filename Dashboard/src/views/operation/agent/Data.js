import { initDatePickerRange } from '@/utils/transDate'

export function getAgentCreate() {
  const searchForm = {
    parentAgentId: '',
    name: '',
    oddType: null,
    gameClientUrl: 'http://kimo',
    currency: null,
    walletType: null,
    domain: '',
    timeZone: null,
    commissionRate: 0
  }
  return searchForm
}

export function getAgentReport() {
  const searchForm = {
    language: '',
    betTimeRangeStart: '',
    betTimeRangeEnd: '',
    currency: null,
    orderByCondition: null,
    orderBy: null,
    searchTimeRange: initDatePickerRange(),
    agentId: ''
  }
  return searchForm
}
