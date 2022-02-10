import { i18n } from '@/lang/lang'

const state = {
  customerServiceListData: []
}

const role = {
  1: '__admin',
  2: '__customerService'
}

const mutations = {
  SET_CUSTOMERSERVICE_LIST_DATA(state, data) {
    state.customerServiceListData = data
  },
  CHANGE_SELECT_LANG(state) {
    state.customerServiceListData.forEach(element => {
      element.RoleName = i18n.messages[i18n.locale][role[element.Role]]
    })
  }
}
const actions = {
  setcustomerServiceListData({ commit }, data) {
    commit('SET_CUSTOMERSERVICE_LIST_DATA', data)
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
