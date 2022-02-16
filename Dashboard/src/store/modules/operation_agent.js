import { i18n } from '@/lang/lang'

const state = {
  agentOrderBy: [],
  orderByCondition_agent_report: [],
  userStatus: [],
  orderByCondition_agent_management: [],
  oddType: [],
  walletType: [],
  timezoneList: [],
  agentDayReports: [],
  agentManageData: []
}

// -> 排序方式
const agentOrderBy = [
  {
    label: '',
    key: '__ascending',
    value: 0
  },
  {
    label: '',
    key: '__descending',
    value: 1
  }
]

// -> 代理商報表
const orderByCondition_agent_report = [
  {
    label: '',
    key: '__betOrderCount',
    value: 1
  },
  {
    label: '',
    key: '__totalBetAmount',
    value: 2
  },
  {
    label: '',
    key: '__validBetAmount',
    value: 3
  },
  {
    label: '',
    key: '__memberPaidOut',
    value: 4
  },
  {
    label: '',
    key: '__date',
    value: 5
  },
  {
    label: '',
    key: '__agentName',
    value: 6
  },
  {
    label: '',
    key: '__betCount',
    value: 7
  },
  {
    label: '',
    key: '__searchTime',
    value: 8
  }
]

// -> 玩家狀態
const userStatus = [
  {
    label: '',
    key: '__enable',
    value: 1
  },
  {
    label: '',
    key: '__disabled',
    value: 2
  }
]

// -> 代理商管理
const orderByCondition_agent_management = [
  {
    label: '',
    key: '__availableAmount',
    value: 1
  },
  {
    label: '',
    key: '__currency',
    value: 2
  },
  {
    label: '',
    key: '__registerTime',
    value: 3
  },
  {
    label: '',
    key: '__lastLoginTime',
    value: 4
  },
  {
    label: '',
    key: '__status',
    value: 5
  }
]

// -> 盤口，玩家可下注範圍
const oddType = [
  {
    label: 'A_20_50000',
    value: 0
  },
  {
    label: 'B_50_5000',
    value: 1
  },
  {
    label: 'C_20_10000',
    value: 2
  },
  {
    label: 'D_200_20000',
    value: 3
  },
  {
    label: 'E_300_30000',
    value: 4
  },
  {
    label: 'F_400_40000',
    value: 5
  },
  {
    label: 'G_500_50000',
    value: 6
  },
  {
    label: 'H_1000_100000',
    value: 7
  },
  {
    label: 'I_2000_200000',
    value: 8
  }
]

// -> 錢包類型
const walletType = [
  {
    label: '',
    key: '__transferWallet',
    value: 0
  },
  {
    label: '',
    key: '__seamlessWallet',
    value: 1
  }
]

const timezoneList = [
  {
    label: 'UTC +8',
    value: 0
  },
  {
    label: 'UTC +7',
    value: 1
  },
  {
    label: 'UTC +6',
    value: 2
  },
  {
    label: 'UTC +5',
    value: 3
  },
  {
    label: 'UTC +4',
    value: 4
  },
  {
    label: 'UTC +3',
    value: 5
  },
  {
    label: 'UTC +2',
    value: 6
  },
  {
    label: 'UTC +1',
    value: 7
  },
  {
    label: 'UTC +0',
    value: 8
  },
  {
    label: 'UTC -1',
    value: 9
  },
  {
    label: 'UTC -2',
    value: 10
  },
  {
    label: 'UTC -3',
    value: 11
  },
  {
    label: 'UTC -4',
    value: 12
  },
  {
    label: 'UTC -5',
    value: 13
  },
  {
    label: 'UTC -6',
    value: 14
  },
  {
    label: 'UTC -7',
    value: 15
  },
  {
    label: 'UTC -8',
    value: 16
  }
]

const mutations = {
  SET_SELECTMENU(state) {
    state.agentOrderBy = agentOrderBy
    state.orderByCondition_agent_report = orderByCondition_agent_report
    state.userStatus = userStatus
    state.orderByCondition_agent_management = orderByCondition_agent_management
    state.oddType = oddType
    state.walletType = walletType
    state.timezoneList = timezoneList
  },
  SET_AGENTREPORT(state, data) {
    state.agentDayReports = data
  },
  SET_AGENTMANAGEDATA(state, data) {
    state.agentManageData = data
  },
  CHANGE_SELECT_LANG(state) {
    state.agentOrderBy.forEach(element => {
      element.label = i18n.messages[i18n.locale][element.key]
    })
    state.orderByCondition_agent_report.forEach(element => {
      element.label = i18n.messages[i18n.locale][element.key]
    })
    state.userStatus.forEach(element => {
      element.label = i18n.messages[i18n.locale][element.key]
    })
    state.orderByCondition_agent_management.forEach(element => {
      element.label = i18n.messages[i18n.locale][element.key]
    })
    state.walletType.forEach(element => {
      element.label = i18n.messages[i18n.locale][element.key]
    })
  }
}
const actions = {
  setSelectMenu({ commit }) {
    commit('SET_SELECTMENU')
    commit('CHANGE_SELECT_LANG')
  },
  setAgentReport({ commit }, data) {
    commit('SET_AGENTREPORT', data)
    commit('CHANGE_SELECT_LANG')
  },
  setAgentManageData({ commit }, data) {
    commit('SET_AGENTMANAGEDATA', data)
    commit('CHANGE_SELECT_LANG')
  },
  changeSelectLang({ commit }) {
    commit('CHANGE_SELECT_LANG')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
