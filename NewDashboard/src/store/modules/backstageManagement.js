// import { i18n } from '@/lang/lang'

const state = {
  accountStatus: status
}

const status = [{
  key: '0',
  nickname: '__close'
},
{
  key: '1',
  nickname: '__open'
}]

const mutations = {
  SET_ACCOUNT_STATUS(state) {
    state.accountStatus = status
  }
}
const actions = {
  setAccountStatus({ commit }) {
    commit('SET_ACCOUNT_STATUS')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
