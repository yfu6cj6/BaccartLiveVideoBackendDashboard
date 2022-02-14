import { i18n } from '@/lang/lang'

const state = {
  agentOrderBy: [],
  orderByCondition_agent_report: [],
  userStatus: [],
  orderByCondition_agent_management: [],
  oddType: [],
  walletType: [],
  timezoneList: []
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
    label: '',
    key: '__oddRange_1',
    value: 0
  },
  {
    label: '',
    key: '__oddRange_2',
    value: 1
  },
  {
    label: '',
    key: '__oddRange_3',
    value: 2
  },
  {
    label: '',
    key: '__oddRange_4',
    value: 3
  },
  {
    label: '',
    key: '__oddRange_5',
    value: 4
  },
  {
    label: '',
    key: '__oddRange_6',
    value: 5
  },
  {
    label: '',
    key: '__oddRange_7',
    value: 6
  },
  {
    label: '',
    key: '__oddRange_8',
    value: 7
  },
  {
    label: '',
    key: '__oddRange_9',
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
    label: '',
    key: '__utf_plus8',
    value: 0
  },
  {
    label: '',
    key: '__utf_plus7',
    value: 1
  },
  {
    label: '',
    key: '__utf_plus6',
    value: 2
  },
  {
    label: '',
    key: '__utf_plus5',
    value: 3
  },
  {
    label: '',
    key: '__utf_plus4',
    value: 4
  },
  {
    label: '',
    key: '__utf_plus3',
    value: 5
  },
  {
    label: '',
    key: '__utf_plus2',
    value: 6
  },
  {
    label: '',
    key: '__utf_plus1',
    value: 7
  },
  {
    label: '',
    key: '__utf_plus0',
    value: 8
  },
  {
    label: '',
    key: '__utf_minus1',
    value: 9
  },
  {
    label: '',
    key: '__utf_minus2',
    value: 10
  },
  {
    label: '',
    key: '__utf_minus3',
    value: 11
  },
  {
    label: '',
    key: '__utf_minus4',
    value: 12
  },
  {
    label: '',
    key: '__utf_minus5',
    value: 13
  },
  {
    label: '',
    key: '__utf_minus6',
    value: 14
  },
  {
    label: '',
    key: '__utf_minus7',
    value: 15
  },
  {
    label: '',
    key: '__utf_minus8',
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
    state.oddType.forEach(element => {
      element.label = i18n.messages[i18n.locale][element.key]
    })
    state.walletType.forEach(element => {
      element.label = i18n.messages[i18n.locale][element.key]
    })
    state.timezoneList.forEach(element => {
      element.label = i18n.messages[i18n.locale][element.key]
    })
  }
}
const actions = {
  setSelectMenu({ commit }) {
    commit('SET_SELECTMENU')
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
