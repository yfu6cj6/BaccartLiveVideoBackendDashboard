const state = {
  accountStatusType: accountStatusType,
  announcementMarqueeStatusType: announcementMarqueeStatusType,
  roles: roles,
  statusType: statusType
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

const roles = [{
  key: 'AgentSubAccountAdmin',
  nickname: '__admin'
},
{
  key: 'AgentSubAccount',
  nickname: '__visitor'
}]

const statusType = [{
  key: '0',
  nickname: '__lock'
},
{
  key: '1',
  nickname: '__enable'
}]

const mutations = {
  SET_COMMON_TYPE(state) {
    state.accountStatusType = accountStatusType
    state.announcementMarqueeStatusType = announcementMarqueeStatusType
    state.roles = roles
    state.statusType = statusType
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
