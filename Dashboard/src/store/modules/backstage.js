import { i18n } from '@/lang/lang'

const state = {
  accountListData: [],
  accountCreateAgentRole: []
}

const role = {
  1: '__admin',
  2: '__customerService'
}

const mutations = {
  SET_ACCOUNT_LIST_DATA(state, data) {
    state.accountListData = data
  },
  SET_ACCOUNT_CREATE_AGENTROLE(state, data) {
    state.accountCreateAgentRole = data
  },
  CHANGE_SELECT_LANG(state) {
    state.accountListData.forEach(element => {
      element.RoleName = i18n.messages[i18n.locale][role[element.Role]]
    })
    state.accountCreateAgentRole.forEach(element => {
      element.Name = i18n.messages[i18n.locale][role[element.Id]]
    })
  }
}
const actions = {
  setAccountListData({ commit }, data) {
    commit('SET_ACCOUNT_LIST_DATA', data)
    commit('CHANGE_SELECT_LANG')
  },
  setAccountCreateAgentRole({ commit }, data) {
    commit('SET_ACCOUNT_CREATE_AGENTROLE', data)
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
