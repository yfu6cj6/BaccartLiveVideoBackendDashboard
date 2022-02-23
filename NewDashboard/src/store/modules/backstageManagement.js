// import { i18n } from '@/lang/lang'

const state = {
}

const mutations = {
  CHANGE_SELECT_LANG(state) {
  }
}
const actions = {
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
