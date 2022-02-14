import { i18n } from '@/lang/lang'
import { transTableDataByLang } from '@/utils/transLang'

const state = {
  accountType: [],
  memberInfos: [],
  memberBetRecords: [],
  orderBy: [],
  orderByCondition_bet_record: [],
  gamePaymentStatus: [],
  game_result: [],
  limitList: []
}

const accountType = [
  {
    key: '__trialAccount',
    label: '',
    value: 1
  },
  {
    key: '__OfficialMoneyAccount',
    label: '',
    value: 2
  }
]

// -> 排序方式
const orderBy = [
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
// -> 下注紀錄
const orderByCondition_bet_record = [
  {
    label: '',
    key: '__orderNumber',
    value: 1
  },
  {
    label: '',
    key: '__betAmount',
    value: 2
  },
  {
    label: '',
    key: '__payoutAmount',
    value: 3
  },
  {
    label: '',
    key: '__validBetAmount',
    value: 4
  },
  {
    label: '',
    key: '__roundID',
    value: 5
  },
  {
    label: '',
    key: '__currency',
    value: 6
  },
  {
    label: '',
    key: '__betTime',
    value: 7
  }
]

// -> 遊戲結果狀態
const gamePaymentStatus = [
  {
    label: '',
    key: '__paidOuted',
    value: 1
  },
  {
    label: '',
    key: '__paidNone',
    value: 2
  }
]

// -> 遊戲結果
const game_result = [
  {
    label: '',
    key: '__gameRoundID',
    value: 1
  },
  {
    label: '',
    key: '__startTime',
    value: 2
  },
  {
    label: '',
    key: '__endTime',
    value: 3
  },
  {
    label: '',
    key: '__status',
    value: 4
  }
]

// -> 每頁顯示筆數
const limitList = [
  {
    label: '',
    key: '__limitPage_50',
    value: 0
  },
  {
    label: '',
    key: '__limitPage_100',
    value: 1
  },
  {
    label: '',
    key: '__limitPage_200',
    value: 2
  }
]

const mutations = {
  SET_ACCOUNTTYPE(state) {
    state.accountType = accountType
  },
  SET_MEMBERINFOS(state, data) {
    data.forEach(element => {
      element = transTableDataByLang(element)
    })
    state.memberInfos = data
  },
  SET_MEMBER_BETRECORDS(state, data) {
    data.forEach(element => {
      element = transTableDataByLang(element)
    })
    state.memberBetRecords = data
  },
  SET_SELECTMENU(state) {
    state.orderBy = orderBy
    state.orderByCondition_bet_record = orderByCondition_bet_record
    state.gamePaymentStatus = gamePaymentStatus
    state.game_result = game_result
    state.limitList = limitList
  },
  CHANGE_SELECT_LANG(state) {
    state.accountType.forEach(element => {
      element.label = i18n.messages[i18n.locale][element.key]
    })
    state.memberInfos.forEach(element => {
      element.StatusLabel = i18n.messages[i18n.locale][element.StatusKey]
    })
    state.memberBetRecords.forEach(element => {
      element.OrderStatusLabel = i18n.messages[i18n.locale][element.OrderStatusKey]
      element.GamePlayLabel = i18n.messages[i18n.locale][element.GamePlayKey]
    })
    state.orderBy.forEach(element => {
      element.label = i18n.messages[i18n.locale][element.key]
    })
    state.orderByCondition_bet_record.forEach(element => {
      element.label = i18n.messages[i18n.locale][element.key]
    })
    state.gamePaymentStatus.forEach(element => {
      element.label = i18n.messages[i18n.locale][element.key]
    })
    state.game_result.forEach(element => {
      element.label = i18n.messages[i18n.locale][element.key]
    })
    state.limitList.forEach(element => {
      element.label = i18n.messages[i18n.locale][element.key]
    })
  }
}
const actions = {
  setAccountType({ commit }) {
    commit('SET_ACCOUNTTYPE')
    commit('CHANGE_SELECT_LANG')
  },
  setMemberInfos({ commit }, data) {
    commit('SET_MEMBERINFOS', data)
    commit('CHANGE_SELECT_LANG')
  },
  setMemberBetRecords({ commit }, data) {
    commit('SET_MEMBER_BETRECORDS', data)
    commit('CHANGE_SELECT_LANG')
  },
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
