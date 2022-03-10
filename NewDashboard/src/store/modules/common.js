const state = {
  accountStatusType: accountStatusType,
  announcementMarqueeStatusType: announcementMarqueeStatusType,
  agentAccountStatusType: agentAccountStatusType
}

const accountStatusType = [{
  key: '0',
  nickname: '__close'
},
{
  key: '1',
  nickname: '__open'
}]

const announcementMarqueeStatusType = [{
  key: '0',
  nickname: '__close'
},
{
  key: '1',
  nickname: '__open'
}]

const agentAccountStatusType = [{
  key: '0',
  nickname: '__close'
},
{
  key: '1',
  nickname: '__open'
}]

const mutations = {
  SET_COMMON_TYPE(state) {
    state.accountStatusType = accountStatusType
    state.announcementMarqueeStatusType = announcementMarqueeStatusType
    state.agentAccountStatusType = agentAccountStatusType
  }
}
const actions = {
  setCommonType({ commit }) {
    commit('SET_COMMON_TYPE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
